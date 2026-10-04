import { useEffect, useRef, useState } from "react";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalf,
} from "@fortawesome/free-solid-svg-icons";

import nagrivaIntroVideo from "../assets/videos/nagriva-final.webm";

import {
  services,
  portfolioProjects,
  processSteps,
} from "../data/siteData";
import ProjectCard from "../components/ProjectCard";
import FeedbackSection from "../components/FeedbackSection";
import FaqCtaSection from "../components/FaqCtaSection";
import ClientLogos from "../components/ClientLogos";
import RappelCard from "../components/RappelCard";
import StartWithNagrivaButton from "../components/StartWithNagrivaButton";
import { useSeo } from "../hooks/useSeo";
import { seoConfigs } from "../data/seo";

const SEO = seoConfigs.home;

const CAROUSEL_INTERVAL = 2000;
const CAROUSEL_TRANSITION_MS = 700;



type CarouselRotation =
  | { status: "idle"; current: number }
  | { status: "transitioning"; leaving: number; target: number };

function Home() {
  useSeo(SEO);
  const [rotation, setRotation] = useState<CarouselRotation>({
    status: "idle",
    current: 0,
  });

  const [shouldReduceMotion, setShouldReduceMotion] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const groupsCount = Math.max(1, Math.ceil(portfolioProjects.length / 3));

  const getCarouselGroup = (groupIndex: number) => {
    if (portfolioProjects.length === 0) return [];
    const groupStart = (groupIndex * 3) % portfolioProjects.length;
    return Array.from({ length: 3 }, (_, k) =>
      portfolioProjects[(groupStart + k) % portfolioProjects.length],
    );
  };

  const transitioning = rotation.status === "transitioning";
  const visibleGroup = transitioning
    ? getCarouselGroup(rotation.target)
    : getCarouselGroup(rotation.current);
  const leavingGroup = transitioning ? getCarouselGroup(rotation.leaving) : [];

  const rotationRef = useRef(rotation);
  const shouldReduceMotionRef = useRef(shouldReduceMotion);
  const rotationFinishTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    shouldReduceMotionRef.current = shouldReduceMotion;
  }, [shouldReduceMotion]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setShouldReduceMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;
      const currentRotation = rotationRef.current;
      if (currentRotation.status === "transitioning") return;

      const next = (currentRotation.current + 1) % groupsCount;

      if (shouldReduceMotionRef.current) {
        setRotation({ status: "idle", current: next });
        return;
      }

      setRotation({
        status: "transitioning",
        leaving: currentRotation.current,
        target: next,
      });
      rotationFinishTimerRef.current = setTimeout(() => {
        setRotation({ status: "idle", current: next });
      }, CAROUSEL_TRANSITION_MS);
    }, CAROUSEL_INTERVAL);

    return () => {
      clearInterval(timer);
      if (rotationFinishTimerRef.current !== null) {
        clearTimeout(rotationFinishTimerRef.current);
        rotationFinishTimerRef.current = null;
      }
    };
  }, [groupsCount]);

  return (
    <>
      <main id="home">
        <section className="hero hero--two-col" aria-labelledby="hero-title">
          <div className="hero__container">
            <div className="hero__content hero__content--left">
              <p className="eyebrow hero__eyebrow">Nagriva — Website Design & Development Studio</p>
              <div className="hero__headline">
                <h1 id="hero-title">
                  <span className="hero__title-word hero__title-word--underline">Professionalism</span> starts here.
                </h1>
              </div>
              <p className="hero__description hero__description--justified">
                Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online.
              </p>
              <div className="hero__actions hero__actions--left">
                <StartWithNagrivaButton className="button button--primary" />
                <a className="button button--primary-2" href="https://wa.me/+212728427278" >
                  Let's use WhatsApp
                  <FontAwesomeIcon className="button--primary-2-icon" icon={faWhatsapp} aria-hidden="true" />
                </a>

              </div>
              <div className="hero__stats">
                <div className="hero__stat">
                  <span className="hero__stat-value">* 75%</span>
                  <span className="hero__stat-label">Satisfaction rate</span>
                </div>
                <div className="hero__stat">
                  <span className="hero__stat-value">* 98%</span>
                  <span className="hero__stat-label">Happy customers</span>
                </div>
              </div>
              <div className="hero__reviews">
                <div className="hero__stars">
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStarHalf} />
                </div>
                <div className="hero__review-info">
                  <span className="hero__review-text">Google Reviews · 378</span>
                  <a
                    className="hero__review-link"
                    href="https://g.page/r/CesvnU7f7DDJECE/review"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leave a review 
                  </a>
                </div>
              </div>
            </div>
            <div className="hero__visual hero__visual--right">
              <div className="hero__visual-glow" aria-hidden="true" />
              <RappelCard />
            </div>
          </div>
        </section>

        <ClientLogos />

        <section className="services-section" id="services" aria-labelledby="services-title">
          <div className="section-heading">
            <div className="section-heading__copy">
              <h2 id="services-title">Our <span className="services-title__accent">Services</span></h2>
              <p className="section-intro">Focused digital work for businesses that need to look serious online.</p>
            </div>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className={`service-card${service.isCore ? " service-card--core" : ""}`} key={service.title}>
                <div className="service-card__topline">
                  <span className="service-card__icon" aria-hidden="true"><FontAwesomeIcon icon={service.icon} /></span>
                  {service.isCore && <span className="service-card__core-label">Core Service</span>}
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
          <div className="portfolio-heading">
            <p className="eyebrow">SELECTED WORK</p>
            <h2 id="portfolio-title">Selected work,<br /> <span>built with purpose.</span></h2>

          </div>

          <div className="portfolio-grid home-carousel">
            <div className="home-carousel__set">
              {visibleGroup.map((project, i) => (
                <div
                  className={`home-carousel-item${
                    transitioning && !shouldReduceMotion
                      ? ` home-carousel-item--enter-${i}`
                      : ""
                  }`}
                  key={project.title}
                >
                  <ProjectCard project={project} loading="eager" hideActions />
                </div>
              ))}
            </div>
            {transitioning && (
              <div className="home-carousel__set home-carousel__set--leaving" aria-hidden="true">
                {leavingGroup.map((project, i) => (
                  <div className={`home-carousel-item home-carousel-item--exit-${i}`} key={project.title}>
                    <ProjectCard project={project} loading="eager" hideActions />
                  </div>
                ))}
              </div>
            )}
          </div>
          {visibleGroup.length === 0 && <p className="portfolio-empty-state">No projects in this category yet.</p>}
          <div className="portfolio-bottom-cta">
            <p>Want to see more of Nagriva's work?</p>
            <a className="portfolio-cta-button" href="/services">Explore all work</a>
          </div>
        </section>

        <section className="why-nagriva-section" id="why-nagriva" aria-labelledby="why-nagriva-title">
          <div className="why-nagriva__content">
            <p className="eyebrow">WHY NAGRIVA</p>
            <h2 id="why-nagriva-title">Digital work built to earn trust and start conversations.</h2>
            <p className="why-nagriva__intro">Nagriva combines thoughtful design, clear strategy, and solid development to help businesses show up online with confidence.</p>

            <div className="why-nagriva__values">
              <article className="why-nagriva__value">
                <span className="why-nagriva__value-number">01</span>
                <div>
                  <h3>Professional but approachable.</h3>
                </div>
              </article>
              <article className="why-nagriva__value">
                <span className="why-nagriva__value-number">02</span>
                <div>
                  <h3>Creative but intentional.</h3>
                </div>
              </article>
              <article className="why-nagriva__value">
                <span className="why-nagriva__value-number">03</span>
                <div>
                  <h3>Premium but not distant.</h3>
                </div>
              </article>
              <article className="why-nagriva__value">
                <span className="why-nagriva__value-number">04</span>
                <div>
                  <h3>Digital but human.</h3>
                </div>
              </article>
            </div>
          </div>

          <div className="why-nagriva__media">
            <div className="why-nagriva__video-panel">
              <div className="why-nagriva__video-glow" aria-hidden="true" />
              <div className="why-nagriva__video-topbar">
                <span>INTRO FILM</span>
                <span>TEMPORARY PREVIEW</span>
              </div>
              <video
                className="why-nagriva__video"
                src={nagrivaIntroVideo}
                controls
                playsInline
                preload="metadata"
                aria-label="Nagriva animated logo intro film"
              />
            </div>
          </div>
        </section>

        <FeedbackSection />

        <section className="process-section" id="process" aria-labelledby="process-title">
          <div className="process-section__header">
            <div className="process-section__intro">
              <p className="process-pill">HOW IT WORKS</p>
              <h2 id="process-title">Get your website live in 3 focused steps</h2>
            </div>
            <div className="process-section__heading">
              <p>
                A clear process that takes your project from idea to launch without the usual confusion.
              </p>
            </div>
          </div>

          <div className="process-grid">
            {processSteps.map((step) => (
              <article className="process-card" key={step.title}>
                <div className={`process-card__visual process-card__visual--${step.visual}`} aria-hidden="true">
                  <img className="process-card__image" src={step.image} alt="" />
                </div>
                <div className="process-card__content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FaqCtaSection />
      </main>
    </>
  );
}

export default Home;
