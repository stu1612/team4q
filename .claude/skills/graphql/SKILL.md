# GraphQL Skill

## Intent

All HG communication flows through a single client, `hygraphClient.ts`. Component mappers call this client — nothing else does. A mapper declares its own failure strategy explicitly, by which client function it calls — the client never infers strategy from content type, and no strategy is left for Claude Code to guess.

## Outcomes

- Single source of truth for all HG communication
- Query validation before any network request is made
- A mapper's failure strategy is visible in its own code — one of two named function calls, never inferred from a model name or a file's presence
- UI never sees a raw error — it receives either a VM or a defined error/fallback VM
- Generated types from graphql-codegen feed directly into RD types
- Fallback data, where it exists, is typed and compiler-checked against the current schema — never hand-maintained JSON that can silently drift

## File Structure

```
src/lib/hygraphClient.ts   — query validation + HTTP client, exposes fetchWithFallback / fetchOrFail
src/constants/contact.ts   — global club contact details
```

Fallback data does not live centrally. It lives per-component, as covered in `/data-mapping`:

```
src/components/[componentName]/fallback.ts   — RD-shaped, only present on components using fetchWithFallback
```

This is a deliberate departure from a centralized `fallbacks/` folder. RD-shaped `.ts` fallback data, typed against the same generated types as real responses, means a schema change that breaks the fallback shape is caught by the compiler at build time — not discovered by a visitor at runtime because a hand-maintained JSON file quietly went stale.

## hygraphClient.ts Structure

Internally two layers, but only two functions are ever called by a mapper:

**Layer 1 — Query Validation** (internal, runs inside both public functions below)

- Validates the query before any network request is made
- Catches empty strings, malformed GraphQL structure
- Throws a descriptive error before touching the network — never wastes a request on a bad query

**Layer 2 — HTTP Client** (internal, runs inside both public functions below)

- Assumes the query is valid (Layer 1 already ran)
- Handles the HG endpoint, auth token, network errors, timeouts, non-200 responses
- Categorises infrastructure failures into a typed technical error — for developers and logs, never shown to a visitor

**Public interface — the only two things a mapper calls:**

- **`fetchWithFallback<T>(query, fallbackData: T): Promise<T>`** — always resolves. On any technical failure, returns `fallbackData` (imported from that component's `fallback.ts`) instead of throwing. Used by mappers for editorial content, where a visitor should never see an error state.
- **`fetchOrFail<T>(query): Promise<Result<T, HGError>>`** — never silently resolves on failure. Returns a typed result the mapper must check (`result.ok`). Used by mappers for time-sensitive content, where showing nothing (or an explicit message) is safer than showing wrong or stale data.

`hygraphClient.ts` has no awareness of what any model's fallback content looks like, or what message a failure should show a visitor — both are mapper-layer decisions per `/data-mapping`. The client's only job is: validate, fetch, categorise technical failures, and expose the two functions above.

## How Mappers Call the Client

A mapper calls exactly one of the two functions above, and that choice is the mapper's explicit, visible statement of its own failure strategy — never left to be inferred from the model name, a config table, or whether a file happens to exist. The client handles all communication concerns; the mapper handles all transformation and visitor-facing concerns.

## graphql-codegen

- Types are generated from the HG schema automatically
- Generated types feed directly into component RD types in `types.ts`
- Never hand-write RD types — always derive from generated types
- Fallback data in `fallback.ts` is typed against these same generated RD types — this is what makes a stale fallback a compile error rather than a runtime surprise
- Run codegen whenever the HG schema changes, before touching any mapper

## Failure Strategy Per Model

Every model is assigned one strategy below — none are left uncategorised, and none use a bespoke third failure mode. Every model uses one of the two public functions and their defined behaviour, with no exceptions.

**`fetchOrFail` — time-sensitive content:**

- **FixtureModel, TrainingModel** — never show stale or fake schedule data. On failure, render a **full message block** — same visual weight as the content it replaces, not a quiet afterthought. A visitor relies on this content to know when and where to show up; silence here could mean someone arrives to a cancelled or wrongly-timed session. Message surfaces club contact details from `src/constants/contact.ts`. Example: _"Vi upplever tekniska problem. För träningsinformation, kontakta oss på [number]"_
- **ResultModel, PlayerModel** — on failure, **render nothing** — no message, no fallback content, the section is simply absent. This is a deliberate, stated exception to the full-message pattern above, not an unexplained inconsistency: both are cosmetic/display features a visitor was never relying on for actionable information (ResultModel is explicitly a switchable cosmetic banner; PlayerModel roster display is a nice-to-have, not something a visitor needs to know when or where to be). Absence carries no real-world consequence for either, unlike Fixtures/Training.

**`fetchWithFallback` — editorial content:**

- **NewsCardModel, SponsorModel, HeroModel, TeamPageModel** — a visitor should never see an error state for these. On failure, `fallback.ts` supplies RD-shaped fake-but-realistic content, which flows through the mapper's normal transform logic identically to a real response.
- HeroModel specifically: it is HG-sourced content (Heading, Cover Image, Subheading, CTA) like any other editorial model, not static build-time markup — it must not be treated as having no runtime dependency.
- TeamPageModel specifically: despite being structurally load-bearing (it is the entire `/mens`, `/womens`, `/juniors` route), it's grouped with editorial content because the organising principle for this split is how often content changes and how dangerous staleness is — not how important the page is. Low-frequency, rarely-changing content stays editorial regardless of page significance.

**No runtime dependency:**

- **Nav, Layout, and other structural chrome** — built at Astro build time, no HG fetch involved, no failure strategy needed. This is markup/layout only — it does not include HeroModel, which is HG-sourced.

## Contact Details

Club contact details are defined once in `src/constants/contact.ts` and imported wherever needed. Never hardcode contact information per component.

## Gotchas

- Never call the HG endpoint directly from a component — always go through `hygraphClient.ts`
- A mapper never constructs its own request — it calls `fetchWithFallback` or `fetchOrFail`, full stop
- Query validation is not a separately-callable step — it always runs inside both public functions, never skipped
- Fallback data lives in `fallback.ts`, typed against generated RD types — never centralized untyped JSON
- Run graphql-codegen after every HG schema change, before writing or editing any mapper
- `fetchOrFail` models never receive fallback data — do not give FixtureModel, TrainingModel, ResultModel, or PlayerModel a `fallback.ts`
- Contact details come from `src/constants/contact.ts` — never hardcode them
