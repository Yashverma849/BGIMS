/**
 * HTTP-backed CMS adapter. Writes flow to the JSON API; reads are not
 * implemented on the public side (the admin dashboard hits /api/admin/*
 * directly). Throws on network failures so the caller can surface a real
 * error rather than silently dropping submissions.
 */

import type { CmsAdapter, Application, Enquiry } from './types';

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'same-origin',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} failed: ${res.status} ${text}`);
  }
  return (await res.json()) as T;
}

const notImplemented = (op: string) => () => {
  throw new Error(
    `cms.${op}() is not available on the public client. Use /api/admin/* from the dashboard.`,
  );
};

export const httpAdapter: CmsAdapter = {
  listApplications: notImplemented('listApplications') as never,
  async saveApplication(app: Application) {
    return postJSON<Application>('/api/applications', app);
  },
  setApplications: notImplemented('setApplications') as never,

  listEnquiries: notImplemented('listEnquiries') as never,
  async saveEnquiry(enq: Enquiry) {
    return postJSON<Enquiry>('/api/enquiries', enq);
  },
  setEnquiries: notImplemented('setEnquiries') as never,

  getContentDraft: () => null,
  setContentDraft: notImplemented('setContentDraft') as never,
  getSession: () => null,
  setSession: notImplemented('setSession') as never,
  clearSession: () => undefined,
};
