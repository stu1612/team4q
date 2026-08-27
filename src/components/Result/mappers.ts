// Phase 2 will swap resultDummy for a real fetchOrFail(query) call via
// src/lib/hygraphClient.ts, checking result.ok before mapping (render nothing on failure,
// per /graphql skill). For now the dummy data stands in directly as the RD.

import type { ResultRD, ResultVM } from "./types";
import { resultDummy } from "./dummy";

const STALE_AFTER_DAYS = 28;

function isVisible(rd: ResultRD): boolean {
  const publishedAt = new Date(rd.publishedAt);
  const daysSincePublished = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);
  const isStale = daysSincePublished > STALE_AFTER_DAYS;
  // isActive may only suppress early — staleness can still hide an active result,
  // but never the reverse. See /data-mapping skill's compound-visibility pattern.
  return rd.isActive && !isStale;
}

function toVM(rd: ResultRD): ResultVM {
  return {
    homeTeam: rd.homeTeam,
    homeScore: rd.homeScore,
    awayTeam: rd.awayTeam,
    awayScore: rd.awayScore,
    teamName: rd.team.name,
    backgroundImage: rd.backgroundImage as ImageMetadata,
    hasDate: Boolean(rd.date),
    date: rd.date,
  };
}

export async function getResultVMs(): Promise<ResultVM[]> {
  // isVisible is resolved and applied here, not left for the UI to filter on —
  // an invisible result should never reach any consumer of this mapper.
  return resultDummy.filter(isVisible).map(toVM);
}
