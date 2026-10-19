import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Noto_Naskh_Arabic } from "next/font/google";
import { HtmlLang } from "@/components/html-lang";
import { cn } from "@/lib/utils";

// Arabic only (subsets: arabic) — Latin text keeps falling through to Fraunces / Spline.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});

const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
  variable: "--font-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mohammad Otaqi — مهندس برمجيات",
    template: "%s · Mohammad Otaqi",
  },
  description:
    "مهندس برمجيات في ZagTrader يبني أنظمة SWIFT وFIX والربط مع البورصات ومنصة لأتمتة الاختبارات بالذكاء الاصطناعي، ويطلق تطبيقات جوال ومنصات SaaS خاصة به. عمّان، الأردن.",
  alternates: { canonical: "/ar", languages: { en: "/", ar: "/ar" } },
  openGraph: { locale: "ar_JO", url: "/ar" },
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="ar" dir="rtl" className={cn(plexArabic.variable, naskh.variable, "locale-ar")}>
      <HtmlLang lang="ar" dir="rtl" />
      {children}
    </div>
  );
}
