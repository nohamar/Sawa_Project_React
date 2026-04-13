import { useEffect, useState } from "react";
import type { Feedback, NewFeedback } from "../types/feedback";
import { createFeedback, getFeedback, deleteFeedback,updateFeedback, getFeedbackUser
 } from "../services/feedbackService";

export function useFeedback(volunteerId: string, eventId: string){
const [feedback, setFeedback] = useState<Feedback[]>([]);
const [loading, setLoading] = useState(false); 
const [error, setError] = useState(""); 
const [successMessage, setSuccessMessage] = useState("");


async function CreateFeedback(feedback:NewFeedback){
    clearMessages(); 
    if (!volunteerId) {
      setError("User is not logged in.");
      return false;
    }
    const {error} = await createFeedback(feedback); 
    if(error){
         setError(error.message);
      return false;
    }
}

async function getFeedback_User(currentvolunteer_id:string){
    if (!currentvolunteer_id) {
      setFeedback([]); 
      return; 
    }
    clearMessages(); 
    setLoading(true); 
    setError(""); 

    const {data, error} = await getFeedbackUser(currentvolunteer_id); 
    if(error){
        setError(error.message); 
        setLoading(false); 
        return; 
    }
     
    setFeedback(data); 
    setLoading(false); 
}

useEffect(()=>{
    getFeedback_User(volunteerId);
}, [volunteerId])

async function getFeedback_Event(event_id:string, currentvolunteer_id:string ){
      if (!currentvolunteer_id) {
      setFeedback([]); 
      return; 
    }
    clearMessages();
    setLoading(true); 
    setError(""); 
    
    const {data, error} = await getFeedback(event_id); 
    if(error){
        setError(error.message); 
        setLoading(false); 
        return; 
    }

    setFeedback(data); 
}

useEffect(()=>{
    getFeedback_Event(eventId, volunteerId)
}, [eventId, volunteerId])

async function DeleteFeedback(event_id:string, volunteer_id:string){
    clearMessages();
    if (!volunteerId) {
      setError("User is not logged in.");
      return false;
    }

    const {error} = await deleteFeedback( volunteer_id, event_id); 

    if(error){
        setLoading(false); 
        setError(error.message); 
        return false; 
    }    
    setSuccessMessage("Feedback Deleted Successfully"); 
    return true; 
}

async function UpdateFeedback(id:string, comment:string, rating:number){
clearMessages();
 if (!volunteerId) {
      setError("User is not logged in.");
      return false;
    }

  const {error} = await updateFeedback(id, comment, rating); 
  if(error){
    setError(error.message || "Failed to update Feedback"); 
  }
 
  setSuccessMessage("Feedback updated Successfully."); 
  return true; 
}


  function clearMessages() {
    setError("");
    setSuccessMessage("");
  }

  return{
    feedback,
    error, 
    loading, 
    successMessage, 
    UpdateFeedback, 
    getFeedback_Event, 
    getFeedback_User, 
    DeleteFeedback, 
    CreateFeedback
  }
}