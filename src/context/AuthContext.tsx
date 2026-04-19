import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types/profile";
import type {
  SignInCredentials,
  SignUpCredentials,
  UserRole,
} from "../types/auth";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<{ error: string | null }>;
  signUp: (credentials: SignUpCredentials) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

const loadProfile = async (authUser: User | null) => {
  if (!authUser) {
    setProfile(null);
    return;
  }

  const result = await profileService.getProfileByUserId(authUser.id);

  if (result.error) {
    setProfile(null);
    return;
  }

  if (result.profile) {
    setProfile(result.profile);
    return;
  }

  const firstName =
    (authUser.user_metadata?.first_name as string | undefined) ?? "";
  const secondName =
    (authUser.user_metadata?.second_name as string | undefined) ?? "";
  const role =
    (authUser.user_metadata?.role as UserRole | undefined) ?? "volunteer";
  const age =
    (authUser.user_metadata?.age as string | undefined) ?? "";
  const bio =
    (authUser.user_metadata?.bio as string | undefined) ?? null;

  const createResult = await profileService.createProfile({
    user_id: authUser.id,
    first_name: firstName,
    second_name: secondName,
    email: authUser.email ?? "",
    role,
    bio,
    age,
    avatar: null,
  });

  if (createResult.error) {
    setProfile(null);
    return;
  }

  setProfile(createResult.profile);
};

  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user);
  };

  const signIn = async (
    credentials: SignInCredentials
  ): Promise<{ error: string | null }> => {
    const result = await authService.signIn(credentials);

    if (result.error || !result.user) {
      return { error: result.error };
    }

    setUser(result.user);
    await loadProfile(result.user);

    return { error: null };
  };

  const signUp = async (
    credentials: SignUpCredentials
  ): Promise<{ error: string | null }> => {
    const result = await authService.signUp(credentials);

    if (result.error) {
      return { error: result.error };
    }

    return { error: null };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      await loadProfile(currentUser);

      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (authUser) => {
      setUser(authUser);
      await loadProfile(authUser);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}