// The codegen task will swap sponsorFallback for a real fetchWithFallback(query,
// sponsorFallback) call via src/lib/hygraphClient.ts. For now the fallback data stands
// in directly as the RD.

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
  // isActive === "active" gates visibility; an inactive sponsor never reaches a consumer.
  return sponsorFallback.filter((rd) => rd.isActive === "active").map(toVM);
}
