// RD types derive from graphql-codegen output (src/gql/generated.ts). coverImage widened
// (RawImage) so fallback.ts keeps a local import. Mapper wired; not rendered until the
// /herrlaget /damlaget /ungdomslaget routes are built in Phase 4.

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
}
