import { gql } from "graphql-request";
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

function toVM(rd: HeroRD): HeroVM {
  const hasCTA = Boolean(rd.ctaLabel && rd.ctaUrl);
  return {
    heading: rd.heading,
    coverImage: resolveImage(rd.coverImage),
    subheading: rd.subheading ?? "",
    hasSubheading: Boolean(rd.subheading),
    hasCTA,
    ctaLabel: hasCTA ? (rd.ctaLabel as string) : "",
    ctaUrl: hasCTA ? (rd.ctaUrl as string) : "",
  };
}

export async function getHeroVM(): Promise<HeroVM> {
  const data = await fetchWithFallback<HeroResponseRD>(HERO_QUERY, heroFallback);
  // No isActive field on HeroModel — take the single row; empty collection → fallback row.
  const rd = data.heroModels[0] ?? heroFallback.heroModels[0];
  return toVM(rd);
}
