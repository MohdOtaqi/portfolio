"use client";

import type { ReactNode } from "react";

/** Native disclosure for long lists. Tells the sky to re-measure, because its
 *  day-to-night timeline is anchored to the page height. */
export function ExpandList({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="group/more mt-3" onToggle={() => window.dispatchEvent(new Event("resize"))}>
      <summary className="mono inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-xs text-foreground transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
        {label}
        <span aria-hidden className="transition-transform duration-200 group-open/more:rotate-180">
          ↓
        </span>
      </summary>
      {children}
    </details>
  );
}
