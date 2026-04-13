import type { User, Session } from "@supabase/supabase-js";

export type { User, Session };

export type UserRole = "volunteer" | "organizer";

export type SignUpCredentials = {
  email: string;
  password: string;
  options: {
    data: {
      first_name: string;
      second_name: string;
      role: UserRole;
      age: string;
      bio?: string | null;
    };
  };
};

export type SignInCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User | null;
  session: Session | null;
  error: string | null;
};

export type SignOutResponse = {
  error: string | null;
};