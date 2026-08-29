// RD-shaped fallback for TeamPageModel (fetchWithFallback). Mirrors the live Hygraph
// shape as of 2026-08-29: `teamModel` relation (slug is the "-laget" form the site uses
// for labels). Cover images stay local imports for the interim.

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import womensCover from "../../images/fallback/teams/womens-cover.jpg";
import juniorCover from "../../images/fallback/teams/junior-cover.jpg";
import type { TeamPageRD } from "./types";

export const teamPageFallbackMens: TeamPageRD = {
  heading: "Herrlaget",
  coverImage: mensCover,
  subheading:
    "Herrlaget representerar T4Q i Skånes högsta serier med hjärta och lagkänsla.",
  teamModel: { name: "Herr", slug: "herrlaget" },
};

export const teamPageFallbackWomens: TeamPageRD = {
  heading: "Damlaget",
  coverImage: womensCover,
  subheading:
    "Damlaget kombinerar bredd och spets och fortsätter att utvecklas match för match.",
  teamModel: { name: "Dam", slug: "damlaget" },
};

export const teamPageFallbackJuniors: TeamPageRD = {
  heading: "Ungdomslaget",
  coverImage: juniorCover,
  subheading:
    "Ungdomslaget är grunden för klubbens framtid – här får unga spelare växa.",
  teamModel: { name: "Ungdom", slug: "ungdomslaget" },
};
