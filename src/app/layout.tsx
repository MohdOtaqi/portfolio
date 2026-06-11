import type { Metadata } from "next";
import { Fraunces, Spline_Sans, Spline_Sans_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";
import { cn } from "@/lib/utils";

// Display: Fraunces — optical high-contrast serif (the "astronomical instrument"
// feel of the Meridian direction). Body: Spline Sans. Mono: Spline Sans Mono.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
});

const spline = Spline_Sans({
  subsets: ["latin"],
  variable: "--font-spline",
  display: "swap",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  variable: "--font-spline-mono",
  display: "swap",
});

const SITE_URL = "https://mohammadotaqi.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mohammad Otaqi — Software Engineer",
    template: "%s · Mohammad Otaqi",
  },
  description:
    "Mohammad Otaqi — Software Engineer building fintech trading infrastructure at ZagTrader. SWIFT & FIX messaging, market-data systems, C#/.NET, React, Flutter. Based in Amman, Jordan.",
  keywords: [
    "Mohammad Otaqi",
    "محمد اتقي",
    "Software Engineer",
    "Software Developer",
    "C#",
    ".NET",
    "ASP.NET Core",
    "React",
    "Flutter",
    "SWIFT messaging",
    "FIX protocol",
    "fintech",
    "ZagTrader",
    "Amman Jordan",
    "HTU",
  ],
  authors: [{ name: "Mohammad Otaqi", url: SITE_URL }],
  creator: "Mohammad Otaqi",
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Mohammad Otaqi — Software Engineer",
    description:
      "Building the infrastructure that moves money — SWIFT/FIX messaging, market data, full-stack products. Based in Amman, Jordan.",
    siteName: "Mohammad Otaqi",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Mohammad Otaqi — Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Otaqi — Software Engineer",
    description:
      "Building the infrastructure that moves money — SWIFT/FIX messaging, market data, full-stack products.",
    images: ["/og.png"],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohammad Otaqi",
  url: "https://mohammadotaqi.com",
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "ZagTrader", url: "https://zagtrader.com" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Al-Hussein Technical University", alternateName: "HTU" },
  address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
  sameAs: [
    "https://github.com/MohdOtaqi",
    "https://jo.linkedin.com/in/mohammad-otaqi-ba5a17257",
  ],
  knowsAbout: ["C#", ".NET", "ASP.NET Core", "React", "TypeScript", "Flutter", "SQL Server", "SWIFT messaging", "FIX protocol", "fintech software"],
  image: "https://mohammadotaqi.com/og.png",
  description: "Software Engineer at ZagTrader specialising in fintech infrastructure — SWIFT/FIX messaging, market-data systems, and full-stack product development.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(fraunces.variable, spline.variable, splineMono.variable)}
    >
      <body className="cursor-host min-h-dvh antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
