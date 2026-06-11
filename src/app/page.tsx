import { ScrollSky } from "@/components/scroll-sky";
import { Atmosphere } from "@/components/grain";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Network } from "@/components/network";
import { ExperienceSection } from "@/components/experience";
import { Dusk } from "@/components/dusk";
import { SelectedWork } from "@/components/selected-work";
import { EventsSection } from "@/components/events-section";
import { Capabilities } from "@/components/capabilities";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <>
      <ScrollSky />
      {/* overflow-x-clip: off-screen Reveal elements sit at x:±44 before they
          animate in; without clipping they widen the document and cause a
          horizontal jiggle on mobile. clip (not hidden) keeps Lenis/sticky intact. */}
      <main className="relative overflow-x-clip">
        <Hero />

        {/* ☀ DAY — fintech / ZagTrader (text dark, sky is light here) */}
        <div id="day" className="theme-day">
          <About />
          <Network />
          <ExperienceSection />
        </div>

        {/* dusk transition (sky dims continuously behind) */}
        <Dusk />

        {/* ☾ NIGHT — personal apps (text light, sky is dark here) */}
        <div id="night" className="theme-night">
          <SelectedWork />
          <EventsSection />
          <Capabilities />
          <Contact />
        </div>
      </main>
      <Atmosphere />
    </>
  );
}
