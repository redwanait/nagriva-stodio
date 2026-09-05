import { supabase } from "./supabase";
import type { Feedback, FeedbackSubmitPayload } from "../types/feedback";

function requireSupabase() {
  if (!supabase) {
    throw new Error("Feedback is unavailable right now.");
  }
  return supabase;
}

const FEEDBACK_COLUMNS = "id, author_name, author_role, author_company, author_avatar_url, content, status, created_at, published_at";

/**
 * Fetch all published feedback ordered by published date.
 */
export async function fetchPublishedFeedbacks(): Promise<Feedback[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("feedbacks")
    .select(FEEDBACK_COLUMNS)
    .eq("status", "published");
  // Note: we intentionally do NOT filter/order by published_at. published_at
  // is nullable, and the moderation workflow allows publishing a feedback by
  // only setting status = 'published' (leaving published_at NULL). Filtering
  // against NULL triggers the cast error 22007 on the timestamptz column.

  if (error) {
    console.error("Failed to load feedbacks:", error);
    throw new Error("Unable to load feedback right now.");
  }

  return (data ?? []) as Feedback[];
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