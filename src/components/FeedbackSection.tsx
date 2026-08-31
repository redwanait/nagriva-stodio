import { useCallback, useEffect, useRef, useState } from "react";
import type { FeedbackWithStats } from "../types/feedback";
import { fetchPublishedFeedbacks } from "../lib/feedbackService";
import FeedbackCard from "./FeedbackCard";

type FeedbackSectionProps = {
  initialFeedbacks?: FeedbackWithStats[];
};

function FeedbackSection({ initialFeedbacks }: FeedbackSectionProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithStats[]>(initialFeedbacks ?? []);
  const [loading, setLoading] = useState(!initialFeedbacks);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const didScrollToHash = useRef(false);

  const loadFeedbacks = useCallback(async () => {
    try {
      const data = await fetchPublishedFeedbacks();
      setFeedbacks(data);
      setError(null);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load feedback.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    setError(null);
    try {
      const data = await fetchPublishedFeedbacks();
      setFeedbacks(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load feedback.");
    } finally {
      setRetrying(false);
    }
  }, []);

  useEffect(() => {
    if (loading || didScrollToHash.current) return;
    const hash = window.location.hash;
    const targetId = hash.startsWith("#feedback-") ? hash.slice(1) : null;
    if (targetId && document.getElementById(targetId)) {
      didScrollToHash.current = true;
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loading, feedbacks]);

  const handleLikeChange = useCallback((feedbackId: string, count: number) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === feedbackId ? { ...f, likeCount: count } : f)),
    );
  }, []);

  const renderGroup = (clone: boolean) =>
    feedbacks.map((feedback) => (
      <FeedbackCard
        key={`${clone ? "clone-" : ""}${feedback.id}`}
        feedback={feedback}
        onLikeChange={handleLikeChange}
        isClone={clone}
      />
    ));

  return (
    <section
      className="feedback-section"
      id="feedback"
      aria-labelledby="feedback-title"
    >
      <div className="feedback-section__header">
        <p className="eyebrow feedback-section__eyebrow">FEEDBACK</p>
        <h2 id="feedback-title">
          What clients say about <span>building with Nagriva.</span>
        </h2>
        <p className="feedback-section__intro">
          Real words from real people we have worked with. Every kind word is
          reviewed and published by us.
        </p>
      </div>

      {loading ? (
        <div className="feedback-loading" role="status">
          <span className="feedback-skeleton" />
          <span className="feedback-skeleton" />
          <span className="feedback-skeleton" />
        </div>
      ) : error ? (
        <div className="feedback-error" role="alert">
          <p>{error}</p>
          <button
            className="feedback-button feedback-button--secondary"
            onClick={handleRetry}
            type="button"
            disabled={retrying}
          >
            {retrying ? "Trying…" : "Try again"}
          </button>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="feedback-empty">
          <span className="feedback-empty__mark" aria-hidden="true">“</span>
          <p>No feedback yet. Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="feedback-marquee">
          <div className="feedback-marquee__track">
            <ul className="feedback-marquee__group" aria-hidden="true">
              {renderGroup(false)}
            </ul>
            <ul className="feedback-marquee__group feedback-marquee__group--clone" aria-hidden="true">
              {renderGroup(true)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default FeedbackSection;
