import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Machined "double-bezel" (Doppelrand): an outer shell (tray) holding an inner
 * core (plate) with concentric radii + an inner top-highlight, so a card reads
 * like physical hardware instead of a flat box. Outer radius 1.65rem, p-1.5
 * (0.375rem) → inner radius ~1.27rem keeps the curves concentric.
 */
export function Bezel({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.65rem] bg-foreground/[0.045] p-1.5 ring-1 ring-foreground/10 shadow-[0_36px_64px_-34px_rgba(0,0,0,0.55)]",
        className
      )}
    >
      <div
        className={cn(
          "h-full overflow-hidden rounded-[1.27rem] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * "Button-in-button" CTA: a fully-rounded pill whose trailing arrow lives in its
 * own circular wrapper that drifts diagonally on hover (kinetic tension). Spring
 * cubic-bezier, press-scale. variant "solid" (filled) or "ghost" (hairline).
 */
export function CtaLink({
  href,
  children,
  variant = "solid",
  external = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const spring = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";
  return (
    <a
      href={href}
      data-cursor="hover"
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-medium transition-transform active:scale-[0.98]",
        spring,
        variant === "solid"
          ? "bg-foreground text-background"
          : "border border-border text-foreground hover:border-foreground/40",
        className
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
          spring,
          variant === "solid" ? "bg-background/15" : "bg-foreground/[0.07]"
        )}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="stroke-current"
          strokeWidth="1.3"
          aria-hidden
        >
          {external ? (
            <path d="M3 9L9 3M9 3H4.6M9 3V7.4" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <path d="M2.5 6H9.5M9.5 6L6.6 3.2M9.5 6L6.6 8.8" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </span>
    </a>
  );
}
