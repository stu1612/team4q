// Phase 2 will swap sponsorFallback for a real fetchWithFallback(query, sponsorFallback)
// call via src/lib/hygraphClient.ts. For now the fallback data stands in directly as the RD.

import { sponsorFallback } from "./fallback";
import type { SponsorRD, SponsorVM } from "./types";

function toVM(rd: SponsorRD): SponsorVM {
  return {
    name: rd.name,
    logo: rd.logo as ImageMetadata,
    url: rd.url,
    tier: rd.tier,
    tagline: rd.tagline ?? "",
  };
}

export async function getSponsorVMs(): Promise<SponsorVM[]> {
  return sponsorFallback.map(toVM);
}
