import type { Application, Enquiry, ContentDraft, Session } from '~lib/schema';

export type { Application, Enquiry, ContentDraft, Session };

export interface CmsAdapter {
  listApplications(): Application[] | Promise<Application[]>;
  saveApplication(app: Application): Application | Promise<Application>;
  setApplications(apps: Application[]): void | Promise<void>;
  listEnquiries(): Enquiry[] | Promise<Enquiry[]>;
  saveEnquiry(enq: Enquiry): Enquiry | Promise<Enquiry>;
  setEnquiries(enqs: Enquiry[]): void | Promise<void>;
  getContentDraft(): (ContentDraft | null) | Promise<ContentDraft | null>;
  setContentDraft(draft: ContentDraft): void | Promise<void>;
  getSession(): (Session | null) | Promise<Session | null>;
  setSession(session: Session): void | Promise<void>;
  clearSession(): void | Promise<void>;
}

/** localStorage keys preserved byte-compatible with the legacy reference build,
 *  so a partial migration leaves no orphan applications. */
export const STORAGE_KEYS = {
  applications: 'mmbgims_applications',
  enquiries: 'mmbgims_enquiries',
  session: 'mmbgims_session',
  contentDraft: 'mmbgims_content_home',
} as const;
