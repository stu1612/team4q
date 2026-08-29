// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)

export type SponsorTier = "main" | "partner" | "community";
export type IsActive = "active" | "inactive";

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

export interface SponsorRD {
  name: string;
  logo: AssetRD | ImageMetadata;
  url: string;
  tier: SponsorTier;
  isActive: IsActive;
  tagline: string | null;
}

export interface SponsorVM {
  name: string;
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  logo: ImageMetadata;
  url: string;
  tier: SponsorTier;
  tagline: string;
}
