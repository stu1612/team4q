# Fallback Reference Table

Reconciled against the **live** Hygraph schema + real content on **2026-08-29**
(introspection + record-level verification, not assumed). Referenced by the
`/data-mapping` skill — this doc holds the schema-specific data, `/data-mapping`
holds the pattern.

## How to read this table

- **Required** — enforced by Hygraph at the schema level. No mapper fallback; a null
  here is a malformed request, surfaced as a developer-facing error via `hygraphClient.ts`.
- **Flag** — optional field gating whether UI renders. Mapper derives `hasX` alongside
  the value. UI checks the flag, never the raw value.
- **Default** — optional field that doesn't gate rendering. Mapper resolves to a defined
  empty value (`""`, `0`, `[]`) — never `undefined`.
- **Default (derived placeholder)** — optional in Hygraph, but UI always shows something.
  Mapper derives `hasX` (non-rendering consumers only) and the display value (real or
  placeholder). UI renders the display value unconditionally.
- **isActive is an enum, not a boolean.** Where present it is `IsActive` (`active |
  inactive`). The mapper derives visibility as `isActive === "active"` (combined with any
  second condition — see Compound Visibility).

---

## TeamModel

- `name`, `slug` — **Required**
- `teamAffiliation`, `affiliationUrl`, `affiliationLogo` (Asset) — **Flag, paired as one**
  (`hasAffiliation` = all three present). League badge + linked name; render nothing if any
  is missing. All three teams currently populate all three.
- Relation-only model — inlined per consumer as `[Consumer]TeamRD`. Consumers that display
  the team's public name derive the "-laget" label from `slug` (`herrlaget` → "Herrlaget"),
  not from `name` (which is "Herr" / "Dam" / "Ungdom"). Shared helper: `src/lib/teamLabel.ts`.

## NewsCardModel

- `heading`, `slug`, `publishedDate` (Date), `excerpt`, `body` (RichText) — **Required**
  - `body`: query `{ html }` (rendered via `set:html`) and `{ text }` (plain text for meta
    description). The RichText object itself is non-null.
- `coverImage` (Asset) — **Default (derived placeholder)** — mapper resolves `coverImage`
  (real or placeholder) + `hasCoverImage` (non-rendering consumers only)
- `teamModel` — **Flag** (`hasTeam`) — general club news is a valid, intentional state
- `clubMemberModel` (author) — **Flag** (`hasAuthor`) — nullable in schema; render the
  byline only when present
  - `.name` — **Flag** (`hasAuthorName`), defensive
  - `.profileImage` (Asset) — **Flag** (`hasAuthorPhoto`)
  - `.role` — **Default** `""` (null for news authors in current content)

## FixtureModel

- `date` (Date), `startTime`, `endTime`, `location`, `homeTeam`, `awayTeam`, `heading` —
  **Required** (`location` is `.trim()`ed by the mapper — one current record has a leading
  tab / the typo "Idrottshalen")
- `isActive` (`IsActive` enum) — **Required**; `isVisible = isActive === "active"`
  (past/upcoming split deferred to Phase 4 — see Compound Visibility)
- `coverImage` (Asset) — **Flag** (`hasCoverImage`)
- `teamModel` — **Flag** (`hasTeam`) — schema permits null; always present in practice, but
  the mapper guards rather than assuming
- Affiliation — **removed from Fixture.** Reached through `teamModel.teamAffiliation` /
  `affiliationUrl` / `affiliationLogo` (see TeamModel); `hasAffiliation` derived from those
  nested fields.

## PlayerModel

- **Deferred — not in scope for v1.** Roster display is a future feature: no mapper logic,
  no query, no dummy data built now; the component folder stays a stub. Recorded for later:
  `name` (nullable), `jerseyNumber` (`Int!`), `position` (`Position` enum), `isActive`
  (`IsActive` enum), `teamModel` (nullable).

## TrainingModel

- `venue`, `startTime`, `endTime`, `date` (Date) — **Required** (`venue` `.trim()`ed — one
  current record has a leading tab)
- `trainingType` (`TrainingType` enum: `team | individual`) — **Required**; mapper derives a
  display label
- `isActive` (`IsActive` enum) — **Required**; `isVisible = isActive === "active"`
- `information` — **Default** `""`
- `teamModel` — **Flag** (`hasTeam`) — guarded, expected-present
- `clubMemberModels` (coaches) — **Default**, empty array is legitimate. List, 0-to-many
  (was a single required Coach). Mapper resolves `coaches: CoachVM[]` + `hasCoaches`.
  - per coach: `.name` — **Flag**; `.role` — **Default** `""` ("Tränare" in current
    content); `.profileImage` — **Flag** (`hasCoachPhoto`)

## TeamPageModel

