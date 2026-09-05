import { supabase } from "./supabase";

export interface StartInquirySubmitPayload {
  fullName: string;
  email: string;
  company: string;
  need: string;
  projectDescription: string;
  budget: string;
  preferredContact: string;
  phone: string;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Project inquiries are unavailable right now.");
  }
  return supabase;
}

/**
 * Insert a new project inquiry from the "Start" page with status "pending".
 * The client can never set status to anything other than "pending".
 * Email delivery (Resend) and Turnstile verification continue to run through
 * the /api/inquiry endpoint after this row is persisted.
 */
export async function submitStartInquiry(payload: StartInquirySubmitPayload): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("inquiries")
    .insert({
      full_name: payload.fullName,
      email: payload.email,
      company: payload.company || null,
      need: payload.need,
      project_description: payload.projectDescription,
      budget: payload.budget || null,
      preferred_contact: payload.preferredContact,
      phone: payload.phone || null,
      status: "pending",
    });

  if (error) {
    console.error("Failed to submit start inquiry:", error);
    throw new Error("Unable to submit your inquiry. Please try again.");
  }
}