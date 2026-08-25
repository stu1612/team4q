// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export type SponsorTier = "main" | "partner" | "community";

export interface SponsorRD {
  name: string;
  logo: ImageMetadata | string;
  url: string;
  tier: SponsorTier;
  tagline: string | null;
}
