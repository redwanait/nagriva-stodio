import { useState } from "react";
import { portfolioProjects } from "../data/siteData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logos/logo.png";
import "./ProjectPreview.css";

function ProjectPreview({ projectId }: { projectId: string }) {
  const project = portfolioProjects.find((p) => p.id === projectId);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  if (!project || !project.websiteUrl) {
    return (
      <main className="project-preview">
        <header className="project-preview__bar">
          <span className="project-preview__brand" aria-hidden="true">
            <img className="project-preview__logo" src={logo} alt="Nagriva" />
          </span>
          <a className="project-preview__back" href="#portfolio" aria-label="Back to portfolio">
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </a>
        </header>
        <div className="project-preview__notfound">
          <h1>Project not found</h1>
          <p>The website preview you are looking for could not be found.</p>
          <a className="project-preview__open" href="#portfolio">
            Back to Portfolio
          </a>
        </div>
      </main>
    );
  }

  const { websiteUrl, title } = project;

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#portfolio";
    }
  };

  return (
    <main className="project-preview">
      <header className="project-preview__bar">
        <span className="project-preview__brand" aria-hidden="true">
          <img className="project-preview__logo" src={logo} alt="Nagriva" />
        </span>
        <span className="project-preview__label">WEBSITE PREVIEW</span>
        <div className="project-preview__actions">
          <button
            type="button"
            className="project-preview__back"
            onClick={handleBack}
            aria-label="Back to portfolio"
          >
            <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
          </button>
          <a className="project-preview__cta" href="#start">
            Start with Nagriva
            <FontAwesomeIcon className="project-preview__cta-icon" icon={faArrowUpRightFromSquare} aria-hidden="true" />
          </a>
        </div>
      </header>

      <div className="project-preview__stage">
        {status !== "error" && (
          <iframe
            className="project-preview__frame"
            src={websiteUrl}
            title={`${title} website preview`}
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        )}

        {status === "loading" && (
          <div className="project-preview__overlay" role="status">
            <span className="project-preview__spinner" aria-hidden="true" />
            <p>Loading preview…</p>
          </div>
        )}

        {status === "error" && (
          <div className="project-preview__error" role="alert">
            <h1>Preview unavailable</h1>
            <p>This website does not allow embedding in an iframe.</p>
            <a
              className="project-preview__open"
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original website <span aria-hidden="true">↗</span>
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

export default ProjectPreview;
