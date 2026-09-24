// Static "about the team" copy for the team pages — hand-written in code, not Hygraph (a
// developer decision: this is low-frequency editorial copy the club updates through the
// developer, the same reasoning as src/constants/seo.ts). Keyed by team slug; a team with
// no entry simply renders no intro section (TeamIntro/index.astro).
//
// TODO(club): the copy below is a first draft written from what the site already knows
// (league, home venue, founding year). Have the club review the wording before launch.

import type { ImageMetadata } from "astro";
import mensGame from "../images/fallback/mission/team4q_mission_men.jpg";
import mensAction from "../images/fallback/teams/mens-cover.jpg";
import womensTeam from "../images/fallback/mission/team4q_mission_women.jpg";
import womensAction from "../images/fallback/news/women-news.jpg";
import youthTeam from "../images/fallback/news/team-news.jpg";
import youthYoungest from "../images/fallback/mission/team4q_mission_jnr.jpg";
import youthMiddle from "../images/fallback/news/junior-news.jpg";
import youthOldest from "../images/fallback/teams/junior-cover.jpg";

export interface TeamFact {
  label: string;
  value: string;
}

export interface TeamIntroImage {
  src: ImageMetadata;
  alt: string;
  /** CSS object-position for the crop (primary is 4:3, secondary square). Default centre. */
  position?: string;
}

/** One step of the youth pathway — an age band with its own photo. */
export interface TeamStage {
  /** Short age band for the pill label, e.g. "ca 7–10 år". */
  ageLabel: string;
  title: string;
  text: string;
  image: TeamIntroImage;
}

export interface TeamIntroContent {
  /** "youth" softens the visual treatment (rounded photos, tilted cards, pill labels) for a
   *  younger audience without going childish. Omit for the senior teams. */
  tone?: "youth";
  kicker: string;
  heading: string;
  paragraphs: string[];
  /** Short at-a-glance facts, rendered as a stat row. Keep to 3. */
  facts: TeamFact[];
  /** Optional age-group pathway, rendered as photo cards under the intro. */
  stages?: { heading: string; items: TeamStage[] };
  /** Optional practical checklist (e.g. for parents), rendered beside the call to action. */
  goodToKnow?: { heading: string; items: string[] };
  /** Recruitment call to action under the intro. */
  cta: { heading: string; text: string };
  /** `secondary` is optional — a team whose photos go to `stages` can use just one here. */
  images: { primary: TeamIntroImage; secondary?: TeamIntroImage };
}

