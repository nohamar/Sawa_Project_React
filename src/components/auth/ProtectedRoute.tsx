import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";


type ProtectedRouteProps = {
  user: User | null;
  children: ReactNode;
};

export default function ProtectedRoute({
  user,
  children,
}: ProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  return <>{children}</>;
}