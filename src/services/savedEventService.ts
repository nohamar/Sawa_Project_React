import { supabase } from "../lib/supabaseClient";

export const saveEvent = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from("Saved_event")
    .insert([
      {
        volunteer_id: userId,
        event_id: eventId,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const removeSavedEvent = async (userId: string, eventId: string) => {
  const { error } = await supabase
    .from("Saved_event")
    .delete()
    .eq("volunteer_id", userId)
    .eq("event_id", eventId);

  if (error) throw error;
  return true;
};

export const getSavedEvents = async (userId: string) => {
  const { data, error } = await supabase
    .from("Saved_event")
    .select(`
      id,
      event_id,
      Events (*)
    `)
    .eq("volunteer_id", userId);

  if (error) throw error;
  return data;
};

export const isEventSaved = async (userId: string, eventId: string) => {
  const { data, error } = await supabase
    .from("Saved_event")
    .select("id")
    .eq("volunteer_id", userId)
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};