import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';

/**
 * Adapter is auto-selected based on the environment:
 *   - VERCEL=1   → @astrojs/vercel  (set by Vercel during build)
 *   - default    → @astrojs/node    (self-hosted Node via server.mjs)
 *
 * Add Netlify / Cloudflare here the same way if you switch hosts.
 */
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV;

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://mmbgims.com',
  output: 'hybrid',
  trailingSlash: 'ignore',
  adapter: isVercel
    ? vercel({
        webAnalytics: { enabled: false },
        maxDuration: 10,
        imageService: false,
      })
    : node({ mode: 'middleware' }),
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => typeof page === 'string' && !page.includes('/admin/') && !page.includes('/api/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
