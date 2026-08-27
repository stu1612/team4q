// interim — replace with graphql-codegen output in Phase 2 (see /graphql skill)

export interface PlayerTeamRD {
  name: string;
  slug: string;
}

export interface PlayerRD {
  name: string;
  position: string;
  team: PlayerTeamRD;
  jerseyNumber: number | null;
}
