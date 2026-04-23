import { supabase } from "../lib/supabaseClient";

export async function saveSavedEvent(userId: number, eventId: number) {
  const { data: existing, error: existingError } = await supabase
    .from("Saved_event")
    .select("id")
    .eq("volunteer_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (existingError) {
    return { data: null, error: existingError };
  }

  if (existing) {
    return { data: existing, error: null };
  }

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

export async function removeSavedEvent(userId: number, eventId: number) {
  return await supabase
    .from("Saved_event")
    .delete()
    .eq("volunteer_id", userId)
    .eq("event_id", eventId);
}

export async function getSavedEvents(userId: number) {
  return await supabase
    .from("Saved_event")
    .select(`
      id,
      created_at,
      volunteer_id,
      event_id,
      Events (*)
    `)
    .eq("volunteer_id", userId);
}

export async function isEventSaved(userId: number, eventId: number) {
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
      created_at,
      volunteer_id,
      event_id,
      Events (*)
    `);
}