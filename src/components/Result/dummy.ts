// Dev-only stand-in data — NOT a runtime fallback (ResultModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before real Hygraph queries land in the codegen task.
// Delete once hygraphClient.ts + real queries replace it.
//
// Mirrors the live Hygraph shape as of 2026-08-29: `teamModel` relation, `isActive` enum,
// nullable `publishedAt`. backgroundImage reuses the three preset team-branded cover
// assets, per fallback-reference.md. The set below deliberately exercises the mapper's
// isVisible filter: one inactive, one stale (publishedAt > 28 days old).

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import womensCover from "../../images/fallback/teams/womens-cover.jpg";
import juniorCover from "../../images/fallback/teams/junior-cover.jpg";
import type { ResultRD } from "./types";

export const resultDummy: ResultRD[] = [
  {
    homeTeam: "T4Q",
    homeScore: 78,
    awayTeam: "EOS",
    awayScore: 71,
    teamModel: { name: "Herr", slug: "herrlaget" },
    backgroundImage: mensCover,
    isActive: "active",
    date: "2026-08-26",
    publishedAt: "2026-08-27T20:11:09.390Z",
  },
  {
    homeTeam: "Malmö Basket",
    homeScore: 64,
    awayTeam: "T4Q",
    awayScore: 73,
    teamModel: { name: "Dam", slug: "damlaget" },
    backgroundImage: womensCover,
    isActive: "active",
    date: null,
    publishedAt: "2026-08-27T20:14:41.723Z",
  },
  {
    // Active but stale — publishedAt is > 28 days old, so isVisible must be false.
    homeTeam: "T4Q",
    homeScore: 50,
    awayTeam: "Kristianstad Basket",
    awayScore: 45,
    teamModel: { name: "Ungdom", slug: "ungdomslaget" },
    backgroundImage: juniorCover,
    isActive: "active",
    date: "2026-07-10",
    publishedAt: "2026-07-10T18:00:00.000Z",
  },
  {
    // Inactive — isVisible must be false regardless of freshness.
    homeTeam: "T4Q",
    homeScore: 60,
    awayTeam: "Helsingborg BBK",
    awayScore: 60,
    teamModel: { name: "Herr", slug: "herrlaget" },
    backgroundImage: mensCover,
    isActive: "inactive",
    date: "2026-08-25",
    publishedAt: "2026-08-25T19:00:00.000Z",
  },
];
