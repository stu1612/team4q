import { getSponsorVMs } from "../Sponsor/mappers";
import type { CommercialSlotVM } from "./types";

// Reuses the Sponsor query rather than issuing its own — the slot is two fields on
// SponsorModel, so a second query would only duplicate the fetch and its fallback handling.
// First active sponsor with a slot wins; null means the section has nothing to show.
export async function getCommercialSlotVM(): Promise<CommercialSlotVM | null> {
  const sponsors = await getSponsorVMs();
  const sponsor = sponsors.find(
    (candidate) => candidate.hasCommercialSlot && candidate.commercialImage !== null,
  );
  if (!sponsor || !sponsor.commercialImage) return null;

  return {
    sponsorName: sponsor.name,
    sponsorUrl: sponsor.url,
    logo: sponsor.logo,
    tagline: sponsor.tagline,
    image: sponsor.commercialImage,
  };
}
