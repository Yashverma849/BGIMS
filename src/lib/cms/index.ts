/**
 * Public-side CMS adapter.
 *
 * Writes always go through the HTTP API (which writes to the DB) so
 * submissions are durable across devices. Reads on the public site are
 * never needed — the admin dashboard is the only consumer of list data
 * and it talks to /api/admin/* directly.
 *
 * The `localStorageAdapter` remains exported so legacy mocked-mode demos
 * (offline kiosks, no backend) can opt in via:
 *
 *   import { localStorageAdapter as cms } from '~lib/cms/local-storage';
 */

import type { CmsAdapter } from './types';
import { httpAdapter } from './http';

export const cms: CmsAdapter = httpAdapter;

export * from './types';
