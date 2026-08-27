// Phase 2 will swap newsCardFallback for a real fetchWithFallback(query, newsCardFallback)
// call via src/lib/hygraphClient.ts. For now the fallback data stands in directly as the RD.

import placeholderCoverImage from "../../images/fallback/news/result-news.jpg";
import { newsCardFallback } from "./fallback";
import type { NewsCardRD, NewsCardVM } from "./types";

function toVM(rd: NewsCardRD): NewsCardVM {
  return {
    heading: rd.heading,
    slug: rd.slug,
    publishedDate: rd.publishedDate,
    excerpt: rd.excerpt,
    authorName: rd.author.name,
    hasAuthorPhoto: Boolean(rd.author.photo),
    authorPhoto: rd.author.photo as ImageMetadata | null,
    hasTeamTag: Boolean(rd.team),
    teamName: rd.team?.name ?? "",
    // Default-with-derived-placeholder: always resolve to something renderable.
    coverImage: (rd.coverImage ?? placeholderCoverImage) as ImageMetadata,
  };
}

export async function getNewsCardVMs(): Promise<NewsCardVM[]> {
  return newsCardFallback.map(toVM);
}
