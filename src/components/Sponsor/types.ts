// RD types derive from graphql-codegen output (src/gql/generated.ts). logo and
// commercialImage are widened (RawImage) so fallback.ts can keep local imports;
// commercialImage stays nullable to match the live schema (Flag field, paired with
// hasCommercialSlot).

import type { SponsorListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type SponsorRow = SponsorListQuery["sponsorModels"][number];

export interface SponsorRD extends Omit<SponsorRow, "logo" | "commercialImage"> {
  logo: RawImage;
  commercialImage: RawImage | null;
}

export interface SponsorResponseRD {
  sponsorModels: SponsorRD[];
}

// Re-exported from generated for consumers that want the union without importing gql/.
export type SponsorTier = SponsorRow["tier"];

export interface SponsorVM {
  name: string;
  logo: ImageMetadata | string;
  url: string;
  tier: SponsorTier;
  tagline: string;
  hasCommercialSlot: boolean;
  commercialImage: ImageMetadata | string | null;
}

// Homepage "Våra partners" two-row grouping: main-tier sponsors get the larger top row;
// partner and community tiers share the smaller bottom row (no community sponsor exists yet,
// but the grouping needs no changes when one is added).
export interface SponsorGroupsVM {
  main: SponsorVM[];
  featured: SponsorVM[];
}
