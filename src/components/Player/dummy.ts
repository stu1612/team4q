// Dev-only stand-in data — NOT a runtime fallback (PlayerModel is fetchOrFail, see
// /graphql skill: this model must never get a fallback.ts). Exists purely so pages can be
// built against a realistic RD shape before Hygraph is wired in Phase 2. Delete once
// hygraphClient.ts + real queries replace it.

import type { PlayerRD } from "./types";

export const playerDummy: PlayerRD[] = [
  { name: "Marcus Holm", position: "Guard", team: { name: "Herrlaget", slug: "mens" }, jerseyNumber: 7 },
  { name: "Adam Berg", position: "Forward", team: { name: "Herrlaget", slug: "mens" }, jerseyNumber: 11 },
  { name: "Simon Åkesson", position: "Center", team: { name: "Herrlaget", slug: "mens" }, jerseyNumber: null },
  { name: "Freja Lindqvist", position: "Guard", team: { name: "Damlaget", slug: "womens" }, jerseyNumber: 4 },
  { name: "Elin Sandberg", position: "Forward", team: { name: "Damlaget", slug: "womens" }, jerseyNumber: 15 },
  { name: "Alva Nyström", position: "Center", team: { name: "Damlaget", slug: "womens" }, jerseyNumber: 21 },
  { name: "Noah Karlsson", position: "Guard", team: { name: "Ungdomslaget", slug: "juniors" }, jerseyNumber: 9 },
  { name: "Elias Ström", position: "Forward", team: { name: "Ungdomslaget", slug: "juniors" }, jerseyNumber: null },
];
