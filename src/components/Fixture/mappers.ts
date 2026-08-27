// Phase 2 will swap fixtureDummy for a real fetchOrFail(query) call via
// src/lib/hygraphClient.ts, checking result.ok before mapping (message block on failure,
// per /graphql skill). For now the dummy data stands in directly as the RD.

import { fixtureDummy } from "./dummy";
import type { FixtureRD, FixtureVM } from "./types";

function toVM(rd: FixtureRD): FixtureVM {
  return {
    heading: rd.heading,
    date: rd.date,
    startTime: rd.startTime,
    endTime: rd.endTime,
    location: rd.location,
    homeTeam: rd.homeTeam,
    awayTeam: rd.awayTeam,
    teamName: rd.team.name,
    hasCoverImage: Boolean(rd.coverImage),
    coverImage: rd.coverImage as ImageMetadata | null,
    affiliationLabels: rd.affiliations.map((a) => a.label),
  };
}

export async function getFixtureVMs(): Promise<FixtureVM[]> {
  return fixtureDummy.map(toVM);
}
