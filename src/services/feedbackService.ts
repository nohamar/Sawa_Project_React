import { supabase } from "../lib/supabaseClient";

import type { NewFeedback } from "../types/feedback";

export async function createFeedback (feedback:NewFeedback){
return await supabase.from("Event_feedback").insert([feedback])
}

export async function getFeedback (event_id:string){
    return await supabase.from("Event_feedback").select("*").eq("event_id", event_id)

}

export async function getFeedbackUser(volunteer_id:string){
    return await supabase.from("Event_feedback").select("*").eq("volunteer_id", volunteer_id); 
}

export async function deleteFeedback (userId: string, eventId: string){
    return await supabase.from("Event_feedback").delete().eq("event_id", eventId).eq("volunteer_id", userId ); 
}

export const updateFeedback = async (feedback_id: string, comment:string, rating:number) => {
  return await supabase
    .from("Event_feedback")
    .update({ comment, rating })
    .eq("id", feedback_id)
    .select()
    .single();

};