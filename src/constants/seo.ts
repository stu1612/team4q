// Hand-written static SEO data for every non-dynamic page (see /seo skill). This is
// configuration, not content — the client never edits it, so it never goes near Hygraph.
// The one page NOT covered here is /nyheter/[slug], which derives its SEO from the
// article's own VM in Phase 4.
//
// Every entry supplies title, description, ogImage and jsonLd in full. The page passes
// its entry straight to <Base seo={...}>, which computes the canonical URL and merges
// global defaults before handing it to the SEO component.

import { CLUB_CONTACT } from "./contact";

/** Shape every page hands to <Base seo={...}>. `canonical` is derived by Base, not here. */
export interface SeoEntry {
  title: string;
  description: string;
  /** Absolute URL — social crawlers reject relative paths. */
  ogImage: string;
  /** schema.org JSON-LD for this page, or null when the page type needs none. */
  jsonLd: object | null;
}

type TeamKey = "mens" | "womens" | "juniors";

interface SeoStatic {
  home: SeoEntry;
  newsListing: SeoEntry;
  sponsors: SeoEntry;
  contact: SeoEntry;
  /** Keyed by TeamModel tag, NOT derived from any TeamModel field (TeamModel has no SEO data). */
  team: Record<TeamKey, SeoEntry>;
}

const ORG_NAME = "Team Fourth Quarter";

// Single source for the origin: mirrors `site` in astro.config.mjs (Astro injects it as
// import.meta.env.SITE). The fallback keeps type-checking of this file standalone.
const SITE_ORIGIN = import.meta.env.SITE ?? "https://team4q.se";
const abs = (path: string): string => new URL(path, SITE_ORIGIN).href;

const OG_DEFAULT = abs("/og-default.jpg");

// Non-empty social profiles only — drives Organization `sameAs`.
const SOCIAL_URLS: string[] = Object.values(CLUB_CONTACT.social).filter((url) => url.length > 0);

// PostalAddress with the placeholder fields omitted until the developer fills them in.
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  ...(CLUB_CONTACT.address.street ? { streetAddress: CLUB_CONTACT.address.street } : {}),
  ...(CLUB_CONTACT.address.postalCode ? { postalCode: CLUB_CONTACT.address.postalCode } : {}),
  addressLocality: CLUB_CONTACT.address.city,
  addressCountry: CLUB_CONTACT.address.country,
} as const;

const teamEntry = (key: TeamKey): SeoEntry => {
  const label = { mens: "Herrlaget", womens: "Damlaget", juniors: "Ungdomslaget" }[key];
  const slug = { mens: "herrlaget", womens: "damlaget", juniors: "ungdomslaget" }[key];
  const noun = { mens: "herrbasket", womens: "dambasket", juniors: "ungdomsbasket" }[key];
  return {
    title: `${label} | ${ORG_NAME}`,
    description: `${label} i ${ORG_NAME} – matcher, resultat, träningstider och nyheter för T4Q:s ${noun} i Helsingborg.`,
    ogImage: OG_DEFAULT,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: `${ORG_NAME} ${label}`,
      sport: "Basketball",
      url: abs(`/${slug}`),
      location: {
        "@type": "Place",
        name: "Helsingborg",
        address: { "@type": "PostalAddress", addressLocality: "Helsingborg", addressCountry: "SE" },
      },
      parentOrganization: { "@type": "Organization", name: ORG_NAME, url: abs("/") },
    },
  };
};

export const SEO_STATIC: SeoStatic = {
  home: {
    title: `${ORG_NAME} | Basketklubb i Helsingborg`,
    description:
      "Team Fourth Quarter (T4Q) är en basketklubb i Helsingborg med herr-, dam- och ungdomslag. Följ nyheter, matcher och träningstider.",
    ogImage: OG_DEFAULT,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: ORG_NAME,
      url: abs("/"),
      logo: abs("/logo.png"),
      ...(SOCIAL_URLS.length ? { sameAs: SOCIAL_URLS } : {}),
    },
  },

  newsListing: {
    title: `Nyheter | ${ORG_NAME}`,
    description:
      "Senaste nytt från Team Fourth Quarter – matchrapporter, klubbnyheter och information om herr-, dam- och ungdomslagen.",
    ogImage: OG_DEFAULT,
    jsonLd: null,
  },

  sponsors: {
    title: `Sponsorer | ${ORG_NAME}`,
    description:
      "Företagen som stöttar Team Fourth Quarter. Vill ditt företag synas tillsammans med basketen i Helsingborg? Hör av dig.",
    ogImage: OG_DEFAULT,
    jsonLd: null,
  },

  contact: {
    title: `Kontakt | ${ORG_NAME}`,
    description:
      "Kontakta Team Fourth Quarter – e-post, telefon och adress till basketklubben i Helsingborg.",
    ogImage: OG_DEFAULT,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: ORG_NAME,
      url: abs("/kontakt"),
      email: CLUB_CONTACT.email,
      ...(CLUB_CONTACT.phone ? { telephone: CLUB_CONTACT.phone } : {}),
      address: POSTAL_ADDRESS,
    },
  },

  team: {
    mens: teamEntry("mens"),
    womens: teamEntry("womens"),
    juniors: teamEntry("juniors"),
  },
};
