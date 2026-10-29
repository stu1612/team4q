// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // The showpiece's own Vercel URL, never the club's real domain. Drives absolute
  // canonical/OG/JSON-LD URLs (src/components/SEO), so nothing here claims to be the real site.
  site: 'https://sundet-basket.vercel.app',

  env: {
    schema: {
      // Hygraph endpoint + permanent-auth token. Server-only secrets: read via
      // `astro:env/server` in src/lib/hygraphClient.ts, kept out of the client bundle.
      HYGRAPH_API_URL: envField.string({ context: 'server', access: 'secret' }),
      HYGRAPH_TOKEN: envField.string({ context: 'server', access: 'secret' }),
      // "demo" serves every model from local data (fallback.ts / demo.ts) with no Hygraph
      // request: the showpiece runs on a fictional club. "hygraph" restores live content.
      CONTENT_SOURCE: envField.enum({
        values: ['demo', 'hygraph'],
        context: 'server',
        access: 'public',
        default: 'demo'
      })
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

  // On-demand rendering. `output` stays the default 'static'; pages that opt out via
  // `export const prerender = false` become serverless functions.
  // ISR caches them for an hour after each render, so time-dependent content (upcoming
  // fixtures, 28-day result expiry) stays correct without a Hygraph publish.
  adapter: vercel({
    isr: {
      expiration: 60 * 60
    }
  })
});