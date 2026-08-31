import { supabase } from "./supabase";
import type {
  Feedback,
  FeedbackComment,
  FeedbackSubmitPayload,
  FeedbackWithStats,
  CommentSubmitPayload,
} from "../types/feedback";

function requireSupabase() {
  if (!supabase) {
    throw new Error("Feedback is unavailable right now.");
  }
  return supabase;
}

const FEEDBACK_COLUMNS = "id, author_name, author_role, author_company, author_avatar_url, content, status, created_at, published_at";

function toFeedback(row: Feedback): Feedback {
  return {
    id: row.id,
    author_name: row.author_name,
    author_role: row.author_role,
    author_company: row.author_company,
    author_avatar_url: row.author_avatar_url,
    content: row.content,
    status: row.status,
    created_at: row.created_at,
    published_at: row.published_at,
  };
}

function toComment(row: FeedbackComment): FeedbackComment {
  return {
    id: row.id,
    feedback_id: row.feedback_id,
    author_name: row.author_name,
    content: row.content,
    status: row.status,
    created_at: row.created_at,
    published_at: row.published_at,
  };
}

/**
 * Fetch counts of published comments grouped by feedback id. This avoids
 * fetching every comment body and avoids an N+1 set of requests.
 */
async function fetchPublishedCommentCounts(): Promise<Map<string, number>> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("feedback_comments")
    .select("feedback_id")
    .eq("status", "published");

  const counts = new Map<string, number>();
  if (error) {
    throw error;
  }

  for (const row of data ?? []) {
    const id = (row as { feedback_id: string }).feedback_id;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return counts;
}

/**
 * Fetch all published feedback ordered by published date, along with the
 * real like count and published comment count for each item.
 */
export async function fetchPublishedFeedbacks(): Promise<FeedbackWithStats[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("feedbacks")
    .select(`${FEEDBACK_COLUMNS}, likes:feedback_likes(count)`)
    .eq("status", "published");
  // Note: we intentionally do NOT filter/order by published_at. published_at
  // is nullable, and the moderation workflow allows publishing a feedback by
  // only setting status = 'published' (leaving published_at NULL). Filtering
  // against NULL triggers the cast error 22007 on the timestamptz column.

  if (error) {
    console.error("Failed to load feedbacks:", error);
    throw new Error("Unable to load feedback right now.");
  }

  let commentCounts = new Map<string, number>();
  try {
    commentCounts = await fetchPublishedCommentCounts();
  } catch (commentError) {
    // Comment counts are secondary; surface the feedbacks anyway.
    console.error("Failed to load comment counts:", commentError);
  }

  const feedbacks: FeedbackWithStats[] = (data ?? []).map((row) => {
    const feedback = toFeedback(row as Feedback);

    const rows = row as { likes?: { count: number }[] | null };
    const likesArr = Array.isArray(rows.likes) ? rows.likes : [];

    return {
      ...feedback,
      likeCount: Number(likesArr[0]?.count ?? 0),
      commentCount: commentCounts.get(feedback.id) ?? 0,
    };
  });

  return feedbacks;
}

/**
 * Insert a new feedback with status "pending".
 * The client can never set status to anything other than "pending".
 */
export async function submitFeedback(payload: FeedbackSubmitPayload): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("feedbacks")
    .insert({
      author_name: payload.author_name,
      author_role: payload.author_role || null,
      author_company: payload.author_company || null,
      author_avatar_url: payload.author_avatar_url || null,
      content: payload.content,
      status: "pending",
    });

  if (error) {
    console.error("Failed to submit feedback:", error);
    throw new Error("Unable to submit feedback. Please try again.");
  }
}

/**
 * Insert a like row for a feedback.
 * Every click creates a real row; the displayed count reflects the true
 * number of rows in feedback_likes.
 */
export async function addFeedbackLike(feedbackId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("feedback_likes")
    .insert({ feedback_id: feedbackId });

  if (error) {
    console.error("Failed to add like:", error);
    throw new Error("Unable to add your like. Please try again.");
  }
}

/** Fetch the real like count for a single feedback. */
export async function fetchLikeCount(feedbackId: string): Promise<number> {
  const client = requireSupabase();
  const { count, error } = await client
    .from("feedback_likes")
    .select("id", { count: "exact", head: true })
    .eq("feedback_id", feedbackId);

  if (error) {
    console.error("Failed to load like count:", error);
    throw new Error("Unable to load like count.");
  }

  return count ?? 0;
}

/**
 * Fetch all published comments for a single feedback.
 */
export async function fetchPublishedComments(feedbackId: string): Promise<FeedbackComment[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("feedback_comments")
    .select("*")
    .eq("feedback_id", feedbackId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load comments:", error);
    throw new Error("Unable to load comments right now.");
  }

  return (data ?? []).map((row) => toComment(row as FeedbackComment));
}

/**
 * Insert a new comment with status "pending".
 * The client can never publish a comment directly.
 */
export async function submitComment(payload: CommentSubmitPayload): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("feedback_comments")
    .insert({
      feedback_id: payload.feedback_id,
      author_name: payload.author_name,
      content: payload.content,
      status: "pending",
    });

  if (error) {
    console.error("Failed to submit comment:", error);
    throw new Error("Unable to submit your comment. Please try again.");
  }
}
