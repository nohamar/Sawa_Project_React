export type Feedback ={

id : number; 
rating :number; 
comment : string; 
created_at?:string ;
event_id: string ; 
volunteer_id: string 
}

export type NewFeedback ={
rating :number; 
comment : string; 
event_id: string ; 
volunteer_id: string 
}