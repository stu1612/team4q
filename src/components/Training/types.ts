// RD types derive from graphql-codegen output (src/gql/generated.ts). Coach image widened
// (RawImage). Mapper wired; not rendered until Phase 4.

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
}

export interface TrainingVM {
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  trainingTypeLabel: string;
  information: string;
  hasTeam: boolean;
  teamLabel: string;
  hasCoaches: boolean;
  coaches: CoachVM[];
}

export type TrainingListVM =
  | { ok: true; sessions: TrainingVM[] }
  | { ok: false; contact: ClubContact };
