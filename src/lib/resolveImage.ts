// Component RD image fields accept either a local build-time import (used by fallback.ts,
// so <Image> keeps optimising it) or a Hygraph Asset selection ({ url, width, height })
// from a live response. This narrows that union to something <Image src> accepts directly.
// The interim `| ImageMetadata` arm on RD image fields goes away only if fallback.ts ever
// stops using local imports.

/** A Hygraph Asset selection, or a local build-time image import. */
export type RawImage =
  | { url: string; width: number | null; height: number | null }
  | ImageMetadata;

export function resolveImage(img: RawImage): ImageMetadata | string {
  return "url" in img ? img.url : img;
}

export function resolveImageOrNull(
  img: RawImage | null | undefined,
): ImageMetadata | string | null {
  return img == null ? null : resolveImage(img);
}
