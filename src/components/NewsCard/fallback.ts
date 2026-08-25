import teamNews from "../../images/fallback/news/team-news.jpeg";
import womenNews from "../../images/fallback/news/women-news.jpg";
import juniorNews from "../../images/fallback/news/junior-news.jpg";
import resultNews from "../../images/fallback/news/result-news.jpg";
import type { NewsCardRD } from "./types";

const author = { name: "T4Q Redaktionen", photo: null };

export const newsCardFallback: NewsCardRD[] = [
  {
    heading: "Herrlaget kör igång försäsongen med full trupp",
    slug: "herrlaget-kor-igang-forsasongen",
    publishedDate: "2026-08-18T09:00:00.000Z",
    excerpt:
      "Inför den kommande säsongen samlas herrlaget för gemensam träning och uppbyggnad inför seriestart.",
    body: "Herrlaget har inlett försäsongen med full trupp på plats. Fokus ligger på fysisk uppbyggnad och lagsamarbete inför den stundande serien, och truppen ser fram emot en säsong med höga ambitioner.",
    author,
    coverImage: teamNews,
    team: { name: "Herrlaget", slug: "mens" },
  },
  {
    heading: "Damlaget stärker truppen inför säsongen",
    slug: "damlaget-starker-truppen",
    publishedDate: "2026-08-15T09:00:00.000Z",
    excerpt:
      "Damlaget har förstärkt truppen och ser fram emot en säsong med höga målsättningar.",
    body: "Med nya spelare på plats och ett tränarteam som fortsätter bygga vidare på fjolårets framgångar går damlaget in i säsongen med förnyad energi och tydliga mål.",
    author,
    coverImage: womenNews,
    team: { name: "Damlaget", slug: "womens" },
  },
  {
    heading: "Ungdomslaget fortsätter klubbens satsning på unga spelare",
    slug: "ungdomslaget-satsning-unga-spelare",
    publishedDate: "2026-08-12T09:00:00.000Z",
    excerpt:
      "Klubbens ungdomssatsning fortsätter att växa, med fler unga spelare som får chansen att utvecklas.",
    body: "T4Q:s ungdomslag fortsätter att vara en viktig del av klubbens långsiktiga arbete. Genom regelbunden träning och matchning får unga spelare möjlighet att utvecklas i sin egen takt.",
    author,
    coverImage: juniorNews,
    team: { name: "Ungdomslaget", slug: "juniors" },
  },
  {
    heading: "Se höjdpunkterna från senaste helgens matcher",
    slug: "hojdpunkter-senaste-helgens-matcher",
    publishedDate: "2026-08-08T09:00:00.000Z",
    excerpt:
      "En händelserik helg med matcher för samtliga lag – här är en sammanfattning.",
    body: "Helgen bjöd på matcher för klubbens lag, med bra insatser genom hela truppen. Håll utkik efter kommande matcher i kalendern och kom gärna och heja fram laget på plats.",
    author,
    coverImage: resultNews,
    team: null,
  },
];
