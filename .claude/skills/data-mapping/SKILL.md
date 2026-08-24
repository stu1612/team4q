# Data Mapping Skill

## Intent

Every component is self-contained and owns its entire data lifecycle. The UI renders values — nothing more. All data logic lives in the mapper.

## Outcomes

- Components follow a strict three-file structure
- Raw HG data never reaches the UI
- All logic, safety, transformation and derivation happens in the mapper
- UI components are predictable, dumb renderers
- Whether a component resolves quietly or surfaces a failure is an explicit choice in code, never inferred from file presence or convention

## Folder Structure

Each component lives in its own folder under `src/components/` with three files, plus a fourth when the component needs fallback content:

```
src/components/[componentName]/
  index.astro
  mappers.ts
  types.ts
  fallback.ts   ← only present when the component uses fetchWithFallback (see below)
```

- `index.astro` — UI only, renders VM values, no data logic
- `mappers.ts` — fetches data via `hygraphClient.ts`, transforms raw response to VM, returns a safe object
- `types.ts` — RD and VM type definitions for this component
- `fallback.ts` — RD-shaped fallback data, only for components using the fallback strategy (see Request Failure Handling)

## Naming Convention

- Raw HG response type — `[Name]RD`
- ViewModel type — `[Name]VM`

Examples: `TeamRD` / `TeamVM`, `NewsCardRD` / `NewsCardVM`, `FixtureRD` / `FixtureVM`

Shared Hygraph components (e.g. `ClubMemberComponent`, used by both NewsCardModel's Author and TrainingModel's Coach) still get separate RD/VM types per usage — `AuthorRD`/`AuthorVM`, `CoachRD`/`CoachVM` — even though the underlying HG shape is identical. This is intentional: the two usages are only coincidentally the same shape today, and keeping the types separate means one can diverge later without untangling a shared dependency.

## Request Failure Handling

All HG communication goes through the centralized client, `hygraphClient.ts` — the mapper calls this client, it never constructs or fires a request itself.

`hygraphClient.ts` exposes two functions. The mapper picks whichever matches the component's failure strategy — this choice is made explicitly in the mapper's own code, not inferred from whether a `fallback.ts` file happens to exist:

- **`fetchWithFallback<T>(query, fallbackData: T): Promise<T>`** — for editorial content (news, sponsors) where a request failure should never be visible to a visitor. Always resolves. `fallbackData` is imported from that component's `fallback.ts`, RD-shaped, and flows through the exact same transform logic as a real response — so there is only one transform code path to keep correct as the schema evolves, not two.
- **`fetchOrFail<T>(query): Promise<Result<T, HGError>>`** — for time-sensitive content (fixtures, training) where a visitor should see a clear message and the club's contact details (from `src/constants/contact.ts`) rather than stale or fake data. The mapper checks `result.ok` and branches into a defined error VM if false.

`hygraphClient.ts` itself only handles the transport layer — HTTP failures, malformed responses, timeouts — and returns technical error detail for developers/logs. It has no awareness of any model's fallback content or visitor-facing messaging; that judgment belongs entirely to the mapper.

## Mapper Responsibilities

The mapper is the single transformation layer. It is responsible for:

- **Request strategy** — calling `fetchWithFallback` or `fetchOrFail`, per the component's failure strategy
- **Safety** — null/undefined checks, fallback values for every optional field, per the field-level treatment below
- **Transformation** — date formatting, string manipulation, concatenation
- **Derivation** — values computed from raw data (e.g. `isUpcoming` from a date comparison, a display label from an enum value)
- **Shape** — structuring the VM object exactly as the UI expects it

## Field-Level Fallback Treatment

Every optional field falls into one of three categories. Which category applies to which field, per model, is schema-specific and lives in the **fallback reference table** (`fallback-reference.md`) — this skill defines the pattern, that doc defines the application.

- **Flag** — optional field that gates whether a piece of UI renders (e.g. a player photo). Mapper derives a `hasX` boolean alongside the value. UI checks the flag, not the raw value.
- **Default** — optional field that doesn't gate anything (e.g. a tagline). Mapper resolves to a defined empty value — `""`, `0`, empty array — never `undefined`.
- **Default (derived placeholder)** — optional in Hygraph, but the UI should always show something (e.g. a news article's cover image). Mapper derives both the resolved display value (real asset, or a placeholder path if unset) and a `hasX` boolean. The UI renders the display value unconditionally and never branches on the flag — the flag exists only for non-rendering consumers (content-completeness checks, admin views), not for the UI itself.

Required fields (per Hygraph's own schema config) need no fallback in the mapper — if one is ever missing, that's a malformed request, not a normal data state, and should surface as a developer-facing error, not be silently defaulted.

## Compound Visibility (isActive + a second condition)

Most models only need to check `isActive`. Some models have a second, independent reason content should stop rendering — e.g. `ResultModel` should disappear after 28 days regardless of its `isActive` value, derived by comparing Hygraph's system `publishedAt` against the current date.

Where this applies, the mapper combines both into a single derived flag (e.g. `isVisible`) rather than leaving two separate flags for the UI to check:

```
isVisible = isActive && !isSecondCondition
```

`isActive` may always suppress content early; it may never override the second condition back into visibility. The UI checks the one combined flag only — it never independently inspects `isActive` or the second condition. See `fallback-reference.md` for which models use this pattern and what the second condition is.

## UI Responsibilities

The UI receives a VM and renders it. Nothing else.

- No null checks, no formatting, no computation, no optional chaining on data values
- Conditionals on VM boolean flags are fine (`hasCoverImage`, `isUpcoming`, empty-array checks for empty states) — these are presentational, not data-safety logic
- Conditionals that inspect a raw data value's shape or validity are not fine — that belongs in the mapper

If logic appears in the UI that isn't a check against an already-derived VM flag, it's in the wrong place. Move it to the mapper.

## Gotchas

- Never put data logic in `index.astro` — if you find yourself writing a ternary on a raw data value in the UI, stop and move it to the mapper
- Mappers are always async — they call `hygraphClient.ts`
- Every field on the VM must resolve to something defined — the UI should never receive `undefined`
- Boolean flags used for UI branching (e.g. `isUpcoming`, `hasResult`) are always derived in the mapper, never computed inline in the UI
- Do not build a "derived" boolean as its own separately-editable Hygraph field (e.g. a manually-toggled `hasCoverImage` content field). If a value can be computed from a field you already store, compute it in the mapper — a second stored field for the same fact is duplicated state that will eventually drift out of sync with the real one
