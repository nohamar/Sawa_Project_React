import { supabase } from "../lib/supabaseClient";
import type { NewRegistration, AttendanceStatus } from "../types/registration";

export async function createRegistration(registration: NewRegistration) {
  return await supabase.from("Registration").insert([registration]);
}

export async function getRegistration_Event(event_id: string) {
  return await supabase
    .from("Registration")
    .select(`
      id,
      registration_status,
      attendance_status,
      registered_at,
      event_id,
      volunteer_id,
      waitlist_position,
      profile:Profile!volunteer_id (
        id,
        first_name,
        second_name,
        avatar
      )
    `)
    .eq("event_id", event_id);
}

export async function getRegistration_User(volunteer_id: string) {
  return await supabase
    .from("Registration")
    .select(`
      id,
      registration_status,
      attendance_status,
      registered_at,
      event_id,
      volunteer_id,
      waitlist_position,
      Events (*)
    `)
    .eq("volunteer_id", volunteer_id);
}

export async function getAllRegistrations() {
  return await supabase.from("Registration").select("*");
}

export async function deleteRegistration(registration_id: string) {
  return await supabase
    .from("Registration")
    .delete()
    .eq("id", registration_id);
}

export async function updateAttendanceStatus(
  registrationId: number,
  attendance_status: AttendanceStatus
) {
  return await supabase
    .from("Registration")
    .update({ attendance_status })
    .eq("id", registrationId);
}