export type Feedback = {
  id: number;
  rating: number;
  comment: string;
  created_at?: string;
  event_id: number;
  volunteer_id: number;
};

export type NewFeedback = {
  rating: number;
  comment: string;
  event_id: number;
  volunteer_id: number;
};

export type FeedbackWithEvent = Feedback & {
  Events: {
    id: number;
    title: string;
  } | null;
};

export type FeedbackWithEventAndProfile = Feedback & {
  Events: {
    id: number;
    title: string;
  } | null;
  profile: {
    id: number;
    first_name: string;
    second_name: string;
    email?: string;
    avatar: string | null;
    role?: string;
  } | null;
};