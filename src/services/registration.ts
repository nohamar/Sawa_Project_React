import { supabase } from "../lib/supabaseClient";

import type { NewRegistration } from "../types/registration";

export async function createRegistration (registration:NewRegistration){
return await supabase.from("Registration").insert([registration])
}

export async function getRegistration_Event (event_id:string){
    return await supabase.from("Registration").select("*").eq("event_id", event_id)

}

export async function getRegistration_User(volunteer_id:string){
    return await supabase.from("Registration").select("*").eq("volunteer_id", volunteer_id)
}

export async function deleteRegistration (registration_id:string){
    return await supabase.from("Registration").delete().eq("id", registration_id)
}
export async function getAllRegistrations() {
  return await supabase
    .from("Registration")
    .select("*");
}