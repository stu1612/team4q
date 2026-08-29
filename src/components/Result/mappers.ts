import { gql } from "graphql-request";
import { fetchOrFail } from "../../lib/hygraphClient";
import { resolveImage } from "../../lib/resolveImage";
import { teamLabel } from "../../lib/teamLabel";
import type { ResultRD, ResultResponseRD, ResultVM } from "./types";

const STALE_AFTER_DAYS = 28;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const RESULT_QUERY = gql`
  query ResultList {
    resultModels(orderBy: publishedAt_DESC) {
      homeTeam
      homeScore
      awayTeam
      awayScore
      date
      isActive
      publishedAt
      teamModel {
        name
        slug
      }
      backgroundImage {
        url
        width
        height
      }
    }
  }
`;

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
    backgroundImage: resolveImage(rd.backgroundImage),
    hasDate: Boolean(rd.date),
    date: rd.date,
  };
}

export async function getResultVMs(): Promise<ResultVM[]> {
  const res = await fetchOrFail<ResultResponseRD>(RESULT_QUERY);
  // ResultModel is a cosmetic banner — on failure render nothing, no message (per /graphql).
  if (!res.ok) return [];
  return res.data.resultModels.filter(isVisible).map(toVM);
}
