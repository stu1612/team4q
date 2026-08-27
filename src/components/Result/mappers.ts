// TODO: implement in Phase 1 task 4 / Phase 2 (see /data-mapping and /graphql skills)
// Will call fetchOrFail from src/lib/hygraphClient.ts, transform ResultRD into a
// ResultVM (to be defined in ./types once this is written), deriving isStale/isVisible
// from publishedAt. On failure, render nothing per /graphql skill — no fallback.ts.

export async function getResultVMs(): Promise<unknown> {
  throw new Error("Result mapper not implemented yet");
}
