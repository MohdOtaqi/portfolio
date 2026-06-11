"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./scene/scene"), { ssr: false });

export function HeroCanvas() {
  const [mode, setMode] = useState<"off" | "low" | "full">("off");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setMode("off");
      return;
    }
    setMode(window.innerWidth < 768 ? "low" : "full");
  }, []);

  return (
    <div className="absolute inset-0 -z-10" aria-hidden>
      {/* static fallback / base glow that always shows */}
      <div
        className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(94,240,255,0.10), transparent 62%)",
        }}
      />
      {mode !== "off" && <Scene count={mode === "low" ? 110 : 210} />}
    </div>
  );
}
