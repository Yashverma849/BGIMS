import type { CmsAdapter, Application, Enquiry, ContentDraft, Session } from './types';
import { STORAGE_KEYS } from './types';

function readJSON<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const localStorageAdapter: CmsAdapter = {
  listApplications() {
    return readJSON<Application[]>(STORAGE_KEYS.applications, []);
  },
  saveApplication(app) {
    const apps = readJSON<Application[]>(STORAGE_KEYS.applications, []);
    apps.push(app);
    writeJSON(STORAGE_KEYS.applications, apps);
    return app;
  },
  setApplications(apps) {
    writeJSON(STORAGE_KEYS.applications, apps);
  },
  listEnquiries() {
    return readJSON<Enquiry[]>(STORAGE_KEYS.enquiries, []);
  },
  saveEnquiry(enq) {
    const list = readJSON<Enquiry[]>(STORAGE_KEYS.enquiries, []);
    list.unshift(enq);
    writeJSON(STORAGE_KEYS.enquiries, list);
    return enq;
  },
  setEnquiries(enqs) {
    writeJSON(STORAGE_KEYS.enquiries, enqs);
  },
  getContentDraft() {
    return readJSON<ContentDraft | null>(STORAGE_KEYS.contentDraft, null);
  },
  setContentDraft(draft) {
    writeJSON(STORAGE_KEYS.contentDraft, draft);
  },
  getSession() {
    return readJSON<Session | null>(STORAGE_KEYS.session, null);
  },
  setSession(session) {
    writeJSON(STORAGE_KEYS.session, session);
  },
  clearSession() {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.session);
  },
};