- `heading`, `coverImage` (Asset) — **Required**
- `subheading` — **Default** `""`
- `teamModel` — **Required-with-guard** — schema now permits null, but `/mens` `/womens`
  `/juniors` are meaningless without the relation; a missing one is a developer-facing error
  via the client, not a silent empty state

## SponsorModel

- `name`, `url`, `logo` (Asset), `tier` (`SponsorTier` enum: `main | partner | community`) —
  **Required**
- `isActive` (`IsActive` enum) — **Required**; `isVisible = isActive === "active"`
- `tagline` — **Default** `""` (null for every current sponsor)

## HeroModel

- `heading`, `coverImage` (Asset) — **Required**
- `ctaLabel` + `ctaUrl` — **Flag**, paired as one (`hasCTA`) — never a label with no link or
  vice versa
- `subheading` — **Default** `""`
- **No `isActive` field.** Mapper queries `heroModels(first: 1)`, takes `[0]`; an empty
  collection falls through to `fallback.ts`. Assumes the club maintains exactly one Hero.

## ResultModel

- `homeTeam`, `homeScore` (Int), `awayTeam`, `awayScore` (Int), `backgroundImage` (Asset) —
  **Required**
- `date` (Date) — **Optional** — **Flag** (`hasDate`)
- `teamModel` — **Flag** (`hasTeam`) — guarded, expected-present
- `isActive` (`IsActive` enum) — see Compound Visibility

**Not stored, derived in the mapper:**

- `isStale` — `publishedAt == null ? false : (currentDate − publishedAt) > 28 days`, using
  Hygraph's system `publishedAt` (nullable `DateTime`; null counts as not-stale). Not the
  `date` field.
- `isVisible` — `isActive === "active" && !isStale`. `isActive` can hide a fresh result
  early; it cannot revive a stale one. Single flag both the team-page banner and the
  homepage "previous results" section check — if `isVisible` is false the UI renders
  nothing for that result.
- Winner/margin — deliberately not stored or derived.

Deliberately decoupled from FixtureModel — no reference between them. A Result is a one-time
archival entry made after a game; referencing a Fixture would add admin friction for a
sync-safety benefit that doesn't apply here. Background Image is one of three pre-set
branded assets (mens/womens/juniors), selected per result — not a fresh upload each time.

## ClubMemberModel  *(new — was the `ClubMemberComponent` shared component)*

Standalone model, consumed by NewsCardModel (`clubMemberModel`, single) and TrainingModel
(`clubMemberModels`, list). Per `/data-mapping`, each usage gets its own RD/VM
(`AuthorRD`/`AuthorVM`, `CoachRD`/`CoachVM`) even though the shape is identical today.

- `name` — **Flag** (nullable)
- `role` — **Default** `""`
- `email` — **Default** `""` — populated and **public-facing**; select it only in queries
  for components that actually render it (Astro bakes all page data into the static HTML)
- `contactNumber` — **Default** `""` (null in all current records)
- `profileImage` (Asset) — **Flag** (`hasPhoto`)

## Asset  *(shared shape for every image field)*

- Query `{ url width height }`. `url` is non-null; `width`/`height` are nullable `Float` but
  present on all current content images.
- Mapper narrows the RD image union to a resolved image the UI can render directly. Remote
  `<Image>` needs the dimensions; where absent, use `inferSize` or a known fallback ratio.
- `astro.config.mjs` needs `image.domains: ["eu-west-2.graphassets.com"]` (or a
  `remotePatterns` entry) before any remote asset renders through `<Image>`. Added with the
  codegen task, when RD image fields switch from the interim local-import union to URL-only.

---

## Compound Visibility

Most models only need `isActive === "active"`. `ResultModel` has a second, independent
reason to stop rendering (28-day staleness from `publishedAt`). The mapper combines both
into one derived flag (`isVisible`) — the UI checks only that. `isActive` may suppress
content early; it may never override the second condition back into visibility.

`FixtureModel` will gain an analogous compound flag in Phase 4 for the past/upcoming split;
for now its `isVisible` is just `isActive === "active"`.

---

## Removed since the previous reconciliation

- **`AffilicationComponent`** (Hygraph's spelling) — gone; affiliation is three inline
  nullable fields on `TeamModel`.
- **`ClubMemberComponent`** — replaced by the `ClubMemberModel` model above.
- **`FixtureModel.affiliations`** (repeatable) — gone; affiliation via the team relation.
- **Boolean `isActive`** — now the `IsActive` enum everywhere it exists; Hero, NewsCard, and
  TeamPage have no active-flag field at all.
- The team relation is named **`teamModel`** on every model and is nullable on all of them.

## In schema but unused

- `Day` enum (`mandag`…`sondag`) — no field references it; TrainingModel has only `date`.
- `TeamTag` enum (`mens | womens | juniors`) — no model field uses it; team identity is `slug`.
