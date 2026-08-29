/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** Internal status toggle to render/remove component. */
export type IsActive =
  | 'active'
  | 'inactive';

export type SponsorTier =
  | 'community'
  | 'main'
  | 'partner';

export type TrainingType =
  | 'individual'
  | 'team';

export type FixtureListQueryVariables = Exact<{ [key: string]: never; }>;


export type FixtureListQuery = { fixtureModels: Array<{ heading: string, date: string, startTime: string, endTime: string, location: string, homeTeam: string, awayTeam: string, isActive: IsActive, coverImage: { url: string, width: number | null, height: number | null } | null, teamModel: { name: string, slug: string, teamAffiliation: string | null, affiliationUrl: string | null, affiliationLogo: { url: string, width: number | null, height: number | null } | null } | null }> };

export type HeroContentQueryVariables = Exact<{ [key: string]: never; }>;


export type HeroContentQuery = { heroModels: Array<{ heading: string, subheading: string | null, ctaLabel: string | null, ctaUrl: string | null, coverImage: { url: string, width: number | null, height: number | null } }> };

export type NewsCardListQueryVariables = Exact<{ [key: string]: never; }>;


export type NewsCardListQuery = { newsCardModels: Array<{ heading: string, slug: string, publishedDate: string, excerpt: string, body: { html: string, text: string }, coverImage: { url: string, width: number | null, height: number | null } | null, teamModel: { name: string, slug: string } | null, clubMemberModel: { name: string | null, role: string | null, profileImage: { url: string, width: number | null, height: number | null } | null } | null }> };

export type ResultListQueryVariables = Exact<{ [key: string]: never; }>;


export type ResultListQuery = { resultModels: Array<{ homeTeam: string, homeScore: number, awayTeam: string, awayScore: number, date: string | null, isActive: IsActive, publishedAt: string | null, teamModel: { name: string, slug: string } | null, backgroundImage: { url: string, width: number | null, height: number | null } }> };

export type SponsorListQueryVariables = Exact<{ [key: string]: never; }>;


export type SponsorListQuery = { sponsorModels: Array<{ name: string, url: string, tagline: string | null, tier: SponsorTier, isActive: IsActive, logo: { url: string, width: number | null, height: number | null } }> };

export type TeamPageBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type TeamPageBySlugQuery = { teamPageModels: Array<{ heading: string, subheading: string | null, coverImage: { url: string, width: number | null, height: number | null }, teamModel: { name: string, slug: string } | null }> };

export type TrainingListQueryVariables = Exact<{ [key: string]: never; }>;


export type TrainingListQuery = { trainingModels: Array<{ venue: string, date: string, startTime: string, endTime: string, trainingType: TrainingType, isActive: IsActive, information: string | null, teamModel: { name: string, slug: string } | null, clubMemberModels: Array<{ name: string | null, role: string | null, profileImage: { url: string, width: number | null, height: number | null } | null }> }> };
