import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';
import type { ReactNode } from 'react';

/**
 * Wraps any route that requires a valid session.
 * If the user is not authenticated, redirects to /login.
 * Used in App.tsx around every protected route.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuth = useAppSelector(selectIsAuthenticated);
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}
