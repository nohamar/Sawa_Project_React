import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { UserRole } from "../../types/auth";
import type { Profile } from "../../types/profile";

type RoleProtectedRouteProps = {
  user: Profile | null;
  allowedRole: UserRole;
  children: ReactNode;
};

export default function RoleProtectedRoute({
  user,
  allowedRole,
  children,
}: RoleProtectedRouteProps) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}