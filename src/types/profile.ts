import type { UserRole } from "./auth";

export type Profile = {
  id: number;
  first_name: string;
  second_name: string;
  email: string;
  role: UserRole;
  bio: string | null;
  age: string | null;
  avatar: string | null;
  created_at: string;
  user_id: string;
};

export type CreateProfileInput = Omit<Profile, "id" | "created_at">;

export type UpdateProfileInput = Partial<
  Omit<Profile, "id" | "user_id" | "created_at">
>;

export type ProfileResponse = {
  profile: Profile | null;
  error: string | null;
};