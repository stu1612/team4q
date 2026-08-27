// Dev-only stand-in data — NOT a runtime fallback (FixtureModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before Hygraph is wired in Phase 2. Delete once
// hygraphClient.ts + real queries replace it.

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import type { FixtureRD } from "./types";

export const fixtureDummy: FixtureRD[] = [
  {
    heading: "Herrlaget möter Lund Basket",
    date: "2026-09-05",
    startTime: "19:00",
    endTime: "21:00",
    location: "Idrottshallen, Helsingborg",
    homeTeam: "T4Q Helsingborg",
    awayTeam: "Lund Basket",
    team: { name: "Herrlaget", slug: "mens" },
    coverImage: mensCover,
    affiliations: [{ label: "Skåneserien" }],
  },
  {
    heading: "Damlaget på bortaplan mot Malmö Basket",
    date: "2026-09-08",
    startTime: "18:00",
    endTime: "20:00",
    location: "Baltiska Hallen, Malmö",
    homeTeam: "Malmö Basket",
    awayTeam: "T4Q Helsingborg",
    team: { name: "Damlaget", slug: "womens" },
    coverImage: null,
    affiliations: [],
  },
  {
    heading: "Ungdomslaget möter Kristianstad Basket",
    date: "2026-09-12",
    startTime: "17:00",
    endTime: "18:30",
    location: "Idrottshallen, Helsingborg",
    homeTeam: "T4Q Helsingborg",
    awayTeam: "Kristianstad Basket",
    team: { name: "Ungdomslaget", slug: "juniors" },
    coverImage: null,
    affiliations: [{ label: "Ungdomsserien" }],
  },
];
