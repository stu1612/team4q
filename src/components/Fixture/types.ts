// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

// TODO: verify AffiliationComponent fields against Hygraph — not yet reconciled
export interface AffiliationRD {
  label: string;
}

export interface FixtureTeamRD {
  name: string;
  slug: string;
}

export interface FixtureRD {
  heading: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  team: FixtureTeamRD;
  coverImage: ImageMetadata | string | null;
  affiliations: AffiliationRD[];
}

export interface FixtureVM {
  heading: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  teamName: string;
  hasCoverImage: boolean;
  // Narrower than FixtureRD's coverImage — only local imports occur before Phase 2.
  // Revisit once live Hygraph asset URLs need distinct <Image> handling (remote
  // width/height).
  coverImage: ImageMetadata | null;
  affiliationLabels: string[];
}
