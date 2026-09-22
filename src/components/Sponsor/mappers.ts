import { gql } from "graphql-request";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage, resolveImageOrNull } from "../../lib/resolveImage";
import { sponsorFallback } from "./fallback";
import type {
  SponsorGroupsVM,
  SponsorRD,
  SponsorResponseRD,
  SponsorVM,
} from "./types";

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
      hasCommercialSlot
      commercialImage {
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
    hasCommercialSlot: rd.hasCommercialSlot,
    commercialImage: resolveImageOrNull(rd.commercialImage),
  };
}

export async function getSponsorVMs(): Promise<SponsorVM[]> {
  const data = await fetchWithFallback<SponsorResponseRD>(
    SPONSOR_QUERY,
    sponsorFallback,
  );
  // isActive === "active" gates visibility; an inactive sponsor never reaches a consumer.
  return data.sponsorModels.filter((rd) => rd.isActive === "active").map(toVM);
}

// Homepage "Våra partners" row split — main tier on its own, partner + community sharing the
// smaller row. Grouping lives here, not in the UI, per /data-mapping.
export async function getSponsorGroups(): Promise<SponsorGroupsVM> {
  const sponsors = await getSponsorVMs();
  return {
    main: sponsors.filter((sponsor) => sponsor.tier === "main"),
    featured: sponsors.filter((sponsor) => sponsor.tier !== "main"),
  };
}
