import { gql } from "graphql-request";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage } from "../../lib/resolveImage";
import { sponsorFallback } from "./fallback";
import type { SponsorRD, SponsorResponseRD, SponsorVM } from "./types";

const SPONSOR_QUERY = gql`
  query SponsorList {
    sponsorModels {
      name
      url
      tagline
      tier
      isActive
      logo {
        url
        width
        height
      }
    }
  }
`;

function toVM(rd: SponsorRD): SponsorVM {
  return {
    name: rd.name,
    logo: resolveImage(rd.logo),
    url: rd.url,
    tier: rd.tier,
    tagline: rd.tagline ?? "",
  };
}

export async function getSponsorVMs(): Promise<SponsorVM[]> {
  const data = await fetchWithFallback<SponsorResponseRD>(SPONSOR_QUERY, sponsorFallback);
  // isActive === "active" gates visibility; an inactive sponsor never reaches a consumer.
  return data.sponsorModels.filter((rd) => rd.isActive === "active").map(toVM);
}
