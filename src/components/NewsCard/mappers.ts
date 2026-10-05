import { gql } from "graphql-request";
import placeholderCoverImage from "../../images/fallback/news/result-news.jpg";
import { formatDateSv } from "../../lib/formatDate";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage, resolveImageOrNull } from "../../lib/resolveImage";
import { teamLabel, teamTagShort } from "../../lib/teamLabel";
import { newsCardFallback } from "./fallback";
import type { NewsArticleVM, NewsCardRD, NewsCardResponseRD, NewsCardVM } from "./types";

// A real GraphQL fragment (not a plain string) so graphql-codegen can resolve it — the
// operations spread it and append it after the operation body. Same pattern as Fixture.
const NEWS_FIELDS = gql`
  fragment NewsCardFields on NewsCardModel {
    heading
    slug
    publishedDate
    excerpt
    body {
      html
      text
    }
    coverImage {
      url
      width
      height
    }
    teamModel {
      name
      slug
    }
    clubMemberModel {
      name
      role
      profileImage {
        url
        width
        height
      }
    }
  }
`;

const NEWS_QUERY = gql`
  query NewsCardList {
    newsCardModels(orderBy: publishedDate_DESC) {
      ...NewsCardFields
    }
  }
  ${NEWS_FIELDS}
`;

// Article route: one article by slug. A filtered list with `first: 1` rather than the
// singular field, so it doesn't depend on `slug` being marked unique in the schema.
const NEWS_BY_SLUG_QUERY = gql`
  query NewsCardBySlug($slug: String!) {
    newsCardModels(where: { slug: $slug }, first: 1) {
      ...NewsCardFields
    }
  }
  ${NEWS_FIELDS}
`;

function toVM(rd: NewsCardRD): NewsCardVM {
  const author = rd.clubMemberModel;
  const hasAuthor = Boolean(author && author.name);
  const hasTeam = Boolean(rd.teamModel);
  return {
    heading: rd.heading,
    slug: rd.slug,
    publishedDate: rd.publishedDate,
    excerpt: rd.excerpt,
    bodyHtml: rd.body.html,
    hasAuthor,
    authorName: hasAuthor ? (author!.name as string) : "",
    authorRole: author?.role ?? "",
    hasAuthorPhoto: Boolean(author?.profileImage),
    authorPhoto: resolveImageOrNull(author?.profileImage),
    hasTeam,
    teamLabel: hasTeam ? teamLabel(rd.teamModel!.slug) : "",
    tagLabel: hasTeam ? teamTagShort(rd.teamModel!.slug) : "",
    // Default-with-derived-placeholder: always resolve to something renderable.
    coverImage: rd.coverImage ? resolveImage(rd.coverImage) : placeholderCoverImage,
    dateLabel: formatDateSv(rd.publishedDate),
    href: `/nyheter/${rd.slug}`,
  };
}

export async function getNewsCardVMs(): Promise<NewsCardVM[]> {
  const data = await fetchWithFallback<NewsCardResponseRD>(NEWS_QUERY, newsCardFallback);
  return data.newsCardModels.map(toVM);
}

/**
 * One article for /nyheter/[slug], or null → the page renders 404.
 *
 * Fallback articles must open wherever their cards were shown, so the slug is matched
 * against fallback.ts in two cases:
 *  1. The fetch fails — fetchWithFallback returns the fallback match (or nothing).
 *  2. The fetch succeeds but Hygraph has no such slug — e.g. a page cached by ISR during an
 *     outage still links to fallback cards after Hygraph recovers.
 * Any other unknown slug (typo, unpublished article) still resolves to null.
 */
export async function getNewsArticleVM(slug: string): Promise<NewsArticleVM | null> {
  const fallbackRD = newsCardFallback.newsCardModels.find((rd) => rd.slug === slug) ?? null;
  const data = await fetchWithFallback<NewsCardResponseRD>(
    NEWS_BY_SLUG_QUERY,
    { newsCardModels: fallbackRD ? [fallbackRD] : [] },
    { slug },
  );
  const rd = data.newsCardModels[0] ?? fallbackRD;
  if (!rd) return null;
  return { article: toVM(rd), isFallback: rd === fallbackRD };
}
