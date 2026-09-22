// Wired to fetchOrFail. Not rendered until Phase 4.

import { gql } from "graphql-request";
import { CLUB_CONTACT } from "../../constants/contact";
import { fetchOrFail } from "../../lib/hygraphClient";
import { resolveImageOrNull } from "../../lib/resolveImage";
import { teamLabel } from "../../lib/teamLabel";
import type {
  CoachRD,
  CoachVM,
  TrainingListVM,
  TrainingRD,
  TrainingResponseRD,
  TrainingVM,
} from "./types";

const TRAINING_TYPE_LABELS: Record<string, string> = {
  team: "Lagträning",
  individual: "Individuell träning",
};

const TRAINING_FIELDS = `
  venue
  date
  startTime
  endTime
  trainingType
  isActive
  information
  teamModel {
    name
    slug
  }
  clubMemberModels {
    name
    role
    profileImage {
      url
      width
      height
    }
  }
`;

const TRAINING_QUERY = gql`
  query TrainingList {
    trainingModels(orderBy: date_ASC) {
      ${TRAINING_FIELDS}
    }
  }
`;

// Team-scoped variant for team pages — same fields, filtered server-side.
const TRAINING_BY_TEAM_QUERY = gql`
  query TrainingListByTeam($slug: String!) {
    trainingModels(where: { teamModel: { slug: $slug } }, orderBy: date_ASC) {
      ${TRAINING_FIELDS}
    }
  }
`;

function coachToVM(rd: CoachRD): CoachVM {
  return {
    name: rd.name ?? "",
    role: rd.role ?? "",
    hasCoachPhoto: Boolean(rd.profileImage),
    photo: resolveImageOrNull(rd.profileImage),
  };
}

function toVM(rd: TrainingRD): TrainingVM {
  const coaches = rd.clubMemberModels.filter((c) => c.name).map(coachToVM);
  return {
    venue: rd.venue.trim(),
    date: rd.date,
    startTime: rd.startTime,
    endTime: rd.endTime,
    trainingTypeLabel: TRAINING_TYPE_LABELS[rd.trainingType] ?? rd.trainingType,
    information: rd.information ?? "",
    hasTeam: Boolean(rd.teamModel),
    teamLabel: rd.teamModel ? teamLabel(rd.teamModel.slug) : "",
    hasCoaches: coaches.length > 0,
    coaches,
  };
}

// A coach can appear on multiple sessions; de-duplicated by name for a single "Tränare"
// sub-section rather than repeating their card per session.
function dedupeCoaches(sessions: TrainingVM[]): CoachVM[] {
  const seen = new Map<string, CoachVM>();
  for (const session of sessions) {
    for (const coach of session.coaches) {
      if (!seen.has(coach.name)) seen.set(coach.name, coach);
    }
  }
  return [...seen.values()];
}

export async function getTrainingVMs(): Promise<TrainingListVM> {
  const res = await fetchOrFail<TrainingResponseRD>(TRAINING_QUERY);
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  const sessions = res.data.trainingModels
    .filter((rd) => rd.isActive === "active")
    .map(toVM);
  return { ok: true, sessions, coaches: dedupeCoaches(sessions) };
}

/** Every active training session for one team, plus its de-duplicated coaches (used by the
 *  team-page training section). No date filtering — isActive is the sole visibility gate. */
export async function getTrainingVMsByTeam(slug: string): Promise<TrainingListVM> {
  const res = await fetchOrFail<TrainingResponseRD>(TRAINING_BY_TEAM_QUERY, { slug });
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  const sessions = res.data.trainingModels
    .filter((rd) => rd.isActive === "active")
    .map(toVM);
  return { ok: true, sessions, coaches: dedupeCoaches(sessions) };
}
