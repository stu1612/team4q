import { gql } from "graphql-request";
import { CLUB_CONTACT } from "../../constants/contact";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage } from "../../lib/resolveImage";
import { heroFallback } from "./fallback";
import type { HeroRD, HeroResponseRD, HeroVM } from "./types";

const HERO_QUERY = gql`
  query HeroContent {
    heroModels(first: 1) {
      heading
      subheading
      ctaLabel
      ctaUrl
      coverImage {
        url
        width
        height
      }
    }
  }
`;

// Contact is mailto-only (the /kontakt route was dropped 2026-10-01), so the CTA always
// targets the club email. HeroModel's ctaUrl is still queried but ignored — an older
// Hygraph entry may still hold "/kontakt".
const CTA_URL = `mailto:${CLUB_CONTACT.email}`;

function toVM(rd: HeroRD): HeroVM {
  const hasCTA = Boolean(rd.ctaLabel);
  return {
    heading: rd.heading,
    coverImage: resolveImage(rd.coverImage),
    subheading: rd.subheading ?? "",
    hasSubheading: Boolean(rd.subheading),
    hasCTA,
    ctaLabel: hasCTA ? (rd.ctaLabel as string) : "",
    ctaUrl: hasCTA ? CTA_URL : "",
  };
}

export async function getHeroVM(): Promise<HeroVM> {
  const data = await fetchWithFallback<HeroResponseRD>(HERO_QUERY, heroFallback);
  // No isActive field on HeroModel — take the single row; empty collection → fallback row.
  const rd = data.heroModels[0] ?? heroFallback.heroModels[0];
  return toVM(rd);
}
