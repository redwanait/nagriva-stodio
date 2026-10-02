import AboutHero from "../components/about/AboutHero";
import WhatNagrivaDoes from "../components/about/WhatNagrivaDoes";
import WhatNagrivaIsUsedFor from "../components/about/WhatNagrivaIsUsedFor";
import HistoryTimeline from "../components/about/HistoryTimeline";
import FinalCta from "../components/FinalCta";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs.about;

function About() {
  useSeo(SEO);
  return (
    <main className="about-page" id="about-page">
      <AboutHero />
      <WhatNagrivaDoes />
      <WhatNagrivaIsUsedFor />
      <HistoryTimeline />
      <FinalCta />
    </main>
  );
}

export default About;
