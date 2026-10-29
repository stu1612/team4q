// RD-shaped fallback for SponsorModel (fetchWithFallback). Same shape as the SponsorList
// query result. Logos are local imports so <Image> keeps optimising them. Taglines are
// populated here to exercise the non-empty path (every live sponsor currently has null).
// Every sponsor is fictional; URLs point at example.com so no real business is linked.

import fyrvaktarenLogo from "../../images/fallback/sponsors/fyrvaktaren-logo.svg";
import saltstankLogo from "../../images/fallback/sponsors/saltstank-logo.svg";
import vagbrytarenLogo from "../../images/fallback/sponsors/vagbrytaren-logo.svg";
import ljusgardenLogo from "../../images/fallback/sponsors/ljusgarden-logo.svg";
import kompassenLogo from "../../images/fallback/sponsors/kompassen-logo.svg";
import hamnljusLogo from "../../images/fallback/sponsors/hamnljus-logo.svg";
import commercialImage from "../../images/fallback/sponsors/sponsor-cover.jpg";
import type { SponsorResponseRD } from "./types";

const TAGLINE = "Stolt sponsor av Sundet Basket";
const SPONSOR_URL = "https://example.com/";

const partner = (name: string, logo: ImageMetadata) => ({
  name,
  logo,
  url: SPONSOR_URL,
  tier: "partner" as const,
  isActive: "active" as const,
  tagline: TAGLINE,
  hasCommercialSlot: false,
  commercialImage: null,
});

export const sponsorFallback: SponsorResponseRD = {
  sponsorModels: [
    {
      name: "Fyrvaktaren Bygg",
      logo: fyrvaktarenLogo,
      url: SPONSOR_URL,
      tier: "main",
      isActive: "active",
      tagline:
        "Vi har byggt hem och arbetsplatser längs kusten i över 20 år – och vi bygger gärna gemenskap också.",
      hasCommercialSlot: true,
      commercialImage: commercialImage,
    },
    partner("Saltstänk Café", saltstankLogo),
    partner("Vågbrytaren Fastigheter", vagbrytarenLogo),
    partner("Ljusgården Optik", ljusgardenLogo),
    partner("Kompassen Sport", kompassenLogo),
    partner("Hamnljus El", hamnljusLogo),
  ],
};
