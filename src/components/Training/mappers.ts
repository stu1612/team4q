// The codegen task will swap trainingDummy for a real fetchOrFail(query) call via
// src/lib/hygraphClient.ts, checking result.ok before mapping (full message block on
// failure, per /graphql skill — this model gets no fallback.ts). For now the dummy data
// stands in directly as the RD. Not yet wired to a page — built in Phase 4.

import { teamLabel } from "../../lib/teamLabel";
import { trainingDummy } from "./dummy";
import type { CoachRD, CoachVM, TrainingRD, TrainingVM } from "./types";

const TRAINING_TYPE_LABELS: Record<string, string> = {
  team: "Lagträning",
  individual: "Individuell träning",
};

function coachToVM(rd: CoachRD): CoachVM {
  return {
    name: rd.name ?? "",
    role: rd.role ?? "",
    hasCoachPhoto: Boolean(rd.profileImage),
    photo: (rd.profileImage ?? null) as ImageMetadata | null,
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

export async function getTrainingVMs(): Promise<TrainingVM[]> {
  return trainingDummy.filter((rd) => rd.isActive === "active").map(toVM);
}
