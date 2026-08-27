// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export type SponsorTier = "main" | "partner" | "community";

export interface SponsorRD {
  name: string;
  logo: ImageMetadata | string;
  url: string;
  tier: SponsorTier;
  tagline: string | null;
}

export interface SponsorVM {
  name: string;
  // Narrower than SponsorRD's logo — only local imports occur before Phase 2.
  // Revisit once live Hygraph asset URLs need distinct <Image> handling (remote
  // width/height).
  logo: ImageMetadata;
  url: string;
  tier: SponsorTier;
  tagline: string;
}