export const TEAM_INTRO: Readonly<Record<string, TeamIntroContent>> = {
  herrlaget: {
    kicker: "Om herrlaget",
    heading: "Lagkänsla först. Resultaten följer.",
    paragraphs: [
      "Herrlaget är T4Q:s representationslag och spelar i Basketettan Herr (Södra), där vi varje helg möter några av de bästa lagen i södra Sverige.",
      "Truppen är en blandning av rutinerade spelare och unga talanger som tar steget upp. Gemensamt för alla är viljan att utvecklas – som spelare, som lag och som förening.",
      "Hemmamatcherna spelas i Idrottshallen i Helsingborg, och läktaren är öppen för alla. Kom och se en match – stämningen gör skillnad på planen.",
    ],
    facts: [
      { label: "Serie", value: "Basketettan Södra" },
      { label: "Hemmaplan", value: "Idrottshallen" },
      { label: "Föreningen sedan", value: "2016" },
    ],
    cta: {
      heading: "Vill du spela i herrlaget?",
      text: "Vi välkomnar alltid spelare som vill utvecklas. Kontakta tränaren för ett pass under Träningstider, eller mejla oss så berättar vi mer.",
    },
    images: {
      primary: { src: mensGame, alt: "Herrlaget i match i Helsingborg, en spelare går upp för ett avslut under korgen" },
      secondary: { src: mensAction, alt: "Spelare hoppar mot korgen i en tät match", position: "45% 30%" },
    },
  },

  damlaget: {
    kicker: "Om damlaget",
    heading: "Bredd, spets och gemenskap.",
    paragraphs: [
      "Damlaget spelar i Basketettan Dam (Södra) och möter varje säsong några av de starkaste lagen i södra Sverige. Laget utvecklas match för match – både på planen och som grupp.",
      "Här finns plats för rutinerade spelare och för dig som vill ta nästa steg. Vi bygger ett lag där alla bidrar, och där träningarna är lika viktiga som matcherna.",
      "Hemmamatcherna spelas i Idrottshallen i Helsingborg. Kom och heja fram laget – varje röst på läktaren hörs.",
    ],
    facts: [
      { label: "Serie", value: "Basketettan Södra" },
      { label: "Hemmaplan", value: "Idrottshallen" },
      { label: "Föreningen sedan", value: "2016" },
    ],
    cta: {
      heading: "Vill du spela i damlaget?",
      text: "Oavsett om du har spelat länge eller vill komma tillbaka till basketen – kontakta tränaren för ett pass under Träningstider, eller mejla oss så berättar vi mer.",
    },
    images: {
      primary: { src: womensTeam, alt: "Damlaget jublar tillsammans på planen efter en seger", position: "50% 62%" },
      secondary: { src: womensAction, alt: "Spelare för upp bollen i en damseriematch", position: "62% 25%" },
    },
  },

  // Age bands are a first guess for the club to confirm (TODO(club)).
  ungdomslaget: {
    tone: "youth",
    kicker: "Om ungdomsverksamheten",
    heading: "Här börjar resan.",
    paragraphs: [
      "Ungdomsverksamheten är grunden för hela T4Q. Här lär sig barn och ungdomar spelet från början – teknik, spelförståelse och att vara en bra lagkamrat.",
      "Vi tränar i Idrottshallen i Helsingborg och spelar i Skånes BDF:s ungdomsserier. Fokus ligger på glädje och utveckling – resultaten kommer när grunden sitter.",
      "Föräldrar är alltid välkomna att titta på träningarna. Det är ett bra sätt att lära känna tränarna, laget och föreningen.",
    ],
    facts: [
      { label: "Serie", value: "Skånes BDF" },
      { label: "Träning", value: "Idrottshallen" },
      { label: "Föreningen sedan", value: "2016" },
    ],
    stages: {
      heading: "Från första studsen till juniorlaget",
      items: [
        {
          ageLabel: "ca 7–10 år",
          title: "Första studsen",
          text: "Lek, rörelse och bollkänsla. Här handlar det om att ha kul med bollen och lära sig grunderna i sin egen takt.",
          image: { src: youthYoungest, alt: "Glada barn i T4Q-tröjor springer med en basketboll", position: "50% 35%" },
        },
        {
          ageLabel: "ca 11–14 år",
          title: "Lära spelet",
          text: "Teknik, samarbete och de första seriematcherna. Spelarna lär sig ta ansvar på planen – och för varandra.",
          image: { src: youthMiddle, alt: "Fyra unga T4Q-spelare i klubbtröjor med en basketboll", position: "50% 30%" },
        },
        {
          ageLabel: "ca 15–19 år",
          title: "Nästa steg",
          text: "Mer träning, högre tempo och tydliga mål. För den som vill kan vägen leda vidare till klubbens seniorlag.",
          image: { src: youthOldest, alt: "Äldre ungdomar spelar match, en spelare går upp för ett avslut vid korgen", position: "50% 30%" },
        },
      ],
    },
    goodToKnow: {
      heading: "Bra att veta inför första träningen",
      items: [
        "Inomhusskor som inte märker på golvet",
        "Vattenflaska och bekväma träningskläder",
        "Kom gärna tio minuter innan passet börjar",
        "Hör av dig till tränaren innan – kontaktuppgifterna finns under Träningstider",
      ],
    },
    cta: {
      heading: "Vill ditt barn börja spela?",
      text: "Alla är välkomna att prova på en träning. Kontakta tränaren för passet under Träningstider, eller mejla oss så hjälper vi er vidare.",
    },
    images: {
      primary: { src: youthTeam, alt: "Ett av T4Q:s ungdomslag tillsammans med sina tränare i hallen", position: "50% 40%" },
    },
  },
};
