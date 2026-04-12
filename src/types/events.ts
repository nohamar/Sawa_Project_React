// types/events.ts
export type EventStatus = "upcoming" | "completed" | "closed";
export type EventTypes = "Workshop"| "Seminar"| "Volunteer" |"Social" | "Charity";
export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: EventStatus;
  
  type: EventTypes;
  image:string;
  created_at?: string;
}

export type CreateEvent = {
  organizer_id: number;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: EventStatus;
 
  type: EventTypes;
  image:string;
};
export type EventFormData = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  
  capacity: string;
  type: string;
  image: string;
};

export type UpdateEvent = Partial<CreateEvent>;