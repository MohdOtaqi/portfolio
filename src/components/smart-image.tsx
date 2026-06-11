"use client";

import { useState } from "react";

// remember image URLs that 404'd so the carousel doesn't re-request them
const failedSrc = new Set<string>();

export function SmartImage({
  src,
  alt,
  label,
  className,
}: {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(() => (src ? failedSrc.has(src) : true));

  const initials =
    (label ?? alt ?? "")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "MO";

  return (
    <div className={`relative overflow-hidden bg-card ${className ?? ""}`}>
      {/* Designed cover — ALWAYS the base layer, so a missing/slow/404 photo
          never reads as a blank card. A real photo (below) sits on top of it. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(100% 75% at 0% 0%, color-mix(in oklab, var(--brand) 62%, transparent), transparent 56%), radial-gradient(100% 88% at 100% 100%, color-mix(in oklab, var(--brand-2, var(--brand)) 66%, transparent), transparent 58%), linear-gradient(135deg, color-mix(in oklab, var(--brand) 14%, var(--card)) 0%, var(--card) 100%)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.13] text-foreground"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1.4px)",
            backgroundSize: "18px 18px",
          }}
          aria-hidden
        />
        <span
          className="font-display select-none font-semibold leading-none text-foreground/25"
          style={{ fontSize: "clamp(2.6rem, 10vw, 6.5rem)" }}
          aria-hidden
        >
          {initials}
        </span>
        <span className="sr-only">{label ?? alt}</span>
      </div>

      {/* Real photo on top (covers the designed cover when it loads). alt="" so a
          missing/broken photo never leaks alt text over the cover — the sr-only
          label above carries the accessible name. */}
      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          onError={() => {
            failedSrc.add(src);
            setFailed(true);
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
