import { useEffect } from "react";

function NotFound() {
  useEffect(() => {
    const prev = document.title;
    document.title = "404 — Page Not Found | Nagriva";

    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const prevRobots = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";

    return () => {
      document.title = prev;
      if (prevRobots !== null && meta) {
        meta.content = prevRobots;
      } else if (meta) {
        meta.remove();
      }
    };
  }, []);

  return (
    <main className="not-found-page">
      <div className="not-found__content">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">This page doesn&apos;t exist.</h1>
        <p className="not-found__subtitle">
          The page you&apos;re looking for may have been moved or removed.
        </p>
        <div className="not-found__actions">
          <a className="final-cta__button final-cta__button--primary" href="/">
            Back to Home
          </a>
          <a
            className="final-cta__button final-cta__button--secondary"
            href="https://wa.me/+212616523110"
          >
            Talk to Redouane
          </a>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
