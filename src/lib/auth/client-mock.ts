import type { AuthAdapter } from './adapter';
import type { LoginInput, Session } from '~lib/schema';
import { localStorageAdapter } from '~lib/cms/local-storage';

const DEMO_EMAIL = (import.meta.env.PUBLIC_ADMIN_DEMO_EMAIL as string) || 'director@mmbgims.com';
const DEMO_PWD = (import.meta.env.PUBLIC_ADMIN_DEMO_PWD as string) || 'bgims2026';

export const clientMockAuth: AuthAdapter = {
  signIn({ email, password }: LoginInput): Session | null {
    const e = email.trim().toLowerCase();
    const ok =
      (e === DEMO_EMAIL && password === DEMO_PWD) ||
      (e.endsWith('@mmbgims.com') && password.length >= 6);
    if (!ok) return null;
    const session: Session = {
      email: e,
      signedInAt: new Date().toISOString(),
      role: e.startsWith('director') ? 'Director' : 'Staff',
    };
    localStorageAdapter.setSession(session);
    return session;
  },
  current() {
    return localStorageAdapter.getSession();
  },
  signOut() {
    localStorageAdapter.clearSession();
  },
};
