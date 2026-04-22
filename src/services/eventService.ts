//eventService
import { supabase } from "../lib/supabaseClient";
import type { NewRegistration } from "../types/registration";
import { deleteImage } from "./storageService";

// CREATE
export const createEvent = async (eventData: any) => {
   console.log("creating event", eventData);
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
export const getEventById = async (id: number) => {
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

export const updateEventStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from("Events")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

// DELETE
export const deleteEvent = async (id: string, imageUrl: string) => {
  const { error } = await supabase
    .from("Events")
    .delete()
    .eq("id", Number(id));

  if (error) return { error };

  if (imageUrl) {
    await deleteImage(imageUrl);
  }

  return { error: null };
};

export async function createRegistration(registration: NewRegistration) {
  return await supabase.from("Registration").insert([registration]);
}