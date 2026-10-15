import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import FinalCta from "../components/FinalCta";
import ProjectCard from "../components/ProjectCard";
import ProjectFinderModal from "../components/ProjectFinderModal";
import { portfolioProjects } from "../data/siteData";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs.portfolio;

const MOBILE_BREAKPOINT = "(max-width: 720px)";
const INITIAL_VISIBLE: Record<"mobile" | "desktop", number> = {
  mobile: 4,
  desktop: 6,
};
const BATCH_SIZE = 6;
const EAGER_LOAD_COUNT = 6;

/** The finder is offered at most once per portfolio browsing session. */
const FINDER_SESSION_KEY = "nagriva.portfolio.finderShown";

/**
 * TEMPORARY (review only). While true, the finder opens on every visit instead of
 * once per browsing session, so the modal can be reviewed repeatedly.
 * Set this back to `false` to restore the normal once-per-session behaviour.
 */
const ALWAYS_SHOW_FINDER = true;

function hasSeenFinderThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(FINDER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markFinderSeenThisSession(): void {
  try {
    window.sessionStorage.setItem(FINDER_SESSION_KEY, "1");
  } catch {
    // Storage disabled (private mode): the in-memory ref still prevents re-opening.
  }
}

function Portfolio() {
  useSeo(SEO);
  const [visibleCount, setVisibleCount] = useState(() =>
    window.matchMedia(MOBILE_BREAKPOINT).matches
      ? INITIAL_VISIBLE.mobile
      : INITIAL_VISIBLE.desktop
  );
  const total = portfolioProjects.length;
  const hasMore = visibleCount < total;
  const [finderOpen, setFinderOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  // Index of the first project revealed by a keyboard activation of "View more".
  const pendingFocusIndexRef = useRef<number | null>(null);
  // The first project revealed by the final click, focused again when the modal closes.
  const revealFocusTargetRef = useRef<HTMLElement | null>(null);
  const finderShownRef = useRef(false);

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

  // Opens the finder at most once per browsing session. Every trigger path goes
  // through here, so the modal can never be opened twice.
  const offerFinder = useCallback(() => {
    if (finderShownRef.current) return;
    if (!ALWAYS_SHOW_FINDER && hasSeenFinderThisSession()) return;
    finderShownRef.current = true;
    markFinderSeenThisSession();
    setFinderOpen(true);
  }, []);

  const handleViewMore = (event: MouseEvent<HTMLButtonElement>) => {
    const nextCount = Math.min(visibleCount + BATCH_SIZE, total);
    // detail is 0 when the click came from the keyboard (or assistive technology).
    // Mouse and touch clicks keep the browser's default focus behaviour.
    pendingFocusIndexRef.current = event.detail === 0 ? visibleCount : null;
    setVisibleCount(nextCount);
    // Open from the same click that reveals the final batch, so it feels immediate.
    if (nextCount >= total) offerFinder();
  };

  // After the final reveal, keyboard users are moved to the first newly revealed
  // project. When the finder opened, that card is remembered instead, so focus
  // returns there when the dialog closes.
  useEffect(() => {
    if (hasMore) return;

    const index = pendingFocusIndexRef.current;
    pendingFocusIndexRef.current = null;
    if (index === null) return;
    const card = gridRef.current?.children[index];
    if (!(card instanceof HTMLElement)) return;
    card.tabIndex = -1;
    if (finderOpen) {
      revealFocusTargetRef.current = card;
    } else {
      card.focus();
    }
  }, [hasMore, visibleCount, finderOpen]);

  return (
    <main className="portfolio-page" id="portfolio-page">
      <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
        <div className="portfolio-hero__container">
          <div className="portfolio-hero__content">
            <p className="eyebrow portfolio-hero__eyebrow">
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
        <div className="portfolio-grid portfolio-projects__grid" ref={gridRef}>
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

      {finderOpen && (
        <ProjectFinderModal
          onClose={() => setFinderOpen(false)}
          returnFocusRef={revealFocusTargetRef}
        />
      )}

      <FinalCta />
    </main>
  );
}

export default Portfolio;
