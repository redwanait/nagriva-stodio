import { useCallback, useEffect, useState } from "react";
import type { FeedbackComment } from "../types/feedback";
import {
  fetchPublishedComments,
  submitComment,
} from "../lib/feedbackService";
import Avatar from "./Avatar";
import { formatFeedbackDate } from "../lib/feedbackUtils";

const NAME_MAX = 80;
const COMMENT_MAX = 500;

type CommentsPanelProps = {
  feedbackId: string;
  onClose: () => void;
};

function CommentsPanel({ feedbackId, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [invalidName, setInvalidName] = useState(false);
  const [invalidContent, setInvalidContent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchPublishedComments(feedbackId);
      setComments(data);
      setError(null);
      setLoading(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load comments.");
      setLoading(false);
    }
  }, [feedbackId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const nameNext = !name.trim();
    const contentNext = !content.trim() || content.trim().length > COMMENT_MAX;
    setInvalidName(nameNext);
    setInvalidContent(contentNext);
    if (nameNext || contentNext) return;

    setSubmitting(true);
    try {
      await submitComment({
        feedback_id: feedbackId,
        author_name: name.trim(),
        content: content.trim(),
      });
      setSuccess(true);
      setName("");
      setContent("");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Unable to submit your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comments-panel" id={`comments-${feedbackId}`}>
      <div className="comments-panel__head">
        <h4>Comments</h4>
        <button
          className="comments-panel__close"
          type="button"
          onClick={onClose}
          aria-label="Close comments"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="comments-panel__loading" role="status">
          <span className="comments-skeleton" />
          <span className="comments-skeleton" />
        </div>
      ) : error ? (
        <p className="comments-panel__error" role="alert">{error}</p>
      ) : comments.length === 0 ? (
        <p className="comments-panel__empty">No comments yet.</p>
      ) : (
        <ul className="comments-list">
          {comments.map((comment) => (
            <li className="comments-item" key={comment.id}>
              <Avatar name={comment.author_name} url={null} size="small" />
              <div className="comments-item__body">
                <div className="comments-item__meta">
                  <strong>{comment.author_name}</strong>
                  <time dateTime={comment.created_at}>
                    {formatFeedbackDate(comment.created_at)}
                  </time>
                </div>
                <p className="comments-item__content">{comment.content}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form className="comments-form" onSubmit={handleSubmit} noValidate>
        <div className="comments-form__field">
          <label className="comments-form__label" htmlFor={`comment-name-${feedbackId}`}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={`comment-name-${feedbackId}`}
            className="comments-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={NAME_MAX}
            placeholder="Your name"
            disabled={submitting}
            aria-invalid={invalidName}
          />
          {invalidName && (
            <p className="comments-form__error" role="alert">Please enter your name.</p>
          )}
        </div>

        <div className="comments-form__field">
          <label className="comments-form__label" htmlFor={`comment-content-${feedbackId}`}>
            Comment <span aria-hidden="true">*</span>
          </label>
          <textarea
            id={`comment-content-${feedbackId}`}
            className="comments-form__input comments-form__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={COMMENT_MAX}
            placeholder="Write a comment…"
            disabled={submitting}
            aria-invalid={invalidContent}
          />
          <span className="comments-form__counter">{content.length}/{COMMENT_MAX}</span>
          {invalidContent && (
            <p className="comments-form__error" role="alert">
              Please enter a comment of {COMMENT_MAX} characters or fewer.
            </p>
          )}
        </div>

        {submitError && (
          <p className="comments-form__error comments-form__error--global" role="alert">{submitError}</p>
        )}
        {success && (
          <p className="comments-form__success" role="status">
            Your comment has been submitted for review.
          </p>
        )}

        <div className="comments-form__actions">
          <button
            className="feedback-button feedback-button--primary"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentsPanel;
