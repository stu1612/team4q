// RD types derive from graphql-codegen output (src/gql/generated.ts). Coach image widened
// (RawImage). Coach email/contactNumber are public-facing (fallback-reference: ClubMember)
// and selected only because this component renders them.

import type { TrainingListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";
import type { ClubContact } from "../../constants/contact";

type TrainingRow = TrainingListQuery["trainingModels"][number];
type CoachRow = TrainingRow["clubMemberModels"][number];

export interface CoachRD extends Omit<CoachRow, "profileImage"> {
  profileImage: RawImage | null;
}

export interface TrainingRD extends Omit<TrainingRow, "clubMemberModels"> {
  clubMemberModels: CoachRD[];
}

export interface TrainingResponseRD {
  trainingModels: TrainingRD[];
}

export interface CoachVM {
  name: string;
  role: string;
  hasCoachPhoto: boolean;
  photo: ImageMetadata | string | null;
  /** "" when not set — the contact link is omitted. */
  email: string;
  phone: string;
  /** `tel:` href with whitespace stripped; "" when there's no phone. */
  phoneHref: string;
}

export interface TrainingVM {
  venue: string;
  date: string;
  /** Date split for the session card's date panel: "tis" / "8" / "sep". */
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  /** Local start/end as "YYYY-MM-DDTHH:mm" for <time datetime>. */
  isoStart: string;
  isoEnd: string;
  startTime: string;
  endTime: string;
  trainingTypeLabel: string;
  information: string;
  hasTeam: boolean;
  /** "" when the session has no team relation. */
  teamSlug: string;
  teamLabel: string;
  hasCoaches: boolean;
  coaches: CoachVM[];
}

export type TrainingListVM =
  | { ok: true; sessions: TrainingVM[] }
  | { ok: false; contact: ClubContact };

/** One team's block on the all-teams /traning page. */
export interface TrainingTeamGroupVM {
  /** Section anchor id, e.g. "traning-herrlaget". */
  anchorId: string;
  label: string;
  /** Team page href, or "" for the no-team "Hela klubben" group. */
  teamHref: string;
  sessions: TrainingVM[];
}

export type TrainingByTeamVM =
  | { ok: true; groups: TrainingTeamGroupVM[] }
  | { ok: false; contact: ClubContact };
