// Demo data for FixtureModel, served only when CONTENT_SOURCE is "demo" (see hygraphClient).
// Not a failure fallback: fetchOrFail still never fakes data when Hygraph fails. RD-shaped,
// date_ASC like the live query. The club and every opponent are fictional; dates are
// relative to render time so the schedule never runs dry.

import { demoDate } from "../../lib/demoDates";
import type { FixtureRD, FixtureResponseRD } from "./types";

const CLUB = "Sundet Basket";

const team = (name: string, slug: string) => ({
  name,
  slug,
  teamAffiliation: null,
  affiliationUrl: null,
  affiliationLogo: null,
});
const HERR = team("Herr", "herrlaget");
const DAM = team("Dam", "damlaget");
const UNGDOM = team("Ungdom", "ungdomslaget");

// Built per call, so a long-lived server function never serves yesterday's dates.
const fixtures = (): FixtureRD[] => [
  {
    heading: "Basketettan Herr",
    date: demoDate(3),
    startTime: "18:00",
    endTime: "20:00",
    location: "Sundshallen, Helsingborg",
    homeTeam: CLUB,
    awayTeam: "Västerhamn Basket",
    isActive: "active",
    teamModel: HERR,
  },
  {
    heading: "Division 1 Dam",
    date: demoDate(5),
    startTime: "15:00",
    endTime: "17:00",
    location: "Norrvikshallen, Norrvik",
    homeTeam: "Norrviks BBK",
    awayTeam: CLUB,
    isActive: "active",
    teamModel: DAM,
  },
  {
    heading: "U16 Pojkar",
    date: demoDate(6),
    startTime: "11:00",
    endTime: "12:30",
    location: "Hamnhallen, Helsingborg",
    homeTeam: CLUB,
    awayTeam: "Sjöstads Basket",
    isActive: "active",
    teamModel: UNGDOM,
  },
  {
    heading: "Basketettan Herr",
    date: demoDate(10),
    startTime: "19:00",
    endTime: "21:00",
    location: "Bergvallahallen, Bergvalla",
    homeTeam: "Bergvalla BK",
    awayTeam: CLUB,
    isActive: "active",
    teamModel: HERR,
  },
  {
    heading: "Division 1 Dam",
    date: demoDate(12),
    startTime: "16:00",
    endTime: "18:00",
    location: "Sundshallen, Helsingborg",
    homeTeam: CLUB,
    awayTeam: "Ängsby Basket",
    isActive: "active",
    teamModel: DAM,
  },
  {
    heading: "U16 Pojkar",
    date: demoDate(13),
    startTime: "10:00",
    endTime: "11:30",
    location: "Västerhamns sporthall, Västerhamn",
    homeTeam: "Västerhamn Basket",
    awayTeam: CLUB,
    isActive: "active",
    teamModel: UNGDOM,
  },
  {
    heading: "Basketettan Herr",
    date: demoDate(17),
    startTime: "18:00",
    endTime: "20:00",
    location: "Sundshallen, Helsingborg",
    homeTeam: CLUB,
    awayTeam: "Norrviks BBK",
    isActive: "active",
    teamModel: HERR,
  },
];

/** Stands in for FixtureList (all teams) or FixtureListByTeam (one slug). */
export function fixtureDemo(slug?: string): FixtureResponseRD {
  return {
    fixtureModels: slug ? fixtures().filter((f) => f.teamModel?.slug === slug) : fixtures(),
  };
}
