// RD-shaped fallback for TeamPageModel (fetchWithFallback), one entry per team slug.
// Same shape as the TeamPageBySlug query result. Cover images stay local imports.

import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import womensCover from "../../images/fallback/teams/womens-cover.jpg";
import juniorCover from "../../images/fallback/teams/junior-cover.jpg";
import type { TeamPageResponseRD } from "./types";

export const teamPageFallbackBySlug: Record<string, TeamPageResponseRD> = {
  herrlaget: {
    teamPageModels: [
      {
        heading: "Herrlaget",
        subheading:
          "Herrlaget representerar T4Q i Skånes högsta serier med hjärta och lagkänsla.",
        coverImage: mensCover,
        teamModel: { name: "Herr", slug: "herrlaget" },
      },
    ],
  },
  damlaget: {
    teamPageModels: [
      {
        heading: "Damlaget",
        subheading:
          "Damlaget kombinerar bredd och spets och fortsätter att utvecklas match för match.",
        coverImage: womensCover,
        teamModel: { name: "Dam", slug: "damlaget" },
      },
    ],
  },
  ungdomslaget: {
    teamPageModels: [
      {
        heading: "Ungdomslaget",
        subheading:
          "Ungdomslaget är grunden för klubbens framtid – här får unga spelare växa.",
        coverImage: juniorCover,
        teamModel: { name: "Ungdom", slug: "ungdomslaget" },
      },
    ],
  },
};
