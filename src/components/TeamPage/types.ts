// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)
// The mapper is still a stub; VM shape here is provisional and may expand in Phase 4.

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

export interface TeamPageTeamRD {
  name: string;
  slug: string;
}

export interface TeamPageRD {
  heading: string;
  coverImage: AssetRD | ImageMetadata;
  subheading: string | null;
  // Schema permits null, but the page is meaningless without it — the mapper treats a
  // missing relation as a developer-facing error, not a silent empty state.
  teamModel: TeamPageTeamRD | null;
}

export interface TeamPageVM {
  heading: string;
  subheading: string;
  teamLabel: string;
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  coverImage: ImageMetadata;
}
