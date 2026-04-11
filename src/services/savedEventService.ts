import { supabase } from "../lib/supabaseClient";

export async function saveEvent(userId: string, eventId: string) {
  return await supabase
    .from("Saved_event")
    .insert([
      {
        volunteer_id: userId,
        event_id: eventId,
      },
    ])
    .select()
    .single();
}

export async function removeSavedEvent(userId: string, eventId: string) {
  return await supabase
    .from("Saved_event")
    .delete()
    .eq("volunteer_id", userId)
    .eq("event_id", eventId);
}

export async function getSavedEvents(userId: string) {
  return await supabase
    .from("Saved_event")
    .select(`
      id,
      event_id,
      Events (*)
    `)
    .eq("volunteer_id", userId);
}

export async function isEventSaved(userId: string, eventId: string) {
  return await supabase
    .from("Saved_event")
    .select("id")
    .eq("volunteer_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();
}

export async function getAllSavedEvents() {
  return await supabase
    .from("Saved_event")
    .select(`
      id,
      volunteer_id,
      event_id,
      Events (*)
    `);
}