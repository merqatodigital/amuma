import type { ComponentType } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Admin from "../admin/Admin";
import { ContentProvider, useContent } from "../store";
import CustomSection from "../sections/Custom";
import SectionMedia from "./SectionMedia";
import { Circle, Experience, Meaning, Vision } from "../sections/Story";
import { Future, Hidden, Palawan, Roadmap, SanVicente } from "../sections/Places";
import { Calculator, Flywheel, Revenue, Tiers, Usage } from "../sections/Model";
import { Faq, Footer, Join, Portal, Team } from "../sections/Community";

/** Every built-in section the client can show, hide, or reorder. */
export const REGISTRY: Record<string, ComponentType> = {
  vision: Vision,
  meaning: Meaning,
  circle: Circle,
  hidden: Hidden,
  palawan: Palawan,
  sanVicente: SanVicente,
  experience: Experience,
  future: Future,
  roadmap: Roadmap,
  tiers: Tiers,
  usage: Usage,
  revenue: Revenue,
  flywheel: Flywheel,
  calculator: Calculator,
  team: Team,
  portal: Portal,
  join: Join,
  faq: Faq,
};

function Sections() {
  const { sections } = useContent();
  return (
    <>
      {sections
        .filter((s) => s.enabled)
        .map((s) => {
          const C = REGISTRY[s.type];
          const body =
            s.type === "custom" ? <CustomSection id={s.id} /> : C ? <C /> : null;
          return (
            <div key={s.id}>
              {body}
              <SectionMedia id={s.id} />
            </div>
          );
        })}
    </>
  );
}

export default function Site() {
  return (
    <ContentProvider>
      <div className="min-h-screen bg-sand-50 text-bark-800 antialiased">
        <Nav />
        <main>
          <Hero />
          <SectionMedia id="hero" />
          <Sections />
        </main>
        <Footer />
        <Admin />
      </div>
    </ContentProvider>
  );
}
