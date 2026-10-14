import { useEffect, useRef, useState, type MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import StartWithNagrivaButton from "./StartWithNagrivaButton";
import { copyToClipboard } from "../lib/clipboard";

type ProjectCardProps = {
  project: {
    id: string;
    title: string;
    link?: string;
    linkOne?: string;
    websiteUrl?: string;
    visual?: string;
    image?: string;
    categories: string[];
    clientInitial?: string;
    clientName?: string;
  };
  loading?: "lazy" | "eager";
  hideActions?: boolean;
};

type CopyState = "idle" | "copied" | "error";

const COPY_FEEDBACK_MS = 2000;

function ProjectCard({ project, loading = "lazy", hideActions = false }: ProjectCardProps) {
  const showStartAction = Boolean(project.linkOne);
  const showPreviewAction = Boolean(project.websiteUrl);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyRequestRef = useRef(0);

  useEffect(() => {
    return () => {
      // Invalidate any in-flight copy and drop the pending feedback reset.
      copyRequestRef.current += 1;
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const handleCopyId = async (event: MouseEvent<HTMLButtonElement>) => {
    // Keep this click local: no link navigation and no Start flow.
    event.preventDefault();
    const requestId = ++copyRequestRef.current;
    const copied = await copyToClipboard(project.id);
    // A newer click or an unmount superseded this request.
    if (requestId !== copyRequestRef.current) return;
    setCopyState(copied ? "copied" : "error");
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => {
      feedbackTimerRef.current = null;
      setCopyState("idle");
    }, COPY_FEEDBACK_MS);
  };

  const copyAnnouncement =
    copyState === "copied"
      ? `Project ID ${project.id} copied.`
      : copyState === "error"
        ? `Could not copy project ID ${project.id}. Please try again.`
        : "";

  const inner = (
    <>
      <div className={`portfolio-card__visual portfolio-card__visual--${project.visual ?? "default"}`}>
        {project.image && (
          <img
            className="portfolio-visual__image"
            src={project.image}
            alt={`${project.title} website preview`}
            loading={loading}
            decoding="async"
          />
        )}
      </div>
      <div className="portfolio-card__body">
        <div>
          <h3>{project.title}</h3>
          <p>{project.categories}</p>
        </div>
        <div className="portfolio-card__client">
          <span className="portfolio-card__avatar" aria-hidden="true">
            {project.clientInitial}
          </span>
          <span>{project.clientName}</span>
        </div>
        {!hideActions && (
          <div className="portfolio-card__actions">
            {showStartAction && (
              <StartWithNagrivaButton
                className="portfolio-card__action portfolio-card__action--primary"
                href={project.linkOne}
              />
            )}
            <div className="portfolio-card__secondary-actions">
              {showPreviewAction && (
                <a
                  className="portfolio-card__action portfolio-card__action--secondary"
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View this website <span aria-hidden="true"></span>
                </a>
              )}
              <button
                type="button"
                className="portfolio-card__action portfolio-card__action--secondary portfolio-card__copy"
                data-copy-state={copyState}
                onClick={handleCopyId}
              >
                <i className="portfolio-card__copy-icon" aria-hidden="true">
                  <FontAwesomeIcon icon={faCopy} />
                  <FontAwesomeIcon icon={faCheck} />
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </i>
                Copy Project ID
              </button>
            </div>
            <span className="visually-hidden" role="status" aria-live="polite">
              {copyAnnouncement}
            </span>
          </div>
        )}
      </div>
    </>
  );

  return project.link ? (
    <a
      className="portfolio-card"
      href={project.link}
      target={project.link === "#" ? undefined : "_blank"}
      rel={project.link === "#" ? undefined : "noreferrer"}
    >
      {inner}
    </a>
  ) : (
    <article className="portfolio-card">{inner}</article>
  );
}

export default ProjectCard;
