export interface SavedEvent {
  id: number;
  volunteer_id: string;
  event_id: number;
  created_at?: string;
}

// Insert
export type CreateSavedEvent = {
  volunteer_id: string;
  event_id: number;
};