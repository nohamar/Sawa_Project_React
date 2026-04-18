import type { Event } from "./events";

export interface SavedEvent {
  id: number;
  volunteer_id: number;
  event_id: number;
  created_at?: string;
}

export type CreateSavedEvent = {
  volunteer_id: number;
  event_id: number;
};

export type SavedEventWithEvent = SavedEvent & {
  Events: Event | Event[] | null;
};