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
  /** Portfolio Project ID the visitor entered. Optional. */
  projectReference?: string;
  /** Title of the matched portfolio project. Only set on a match. */
  projectTitle?: string;
  /** Website URL of the matched portfolio project. Only set on a match. */
  projectUrl?: string;
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
  // The project columns are only written when an ID was entered. A request
  // without one sends exactly the same row as before.
  const projectColumns = payload.projectReference
    ? {
        project_reference: payload.projectReference,
        project_title: payload.projectTitle ?? null,
        project_url: payload.projectUrl ?? null,
      }
    : {};
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
      ...projectColumns,
    });

  if (error) {
    console.error("Failed to submit start inquiry:", error);
    throw new Error("Unable to submit your inquiry. Please try again.");
  }
}