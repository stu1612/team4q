// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

// FixtureModel.teamModel — affiliation now lives on TeamModel (three inline fields),
// no longer a repeatable component on the fixture itself.
export interface FixtureTeamRD {
  name: string;
  slug: string;
  teamAffiliation: string | null;
  affiliationUrl: string | null;
  affiliationLogo: AssetRD | ImageMetadata | null;
}

export type IsActive = "active" | "inactive";

export interface FixtureRD {
  heading: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  isActive: IsActive;
  teamModel: FixtureTeamRD | null;
  coverImage: AssetRD | ImageMetadata | null;
}

export interface FixtureVM {
  heading: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  hasTeam: boolean;
  teamLabel: string;
  hasCoverImage: boolean;
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  coverImage: ImageMetadata | null;
  hasAffiliation: boolean;
  affiliationName: string;
  affiliationUrl: string;
  affiliationLogo: ImageMetadata | null;
}
