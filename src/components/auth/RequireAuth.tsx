import React from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isPresentationFlag, readPresentationSession } from '../../lib/presentation';

interface RequireAuthProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const presentationActive =
    isPresentationFlag(searchParams.get('present')) || !!readPresentationSession();

  // During presentation/recording, allow protected routes even before auto-login finishes
  if (!isAuthenticated && !presentationActive) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin && !presentationActive) {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin-only: in presentation mode still allow viewing for demo (non-destructive UI)
  if (adminOnly && !isAdmin && presentationActive) {
    return <>{children}</>;
  }

  return <>{children}</>;
};
