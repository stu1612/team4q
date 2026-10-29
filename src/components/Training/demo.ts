// Demo data for TrainingModel, served only when CONTENT_SOURCE is "demo" (see hygraphClient).
// Not a failure fallback: on a real Hygraph failure the UI still shows its message block.
// date_ASC like the live query. Coaches, halls and contact details are fictional; email
// addresses use the reserved .example domain and phone numbers PTS's range for fiction
// (070-174 06 05–99), so no real inbox or phone can be reached.

import { demoDate } from "../../lib/demoDates";
import type { CoachRD, TrainingRD, TrainingResponseRD } from "./types";

const coach = (name: string, role: string, email: string, contactNumber: string): CoachRD => ({
  name,
  role,
  email,
  contactNumber,
  profileImage: null,
});

const HERR_COACH = coach("Johan Ekdahl", "Huvudtränare herr", "johan@sundetbasket.example", "070-174 06 11");
const DAM_COACH = coach("Sara Lindvall", "Huvudtränare dam", "sara@sundetbasket.example", "070-174 06 22");
const UNGDOM_COACH = coach("Ali Haddad", "Ungdomstränare", "ali@sundetbasket.example", "070-174 06 33");
const UNGDOM_ASSISTANT = coach("Emma Berg", "Assisterande tränare", "emma@sundetbasket.example", "");

const HERR = { name: "Herr", slug: "herrlaget" };
const DAM = { name: "Dam", slug: "damlaget" };
const UNGDOM = { name: "Ungdom", slug: "ungdomslaget" };

const session = (
  days: number,
  startTime: string,
  endTime: string,
  venue: string,
  teamModel: TrainingRD["teamModel"],
  clubMemberModels: CoachRD[],
  information: string | null = null,
): TrainingRD => ({
  venue,
  date: demoDate(days),
  startTime,
  endTime,
  trainingType: "team",
  isActive: "active",
  information,
  teamModel,
  clubMemberModels,
});

// Built per call, so a long-lived server function never serves yesterday's dates.
const sessions = (): TrainingRD[] => [
  session(1, "17:00", "18:30", "Hamnhallen", UNGDOM, [UNGDOM_COACH, UNGDOM_ASSISTANT], "Nya spelare är välkomna att prova på – ta med inneskor och vattenflaska."),
  session(1, "19:30", "21:00", "Sundshallen", HERR, [HERR_COACH]),
  session(2, "18:30", "20:00", "Sundshallen", DAM, [DAM_COACH]),
  session(4, "17:00", "18:30", "Hamnhallen", UNGDOM, [UNGDOM_COACH, UNGDOM_ASSISTANT]),
  session(4, "19:30", "21:00", "Sundshallen", HERR, [HERR_COACH]),
  session(5, "18:30", "20:00", "Sundshallen", DAM, [DAM_COACH], "Fokus på försvar och omställningar inför helgens match."),
];

/** Stands in for TrainingList (all teams) or TrainingListByTeam (one slug). */
export function trainingDemo(slug?: string): TrainingResponseRD {
  const rows = sessions();
  return { trainingModels: slug ? rows.filter((s) => s.teamModel?.slug === slug) : rows };
}
