// RD types derive from graphql-codegen output (src/gql/generated.ts). Image fields are
// widened (RawImage) so fallback.ts keeps local imports. Author (clubMemberModel) keeps
// a separate RD/VM per /data-mapping even though the shape matches TrainingModel's coach.

import type { NewsCardListQuery } from "../../gql/generated";
import type { RawImage } from "../../lib/resolveImage";

type NewsCardRow = NewsCardListQuery["newsCardModels"][number];
type AuthorRow = NonNullable<NewsCardRow["clubMemberModel"]>;

export interface AuthorRD extends Omit<AuthorRow, "profileImage"> {
  profileImage: RawImage | null;
}

export interface NewsCardRD extends Omit<NewsCardRow, "coverImage" | "clubMemberModel"> {
  coverImage: RawImage | null;
  clubMemberModel: AuthorRD | null;
}

export interface NewsCardResponseRD {
  newsCardModels: NewsCardRD[];
}

export interface NewsCardVM {
  heading: string;
  slug: string;
  publishedDate: string;
  excerpt: string;
  bodyHtml: string;
  hasAuthor: boolean;
  authorName: string;
  authorRole: string;
  hasAuthorPhoto: boolean;
  authorPhoto: ImageMetadata | string | null;
  hasTeam: boolean;
  teamLabel: string;
  coverImage: ImageMetadata | string;
}
