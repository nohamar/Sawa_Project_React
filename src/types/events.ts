export type EventStatus = "upcoming" | "completed" | "closed";

export interface Event {
  id: number;
  organizer_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status: EventStatus;
  duration: number;
  created_at?: string;
}

export type CreateEvent = {
  organizer_id: string;
  title: string;
  description?: string;
  location: string;
  event_date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  status?: EventStatus;
  duration?: number;
};

export type UpdateEvent = Partial<CreateEvent>;