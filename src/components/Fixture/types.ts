// RD types derive from graphql-codegen output (src/gql/generated.ts). Image fields are
// widened (RawImage) for consistency with the fetchWithFallback models. Affiliation now
// lives on the team relation.

import type { FixtureListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";
import type { ClubContact } from "../../constants/contact";

type FixtureRow = FixtureListQuery["fixtureModels"][number];
type FixtureTeamRow = NonNullable<FixtureRow["teamModel"]>;

export interface FixtureTeamRD extends Omit<FixtureTeamRow, "affiliationLogo"> {
  affiliationLogo: RawImage | null;
}

export interface FixtureRD extends Omit<FixtureRow, "coverImage" | "teamModel"> {
  coverImage: RawImage | null;
  teamModel: FixtureTeamRD | null;
}

export interface FixtureResponseRD {
  fixtureModels: FixtureRD[];
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
  coverImage: ImageMetadata | string | null;
  hasAffiliation: boolean;
  affiliationName: string;
  affiliationUrl: string;
  affiliationLogo: ImageMetadata | string | null;
}

// fetchOrFail model: the mapper returns a message-block signal on failure, never fake data.
export type FixtureListVM =
  | { ok: true; fixtures: FixtureVM[] }
  | { ok: false; contact: ClubContact };
