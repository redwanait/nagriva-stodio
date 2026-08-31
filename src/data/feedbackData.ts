import type { FeedbackWithStats } from "../types/feedback";

// Feedback content is stored and moderated in Supabase.
// Published feedback is the source of truth for the public Feedback section.
//
// This file exists only to optionally seed initial/static feedback data if the
// surrounding architecture ever needs fallback content. It is intentionally
// kept empty so the running site always reflects the live database.
export const seedFeedbacks: FeedbackWithStats[] = [];
