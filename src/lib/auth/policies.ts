/** RBAC helpers shared by middleware and API routes. */

import type { SessionPayload } from './session';

export function isAdmin(session: SessionPayload | null): boolean {
  return !!session && (session.role === 'Director' || session.role === 'Staff');
}

export function isDirector(session: SessionPayload | null): boolean {
  return session?.role === 'Director';
}
