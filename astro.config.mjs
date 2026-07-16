import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel/serverless';

const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_ENV;

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://mmbgims.com',
  output: 'hybrid',
  adapter: isVercel
    ? vercel({ webAnalytics: { enabled: false }, imageService: false })
    : node({ mode: 'middleware' }),
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
