import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        Checking permissions...
      </div>
    );
  }

  if (!user) {
    // not logged in -> go to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (profile?.role !== "admin") {
    // logged in but not admin
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <h2 className="text-2xl font-semibold">Access denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
