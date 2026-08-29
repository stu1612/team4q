// Team relations in Hygraph store `name` as "Herr" / "Dam" / "Ungdom", but the public
// site refers to the teams as "Herrlaget" / "Damlaget" / "Ungdomslaget" (matching the
// team-page headings). Mappers derive the display label from the team's `slug`, which is
// already the "-laget" form. Single source so every consumer agrees.

const TEAM_LABELS: Record<string, string> = {
  herrlaget: "Herrlaget",
  damlaget: "Damlaget",
  ungdomslaget: "Ungdomslaget",
};

/**
 * Resolve a team's public display label from its slug. Falls back to a
 * capitalised slug for any unmapped value rather than returning something empty.
 */
export function teamLabel(slug: string): string {
  return TEAM_LABELS[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}
