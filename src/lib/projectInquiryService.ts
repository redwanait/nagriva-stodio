import { supabase } from "./supabase";

export interface ProjectInquirySubmitPayload {
  description: string;
  whatsapp: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Project requests are unavailable right now.");
  }
  return supabase;
}

/**
 * Insert a new project inquiry from the "Find your project" section with
 * status "pending". The client can never set status to anything else.
 */
export async function submitProjectInquiry(payload: ProjectInquirySubmitPayload): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("project_inquiries")
    .insert({
      description: payload.description,
      whatsapp: payload.whatsapp,
      status: "pending",
    });

  if (error) {
    console.error("Failed to submit project inquiry:", error);
    throw new Error("Unable to send your request. Please try again.");
  }
}