// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface TeamPageTeamRD {
  name: string;
  slug: string;
}

export interface TeamPageRD {
  heading: string;
  coverImage: ImageMetadata | string;
  subheading: string | null;
  team: TeamPageTeamRD;
}
