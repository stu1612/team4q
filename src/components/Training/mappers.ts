// Wired to fetchOrFail. Rendered by the team-page training section (Training/index.astro).

import { gql } from "graphql-request";
import { CLUB_CONTACT } from "../../constants/contact";
import { formatDatePartsSv } from "../../lib/formatDate";
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

// A real GraphQL fragment (not a plain string) so graphql-codegen can resolve it — the
// operations spread it and append it after the operation body.
const TRAINING_FIELDS = gql`
  fragment TrainingFields on TrainingModel {
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
      email
      contactNumber
      profileImage {
        url
        width
        height
      }
    }
  }
`;

const TRAINING_QUERY = gql`
  query TrainingList {
    trainingModels(orderBy: date_ASC) {
      ...TrainingFields
    }
  }
  ${TRAINING_FIELDS}
`;

// Team-scoped variant for team pages — same fields, filtered server-side.
const TRAINING_BY_TEAM_QUERY = gql`
  query TrainingListByTeam($slug: String!) {
    trainingModels(where: { teamModel: { slug: $slug } }, orderBy: date_ASC) {
      ...TrainingFields
    }
  }
  ${TRAINING_FIELDS}
`;

function coachToVM(rd: CoachRD): CoachVM {
  const email = rd.email?.trim() ?? "";
  const phone = rd.contactNumber?.trim() ?? "";
  return {
    name: rd.name ?? "",
    role: rd.role ?? "",
    hasCoachPhoto: Boolean(rd.profileImage),
    photo: resolveImageOrNull(rd.profileImage),
    email,
    phone,
    phoneHref: phone ? `tel:${phone.replace(/\s+/g, "")}` : "",
  };
}

function toVM(rd: TrainingRD): TrainingVM {
  const coaches = rd.clubMemberModels.filter((c) => c.name).map(coachToVM);
  const dateParts = formatDatePartsSv(rd.date);
  return {
    venue: rd.venue.trim(),
    date: rd.date,
    weekdayShort: dateParts.weekday,
    dayNumber: dateParts.day,
    monthShort: dateParts.month,
    isoStart: `${rd.date}T${rd.startTime}`,
    isoEnd: `${rd.date}T${rd.endTime}`,
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

export async function getTrainingVMs(): Promise<TrainingListVM> {
  const res = await fetchOrFail<TrainingResponseRD>(TRAINING_QUERY);
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  const sessions = res.data.trainingModels
    .filter((rd) => rd.isActive === "active")
    .map(toVM);
  return { ok: true, sessions };
}

/** Every active training session for one team, each with its own coaches and their
 *  contact details (team-page training section). No date filtering — isActive is the sole
 *  visibility gate. */
export async function getTrainingVMsByTeam(slug: string): Promise<TrainingListVM> {
  const res = await fetchOrFail<TrainingResponseRD>(TRAINING_BY_TEAM_QUERY, { slug });
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  const sessions = res.data.trainingModels
    .filter((rd) => rd.isActive === "active")
    .map(toVM);
  return { ok: true, sessions };
}
