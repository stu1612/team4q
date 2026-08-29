// The codegen task will swap fixtureDummy for a real fetchOrFail(query) call via
// src/lib/hygraphClient.ts, checking result.ok before mapping (message block on failure,
// per /graphql skill). For now the dummy data stands in directly as the RD.

import { teamLabel } from "../../lib/teamLabel";
import { fixtureDummy } from "./dummy";
import type { FixtureRD, FixtureVM } from "./types";

function toVM(rd: FixtureRD): FixtureVM {
  const team = rd.teamModel;
  const hasAffiliation = Boolean(
    team?.teamAffiliation && team?.affiliationUrl && team?.affiliationLogo,
  );
  return {
    heading: rd.heading,
    date: rd.date,
    startTime: rd.startTime,
    endTime: rd.endTime,
    location: rd.location.trim(),
    homeTeam: rd.homeTeam,
    awayTeam: rd.awayTeam,
    hasTeam: Boolean(team),
    teamLabel: team ? teamLabel(team.slug) : "",
    hasCoverImage: Boolean(rd.coverImage),
    coverImage: (rd.coverImage ?? null) as ImageMetadata | null,
    hasAffiliation,
    affiliationName: hasAffiliation ? (team!.teamAffiliation as string) : "",
    affiliationUrl: hasAffiliation ? (team!.affiliationUrl as string) : "",
    affiliationLogo: hasAffiliation ? (team!.affiliationLogo as ImageMetadata) : null,
  };
}

export async function getFixtureVMs(): Promise<FixtureVM[]> {
  // isActive === "active" is the visibility gate; an inactive fixture never reaches a
  // consumer. The past/upcoming split is a separate Phase 4 concern.
  return fixtureDummy.filter((rd) => rd.isActive === "active").map(toVM);
}
