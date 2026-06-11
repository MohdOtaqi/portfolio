"use client";

import { motion } from "framer-motion";

const EXPO = [0.16, 1, 0.3, 1] as const;

export function Dusk() {
  return (
    <section className="relative flex h-[66vh] w-full flex-col items-center justify-center overflow-hidden px-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: EXPO }}
        className="eyebrow mb-6 flex items-center gap-3 text-white/65"
      >
        <span className="h-px w-8 bg-white/40" /> Night — after hours
        <span className="h-px w-8 bg-white/40" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: EXPO, delay: 0.1 }}
        className="relative z-10 max-w-2xl text-center font-display text-3xl leading-[1.15] text-white sm:text-5xl"
        style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
      >
        When the markets close,{" "}
        <span className="font-serif-it">the building begins.</span>
      </motion.p>

      {/* drawn horizon line — the "ground" the sun set behind */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.3, ease: EXPO, delay: 0.3 }}
        className="pointer-events-none absolute bottom-[20%] left-1/2 h-px w-[min(78%,46rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
    </section>
  );
}
