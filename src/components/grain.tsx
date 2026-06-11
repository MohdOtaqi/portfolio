"use client";

import { motion, useTransform, useReducedMotion } from "framer-motion";
import { useScrollProgress } from "./smooth-scroll";

// Static fractal-noise tile (SVG data URI) — the filmic grain.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Top-layer cinematic finish: a faint film grain over the whole page + a
 * vignette that deepens as you scroll into night. Sits above content but is
 * pointer-transparent and very low opacity, so it textures without obscuring.
 */
export function Atmosphere() {
  const p = useScrollProgress();
  const reduce = useReducedMotion();
  const vignette = useTransform(p, [0, 0.32, 0.6, 1], [0.08, 0.14, 0.42, 0.5]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      <motion.div
        style={{
          opacity: reduce ? 0.4 : vignette,
          background:
            "radial-gradient(125% 108% at 50% 38%, transparent 50%, rgba(2,4,12,0.72) 100%)",
        }}
        className="absolute inset-0"
      />
      <div
        className="absolute inset-0 opacity-[0.045] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
      />
    </div>
  );
}
