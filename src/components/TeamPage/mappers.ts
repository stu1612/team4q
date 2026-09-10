// Wired to fetchWithFallback, keyed by team slug. Not rendered until the /herrlaget
// /damlaget /ungdomslaget routes are built in Phase 4.

import { gql } from "graphql-request";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage } from "../../lib/resolveImage";
import { teamLabel } from "../../lib/teamLabel";
import {
  teamPageFallbackBySlug,
} from "./fallback";
import type { TeamPageRD, TeamPageResponseRD, TeamPageVM } from "./types";

const TEAM_PAGE_QUERY = gql`
  query TeamPageBySlug($slug: String!) {
    teamPageModels(where: { teamModel: { slug: $slug } }, first: 1) {
      heading
      subheading
      coverImage {
        url
        width
        height
      }
      teamModel {
        name
        slug
      }
    }
  }
`;

function toVM(rd: TeamPageRD): TeamPageVM {
  if (!rd.teamModel) {
    // Required-with-guard: the page is meaningless without its team relation.
    throw new Error("TeamPageModel is missing its teamModel relation");
  }
  return {
    heading: rd.heading,
    subheading: rd.subheading ?? "",
    teamLabel: teamLabel(rd.teamModel.slug),
    coverImage: resolveImage(rd.coverImage),
  };
}

export async function getTeamPageVM(slug: string): Promise<TeamPageVM> {
  const fallback = teamPageFallbackBySlug[slug];
  if (!fallback) throw new Error(`No TeamPage fallback for slug "${slug}"`);
  const data = await fetchWithFallback<TeamPageResponseRD>(TEAM_PAGE_QUERY, fallback, {
    slug,
  });
  const rd = data.teamPageModels[0] ?? fallback.teamPageModels[0];
  return toVM(rd);
}
