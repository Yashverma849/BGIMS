import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

/**
 * Static-only build.
 *
 * Auth + DB-backed routes live in `src/_disabled/` and are NOT served.
 * To re-enable them:
 *   1. `mv src/_disabled/api src/pages/api`
 *   2. `mv src/_disabled/middleware.ts src/middleware.ts`
 *   3. Switch `output` below to `'hybrid'` and add the adapter back:
 *
 *        import node from '@astrojs/node';
 *        import vercel from '@astrojs/vercel/serverless';
 *        const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;
 *        adapter: isVercel ? vercel({ webAnalytics: { enabled: false }, imageService: false })
 *                          : node({ mode: 'middleware' }),
 *
 *   4. Restore `export const prerender = false` on:
 *        src/pages/index.astro · src/pages/admin/dashboard.astro · src/pages/admin/login.astro
 *   5. Restore the API + auth calls in:
 *        src/scripts/enquiry-form.ts · src/scripts/apply/payment.ts
 *        src/scripts/admin/login.ts · src/scripts/admin/dashboard.ts
 *
 * `src/_disabled/` lives inside `src/` so the auth + DB modules still
 * typecheck without surprises.
 */
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://mmbgims.com',
  output: 'static',
  trailingSlash: 'ignore',
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => typeof page === 'string' && !page.includes('/admin/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
