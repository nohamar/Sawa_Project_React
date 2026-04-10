import { supabase } from "../lib/supabaseClient";
import type {
  Profile,
  CreateProfileInput,
  UpdateProfileInput,
  ProfileResponse,
} from "../types/profile";

export const createProfile = async (
  input: CreateProfileInput
): Promise<ProfileResponse> => {
  const { data, error } = await supabase
    .from("Profile")
    .insert(input)
    .select()
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data as Profile, error: null };
};

export const getProfileByUserId = async (
  userId: string
): Promise<ProfileResponse> => {
  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: (data as Profile | null) ?? null, error: null };
};

export const getProfileById = async (
  profileId: number
): Promise<ProfileResponse> => {
  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data as Profile, error: null };
};

export const updateProfile = async (
  profileId: number,
  updates: UpdateProfileInput
): Promise<ProfileResponse> => {
  const { data, error } = await supabase
    .from("Profile")
    .update(updates)
    .eq("id", profileId)
    .select()
    .single();

  if (error) {
    return { profile: null, error: error.message };
  }

  return { profile: data as Profile, error: null };
};

export const getAllVolunteers = async (): Promise<{
  profiles: Profile[];
  error: string | null;
}> => {
  const { data, error } = await supabase
    .from("Profile")
    .select("*")
    .eq("role", "volunteer");

  if (error) {
    return { profiles: [], error: error.message };
  }

  return { profiles: data as Profile[], error: null };
};

export const profileService = {
  createProfile,
  getProfileByUserId,
  getProfileById,
  updateProfile,
  getAllVolunteers,
};