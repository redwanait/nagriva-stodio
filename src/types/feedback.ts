export type FeedbackStatus = "pending" | "published" | "rejected";

export interface Feedback {
  id: string;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  content: string;
  status: FeedbackStatus;
  created_at: string;
  published_at: string | null;
}

export type FeedbackCommentStatus = "pending" | "published" | "rejected";

export interface FeedbackComment {
  id: string;
  feedback_id: string;
  author_name: string;
  content: string;
  status: FeedbackCommentStatus;
  created_at: string;
  published_at: string | null;
}

export interface FeedbackLike {
  id: string;
  feedback_id: string;
  created_at: string;
}

export interface FeedbackWithStats extends Feedback {
  likeCount: number;
  commentCount: number;
}

export interface FeedbackSubmitPayload {
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  content: string;
}

export interface CommentSubmitPayload {
  feedback_id: string;
  author_name: string;
  content: string;
}
