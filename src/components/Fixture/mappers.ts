import { gql } from "graphql-request";
import { CLUB_CONTACT } from "../../constants/contact";
import { fetchOrFail } from "../../lib/hygraphClient";
import { resolveImageOrNull } from "../../lib/resolveImage";
import { teamLabel } from "../../lib/teamLabel";
import type {
  FixtureListVM,
  FixtureRD,
  FixtureResponseRD,
  FixtureVM,
} from "./types";

const FIXTURE_QUERY = gql`
  query FixtureList {
    fixtureModels(orderBy: date_ASC) {
      heading
      date
      startTime
      endTime
      location
      homeTeam
      awayTeam
      isActive
      coverImage {
        url
        width
        height
      }
      teamModel {
        name
        slug
        teamAffiliation
        affiliationUrl
        affiliationLogo {
          url
          width
          height
        }
      }
    }
  }
`;

function toVM(rd: FixtureRD): FixtureVM {
  const team = rd.teamModel;
  const hasAffiliation = Boolean(
    team?.teamAffiliation && team?.affiliationUrl && team?.affiliationLogo,
  );
  return {
    heading: rd.heading,
    date: rd.date,
    startTime: rd.startTime,
    endTime: rd.endTime,
    location: rd.location.trim(),
    homeTeam: rd.homeTeam,
    awayTeam: rd.awayTeam,
    hasTeam: Boolean(team),
    teamLabel: team ? teamLabel(team.slug) : "",
    hasCoverImage: Boolean(rd.coverImage),
    coverImage: resolveImageOrNull(rd.coverImage),
    hasAffiliation,
    affiliationName: hasAffiliation ? (team!.teamAffiliation as string) : "",
    affiliationUrl: hasAffiliation ? (team!.affiliationUrl as string) : "",
    affiliationLogo: hasAffiliation ? resolveImageOrNull(team!.affiliationLogo) : null,
  };
}

export async function getFixtureVMs(): Promise<FixtureListVM> {
  const res = await fetchOrFail<FixtureResponseRD>(FIXTURE_QUERY);
  if (!res.ok) {
    // Time-sensitive content: no fake data. UI shows a full message block with contact
    // details (Phase 4). isActive === "active" is the visibility gate; the past/upcoming
    // split is a separate Phase 4 concern.
    return { ok: false, contact: CLUB_CONTACT };
  }
  const fixtures = res.data.fixtureModels
    .filter((rd) => rd.isActive === "active")
    .map(toVM);
  return { ok: true, fixtures };
}
