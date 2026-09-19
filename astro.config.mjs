// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production domain. Drives absolute canonical/OG URLs (src/components/SEO) and is
  // required for @astrojs/sitemap to emit anything. Set before DNS is pointed (Phase 6).
  site: 'https://team4q.se',

  env: {
    schema: {
      // Hygraph endpoint + permanent-auth token. Server-only secrets: read via
      // `astro:env/server` in src/lib/hygraphClient.ts, kept out of the client bundle.
      HYGRAPH_API_URL: envField.string({ context: 'server', access: 'secret' }),
      HYGRAPH_TOKEN: envField.string({ context: 'server', access: 'secret' })
    },
    // Fail the build on a missing/blank secret rather than a runtime request.
    validateSecrets: true
  },

  image: {
    // Hygraph asset CDN — required for <Image> to optimise live remote assets.
    domains: ['eu-west-2.graphassets.com']
  },

  vite: {
    plugins: [tailwindcss()]
  },

  // On-demand rendering. `output` stays the default 'static'; only `/` and /kontakt opt out
  // via `export const prerender = false`, so they alone become serverless functions.
  // ISR caches the on-demand `/` for an hour after each render, so time-dependent content
  // (upcoming fixtures, 28-day result expiry) stays correct without a Hygraph publish.
  // The setting is adapter-wide, so the /kontakt form route is excluded — it must never be
  // cached.
  adapter: vercel({
    isr: {
      expiration: 60 * 60,
      exclude: ['/kontakt']
    }
  }),
  integrations: [sitemap()]
});