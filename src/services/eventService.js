import { supabase } from "../supabaseClient";

export const createEvent = async (eventData) => {
  const { data, error } = await supabase
    .from("Events")
    .insert([eventData])
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const getAllEvents = async () => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data;
};


export const getEventById = async (id) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getEventsByOrganizer = async (organizerId) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateEvent = async (id, updatedData) => {
  const { data, error } = await supabase
    .from("Events")
    .update(updatedData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id) => {
  const { error } = await supabase
    .from("Events")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const updateEventStatus = async (id, status) => {
  const { data, error } = await supabase
    .from("Events")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};