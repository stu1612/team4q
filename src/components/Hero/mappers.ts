// Phase 2 will swap heroFallback for a real fetchWithFallback(query, heroFallback) call
// via src/lib/hygraphClient.ts. For now the fallback data stands in directly as the RD.

import { heroFallback } from "./fallback";
import type { HeroRD, HeroVM } from "./types";

function toVM(rd: HeroRD): HeroVM {
  const hasCTA = Boolean(rd.ctaLabel && rd.ctaUrl);
  return {
    heading: rd.heading,
    coverImage: rd.coverImage as ImageMetadata,
    subheading: rd.subheading ?? "",
    hasCTA,
    ctaLabel: hasCTA ? (rd.ctaLabel as string) : "",
    ctaUrl: hasCTA ? (rd.ctaUrl as string) : "",
  };
}

export async function getHeroVM(): Promise<HeroVM> {
  return toVM(heroFallback);
}
