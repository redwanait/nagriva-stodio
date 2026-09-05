import type { Feedback } from "../types/feedback";
import Avatar from "./Avatar";
import { formatFeedbackDate, getFeedbackHash } from "../lib/feedbackUtils";

type FeedbackCardProps = {
  feedback: Feedback;
  isClone?: boolean;
};

function FeedbackCard({ feedback, isClone = false }: FeedbackCardProps) {
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
    </li>
  );
}

export default FeedbackCard;
