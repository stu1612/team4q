// RD types derive from graphql-codegen output (src/gql/generated.ts). backgroundImage
// widened (RawImage).

import type { ResultListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type ResultRow = ResultListQuery["resultModels"][number];

export interface ResultRD extends Omit<ResultRow, "backgroundImage"> {
  backgroundImage: RawImage;
}

export interface ResultResponseRD {
  resultModels: ResultRD[];
}

export interface ResultVM {
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  hasTeam: boolean;
  teamLabel: string;
  backgroundImage: ImageMetadata | string;
  hasDate: boolean;
  date: string | null;
}
