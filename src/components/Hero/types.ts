// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface HeroRD {
  heading: string;
  coverImage: ImageMetadata | string;
  subheading: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
}

export interface HeroVM {
  heading: string;
  // Narrower than HeroRD's coverImage — only local imports occur before Phase 2.
  // Revisit once live Hygraph asset URLs need distinct <Image> handling (remote
  // width/height).
  coverImage: ImageMetadata;
  subheading: string;
  hasCTA: boolean;
  ctaLabel: string;
  ctaUrl: string;
}
