import edumentLogo from "../../images/fallback/sponsors/edument-logo.png";
import swedbankLogo from "../../images/fallback/sponsors/swedbank-logo.png";
import sparbankLogo from "../../images/fallback/sponsors/sparbank-logo.png";
import lokaLogo from "../../images/fallback/sponsors/loka-logo.png";
import direktenLogo from "../../images/fallback/sponsors/direkten-logo.png";
import type { SponsorRD } from "./types";

const TAGLINE = "Stolt sponsor av T4Q Helsingborg";

export const sponsorFallback: SponsorRD[] = [
  {
    name: "Edument",
    logo: edumentLogo,
    url: "https://www.edument.se/",
    tier: "main",
    tagline: TAGLINE,
  },
  {
    name: "Swedbank",
    logo: swedbankLogo,
    url: "https://www.swedbank.se/",
    tier: "partner",
    tagline: TAGLINE,
  },
  {
    name: "Sparbanken Skåne",
    logo: sparbankLogo,
    url: "https://www.sparbankenskane.se/",
    tier: "partner",
    tagline: TAGLINE,
  },
  {
    name: "Loka",
    logo: lokaLogo,
    url: "https://loka.nu/",
    tier: "partner",
    tagline: TAGLINE,
  },
  {
    name: "Direkten",
    logo: direktenLogo,
    url: "https://direkten.se/",
    tier: "partner",
    tagline: TAGLINE,
  },
];
