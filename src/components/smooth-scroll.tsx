"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/**
 * Single source of truth for scroll progress (0→1 over the page).
 * Lenis animates the *visual* scroll on its own RAF loop; if other code reads
 * native window scroll it lags a frame behind, which is the micro-jitter the
 * sky used to have. So we publish Lenis's own smoothed progress as a MotionValue
 * and every scroll-linked element (sky, sun/moon, stars) reads THIS.
 */
const ScrollProgressContext = createContext<MotionValue<number> | null>(null);

export function useScrollProgress(): MotionValue<number> {
  const v = useContext(ScrollProgressContext);
  if (!v) throw new Error("useScrollProgress must be used within <SmoothScroll>");
  return v;
}

function LenisBridge({ progress }: { progress: MotionValue<number> }) {
  const lenis = useLenis((l) => {
    const p = l.progress;
    progress.set(Number.isFinite(p) ? p : 0);
  });
  // expose the instance for visual QA (harmless in prod)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;
    }
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const progress = useMotionValue(0);
  return (
    <ScrollProgressContext.Provider value={progress}>
      <ReactLenis
        root
        options={{
          lerp: 0.11,
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1,
          anchors: true,
        }}
      >
        <LenisBridge progress={progress} />
        {children}
      </ReactLenis>
    </ScrollProgressContext.Provider>
  );
}
