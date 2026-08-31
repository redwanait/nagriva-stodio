import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faCheck,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import type { FeedbackWithStats } from "../types/feedback";
import { addFeedbackLike, fetchLikeCount } from "../lib/feedbackService";
import Avatar from "./Avatar";
import CommentsPanel from "./CommentsPanel";
import { formatFeedbackDate, getFeedbackHash } from "../lib/feedbackUtils";

type FeedbackCardProps = {
  feedback: FeedbackWithStats;
  onLikeChange: (feedbackId: string, count: number) => void;
  isClone?: boolean;
};

function FeedbackCard({ feedback, onLikeChange, isClone = false }: FeedbackCardProps) {
  const [likeLoading, setLikeLoading] = useState(false);
  const [likeError, setLikeError] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const likeInFlight = useRef(false);

  const likeCount = feedback.likeCount;
  const commentCount = feedback.commentCount;

  const handleLike = async () => {
    if (likeInFlight.current) return;
    likeInFlight.current = true;
    setLikeLoading(true);
    setLikeError(false);
    try {
      await addFeedbackLike(feedback.id);
      // Always reconcile with the real database count.
      const realCount = await fetchLikeCount(feedback.id);
      onLikeChange(feedback.id, realCount);
    } catch {
      setLikeError(true);
    } finally {
      likeInFlight.current = false;
      setLikeLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}${window.location.pathname}${getFeedbackHash(feedback.id)}`;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Feedback from ${feedback.author_name}`,
          text: feedback.content,
          url: shareUrl,
        });
        return;
      }
    } catch (err) {
      if (err && typeof err === "object" && "name" in err && err.name === "AbortError") {
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <li
      className="feedback-card"
      {...(isClone ? {} : { id: getFeedbackHash(feedback.id).slice(1) })}
    >
      <div className="feedback-card__top">
        <Avatar name={feedback.author_name} url={feedback.author_avatar_url} />
        <div className="feedback-card__identity">
          <h3>{feedback.author_name}</h3>
          <p className="feedback-card__meta">
            {feedback.author_role ? feedback.author_role : "Client"}
            {feedback.author_company ? ` · ${feedback.author_company}` : ""}
          </p>
        </div>
        <time
          className="feedback-card__date"
          dateTime={feedback.published_at ?? feedback.created_at}
        >
          {formatFeedbackDate(feedback.published_at ?? feedback.created_at)}
        </time>
      </div>

      <blockquote className="feedback-card__content">{feedback.content}</blockquote>

      <div className="feedback-card__actions">
        <button
          className="feedback-card__action feedback-card__action--like"
          type="button"
          onClick={handleLike}
          disabled={likeLoading}
          aria-label={`Like this feedback (${likeCount} likes)`}
        >
          <FontAwesomeIcon
            icon={faHeart}
            aria-hidden="true"
            className={likeLoading ? "feedback-card__heart--loading" : ""}
          />
          <span>{likeCount}</span>
        </button>

        <button
          className="feedback-card__action"
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          aria-expanded={commentsOpen}
          aria-controls={commentsOpen ? `comments-${feedback.id}` : undefined}
          aria-label={`View comments (${commentCount})`}
        >
          <FontAwesomeIcon icon={faComment} aria-hidden="true" />
          <span>{commentCount}</span>
        </button>

        <button
          className="feedback-card__action"
          type="button"
          onClick={handleShare}
          aria-label="Share this feedback"
        >
          {shareState === "copied" ? (
            <>
              <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faLink} aria-hidden="true" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      <div className="feedback-card__error" hidden={!likeError} role="alert">
        Could not add your like. Please try again.
      </div>

      {commentsOpen && (
        <CommentsPanel
          feedbackId={feedback.id}
          onClose={() => setCommentsOpen(false)}
        />
      )}
    </li>
  );
}

export default FeedbackCard;
