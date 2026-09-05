import { supabase } from "./supabase";

export type CallMethod = "whatsapp" | "google-meet" | "skype";

export interface CallBookingSubmitPayload {
  name: string;
  phone: string;
  callMethod: CallMethod | null;
}

function requireSupabase() {
  if (!supabase) {
    throw new Error("Call booking is unavailable right now.");
  }
  return supabase;
}

/**
 * Insert a new call booking with status "pending".
 * The client can never set status to anything other than "pending".
 */
export async function submitCallBooking(payload: CallBookingSubmitPayload): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from("call_bookings")
    .insert({
      name: payload.name,
      phone: payload.phone,
      call_method: payload.callMethod,
      status: "pending",
    });

  if (error) {
    console.error("Failed to submit call booking:", error);
    throw new Error("Unable to book your call. Please try again.");
  }
}