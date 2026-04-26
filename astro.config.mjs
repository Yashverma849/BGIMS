import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';

// Swap `node` for `@astrojs/vercel`, `@astrojs/netlify`, or
// `@astrojs/cloudflare` when deploying to those platforms — no other
// changes needed.
export default defineConfig({
  site: 'https://mmbgims.com',
  output: 'hybrid',
  trailingSlash: 'ignore',
  // 'middleware' mode exports a request handler without auto-starting a
  // server. Our `server.mjs` wrapper composes the handler with global
  // security headers + cache-control for /_astro assets.
  adapter: node({ mode: 'middleware' }),
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
