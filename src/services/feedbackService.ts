import { supabase } from "../lib/supabaseClient";

import type { NewFeedback } from "../types/feedback";

export async function createFeedback (feedback:NewFeedback){
return await supabase.from("Event_feedback").insert([feedback])
}

export async function getFeedback (event_id:string){
    return await supabase.from("Event_feedback").select("*").eq("event_id", event_id)

}

export async function deleteFeedback (feedback_id:string){
    return await supabase.from("Event_feedback").delete().eq("id", feedback_id)
}