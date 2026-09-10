// Club contact details — single source, imported wherever needed (never hardcoded per
// component). Surfaced in the fetchOrFail message block for Fixtures / Training when
// Hygraph is unreachable (see /graphql skill), in the Base.astro footer, and in the
// hand-written JSON-LD in src/constants/seo.ts (Organization `sameAs`, LocalBusiness
// address/telephone).
//
// TODO(developer): confirm the real values for every field flagged below — the email is
// from the club's ClubMemberModel record; phone, socials and address are placeholders.
// An empty string means "not set" — consumers omit that line/link entirely.

export interface ClubContact {
  email: string;
  /** Public phone number, or "" to omit it from the footer and the fetchOrFail message. */
  phone: string;
  /** Public social profiles. "" = omit from the footer and from Organization `sameAs`. */
  social: {
    instagram: string;
    facebook: string;
  };
  /** Physical address — used only by the /kontakt LocalBusiness JSON-LD. */
  address: {
    street: string;
    postalCode: string;
    city: string;
    /** ISO 3166-1 alpha-2. */
    country: string;
  };
}

export const CLUB_CONTACT: ClubContact = {
  email: "info@team4q.se",
  phone: "",
  social: {
    instagram: "", // e.g. "https://www.instagram.com/team4q/"
    facebook: "", // e.g. "https://www.facebook.com/team4q/"
  },
  address: {
    street: "",
    postalCode: "",
    city: "Helsingborg",
    country: "SE",
  },
};
