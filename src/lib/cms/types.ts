import type { Application, Enquiry, ContentDraft, Session } from '~lib/schema';

export type { Application, Enquiry, ContentDraft, Session };

export interface CmsAdapter {
  listApplications(): Application[];
  saveApplication(app: Application): Application;
  setApplications(apps: Application[]): void;
  listEnquiries(): Enquiry[];
  saveEnquiry(enq: Enquiry): Enquiry;
  setEnquiries(enqs: Enquiry[]): void;
  getContentDraft(): ContentDraft | null;
  setContentDraft(draft: ContentDraft): void;
  getSession(): Session | null;
  setSession(session: Session): void;
  clearSession(): void;
}

/** localStorage keys preserved byte-compatible with the legacy reference build,
 *  so a partial migration leaves no orphan applications. */
export const STORAGE_KEYS = {
  applications: 'mmbgims_applications',
  enquiries: 'mmbgims_enquiries',
  session: 'mmbgims_session',
  contentDraft: 'mmbgims_content_home',
} as const;
