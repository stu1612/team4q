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

export interface ResultVM {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  teamName: string;
  // Narrower than ResultRD's backgroundImage — only local imports occur before
  // Phase 2. Revisit once live Hygraph asset URLs need distinct <Image> handling
  // (remote width/height).
  backgroundImage: ImageMetadata;
  hasDate: boolean;
  date: string | null;
}
