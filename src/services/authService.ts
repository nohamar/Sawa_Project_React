import { supabase } from "../lib/supabaseClient";
import type {
  SignUpCredentials,
  SignInCredentials,
  AuthResponse,
  SignOutResponse,
  User,
  Session,
} from "../types/auth";
import { profileService } from "./profileService";

export const signUp = async (
  credentials: SignUpCredentials
): Promise<AuthResponse> => {
  const { email, password, options } = credentials;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  if (data.user) {
    const { error: profileError } = await profileService.createProfile({
      user_id: data.user.id,
      first_name: options.data.first_name,
      second_name: options.data.second_name,
      email,
      role: options.data.role,
      bio: null,
      age: null,
      avatar: null,
    });

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      return { user: null, session: null, error: profileError };
    }
  }

  return {
    user: data.user,
    session: data.session,
    error: null,
  };
};

export const signIn = async (
  credentials: SignInCredentials
): Promise<AuthResponse> => {
  const { email, password } = credentials;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error: error.message };
  }

  return {
    user: data.user,
    session: data.session,
    error: null,
  };
};

export const signOut = async (): Promise<SignOutResponse> => {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const getSession = async (): Promise<Session | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};

export const onAuthStateChange = (
  callback: (user: User | null) => void
) => {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
};

export const authService = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  onAuthStateChange,
};