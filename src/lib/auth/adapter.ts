import type { Session, LoginInput } from '~lib/schema';

export interface AuthAdapter {
  /** Returns a Session on success, or null on failure. */
  signIn(input: LoginInput): Session | null;
  current(): Session | null;
  signOut(): void;
}
