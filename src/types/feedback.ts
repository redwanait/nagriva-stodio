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

export interface FeedbackSubmitPayload {
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  author_avatar_url: string | null;
  content: string;
}