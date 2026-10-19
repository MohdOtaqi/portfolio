"use client";

import { useEffect } from "react";

/** The root layout renders <html lang="en">; Arabic routes correct it after mount
 *  (lang for screen readers, dir so the page scrollbar sits on the left). */
export function HtmlLang({ lang, dir }: { lang: string; dir: "ltr" | "rtl" }) {
  useEffect(() => {
    const el = document.documentElement;
    const prev = { lang: el.lang, dir: el.dir };
    el.lang = lang;
    el.dir = dir;
    return () => {
      el.lang = prev.lang;
      el.dir = prev.dir;
    };
  }, [lang, dir]);
  return null;
}
