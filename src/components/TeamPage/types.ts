// RD types derive from graphql-codegen output (src/gql/generated.ts). coverImage widened
// (RawImage) so fallback.ts keeps a local import. The team's league affiliation stays
// URL-only — fallback.ts leaves it null, so a Hygraph outage just hides the league badge.

import type { TeamPageBySlugQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type TeamPageRow = TeamPageBySlugQuery["teamPageModels"][number];

export interface TeamPageRD extends Omit<TeamPageRow, "coverImage"> {
  coverImage: RawImage;
}

export interface TeamPageResponseRD {
  teamPageModels: TeamPageRD[];
}

export interface TeamPageVM {
  heading: string;
  subheading: string;
  teamLabel: string;
  coverImage: ImageMetadata | string;
  /** League badge (TeamModel affiliation) — Flag, all three fields or none. */
  hasAffiliation: boolean;
  affiliationName: string;
  affiliationUrl: string;
  affiliationLogo: ImageMetadata | string | null;
}
