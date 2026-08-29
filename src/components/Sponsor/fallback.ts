// RD-shaped fallback for SponsorModel (fetchWithFallback). Same shape as the SponsorList
// query result. Logos are local imports so <Image> keeps optimising them. Taglines are
// populated here to exercise the non-empty path (every live sponsor currently has null).

import edumentLogo from "../../images/fallback/sponsors/edument-logo.png";
import swedbankLogo from "../../images/fallback/sponsors/swedbank-logo.png";
import sparbankLogo from "../../images/fallback/sponsors/sparbank-logo.png";
import lokaLogo from "../../images/fallback/sponsors/loka-logo.png";
import direktenLogo from "../../images/fallback/sponsors/direkten-logo.png";
import intersportLogo from "../../images/fallback/sponsors/intersport-logo.png";
import type { SponsorResponseRD } from "./types";

const TAGLINE = "Stolt sponsor av T4Q Helsingborg";

export const sponsorFallback: SponsorResponseRD = {
  sponsorModels: [
    { name: "Edument", logo: edumentLogo, url: "https://www.edument.se/", tier: "main", isActive: "active", tagline: TAGLINE },
    { name: "Swedbank", logo: swedbankLogo, url: "https://www.swedbank.se/", tier: "partner", isActive: "active", tagline: TAGLINE },
    { name: "Sparbanken Skåne", logo: sparbankLogo, url: "https://www.sparbankenskane.se/", tier: "partner", isActive: "active", tagline: TAGLINE },
    { name: "Loka", logo: lokaLogo, url: "https://loka.nu/", tier: "partner", isActive: "active", tagline: TAGLINE },
    { name: "Direkten", logo: direktenLogo, url: "https://direkten.se/", tier: "partner", isActive: "active", tagline: TAGLINE },
    { name: "Intersport", logo: intersportLogo, url: "https://intersport.se/", tier: "partner", isActive: "active", tagline: TAGLINE },
  ],
};
