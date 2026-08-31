import { useState } from "react";
import { submitFeedback } from "../lib/feedbackService";

type FeedbackFormProps = {
  onSubmitted: () => void | Promise<void>;
};

const NAME_MAX = 80;
const ROLE_MAX = 80;
const COMPANY_MAX = 80;
const AVATAR_MAX = 500;
const CONTENT_MAX = 1000;

type Errors = Partial<Record<"author_name" | "content" | "author_avatar_url", string>>;

function FeedbackForm({ onSubmitted }: FeedbackFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setRole("");
    setCompany("");
    setAvatarUrl("");
    setContent("");
    setErrors({});
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!name.trim()) {
      next.author_name = "Please enter your name.";
    } else if (name.trim().length > NAME_MAX) {
      next.author_name = `Name must be ${NAME_MAX} characters or fewer.`;
    }
    if (!content.trim()) {
      next.content = "Please share some feedback.";
    } else if (content.trim().length > CONTENT_MAX) {
      next.content = `Feedback must be ${CONTENT_MAX} characters or fewer.`;
    }
    if (avatarUrl.trim() && avatarUrl.trim().length > AVATAR_MAX) {
      next.author_avatar_url = "Avatar URL is too long.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitFeedback({
        author_name: name.trim(),
        author_role: role.trim() || null,
        author_company: company.trim() || null,
        author_avatar_url: avatarUrl.trim() || null,
        content: content.trim(),
      });
      setSuccess(true);
      resetForm();
      onSubmitted();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Unable to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const el = document.getElementById("feedback-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(false);
    setSubmitError(null);
    setErrors({});
  };

  return (
    <div className="feedback-form-wrap">
      {!open ? (
        <button
          className="feedback-form__trigger"
          type="button"
          onClick={handleOpen}
        >
          Leave a feedback <span aria-hidden="true">→</span>
        </button>
      ) : (
        <form
          id="feedback-form"
          className="feedback-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="feedback-form__head">
            <h3>Share your feedback</h3>
            <button
              className="feedback-form__close"
              type="button"
              onClick={handleClose}
              aria-label="Close feedback form"
            >
              ×
            </button>
          </div>

          <p className="feedback-form__note">
            Your feedback will be submitted for review before it appears on this page.
          </p>

          <div className="feedback-form__grid">
            <div className="feedback-form__field">
              <label className="feedback-form__label" htmlFor="feedback-name">
                Name <span aria-hidden="true">*</span>
              </label>
              <input
                id="feedback-name"
                className="feedback-form__input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={NAME_MAX}
                placeholder="Your name"
                aria-invalid={Boolean(errors.author_name)}
                disabled={submitting}
              />
              {errors.author_name && (
                <p className="feedback-form__error" role="alert">{errors.author_name}</p>
              )}
            </div>

            <div className="feedback-form__field">
              <label className="feedback-form__label" htmlFor="feedback-role">
                Role <span className="feedback-form__optional">(optional)</span>
              </label>
              <input
                id="feedback-role"
                className="feedback-form__input"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                maxLength={ROLE_MAX}
                placeholder="e.g. Founder"
                disabled={submitting}
              />
            </div>

            <div className="feedback-form__field">
              <label className="feedback-form__label" htmlFor="feedback-company">
                Company <span className="feedback-form__optional">(optional)</span>
              </label>
              <input
                id="feedback-company"
                className="feedback-form__input"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={COMPANY_MAX}
                placeholder="e.g. Acme Studio"
                disabled={submitting}
              />
            </div>

            <div className="feedback-form__field">
              <label className="feedback-form__label" htmlFor="feedback-avatar">
                Photo URL <span className="feedback-form__optional">(optional)</span>
              </label>
              <input
                id="feedback-avatar"
                className="feedback-form__input"
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                maxLength={AVATAR_MAX}
                placeholder="https://…"
                aria-invalid={Boolean(errors.author_avatar_url)}
                disabled={submitting}
              />
              {errors.author_avatar_url && (
                <p className="feedback-form__error" role="alert">{errors.author_avatar_url}</p>
              )}
              <p className="feedback-form__help">
                A link to a photo of yourself. If omitted, your initials are shown.
              </p>
            </div>
          </div>

          <div className="feedback-form__field">
            <label className="feedback-form__label" htmlFor="feedback-content">
              Your feedback <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="feedback-content"
              className="feedback-form__input feedback-form__textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={CONTENT_MAX}
              placeholder="Tell us about working with Nagriva…"
              aria-invalid={Boolean(errors.content)}
              disabled={submitting}
            />
            <span className="feedback-form__counter">
              {content.length}/{CONTENT_MAX}
            </span>
            {errors.content && (
              <p className="feedback-form__error" role="alert">{errors.content}</p>
            )}
          </div>

          {submitError && (
            <p className="feedback-form__error feedback-form__error--global" role="alert">
              {submitError}
            </p>
          )}

          {success && (
            <p className="feedback-form__success" role="status">
              Thanks for your feedback. It has been submitted for review.
            </p>
          )}

          <div className="feedback-form__actions">
            <button
              className="feedback-button feedback-button--primary"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit feedback"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FeedbackForm;
