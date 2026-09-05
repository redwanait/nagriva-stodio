import { useEffect, useRef } from "react";
function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      section.classList.add("final-cta--visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("final-cta--visible");
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="final-cta" ref={sectionRef} aria-labelledby="final-cta-title">
      <div className="final-cta__panel">

        <div className="final-cta__content">
          <p className="final-cta__eyebrow">LET&apos;S WORK TOGETHER</p>
          <h2 id="final-cta-title">Ready to build something that matters?</h2>
          <p className="final-cta__description">
            Tell us what you&apos;re working on. We&apos;ll help turn your idea into a clear,
            purposeful digital experience.
          </p>
          <div className="final-cta__actions">
            <a className="final-cta__button final-cta__button--primary" href="/start">
              Start with Nagriva
            </a>
            <a className="final-cta__button final-cta__button--secondary" href="https://wa.me/+212616523110">
              Talk to Redoaune
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCta;
