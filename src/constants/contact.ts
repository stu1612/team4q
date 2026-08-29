// Club contact details — single source, imported wherever needed (never hardcoded per
// component). Surfaced in the fetchOrFail message block for Fixtures / Training when
// Hygraph is unreachable (see /graphql skill).
//
// TODO(developer): confirm the public phone number — email is from the club's
// ClubMemberModel record; phone is a placeholder.

export const CLUB_CONTACT = {
  email: "info@team4q.se",
  phone: "", // set the club's public number, or leave "" to omit it from the message
} as const;

export type ClubContact = typeof CLUB_CONTACT;
