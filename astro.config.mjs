// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
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
  }
});