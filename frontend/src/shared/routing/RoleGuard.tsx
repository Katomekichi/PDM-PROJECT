// import type { ReactNode } from 'react';
// import { useAppSelector } from '@/app/hooks';
// import { selectCurrentRoles } from '@/features/auth/authSlice';
// import type { UserRole } from '@/features/auth/types/auth';

// /**
//  * Conditionally renders children only if the logged-in user has one of the required roles.
//  * Used inline: <RoleGuard roles={['PD_ADMIN']}><Button>Terminate</Button></RoleGuard>
//  * Mirrors the transcript's intent: only certain roles can terminate, credential, etc.
//  */
// export function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
//   const userRoles = useAppSelector(selectCurrentRoles);
//   const hasRole = roles.some((r) => userRoles.includes(r));
//   return hasRole ? <>{children}</> : null;
// }
import type { ReactNode } from "react";

export function RoleGuard({
  children,
}: {
  roles: unknown[];
  children: ReactNode;
}) {
  return <>{children}</>;
}