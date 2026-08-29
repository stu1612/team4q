// RD-shaped fallback for NewsCardModel (fetchWithFallback). Mirrors the live Hygraph
// response shape as of 2026-08-29: `teamModel` relation, `clubMemberModel` author,
// `body` as a RichText { html, text } object. Cover images stay local imports for the
// interim (see fallback-reference.md § Asset); author photo is left null to exercise the
// hasAuthorPhoto=false path.

import teamNews from "../../images/fallback/news/team-news.jpeg";
import womenNews from "../../images/fallback/news/women-news.jpg";
import juniorNews from "../../images/fallback/news/junior-news.jpg";
import resultNews from "../../images/fallback/news/result-news.jpg";
import type { AuthorRD, NewsCardRD } from "./types";

const author: AuthorRD = {
  name: "Team Fourth Quarter",
  role: null,
  profileImage: null,
};

const p = (text: string) => ({ html: `<p>${text}</p>`, text });

export const newsCardFallback: NewsCardRD[] = [
  {
    heading: "Herrlaget kör igång försäsongen med full trupp",
    slug: "herrlaget-koer-igang-foersaesongen-med-full-trupp",
    publishedDate: "2026-08-03",
    excerpt:
      "Inför den kommande säsongen samlas herrlaget för gemensam träning och uppbyggnad inför seriestart.",
    body: p(
      "Herrlaget har inlett försäsongen med full trupp på plats. Fokus ligger på fysisk uppbyggnad och lagsamarbete inför den stundande serien, och truppen ser fram emot en säsong med höga ambitioner.",
    ),
    coverImage: teamNews,
    teamModel: { name: "Herr", slug: "herrlaget" },
    clubMemberModel: author,
  },
  {
    heading: "Damlaget stärker truppen inför säsongen",
    slug: "damlaget-staerker-truppen-infoer-saesongen",
    publishedDate: "2026-07-17",
    excerpt:
      "Damlaget har förstärkt truppen och ser fram emot en säsong med höga målsättningar.",
    body: p(
      "Med nya spelare på plats och ett tränarteam som fortsätter bygga vidare på fjolårets framgångar går damlaget in i säsongen med förnyad energi och tydliga mål.",
    ),
    coverImage: womenNews,
    teamModel: { name: "Dam", slug: "damlaget" },
    clubMemberModel: author,
  },
  {
    heading: "Ungdomslaget fortsätter klubbens satsning på unga spelare",
    slug: "ungdomslaget-fortsaetter-klubbens-satsning-pa-unga-spelare",
    publishedDate: "2026-08-10",
    excerpt:
      "Klubbens ungdomssatsning fortsätter att växa, med fler unga spelare som får chansen att utvecklas.",
    body: p(
      "T4Q:s ungdomslag fortsätter att vara en viktig del av klubbens långsiktiga arbete. Genom regelbunden träning och matchning får unga spelare möjlighet att utvecklas i sin egen takt.",
    ),
    coverImage: juniorNews,
    teamModel: { name: "Ungdom", slug: "ungdomslaget" },
    clubMemberModel: author,
  },
  {
    heading: "Se höjdpunkterna från senaste helgens matcher",
    slug: "se-hoejdpunkterna-fran-senaste-helgens-matcher",
    publishedDate: "2026-08-18",
    excerpt:
      "En händelserik helg med matcher för samtliga lag – här är en sammanfattning.",
    body: p(
      "Helgen bjöd på matcher för klubbens lag, med bra insatser genom hela truppen. Håll utkik efter kommande matcher i kalendern och kom gärna och heja fram laget på plats.",
    ),
    coverImage: resultNews,
    teamModel: { name: "Herr", slug: "herrlaget" },
    clubMemberModel: author,
  },
];
