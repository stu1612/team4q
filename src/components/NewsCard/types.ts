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
