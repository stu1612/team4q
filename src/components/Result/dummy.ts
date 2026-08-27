// Dev-only stand-in data — NOT a runtime fallback (ResultModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before Hygraph is wired in Phase 2. Delete once
// hygraphClient.ts + real queries replace it.
//
// backgroundImage reuses the three preset team-branded cover assets, per
// fallback-reference.md ("one of three preset branded assets, not a fresh upload").

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import womensCover from "../../images/fallback/teams/womens-cover.jpg";
import juniorCover from "../../images/fallback/teams/junior-cover.jpg";
import type { ResultRD } from "./types";

export const resultDummy: ResultRD[] = [
  {
    homeTeam: "T4Q Helsingborg",
    homeScore: 78,
    awayTeam: "Lund Basket",
    awayScore: 71,
    team: { name: "Herrlaget", slug: "mens" },
    backgroundImage: mensCover,
    isActive: true,
    date: "2026-08-22",
    publishedAt: "2026-08-22T21:00:00.000Z",
  },
  {
    homeTeam: "Malmö Basket",
    homeScore: 54,
    awayTeam: "T4Q Helsingborg",
    awayScore: 61,
    team: { name: "Damlaget", slug: "womens" },
    backgroundImage: womensCover,
    isActive: true,
    date: null,
    publishedAt: "2026-08-20T19:30:00.000Z",
  },
  {
    homeTeam: "T4Q Helsingborg",
    homeScore: 45,
    awayTeam: "Kristianstad Basket",
    awayScore: 50,
    team: { name: "Ungdomslaget", slug: "juniors" },
    backgroundImage: juniorCover,
    isActive: true,
    date: "2026-07-10",
    publishedAt: "2026-07-10T18:00:00.000Z",
  },
];
