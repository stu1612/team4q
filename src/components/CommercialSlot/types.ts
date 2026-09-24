// No RD type of its own: this component reuses the Sponsor query (see mappers.ts), so its
// only new shape is the VM.

export interface CommercialSlotVM {
  sponsorName: string;
  sponsorUrl: string;
  logo: ImageMetadata | string;
  tagline: string;
  image: ImageMetadata | string;
}
