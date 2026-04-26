/**
 * HTTP-backed CMS adapter. Delegates writes to the /api/* routes; falls back
 * to localStorage for reads (the public site never reads applications cross-
 * device — admin reads stay localStorage-backed in this iteration).
 *
 * Activated when `import.meta.env.PUBLIC_USE_SERVER_API === 'true'`.
 */

import type { CmsAdapter, Application, Enquiry, ContentDraft, Session } from './types';
import { localStorageAdapter } from './local-storage';

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return (await res.json()) as T;
}

export const httpAdapter: CmsAdapter = {
  listApplications: () => localStorageAdapter.listApplications(),
  saveApplication(app: Application) {
    void post<Application>('/api/applications', app).catch((err) =>
      console.error('saveApplication HTTP failed; falling back to local-only', err),
    );
    return localStorageAdapter.saveApplication(app);
  },
  setApplications: (apps) => localStorageAdapter.setApplications(apps),
  listEnquiries: () => localStorageAdapter.listEnquiries(),
  saveEnquiry(enq: Enquiry) {
    void post<Enquiry>('/api/enquiries', enq).catch((err) =>
      console.error('saveEnquiry HTTP failed; falling back to local-only', err),
    );
    return localStorageAdapter.saveEnquiry(enq);
  },
  setEnquiries: (enqs) => localStorageAdapter.setEnquiries(enqs),
  getContentDraft: () => localStorageAdapter.getContentDraft(),
  setContentDraft: (d: ContentDraft) => localStorageAdapter.setContentDraft(d),
  getSession: () => localStorageAdapter.getSession(),
  setSession: (s: Session) => localStorageAdapter.setSession(s),
  clearSession: () => localStorageAdapter.clearSession(),
};
