// Dev-only stand-in data — NOT a runtime fallback (FixtureModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before real Hygraph queries land in the codegen task.
// Delete once hygraphClient.ts + real queries replace it.
//
// Mirrors the live Hygraph shape as of 2026-08-29: `teamModel` relation carrying the
// affiliation fields (no more repeatable component on the fixture), `isActive` enum.

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
// Stand-in affiliation badge for the interim (real content has a dedicated asset).
import affiliationLogo from "../../images/logos/t4q-logo.png";
import type { FixtureRD, FixtureTeamRD } from "./types";

const herr: FixtureTeamRD = {
  name: "Herr",
  slug: "herrlaget",
  teamAffiliation: "Basketettan Herr (Södra)",
  affiliationUrl: "https://www.profixio.com/app/lx/competition/leagueid17392",
  affiliationLogo,
};

const dam: FixtureTeamRD = {
  name: "Dam",
  slug: "damlaget",
  teamAffiliation: "Basketettan Dam (Södra)",
  affiliationUrl: "https://www.profixio.com/app/leagueid14598/teams/1088046",
  affiliationLogo,
};

const ungdom: FixtureTeamRD = {
  name: "Ungdom",
  slug: "ungdomslaget",
  // Partial affiliation — hasAffiliation must be false (needs all three).
  teamAffiliation: "Skånes BDF — Ungdomsserier Pojkar",
  affiliationUrl: null,
  affiliationLogo: null,
};

export const fixtureDummy: FixtureRD[] = [
  {
    heading: "Herrlaget möter Lund Basket",
    date: "2026-09-02",
    startTime: "19:00",
    endTime: "21:00",
    location: "Idrottshallen, Helsingborg",
    homeTeam: "T4Q",
    awayTeam: "Lund Basket",
    isActive: "active",
    teamModel: herr,
    coverImage: mensCover,
  },
  {
    heading: "Damlaget på bortaplan mot Åhus Basket",
    date: "2026-09-20",
    startTime: "16:00",
    endTime: "18:00",
    location: "Åhus Sporthall",
    homeTeam: "Åhus Basket",
    awayTeam: "T4Q",
    isActive: "active",
    teamModel: dam,
    coverImage: null,
  },
  {
    heading: "U17 möter Landskrona Basket",
    date: "2026-09-21",
    startTime: "12:00",
    endTime: "13:00",
    location: "Idrottshallen, Helsingborg",
    homeTeam: "T4Q",
    awayTeam: "Landskrona Basket",
    isActive: "active",
    teamModel: ungdom,
    coverImage: null,
  },
  {
    heading: "Inaktiv testmatch (ska filtreras bort)",
    date: "2026-10-01",
    startTime: "20:00",
    endTime: "22:00",
    location: "Idrottshallen, Helsingborg",
    homeTeam: "T4Q",
    awayTeam: "TBD",
    isActive: "inactive",
    teamModel: herr,
    coverImage: null,
  },
];
