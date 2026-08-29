// The codegen task will swap the fallback lookup for a real fetchWithFallback(query,
// fallbackForSlug, { slug }) call via src/lib/hygraphClient.ts. For now the fallback data
// stands in directly as the RD. Not yet wired to a page — the /mens /womens /juniors
// routes are built in Phase 4.

import { teamLabel } from "../../lib/teamLabel";
import {
  teamPageFallbackJuniors,
  teamPageFallbackMens,
  teamPageFallbackWomens,
} from "./fallback";
import type { TeamPageRD, TeamPageVM } from "./types";

const FALLBACK_BY_SLUG: Record<string, TeamPageRD> = {
  herrlaget: teamPageFallbackMens,
  damlaget: teamPageFallbackWomens,
  ungdomslaget: teamPageFallbackJuniors,
};

function toVM(rd: TeamPageRD): TeamPageVM {
  if (!rd.teamModel) {
    // Required-with-guard: the page is meaningless without its team relation.
    throw new Error("TeamPageModel is missing its teamModel relation");
  }
  return {
    heading: rd.heading,
    subheading: rd.subheading ?? "",
    teamLabel: teamLabel(rd.teamModel.slug),
    coverImage: rd.coverImage as ImageMetadata,
  };
}

export async function getTeamPageVM(slug: string): Promise<TeamPageVM> {
  const rd = FALLBACK_BY_SLUG[slug];
  if (!rd) throw new Error(`No TeamPage data for slug "${slug}"`);
  return toVM(rd);
}
