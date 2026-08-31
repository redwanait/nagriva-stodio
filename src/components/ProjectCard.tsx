type ProjectCardProps = {
  project: {
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
};

function ProjectCard({ project, loading = "lazy" }: ProjectCardProps) {
  const showStartAction = Boolean(project.linkOne);
  const showPreviewAction = Boolean(project.websiteUrl);

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
        {(showStartAction || showPreviewAction) && (
          <div className="portfolio-card__actions">
            {showStartAction && (
              <a className="portfolio-card__action portfolio-card__action--primary" href={project.linkOne}>
                Start with Nagriva <span aria-hidden="true"></span>
              </a>
            )}
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
