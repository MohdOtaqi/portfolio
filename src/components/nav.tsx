"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { href, switchHref, ui, type Locale } from "@/lib/i18n";

/** Floating top bar: section links, a Résumé menu (3 CVs) and the language switch.
 *  A solid dark pill (no backdrop-blur — that re-blurs every scroll frame on phones),
 *  so it reads the same over the light day half and the dark night half. */
export function Nav({ locale }: { locale: Locale }) {
  const t = ui[locale].nav;
  const cvs = ui[locale].cvs;
  const path = usePathname() || "/";
  const home = href(locale, "/");
  const onHome = path === home;
  const at = (id: string) => (onHome ? `#${id}` : `${home}#${id}`);
  const links = [
    { href: at("about"), label: t.about },
    { href: at("systems"), label: t.systems },
    { href: at("work"), label: t.work },
    { href: at("contact"), label: t.contact },
  ];

  const [menu, setMenu] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const cvRef = useRef<HTMLDivElement>(null);

  // hide while scrolling down, come back on any scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 320 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the CV menu on outside click / Escape
  useEffect(() => {
    if (!cvOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!cvRef.current?.contains(e.target as Node)) setCvOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCvOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [cvOpen]);

  // lock page scroll under the phone menu (Lenis drives the page, so pause it too)
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
    document.documentElement.style.overflow = menu ? "hidden" : "";
    if (menu) lenis?.stop?.();
    else lenis?.start?.();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  // phone menu links: close first, then glide to the section once scrolling is unlocked
  const goTo = (e: React.MouseEvent, target: string) => {
    setMenu(false);
    if (!target.startsWith("#")) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      const lenis = (window as unknown as { __lenis?: { start?: () => void; scrollTo?: (t: Element, o?: object) => void } }).__lenis;
      const el = document.querySelector(target);
      lenis?.start?.();
      if (el && lenis?.scrollTo) lenis.scrollTo(el, { offset: -72 });
      else el?.scrollIntoView();
    });
  };

  const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6ad8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0e1c]";

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !menu ? -96 : 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-[70] px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <nav
          aria-label={t.menu}
          className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 rounded-full border border-white/10 bg-[#0b0e1c]/90 py-1.5 pe-1.5 ps-2 text-white shadow-[0_12px_40px_-18px_rgba(0,0,0,0.7)]"
        >
          <a href={onHome ? "#top" : home} data-cursor="hover" className={`flex items-center gap-2.5 rounded-full pe-2 ${ring}`}>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 font-display text-sm font-semibold" dir="ltr">
              MO
            </span>
            <span className="hidden font-display text-[0.95rem] font-semibold sm:inline" dir="ltr">
              Mohammad Otaqi
            </span>
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-cursor="hover"
                className={`rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white ${ring}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={switchHref(locale, path)}
              hrefLang={locale === "ar" ? "en" : "ar"}
              aria-label={t.langAria}
              data-cursor="hover"
              className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white ${ring}`}
            >
              {t.langLabel}
            </a>

            <div ref={cvRef} className="relative hidden sm:block">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={cvOpen}
                onClick={() => setCvOpen((v) => !v)}
                data-cursor="hover"
                className={`flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-[#0b0e1c] transition-transform active:scale-[0.97] ${ring}`}
              >
                {t.resume}
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className={`transition-transform ${cvOpen ? "rotate-180" : ""}`}>
                  <path d="M1.5 3.5L5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
              <AnimatePresence>
                {cvOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute end-0 top-12 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0e1c] p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
                  >
                    <div className="mono px-3 pb-1.5 pt-2 text-[11px] uppercase tracking-[0.18em] text-white/50">{t.resumeMenu}</div>
                    {cvs.map((c) => (
                      <a
                        key={c.file}
                        role="menuitem"
                        href={c.file}
                        download
                        className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.07] ${ring}`}
                      >
                        <span>
                          <span className="block text-sm text-white">{c.label}</span>
                          <span className="mono block text-[11px] text-white/50">{c.note}</span>
                        </span>
                        <span aria-hidden className="text-white/60">↓</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              aria-expanded={menu}
              aria-controls="site-menu"
              onClick={() => setMenu((v) => !v)}
              data-cursor="hover"
              className={`mono flex h-10 items-center rounded-full border border-white/15 px-4 text-xs uppercase tracking-[0.18em] text-white lg:hidden ${ring}`}
            >
              {menu ? t.close : t.menu}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="site-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[65] flex flex-col overflow-y-auto bg-[#070912] px-6 pb-10 pt-28 text-white lg:hidden"
          >
            <nav className="flex flex-col">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => goTo(e, l.href)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.04 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-baseline gap-3 border-b border-white/10 py-4"
                >
                  <span className="mono text-xs text-[#6ad8ff]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-3xl">{l.label}</span>
                </motion.a>
              ))}
            </nav>
            <div className="mt-10">
              <div className="mono mb-3 text-[11px] uppercase tracking-[0.18em] text-white/50">{t.resumeMenu}</div>
              <div className="flex flex-col gap-2">
                {cvs.map((c) => (
                  <a
                    key={c.file}
                    href={c.file}
                    download
                    className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3.5"
                  >
                    <span>
                      <span className="block text-base">{c.label}</span>
                      <span className="mono block text-[11px] text-white/50">{c.note}</span>
                    </span>
                    <span aria-hidden>↓</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
