import FinalCta from "../components/FinalCta";
import ProjectCard from "../components/ProjectCard";
import ProjectFinder from "../components/ProjectFinder";
import { portfolioProjects } from "../data/siteData";

function Portfolio() {
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
          {portfolioProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>

      <ProjectFinder />

      <FinalCta />
    </main>
  );
}

export default Portfolio;
