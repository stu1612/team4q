// The codegen task will swap newsCardFallback for a real fetchWithFallback(query,
// newsCardFallback) call via src/lib/hygraphClient.ts. For now the fallback data stands
// in directly as the RD.

import placeholderCoverImage from "../../images/fallback/news/result-news.jpg";
import { teamLabel } from "../../lib/teamLabel";
import { newsCardFallback } from "./fallback";
import type { NewsCardRD, NewsCardVM } from "./types";

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
    authorPhoto: (author?.profileImage ?? null) as ImageMetadata | null,
    hasTeam: Boolean(rd.teamModel),
    teamLabel: rd.teamModel ? teamLabel(rd.teamModel.slug) : "",
    // Default-with-derived-placeholder: always resolve to something renderable.
    coverImage: (rd.coverImage ?? placeholderCoverImage) as ImageMetadata,
  };
}

export async function getNewsCardVMs(): Promise<NewsCardVM[]> {
  return newsCardFallback.map(toVM);
}
