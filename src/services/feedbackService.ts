import { supabase } from "../lib/supabaseClient";
import type { NewFeedback } from "../types/feedback";

export async function createFeedback(feedback: NewFeedback) {
  return await supabase.from("Event_feedback").insert([feedback]);
}

export async function getFeedback(event_id: number) {
  return await supabase
    .from("Event_feedback")
    .select(`
      *,
      Events (
        id,
        title
      ),
      profile:Profile!event_feedback_volunteer_id_fkey (
        id,
        first_name,
        second_name,
        email,
        avatar,
        role
      )
    `)
    .eq("event_id", event_id)
    .order("created_at", { ascending: false });
}

export async function getFeedbackUser(volunteer_id: number) {
  return await supabase
    .from("Event_feedback")
    .select(`
      *,
      Events (
        id,
        title
      ),
      profile:Profile!event_feedback_volunteer_id_fkey (
        id,
        first_name,
        second_name,
        email,
        avatar,
        role
      )
    `)
    .eq("volunteer_id", volunteer_id)
    .order("created_at", { ascending: false });
}

export async function deleteFeedbackById(feedback_id: number) {
  return await supabase
    .from("Event_feedback")
    .delete()
    .eq("id", feedback_id);
}

export async function updateFeedback(
  feedback_id: number,
  comment: string,
  rating: number
) {
  return await supabase
    .from("Event_feedback")
    .update({ comment, rating })
    .eq("id", feedback_id)
    .select()
    .single();
}