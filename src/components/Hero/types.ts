// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface HeroRD {
  heading: string;
  coverImage: ImageMetadata | string;
  subheading: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
}
