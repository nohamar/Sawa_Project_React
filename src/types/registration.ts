export type RegistrationStatus = "confirmed" | "waitlisted" | "cancelled";
export type AttendanceStatus = "pending" | "attended" | "absent";

export type Registration = {
  id: string;
  registration_status: RegistrationStatus;
  attendance_status: AttendanceStatus;
  registered_at?: string;
  event_id: string;
  volunteer_id: string;
  waitlist_position?: number | null;
};

export type NewRegistration = {
  registration_status: RegistrationStatus;
  attendance_status: AttendanceStatus;
  event_id: string;
  volunteer_id: string;
  waitlist_position?: number | null;
};