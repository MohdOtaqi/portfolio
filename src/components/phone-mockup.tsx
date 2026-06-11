"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "./smart-image";

export function PhoneMockup({
  media,
  label,
}: {
  media?: string[];
  label: string;
}) {
  const slides = media && media.length ? media : [undefined];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 2600);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <div className="relative mx-auto w-[220px]">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-brand/15 blur-3xl" aria-hidden />
      {/* phone frame */}
      <div className="relative aspect-[9/19] rounded-[2.4rem] border border-white/15 bg-[#0c0e1c] p-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-black" aria-hidden />
        <div className="relative h-full w-full overflow-hidden rounded-[1.9rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <SmartImage src={slides[i]} alt={label} label={label} className="h-full w-full rounded-[1.9rem]" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {slides.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-5 bg-brand" : "w-1.5 bg-foreground/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
