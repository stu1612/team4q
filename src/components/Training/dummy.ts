// Dev-only stand-in data — NOT a runtime fallback (TrainingModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before real Hygraph queries land in the codegen task.
// Delete once hygraphClient.ts + real queries replace it.
//
// Mirrors the live Hygraph shape as of 2026-08-29: `clubMemberModels` coaches list
// (0-to-many), `teamModel` relation, `trainingType` + `isActive` enums. One venue keeps a
// leading tab (as in live content) so the mapper's .trim() is exercised.

import type { CoachRD, TrainingRD } from "./types";

const sasa: CoachRD = { name: "Sasa", role: "Tränare", profileImage: null };
const ellen: CoachRD = { name: "Ellen", role: "Tränare", profileImage: null };

export const trainingDummy: TrainingRD[] = [
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-08",
    startTime: "18:00",
    endTime: "20:00",
    trainingType: "team",
    isActive: "active",
    information: "Fokus på försvarsspel",
    teamModel: { name: "Herr", slug: "herrlaget" },
    clubMemberModels: [sasa],
  },
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-09",
    startTime: "17:00",
    endTime: "19:00",
    trainingType: "team",
    isActive: "active",
    information: null,
    teamModel: { name: "Dam", slug: "damlaget" },
    clubMemberModels: [ellen],
  },
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-12",
    startTime: "16:00",
    endTime: "17:30",
    trainingType: "individual",
    isActive: "active",
    information: "Föräldrar välkomna att titta",
    teamModel: { name: "Ungdom", slug: "ungdomslaget" },
    // No coach assigned — hasCoaches=false path.
    clubMemberModels: [],
  },
  {
    venue: "Gustav Adolfs Hallen",
    date: "2026-09-15",
    startTime: "19:00",
    endTime: "21:00",
    trainingType: "team",
    isActive: "inactive",
    information: "Inaktivt pass (ska filtreras bort)",
    teamModel: { name: "Herr", slug: "herrlaget" },
    clubMemberModels: [sasa, ellen],
  },
];
