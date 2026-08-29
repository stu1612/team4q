// RD types derive from graphql-codegen output (src/gql/generated.ts). Only image fields
// are widened — RawImage adds the local-import arm so fallback.ts keeps build-optimised
// images; a live response supplies the { url, width, height } arm.

import type { HeroContentQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type HeroRow = HeroContentQuery["heroModels"][number];

export interface HeroRD extends Omit<HeroRow, "coverImage"> {
  coverImage: RawImage;
}

/** What the Hero query resolves to (a real response or fallback.ts). */
export interface HeroResponseRD {
  heroModels: HeroRD[];
}

export interface HeroVM {
  heading: string;
  // ImageMetadata for a local fallback import, URL string for a live Hygraph asset.
  coverImage: ImageMetadata | string;
  subheading: string;
  hasCTA: boolean;
  ctaLabel: string;
  ctaUrl: string;
}
