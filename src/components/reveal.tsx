"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EXPO = [0.16, 1, 0.3, 1] as const;

export type RevealVariant =
  | "fade"
  | "up"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur";
export type RevealSpeed = "fast" | "normal" | "slow";

const DUR: Record<RevealSpeed, number> = { fast: 0.5, normal: 0.8, slow: 1.15 };

const HIDDEN: Record<RevealVariant, Record<string, number | string>> = {
  fade: { opacity: 0 },
  up: { opacity: 0, y: 30 },
  "slide-left": { opacity: 0, x: -44 },
  "slide-right": { opacity: 0, x: 44 },
  scale: { opacity: 0, scale: 0.94 },
  blur: { opacity: 0, y: 16, filter: "blur(12px)" },
};

function buildVariants(variant: RevealVariant, speed: RevealSpeed): Variants {
  return {
    hidden: HIDDEN[variant],
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: DUR[speed], ease: EXPO },
    },
  };
}

export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
  speed = "normal",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
  speed?: RevealSpeed;
}) {
  return (
    <motion.div
      className={className}
      variants={buildVariants(variant, speed)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  amount = 0.1,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      transition={{ staggerChildren: amount, delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variant = "up",
  speed = "normal",
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  speed?: RevealSpeed;
}) {
  return (
    <motion.div className={className} variants={buildVariants(variant, speed)}>
      {children}
    </motion.div>
  );
}

/** Line-by-line mask reveal for headings. Pass an array of lines. */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className={`block ${lineClassName ?? ""}`}
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, ease: EXPO, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
