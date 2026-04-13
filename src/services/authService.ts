import { supabase } from "../lib/supabaseClient";
import type {
  SignUpCredentials,
  SignInCredentials,
  AuthResponse,
  SignOutResponse,
  User,
  Session,
} from "../types/auth";

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

export const sendPasswordResetEmail = async (
  email: string
): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:5173/reset-password",
  });

  return { error: error ? error.message : null };
};

export const updatePassword = async (
  newPassword: string
): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { error: error ? error.message : null };
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  email: string
): Promise<{ error: string | null }> => {
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Current password is incorrect." };
  }

  const { error } = await supabase.auth.updateUser({
    current_password: currentPassword,
    password: newPassword,
  });

  return { error: error ? error.message : null };
};

export const authService = {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  getSession,
  onAuthStateChange,
  sendPasswordResetEmail,
  updatePassword,
  changePassword
};
