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
