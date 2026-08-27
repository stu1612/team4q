// Dev-only stand-in data — NOT a runtime fallback (TrainingModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before Hygraph is wired in Phase 2. Delete once
// hygraphClient.ts + real queries replace it.

import type { TrainingRD } from "./types";

export const trainingDummy: TrainingRD[] = [
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-01",
    startTime: "19:00",
    endTime: "21:00",
    trainingType: "Lagträning",
    coach: { name: "Erik Nilsson", photo: null },
    team: { name: "Herrlaget", slug: "mens" },
    information: "Ta med både inomhus- och utomhusskor.",
  },
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-02",
    startTime: "18:00",
    endTime: "19:30",
    trainingType: "Styrka & kondition",
    coach: { name: "Lina Andersson", photo: null },
    team: { name: "Damlaget", slug: "womens" },
    information: null,
  },
  {
    venue: "Idrottshallen, Helsingborg",
    date: "2026-09-03",
    startTime: "17:00",
    endTime: "18:00",
    trainingType: "Lagträning",
    coach: { name: "Johan Pettersson", photo: null },
    team: { name: "Ungdomslaget", slug: "juniors" },
    information: "Föräldrar hämtar innanför entrén efter träning.",
  },
];
