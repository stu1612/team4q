import { gql } from "graphql-request";
import placeholderCoverImage from "../../images/fallback/news/result-news.jpg";
import { fetchWithFallback } from "../../lib/hygraphClient";
import { resolveImage, resolveImageOrNull } from "../../lib/resolveImage";
import { teamLabel } from "../../lib/teamLabel";
import { newsCardFallback } from "./fallback";
import type { NewsCardRD, NewsCardResponseRD, NewsCardVM } from "./types";

const NEWS_QUERY = gql`
  query NewsCardList {
    newsCardModels(orderBy: publishedDate_DESC) {
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
  }
`;

function toVM(rd: NewsCardRD): NewsCardVM {
  const author = rd.clubMemberModel;
  const hasAuthor = Boolean(author && author.name);
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
    hasTeam: Boolean(rd.teamModel),
    teamLabel: rd.teamModel ? teamLabel(rd.teamModel.slug) : "",
    // Default-with-derived-placeholder: always resolve to something renderable.
    coverImage: rd.coverImage ? resolveImage(rd.coverImage) : placeholderCoverImage,
  };
}

export async function getNewsCardVMs(): Promise<NewsCardVM[]> {
  const data = await fetchWithFallback<NewsCardResponseRD>(NEWS_QUERY, newsCardFallback);
  return data.newsCardModels.map(toVM);
}
