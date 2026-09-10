// RD-shaped fallback for HeroModel (fetchWithFallback). Same shape as the HeroContent
// query result — flows through the mapper identically to a live response. Cover image is
// a local import so <Image> keeps optimising it.

import heroCover from "../../images/fallback/hero/hero-cover.jpg";
import type { HeroResponseRD } from "./types";

export const heroFallback: HeroResponseRD = {
  heroModels: [
    {
      heading: "Välkomna till Team Fourth Quarter",
      subheading:
        "Herr, dam och ungdom – en klubb, tre lag, samma passion för basket i Helsingborg.",
      ctaLabel: "Kontakta oss",
      ctaUrl: "/kontakt",
      coverImage: heroCover,
    },
  ],
};
