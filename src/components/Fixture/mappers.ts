import { gql } from "graphql-request";
import { CLUB_CONTACT } from "../../constants/contact";
import { fetchOrFail } from "../../lib/hygraphClient";
import { resolveImageOrNull } from "../../lib/resolveImage";
import { formatDatePartsSv, formatDateWeekdaySv, hasPassedStockholm } from "../../lib/formatDate";
import { teamLabel, teamTagShort } from "../../lib/teamLabel";
import type {
  FixtureListVM,
  FixtureRD,
  FixtureResponseRD,
  FixtureVM,
} from "./types";

const FIXTURE_FIELDS = `
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
`;

const FIXTURE_QUERY = gql`
  query FixtureList {
    fixtureModels(orderBy: date_ASC) {
      ${FIXTURE_FIELDS}
    }
  }
`;

// Team-scoped variant for team pages — same fields, filtered server-side. Mirrors the
// where: { teamModel: { slug: $slug } } precedent from TeamPage/mappers.ts.
const FIXTURE_BY_TEAM_QUERY = gql`
  query FixtureListByTeam($slug: String!) {
    fixtureModels(where: { teamModel: { slug: $slug } }, orderBy: date_ASC) {
      ${FIXTURE_FIELDS}
    }
  }
`;

function toVM(rd: FixtureRD): FixtureVM {
  const team = rd.teamModel;
  const hasAffiliation = Boolean(
    team?.teamAffiliation && team?.affiliationUrl && team?.affiliationLogo,
  );
  const dateParts = formatDatePartsSv(rd.date);
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
    tagLabel: team ? teamTagShort(team.slug) : "",
    // A match counts as upcoming until its end time passes, so one in progress stays visible.
    isUpcoming: !hasPassedStockholm(rd.date, rd.endTime),
    dateLabel: formatDateWeekdaySv(rd.date),
    weekdayShort: dateParts.weekday,
    dayNumber: dateParts.day,
    monthShort: dateParts.month,
    timeLabel: rd.startTime,
    isoDateTime: `${rd.date}T${rd.startTime}`,
    hasCoverImage: Boolean(rd.coverImage),
    coverImage: resolveImageOrNull(rd.coverImage),
    hasAffiliation,
    affiliationName: hasAffiliation ? (team!.teamAffiliation as string) : "",
    affiliationUrl: hasAffiliation ? (team!.affiliationUrl as string) : "",
    affiliationLogo: hasAffiliation ? resolveImageOrNull(team!.affiliationLogo) : null,
  };
}

// isActive === "active" is the visibility gate; each VM carries its own `isUpcoming` so a
// consumer decides what to do with past fixtures (team pages).
function mapActiveFixtures(rows: FixtureRD[]): FixtureVM[] {
  return rows.filter((rd) => rd.isActive === "active").map(toVM);
}

export async function getFixtureVMs(): Promise<FixtureListVM> {
  const res = await fetchOrFail<FixtureResponseRD>(FIXTURE_QUERY);
  // Time-sensitive content: no fake data on failure. UI shows a full message block with
  // contact details.
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  return { ok: true, fixtures: mapActiveFixtures(res.data.fixtureModels) };
}

/** The next `limit` fixtures still to be played, soonest first (query is date_ASC; the
 *  time sort breaks same-day ties). */
export async function getUpcomingFixtureVMs(limit: number): Promise<FixtureListVM> {
  const list = await getFixtureVMs();
  if (!list.ok) return list;
  const fixtures = list.fixtures
    .filter((fixture) => fixture.isUpcoming)
    .sort((a, b) => a.isoDateTime.localeCompare(b.isoDateTime))
    .slice(0, limit);
  return { ok: true, fixtures };
}

/** Every active fixture for one team — both past and upcoming; each VM's own `isUpcoming`
 *  flag lets the caller group/style them (used by the team-page fixture list). */
export async function getFixtureVMsByTeam(slug: string): Promise<FixtureListVM> {
  const res = await fetchOrFail<FixtureResponseRD>(FIXTURE_BY_TEAM_QUERY, { slug });
  if (!res.ok) return { ok: false, contact: CLUB_CONTACT };
  return { ok: true, fixtures: mapActiveFixtures(res.data.fixtureModels) };
}
