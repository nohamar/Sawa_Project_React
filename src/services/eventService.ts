import { supabase } from "../lib/supabaseClient";

// CREATE
export const createEvent = async (eventData: any) => {
  const { data, error } = await supabase
    .from("Events")
    .insert([eventData])
    .select()
    .single();

  return { data, error };
};

// GET ALL
export const getAllEvents = async () => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .order("event_date", { ascending: true });

  return { data, error };
};

// GET BY ID
export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

// GET BY ORGANIZER
export const getEventsByOrganizer = async (organizerId: string) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("event_date", { ascending: false });

  return { data, error };
};

// UPDATE
export const updateEvent = async (id: string, updatedData: any) => {
  const { data, error } = await supabase
    .from("Events")
    .update(updatedData)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

// DELETE
export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("Events")
    .delete()
    .eq("id", id);

  return { error };
};

// UPDATE STATUS
export const updateEventStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("Events")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};