import { useState } from "react";
import "./IframeTest.css";

const TEST_URL = "https://chidoled.com";

function IframeTest() {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = "#home";
    }
  };

  return (
    <main className="iframe-test">
      <header className="iframe-test__bar">
        <a
          className="iframe-test__brand"
          href="#home"
          aria-label="Go back to Nagriva home"
          onClick={(e) => {
            e.preventDefault();
            handleBack();
          }}
        >
          <span className="iframe-test__mark" aria-hidden="true">
            N
          </span>
          NAGRIVA <span aria-hidden="true">✦</span>
        </a>
        <span className="iframe-test__label">Website Preview — TEST</span>
        <button
          type="button"
          className="iframe-test__back"
          onClick={handleBack}
        >
          Back
        </button>
      </header>

      <div className="iframe-test__stage">
        {status !== "error" && (
          <iframe
            className="iframe-test__frame"
            src={TEST_URL}
            title="External website preview test"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        )}

        {status === "loading" && (
          <div className="iframe-test__overlay" role="status">
            <span className="iframe-test__spinner" aria-hidden="true" />
            <p>Loading preview…</p>
          </div>
        )}

        {status === "error" && (
          <div className="iframe-test__error" role="alert">
            <h1>Preview unavailable</h1>
            <p>
              This website does not allow embedding in an iframe.
            </p>
            <a
              className="iframe-test__open"
              href={TEST_URL}
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

export default IframeTest;
