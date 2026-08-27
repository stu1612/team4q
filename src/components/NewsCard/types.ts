// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface AuthorRD {
  name: string;
  photo: ImageMetadata | string | null;
}

export interface NewsCardTeamRD {
  name: string;
  slug: string;
}

export interface NewsCardRD {
  heading: string;
  slug: string;
  publishedDate: string;
  excerpt: string;
  body: string;
  author: AuthorRD;
  coverImage: ImageMetadata | string | null;
  team: NewsCardTeamRD | null;
}

export interface NewsCardVM {
  heading: string;
  slug: string;
  publishedDate: string;
  excerpt: string;
  authorName: string;
  hasAuthorPhoto: boolean;
  // Narrower than the RD fields — only local imports occur before Phase 2.
  // Revisit once live Hygraph asset URLs need distinct <Image> handling (remote
  // width/height).
  authorPhoto: ImageMetadata | null;
  hasTeamTag: boolean;
  teamName: string;
  coverImage: ImageMetadata;
}
