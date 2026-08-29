type ProjectCardProps = {
  project: {
    title: string;
    link?: string;
    linkOne?: string;
    linkTwo?: string;
    visual?: string;
    image?: string;
    categories: string[];
    clientInitial?: string;
    clientName?: string;
  };
};

function ProjectCard({ project }: ProjectCardProps) {
  const hasActions = Boolean(project.linkOne && project.linkTwo);

  const inner = (
    <>
      <div className={`portfolio-card__visual portfolio-card__visual--${project.visual ?? "default"}`}>
        {project.image && (
          <img
            className="portfolio-visual__image"
            src={project.image}
            alt={`${project.title} website preview`}
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
        {hasActions && (
          <div className="portfolio-card__actions">
            <a className="portfolio-card__action portfolio-card__action--primary" href={project.linkOne}>
              Start with Nagriva <span aria-hidden="true"></span>
            </a>
            <a className="portfolio-card__action portfolio-card__action--secondary" href={project.linkTwo}>
              View this website <span aria-hidden="true"></span>
            </a>
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
