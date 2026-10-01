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

export interface FixtureRD extends Omit<FixtureRow, "teamModel"> {
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
  /** HERR / DAM / UNGDOM — the short card tag; "" when the fixture has no team. */
  tagLabel: string;
  /** Compound visibility: still to be played (its endTime hasn't passed, Stockholm time). */
  isUpcoming: boolean;
  dateLabel: string;
  /** Date split for the homepage card's date panel: "lör" / "3" / "okt". */
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  timeLabel: string;
  /** Local start as "YYYY-MM-DDTHH:mm" for <time datetime>. */
  isoDateTime: string;
  /** "Hemma" / "Borta" from the club's side of the fixture; "" when neither team name is
   *  recognised as the club. */
  venueLabel: string;
  /** Crest per side — the club logo on the club's side, the generic opponent crest on the
   *  other. Always renderable (Default with derived placeholder). */
  homeCrest: ImageMetadata | string;
  awayCrest: ImageMetadata | string;
  hasAffiliation: boolean;
  affiliationName: string;
  affiliationUrl: string;
  affiliationLogo: ImageMetadata | string | null;
}

// fetchOrFail model: the mapper returns a message-block signal on failure, never fake data.
export type FixtureListVM =
  | { ok: true; fixtures: FixtureVM[] }
  | { ok: false; contact: ClubContact };
