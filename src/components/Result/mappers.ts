// The codegen task will swap resultDummy for a real fetchOrFail(query) call via
// src/lib/hygraphClient.ts, checking result.ok before mapping (render nothing on failure,
// per /graphql skill). For now the dummy data stands in directly as the RD.

import { teamLabel } from "../../lib/teamLabel";
import type { ResultRD, ResultVM } from "./types";
import { resultDummy } from "./dummy";

const STALE_AFTER_DAYS = 28;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function isVisible(rd: ResultRD): boolean {
  // publishedAt is a nullable system field; a null value counts as not-stale.
  const isStale =
    rd.publishedAt != null &&
    (Date.now() - new Date(rd.publishedAt).getTime()) / MS_PER_DAY > STALE_AFTER_DAYS;
  // isActive may only suppress early — staleness can still hide an active result,
  // but never the reverse. See /data-mapping skill's compound-visibility pattern.
  return rd.isActive === "active" && !isStale;
}

function toVM(rd: ResultRD): ResultVM {
  return {
    homeTeam: rd.homeTeam,
    homeScore: rd.homeScore,
    awayTeam: rd.awayTeam,
    awayScore: rd.awayScore,
    hasTeam: Boolean(rd.teamModel),
    teamLabel: rd.teamModel ? teamLabel(rd.teamModel.slug) : "",
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
