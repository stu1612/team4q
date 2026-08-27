// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface ResultTeamRD {
  name: string;
  slug: string;
}

export interface ResultRD {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  team: ResultTeamRD;
  backgroundImage: ImageMetadata | string;
  isActive: boolean;
  date: string | null;
  publishedAt: string;
}
