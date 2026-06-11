"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const ACCENT = new THREE.Color("#5ef0ff");

function makeDotTexture() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function NetworkField({ count = 200 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const { viewport } = useThree();

  const dotTex = useMemo(() => makeDotTexture(), []);

  const { base, seeds, pairs } = useMemo(() => {
    const base = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const radius = 3.1;
    for (let i = 0; i < count; i++) {
      // even-ish distribution in a sphere
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const r = radius * Math.cbrt(Math.random());
      base[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      base[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.78;
      base[i * 3 + 2] = r * Math.cos(phi);
      seeds[i] = Math.random() * 100;
    }
    // static connectivity from base positions
    const pairs: number[] = [];
    const threshold = 1.05;
    const maxPairs = 620;
    for (let i = 0; i < count && pairs.length / 2 < maxPairs; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < threshold * threshold) {
          pairs.push(i, j);
          if (pairs.length / 2 >= maxPairs) break;
        }
      }
    }
    return { base, seeds, pairs };
  }, [count]);

  const pointPositions = useMemo(() => base.slice(), [base]);
  const linePositions = useMemo(
    () => new Float32Array((pairs.length / 2) * 2 * 3),
    [pairs]
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pos = pointPositions;
    for (let i = 0; i < count; i++) {
      const s = seeds[i];
      pos[i * 3] = base[i * 3] + Math.sin(t * 0.35 + s) * 0.16;
      pos[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * 0.3 + s * 1.3) * 0.16;
      pos[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * 0.25 + s * 0.7) * 0.16;
    }
    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position");
      (attr.array as Float32Array).set(pos);
      attr.needsUpdate = true;
    }
    if (linesRef.current) {
      const lp = linePositions;
      for (let k = 0; k < pairs.length; k += 2) {
        const a = pairs[k] * 3;
        const b = pairs[k + 1] * 3;
        const o = (k / 2) * 6;
        lp[o] = pos[a];
        lp[o + 1] = pos[a + 1];
        lp[o + 2] = pos[a + 2];
        lp[o + 3] = pos[b];
        lp[o + 4] = pos[b + 1];
        lp[o + 5] = pos[b + 2];
      }
      const attr = linesRef.current.geometry.getAttribute("position");
      (attr.array as Float32Array).set(lp);
      attr.needsUpdate = true;
    }
    if (group.current) {
      group.current.rotation.y = t * 0.05;
      // mouse parallax
      const mx = (state.pointer.x * viewport.width) / 14;
      const my = (state.pointer.y * viewport.height) / 14;
      group.current.rotation.x += (my * 0.12 - group.current.rotation.x) * 0.04;
      group.current.position.x += (mx * 0.25 - group.current.position.x) * 0.04;
    }
  });

  return (
    <group ref={group}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
            count={count}
          />
        </bufferGeometry>
        <pointsMaterial
          map={dotTex}
          color={ACCENT}
          size={0.13}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export default function Scene({ count = 200 }: { count?: number }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 52 }}
      style={{ pointerEvents: "none" }}
    >
      <NetworkField count={count} />
      <EffectComposer>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
