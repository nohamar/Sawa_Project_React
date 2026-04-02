import { supabase } from "../lib/supabaseClient";

export const createEvent = async (eventData: any) => {
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

export const getEventById = async (id: string) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getEventsByOrganizer = async (organizerId: string) => {
  const { data, error } = await supabase
    .from("Events")
    .select("*")
    .eq("organizer_id", organizerId)
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateEvent = async (id: string, updatedData: any) => {
  const { data, error } = await supabase
    .from("Events")
    .update(updatedData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from("Events")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const updateEventStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("Events")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};