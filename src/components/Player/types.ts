// DEFERRED — PlayerModel (roster display) is out of scope for v1; see fallback-reference.md.
// No mapper, query, or dummy data is built. RD shape below is recorded from the live
// schema (2026-08-29) for whenever the feature is picked up. No VM until then.

export type IsActive = "active" | "inactive";
export type Position =
  | "pointGuard"
  | "shootingGuard"
  | "smallForward"
  | "powerForward"
  | "center";

export interface PlayerTeamRD {
  name: string;
  slug: string;
}

export interface PlayerRD {
  name: string | null;
  position: Position;
  jerseyNumber: number;
  isActive: IsActive;
  teamModel: PlayerTeamRD | null;
}
