"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PhoneMockup } from "./phone-mockup";
import { BrowserMockup } from "./browser-mockup";
import { SmartImage } from "./smart-image";
import type { Project } from "@/lib/data";

/** Renders of a physical device — a light studio plate with a caption strip. */
function RenderCard({ media, label, caption }: { media: string[]; label: string; caption?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (media.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % media.length), 3200);
    return () => clearInterval(t);
  }, [media.length]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/15 bg-[#cfcfcd] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]">
      <div className="relative aspect-[4/3] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <SmartImage src={media[i]} alt={`${label} — device render`} label={label} className="h-full w-full" />
          </motion.div>
        </AnimatePresence>
      </div>
      {caption && (
        <figcaption className="mono border-t border-black/10 bg-[#0c0e1c] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Main mockup with a second visual layered over one corner:
 *  web product + its phone app, or phone app + renders of the device it pairs with. */
export function PairedMockup({ p }: { p: Project }) {
  const c = p.companion!;

  if (p.device === "browser") {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-x-0 top-[6%] pr-[18%]">
          <BrowserMockup media={p.media} label={p.name} url={p.demoUrl} />
        </div>
        <div className="absolute bottom-0 right-0 origin-bottom-right scale-[0.58]">
          <PhoneMockup media={c.media} label={`${p.name} app`} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 sm:left-[4%]">
        <PhoneMockup media={p.media} label={p.name} />
      </div>
      <div className="absolute bottom-[8%] right-0 w-[52%] sm:w-[55%]">
        {c.kind === "render" ? (
          <RenderCard media={c.media} label={p.name} caption={c.caption} />
        ) : (
          <PhoneMockup media={c.media} label={p.name} />
        )}
      </div>
    </div>
  );
}
