"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Magnetic } from "./magnetic";
import { profile } from "@/lib/data";

const links = [
  { href: "#about", label: "About", n: "01" },
  { href: "#capabilities", label: "Capabilities", n: "02" },
  { href: "#work", label: "Work", n: "03" },
  { href: "#contact", label: "Contact", n: "04" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 260 && y > last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? -90 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-10">
          <a href="#top" className="flex items-baseline gap-2" data-cursor="hover">
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Mohammad Otaqi
            </span>
            <span className="h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-brand" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="mono text-[10px] text-brand">{l.n}</span>
                {l.label}
              </a>
            ))}
            <Magnetic strength={0.5}>
              <a
                href={profile.resumeUrl}
                data-cursor="hover"
                className="rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                Résumé
              </a>
            </Magnetic>
          </nav>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="mono flex items-center gap-2 text-sm text-foreground md:hidden"
            data-cursor="hover"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background/95 px-8 backdrop-blur-xl md:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-baseline gap-3 border-b border-border py-5"
              >
                <span className="mono text-xs text-brand">{l.n}</span>
                <span className="font-display text-4xl text-foreground">{l.label}</span>
              </motion.a>
            ))}
            <a href={profile.resumeUrl} onClick={() => setOpen(false)} className="mono mt-8 text-brand">
              Download Résumé →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
