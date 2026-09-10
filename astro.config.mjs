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

  // On-demand rendering. `output` stays the default 'static'; only /kontakt opts out via
  // `export const prerender = false`, so it alone becomes a serverless function.
  adapter: vercel(),
  integrations: [sitemap()]
});