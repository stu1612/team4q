// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

export interface ResultTeamRD {
  name: string;
  slug: string;
}

export type IsActive = "active" | "inactive";

export interface ResultRD {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  teamModel: ResultTeamRD | null;
  backgroundImage: AssetRD | ImageMetadata;
  isActive: IsActive;
  date: string | null;
  // Hygraph system field. Nullable DateTime; a null value counts as not-stale.
  publishedAt: string | null;
}

export interface ResultVM {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  hasTeam: boolean;
  teamLabel: string;
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  backgroundImage: ImageMetadata;
  hasDate: boolean;
  date: string | null;
}
