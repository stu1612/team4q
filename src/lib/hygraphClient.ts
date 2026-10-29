// Centralised Hygraph client — the single point every component mapper calls.
// Per the /graphql skill, NOTHING else in the codebase talks to the Hygraph
// endpoint directly. This file only handles transport: validate, fetch,
// categorise technical failures. It has no awareness of any model's fallback
// content, no visitor-facing messages, and no per-model branching — those are
// mapper-layer concerns.
//
// CONTENT_SOURCE="demo" (the default) is the one exception to "always fetch": no request is
// sent, and each function resolves to the local data its caller supplies — the component's
// fallback.ts for fetchWithFallback, its demo.ts for fetchOrFail. The queries are still
// validated, so the Hygraph path stays correct while it's switched off.

import { ClientError, GraphQLClient } from "graphql-request";
import type { RequestDocument, Variables } from "graphql-request";
import { parse } from "graphql";
import { CONTENT_SOURCE, HYGRAPH_API_URL, HYGRAPH_TOKEN } from "astro:env/server";

const REQUEST_TIMEOUT_MS = 10_000;
const DEMO = CONTENT_SOURCE === "demo";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Returned by `fetchOrFail`. The mapper branches on `result.ok` and must handle
 * the `false` case explicitly (message block or nothing, per the model's
 * failure strategy in the /graphql skill).
 */
export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: HGError };

/**
 * A categorised technical failure. Developer/log facing only — a mapper maps
 * this to a visitor-facing outcome, the UI never receives it raw.
 */
export interface HGError {
  kind: "network" | "timeout" | "http" | "graphql";
  /** Developer/log message — never shown to a visitor. */
  message: string;
  /** HTTP status, set when `kind === "http"`. */
  status?: number;
  /** Raw response errors / underlying cause, for logs and debugging. */
  detail?: unknown;
}

// ---------------------------------------------------------------------------
// Layer 1 — query validation (runs inside both public functions, before any
// network call). A malformed query is a programming error: it always throws,
// in both functions, and is never swallowed into fallback content.
// ---------------------------------------------------------------------------

function assertValidQuery(query: RequestDocument): void {
  if (typeof query === "string" || query instanceof String) {
    const text = String(query).trim();
    if (!text) {
      throw new Error("hygraphClient: empty GraphQL query");
    }
    try {
      parse(text);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`hygraphClient: malformed GraphQL query — ${detail}`);
    }
    return;
  }

  // Already-parsed DocumentNode / TypedDocumentNode (what graphql-codegen will
  // hand us in Task 3). Structurally valid by construction; just guard emptiness.
  if (!query || !Array.isArray(query.definitions) || query.definitions.length === 0) {
    throw new Error("hygraphClient: GraphQL document has no definitions");
  }
}

// ---------------------------------------------------------------------------
// Layer 2 — HTTP client. Assumes the query is already validated. Owns the
// endpoint, auth, timeout, and failure categorisation.
// ---------------------------------------------------------------------------

const client = new GraphQLClient(HYGRAPH_API_URL, {
  headers: { Authorization: `Bearer ${HYGRAPH_TOKEN}` },
});

async function execute<T>(query: RequestDocument, variables?: Variables): Promise<T> {
  return client.request<T>({
    document: query,
    variables,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

function toHGError(error: unknown): HGError {
  if (error instanceof ClientError) {
    const status = error.response?.status;
    if (typeof status === "number" && status >= 400) {
      return {
        kind: "http",
        message: `Hygraph returned HTTP ${status}`,
        status,
        detail: error.response?.errors ?? error.response?.body,
      };
    }
    return {
      kind: "graphql",
      message: "Hygraph responded with GraphQL errors",
      detail: error.response?.errors,
    };
  }

  if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
    return {
      kind: "timeout",
      message: `Hygraph request timed out after ${REQUEST_TIMEOUT_MS}ms`,
    };
  }

  return {
    kind: "network",
    message: error instanceof Error ? error.message : "Unknown network error contacting Hygraph",
    detail: error,
  };
}

function logHGError(error: HGError): void {
  console.error(`[hygraphClient] ${error.kind}: ${error.message}`, error.detail ?? "");
}

// ---------------------------------------------------------------------------
// Public interface — the only two functions a mapper may call. Which one it
// calls IS its stated failure strategy (see the /graphql skill).
// ---------------------------------------------------------------------------

/**
 * Editorial content (news, sponsors, hero, team pages). Always resolves. On any
 * technical failure, logs and returns `fallbackData` (RD-shaped, from the
 * component's `fallback.ts`) — a visitor never sees an error state.
 *
 * A malformed query still throws: that is a build-time programming error, not a
 * runtime data state, and must fail loudly rather than serve fallback forever.
 */
export async function fetchWithFallback<T>(
  query: RequestDocument,
  fallbackData: T,
  variables?: Variables,
): Promise<T> {
  assertValidQuery(query);
  if (DEMO) return fallbackData;
  try {
    return await execute<T>(query, variables);
  } catch (error) {
    const hgError = toHGError(error);
    logHGError(hgError);
    return fallbackData;
  }
}

/**
 * Time-sensitive content (fixtures, training, results, players). Never silently
 * resolves on failure — returns a `Result` the mapper must check. On failure the
 * mapper decides between a full message block and rendering nothing, per the
 * model's entry in the /graphql skill's failure-strategy table.
 *
 * `demoData` is what demo mode resolves to (the component's demo.ts). It is never used as a
 * failure fallback. Demo mode without it throws: a call site was missed, so fail the build.
 */
export async function fetchOrFail<T>(
  query: RequestDocument,
  variables?: Variables,
  demoData?: T,
): Promise<Result<T>> {
  assertValidQuery(query);
  if (DEMO) {
    if (demoData === undefined) {
      throw new Error("hygraphClient: CONTENT_SOURCE is \"demo\" but no demoData was passed");
    }
    return { ok: true, data: demoData };
  }
  try {
    const data = await execute<T>(query, variables);
    return { ok: true, data };
  } catch (error) {
    const hgError = toHGError(error);
    logHGError(hgError);
    return { ok: false, error: hgError };
  }
}
