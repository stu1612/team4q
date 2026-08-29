// RD types derive from graphql-codegen output (src/gql/generated.ts). Only the logo is
// widened (RawImage) so fallback.ts can keep a local import.

import type { SponsorListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type SponsorRow = SponsorListQuery["sponsorModels"][number];

export interface SponsorRD extends Omit<SponsorRow, "logo"> {
  logo: RawImage;
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
}
