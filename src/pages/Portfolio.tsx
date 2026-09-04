import { useEffect, useState } from "react";
import FinalCta from "../components/FinalCta";
import ProjectCard from "../components/ProjectCard";
import ProjectFinder from "../components/ProjectFinder";
import { portfolioProjects } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";

const SEO = {
  title: "Portfolio \u2014 Nagriva",
  description: "A selection of websites, digital experiences, and brand work Nagriva has created for businesses that care about how they show up online.",
  canonical: "https://nagriva.ma/portfolio",
  og: { title: "Portfolio \u2014 Nagriva", description: "A selection of websites, digital experiences, and brand work created for businesses that care about how they show up online.", url: "https://nagriva.ma/portfolio" },
  twitter: { title: "Portfolio \u2014 Nagriva", description: "A selection of websites, digital experiences, and brand work created for businesses that care about how they show up online.", card: "summary_large_image" as const },
};

const MOBILE_BREAKPOINT = "(max-width: 720px)";
const INITIAL_VISIBLE: Record<"mobile" | "desktop", number> = {
  mobile: 6,
  desktop: 9,
};
const BATCH_SIZE = 6;
const EAGER_LOAD_COUNT = 6;

function Portfolio() {
  useSeo(SEO);
  const [visibleCount, setVisibleCount] = useState(() =>
    window.matchMedia(MOBILE_BREAKPOINT).matches
      ? INITIAL_VISIBLE.mobile
      : INITIAL_VISIBLE.desktop
  );
  const total = portfolioProjects.length;
  const hasMore = visibleCount < total;

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT);
    const syncInitial = () => {
      const target = mq.matches ? INITIAL_VISIBLE.mobile : INITIAL_VISIBLE.desktop;
      setVisibleCount((current) => Math.max(current, target));
    };
    if (mq.addEventListener) {
      mq.addEventListener("change", syncInitial);
      return () => mq.removeEventListener("change", syncInitial);
    }
    return undefined;
  }, []);

  const handleViewMore = () => {
    setVisibleCount((current) => current + BATCH_SIZE);
  };

  return (
    <main className="portfolio-page" id="portfolio-page">
      <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
        <div className="portfolio-hero__container">
          <div className="portfolio-hero__content">
            <p className="eyebrow portfolio-hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              SELECTED WORK
            </p>
            <h1 id="portfolio-hero-title">
              Digital work built to be <span>seen</span> — and remembered.
            </h1>
            <p className="portfolio-hero__description">
              A selection of websites, digital experiences, and brand work created for
              businesses that care about how they show up online.
            </p>
          </div>
        </div>
      </section>

      <section
        className="portfolio-projects"
        id="portfolio-projects"
        aria-labelledby="portfolio-projects-title"
      >
        <div className="portfolio-projects__heading">
          <h2 id="portfolio-projects-title">Selected projects</h2>
          <p className="portfolio-projects__intro">
            A focused look at work built to make businesses look serious online.
          </p>
        </div>
        <div className="portfolio-grid portfolio-projects__grid">
          {portfolioProjects.slice(0, visibleCount).map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              loading={index < EAGER_LOAD_COUNT ? "eager" : "lazy"}
            />
          ))}
        </div>
        {hasMore && (
          <button type="button" className="portfolio-load-more" onClick={handleViewMore}>
            View more projects 
          </button>
        )}
      </section>

      <ProjectFinder />

      <FinalCta />
    </main>
  );
}

export default Portfolio;
