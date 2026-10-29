// Demo data for ResultModel, served only when CONTENT_SOURCE is "demo" (see hygraphClient).
// Not a failure fallback: on a real Hygraph failure the banner still renders nothing.
// publishedAt_DESC like the live query, and every publishedAt sits inside the 28-day
// staleness window because it is relative to render time. All teams are fictional.

import resultImage from "../../images/fallback/news/result-news.jpg";
import mensImage from "../../images/fallback/teams/mens-cover.jpg";
import womensImage from "../../images/fallback/teams/womens-cover.jpg";
import juniorImage from "../../images/fallback/teams/junior-cover.jpg";
import { demoDate, demoTimestamp } from "../../lib/demoDates";
import type { ResultRD, ResultResponseRD } from "./types";

const CLUB = "Sundet Basket";

// Built per call, so publishedAt never ages out of the staleness window.
const results = (): ResultRD[] => [
  {
    homeTeam: CLUB,
    homeScore: 84,
    awayTeam: "Bergvalla BK",
    awayScore: 77,
    date: demoDate(-2),
    isActive: "active",
    publishedAt: demoTimestamp(2),
    teamModel: { name: "Herr", slug: "herrlaget" },
    backgroundImage: resultImage,
  },
  {
    homeTeam: "Ängsby Basket",
    homeScore: 61,
    awayTeam: CLUB,
    awayScore: 58,
    date: demoDate(-3),
    isActive: "active",
    publishedAt: demoTimestamp(3),
    teamModel: { name: "Dam", slug: "damlaget" },
    backgroundImage: womensImage,
  },
  {
    homeTeam: CLUB,
    homeScore: 52,
    awayTeam: "Norrviks BBK",
    awayScore: 47,
    date: demoDate(-4),
    isActive: "active",
    publishedAt: demoTimestamp(4),
    teamModel: { name: "Ungdom", slug: "ungdomslaget" },
    backgroundImage: juniorImage,
  },
  {
    homeTeam: "Sjöstads Basket",
    homeScore: 70,
    awayTeam: CLUB,
    awayScore: 79,
    date: demoDate(-9),
    isActive: "active",
    publishedAt: demoTimestamp(9),
    teamModel: { name: "Herr", slug: "herrlaget" },
    backgroundImage: mensImage,
  },
];

/** Stands in for ResultList (all teams) or ResultListByTeam (one slug). */
export function resultDemo(slug?: string): ResultResponseRD {
  const rows = results();
  return { resultModels: slug ? rows.filter((r) => r.teamModel?.slug === slug) : rows };
}
