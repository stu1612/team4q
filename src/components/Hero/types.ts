// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)

// Hygraph Asset selection shape ({ url width height }). Interim: fallback data still
// supplies local ImageMetadata, so image fields are a union; the codegen task drops
// ImageMetadata and finalises URL-only handling. See fallback-reference.md § Asset.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

export interface HeroRD {
  heading: string;
  coverImage: AssetRD | ImageMetadata;
  subheading: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
}

export interface HeroVM {
  heading: string;
  // Narrowed to ImageMetadata for the interim — only local imports occur before the
  // codegen task swaps in live Hygraph asset URLs.
  coverImage: ImageMetadata;
  subheading: string;
  hasCTA: boolean;
  ctaLabel: string;
  ctaUrl: string;
}
