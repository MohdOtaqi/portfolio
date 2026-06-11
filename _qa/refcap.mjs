import { chromium } from "playwright";

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errs = [];
p.on("pageerror", (e) => errs.push(String(e)));

await p.goto("https://mousaaricat.com/", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(2500);

// ---- Structure / tech probe ----
const probe = await p.evaluate(() => {
  const text = (el) => (el?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
  const navLinks = [...document.querySelectorAll("nav a, header a")].map((a) => ({
    t: text(a),
    href: a.getAttribute("href"),
  }));
  // anything that looks like a tab control
  const tabbish = [...document.querySelectorAll('[role="tab"], [class*="tab" i], button')]
    .slice(0, 40)
    .map((el) => ({ tag: el.tagName, role: el.getAttribute("role"), cls: el.className?.toString().slice(0, 60), t: text(el) }))
    .filter((x) => x.t);
  const headings = [...document.querySelectorAll("h1,h2,h3")].map((h) => ({ tag: h.tagName, t: text(h) }));
  const bodyStyle = getComputedStyle(document.body);
  const fonts = new Set();
  document.querySelectorAll("h1,h2,h3,p,a,span").forEach((el) => fonts.add(getComputedStyle(el).fontFamily));
  // detect libs
  const html = document.documentElement.outerHTML;
  const libs = {
    framerMotion: /framer|motion/i.test(html),
    gsap: !!window.gsap || /gsap/i.test(html),
    lenis: !!window.lenis || !!window.__lenis || /lenis/i.test(html),
    next: !!document.getElementById("__next") || /_next\//.test(html),
    three: !!window.THREE || /three/i.test(html),
  };
  return {
    title: document.title,
    bg: bodyStyle.backgroundColor,
    color: bodyStyle.color,
    bodyFont: bodyStyle.fontFamily,
    fonts: [...fonts].slice(0, 8),
    navLinks,
    headings: headings.slice(0, 20),
    tabbish: tabbish.slice(0, 20),
    libs,
    scrollHeight: document.documentElement.scrollHeight,
  };
});
console.log("PROBE:\n" + JSON.stringify(probe, null, 2));

// ---- Scroll filmstrip ----
const fracs = [0, 0.12, 0.25, 0.4, 0.55, 0.7, 0.85, 1];
for (const f of fracs) {
  await p.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.round(max * frac), behavior: "instant" });
  }, f);
  await p.waitForTimeout(1100);
  await p.screenshot({ path: `_qa/ref-${String(Math.round(f * 100)).padStart(3, "0")}.png` });
  console.log("ref-" + Math.round(f * 100));
}

if (errs.length) console.log("ERRORS:\n" + [...new Set(errs)].slice(0, 8).join("\n"));
await b.close();
console.log("DONE");
