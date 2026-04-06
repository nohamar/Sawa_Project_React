// types/events.ts
export type EventStatus = "upcoming" | "completed" | "closed";
export type EventTypes = "Workshop"| "Seminar"| "Volunteer" |"Social" | "Charity";
export interface Event {
  id: number;
  organizer_id: number;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: EventStatus;
  duration?: number;
  type: EventTypes;
  created_at?: string;
}

export type CreateEvent = {
  organizer_id: number;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status?: EventStatus;
  duration?: number;
  type: EventTypes;
};

export type UpdateEvent = Partial<CreateEvent>;