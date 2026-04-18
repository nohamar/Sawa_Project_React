import type { Event } from "./events";

export type RegistrationStatus = "confirmed" | "waitlisted" | "cancelled";
export type AttendanceStatus = "pending" | "attended" | "absent";

export type Registration = {
  id: number;
  registration_status: RegistrationStatus;
  attendance_status: AttendanceStatus;
  registered_at?: string;
  event_id: number;
  volunteer_id: number;
  waitlist_position?: number | null;
};

export type NewRegistration = {
  registration_status: RegistrationStatus;
  attendance_status: AttendanceStatus;
  event_id: number;
  volunteer_id: number;
  waitlist_position?: number | null;
};

export type RegistrationWithEvent = Registration & {
  Events: Event | Event[] | null;
};

export type RegistrationWithVolunteer = Registration & {
  profiles: {
    id: number;
    first_name: string;
    second_name: string;
    avatar: string | null;
  }[];
};