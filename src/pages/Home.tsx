import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

import headlineAudio from "../assets/sound/sound01.wav";
import nagrivaIntroVideo from "../assets/videos/nagriva-final.webm";

import {
  services,
  featuredProjects,
  processSteps,
} from "../data/siteData";
import ProjectCard from "../components/ProjectCard";
import FeedbackSection from "../components/FeedbackSection";
import FaqCtaSection from "../components/FaqCtaSection";

function Home() {
  const [activePortfolioFilter, ] = useState("All");
  const [isVoiceVisible, setIsVoiceVisible] = useState(false);
  const [isHeadlineAudioPlaying, setIsHeadlineAudioPlaying] = useState(false);
  const headlineAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceVisibilityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isVoiceVisibleRef = useRef(false);
  const isPointerInsideVoiceAreaRef = useRef(false);
  const isVoiceFocusedRef = useRef(false);
  const visibleProjects = activePortfolioFilter === "All"
    ? featuredProjects
    : featuredProjects.filter((project) => project.filterCategories.includes(activePortfolioFilter));

  useEffect(() => {
    const audio = new Audio(headlineAudio);
    audio.preload = "auto";
    headlineAudioRef.current = audio;

    const resetAudioState = () => setIsHeadlineAudioPlaying(false);
    audio.addEventListener("ended", resetAudioState);
    audio.addEventListener("error", resetAudioState);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", resetAudioState);
      audio.removeEventListener("error", resetAudioState);
      audio.removeAttribute("src");
      audio.load();
      headlineAudioRef.current = null;
    };
  }, []);

  const toggleHeadlineAudio = () => {
    const audio = headlineAudioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsHeadlineAudioPlaying(false);
      return;
    }

    audio.currentTime = 0;
    void audio.play()
      .then(() => setIsHeadlineAudioPlaying(true))
      .catch(() => setIsHeadlineAudioPlaying(false));
  };

  const clearVoiceVisibilityTimeout = () => {
    if (voiceVisibilityTimeoutRef.current !== null) {
      clearTimeout(voiceVisibilityTimeoutRef.current);
      voiceVisibilityTimeoutRef.current = null;
    }
  };

  const hideVoiceIfOutsideArea = () => {
    if (!isPointerInsideVoiceAreaRef.current && !isVoiceFocusedRef.current) {
      isVoiceVisibleRef.current = false;
      setIsVoiceVisible(false);
    }
  };

  const showVoice = () => {
    if (isVoiceVisibleRef.current) return;

    clearVoiceVisibilityTimeout();
    isVoiceVisibleRef.current = true;
    setIsVoiceVisible(true);
    voiceVisibilityTimeoutRef.current = setTimeout(() => {
      voiceVisibilityTimeoutRef.current = null;
      hideVoiceIfOutsideArea();
    }, 7000);
  };

  const handleVoiceAreaPointerEnter = () => {
    isPointerInsideVoiceAreaRef.current = true;
    showVoice();
  };

  const handleVoiceAreaPointerLeave = () => {
    isPointerInsideVoiceAreaRef.current = false;
    if (voiceVisibilityTimeoutRef.current === null) hideVoiceIfOutsideArea();
  };

  const handleVoiceAreaFocus = () => {
    isVoiceFocusedRef.current = true;
    showVoice();
  };

  const handleVoiceAreaBlur = () => {
    isVoiceFocusedRef.current = false;
    if (voiceVisibilityTimeoutRef.current === null) hideVoiceIfOutsideArea();
  };

  useEffect(() => () => clearVoiceVisibilityTimeout(), []);

  return (
    <>
      <main id="home">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__container">
            <div className="hero__content">
              <p className="eyebrow hero__eyebrow"> <span className="eyebrow__dot" />Sophisticated digital work, made human.</p>
              <div
                className={`hero__headline${isVoiceVisible ? " hero__headline--voice-visible" : ""}`}
                onPointerEnter={handleVoiceAreaPointerEnter}
                onPointerLeave={handleVoiceAreaPointerLeave}
                onFocus={handleVoiceAreaFocus}
                onBlur={handleVoiceAreaBlur}
              >
<button
  className="hero__headline-audio"
  type="button"
  aria-label={isHeadlineAudioPlaying ? "Pause headline audio" : "Play headline audio"}
  aria-pressed={isHeadlineAudioPlaying}
  onClick={toggleHeadlineAudio}
>
  <FontAwesomeIcon
    icon={isHeadlineAudioPlaying ? faPause : faVolumeHigh}
    aria-hidden="true"
  />
</button>
                <h1 id="hero-title">Professional enough<br /><span>to trust.</span><br />Human enough <span>to talk to.</span></h1>
              </div>
              <p className="hero__description">Nagriva designs and builds fast, responsive websites for businesses that want to look credible and perform better online.</p>
              <div className="hero__actions">
                <a className="button button--primary" href="#start">Start your project <span aria-hidden="true">↗</span></a>
                <a className="button button--secondary" href="#services">Talk to the founder<span aria-hidden="true">↗</span></a>
              </div>
              <div className="trust-row" aria-label="What we deliver">
                <span><i />Professional but approachable.</span>
                <span><i />Creative but intentional.</span>
                <span><i />Digital but human.</span>
              </div>
            </div>
          </div>
        </section>

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
                <a className="service-card__link" href="#start">Read more <span aria-hidden="true">→</span></a>
              </article>
            ))}
          </div>
          <a className="services-cta" href="#start">Start with Nagriva <span aria-hidden="true">→</span></a>
        </section>

        <section className="portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
          <div className="portfolio-heading">
            <p className="eyebrow">SELECTED WORK</p>
            <h2 id="portfolio-title">Selected work,<br /> <span>built with purpose.</span></h2>

          </div>

          <div className="portfolio-grid">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
          {visibleProjects.length === 0 && <p className="portfolio-empty-state">No projects in this category yet.</p>}
          <div className="portfolio-bottom-cta">
            <p>Want to see more of Nagriva's work?</p>
            <a className="portfolio-cta-button" href="#start">Explore all work</a>
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
              <a className="process-section__cta" href="#start">Start with Nagriva <span aria-hidden="true">→</span></a>
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
