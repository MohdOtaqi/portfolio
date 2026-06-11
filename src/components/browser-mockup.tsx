"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SmartImage } from "./smart-image";

export function BrowserMockup({
  media,
  label,
  url,
}: {
  media?: string[];
  label: string;
  url?: string;
}) {
  const slides = media && media.length ? media : [undefined];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 2600);
    return () => clearInterval(t);
  }, [slides.length]);

  const host = url ? url.replace(/^https?:\/\//, "") : label.toLowerCase();

  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      {/* glow */}
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-brand/15 blur-3xl" aria-hidden />
      {/* browser frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0c0e1c] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
        {/* chrome bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mono mx-auto truncate rounded-md bg-black/30 px-3 py-1 text-[11px] text-muted-foreground">
            {host}
          </div>
        </div>
        {/* viewport */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <SmartImage src={slides[i]} alt={label} label={label} className="h-full w-full" />
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
