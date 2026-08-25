import mensCover from "../../images/fallback/teams/mens-cover.jpg";
import womensCover from "../../images/fallback/teams/womens-cover.jpg";
import juniorCover from "../../images/fallback/teams/junior-cover.jpg";
import type { TeamPageRD } from "./types";

export const teamPageFallbackMens: TeamPageRD = {
  heading: "Herrlaget",
  coverImage: mensCover,
  subheading:
    "Herrlaget representerar T4Q i Skånes högsta serier med hjärta och lagkänsla.",
  team: { name: "Herrlaget", slug: "mens" },
};

export const teamPageFallbackWomens: TeamPageRD = {
  heading: "Damlaget",
  coverImage: womensCover,
  subheading:
    "Damlaget kombinerar bredd och spets och fortsätter att utvecklas match för match.",
  team: { name: "Damlaget", slug: "womens" },
};

export const teamPageFallbackJuniors: TeamPageRD = {
  heading: "Ungdomslaget",
  coverImage: juniorCover,
  subheading:
    "Ungdomslaget är grunden för klubbens framtid – här får unga spelare växa.",
  team: { name: "Ungdomslaget", slug: "juniors" },
};
