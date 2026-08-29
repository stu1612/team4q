// interim — replace RD with graphql-codegen output in the codegen task (see /graphql skill)

// Hygraph Asset selection shape. Interim union with ImageMetadata — see Hero/types.ts.
export interface AssetRD {
  url: string;
  width: number | null;
  height: number | null;
}

// NewsCardModel.body is a Hygraph RichText field. We select the pre-rendered `html`
// (for display via set:html) and `text` (plain text for meta descriptions / SEO).
export interface RichTextRD {
  html: string;
  text: string;
}

// NewsCardModel.clubMemberModel (the author relation). Standalone ClubMemberModel, all
// fields nullable. Separate RD/VM per usage per /data-mapping — this is the author usage.
export interface AuthorRD {
  name: string | null;
  role: string | null;
  profileImage: AssetRD | ImageMetadata | null;
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
  body: RichTextRD;
  coverImage: AssetRD | ImageMetadata | null;
  teamModel: NewsCardTeamRD | null;
  clubMemberModel: AuthorRD | null;
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
  // Narrowed to ImageMetadata for the interim — see Hero/types.ts.
  authorPhoto: ImageMetadata | null;
  hasTeam: boolean;
  teamLabel: string;
  coverImage: ImageMetadata;
}
