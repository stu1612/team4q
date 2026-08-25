# Fallback Reference Table

Reconciled against the actual Hygraph schema (Required badges checked field-by-field, not assumed). Referenced by the `/data-mapping` skill — this doc holds the schema-specific data, `/data-mapping` holds the pattern.

## How to read this table

- **Required** — enforced by Hygraph at the schema level. The mapper does not need a fallback for these; if one is ever null, the request itself is malformed and should surface as a developer-facing error via `hygraphClient.ts`, not be silently defaulted.
- **Flag** — optional field that gates whether a piece of UI renders. Mapper derives a `hasX` boolean alongside the resolved value. UI checks the flag, never the raw value.
- **Default** — optional field that does not gate rendering. Mapper resolves to a defined empty value (`""`, `0`, empty array) — never `undefined`.
- **Default (derived placeholder)** — optional in Hygraph, but the UI should always show _something_. Mapper derives both `hasX` (boolean, for non-rendering consumers only — audits, admin views, debugging) and the display value itself (real asset URL, or a placeholder path if unset). UI renders the display value unconditionally and never branches on the flag.

---

## TeamModel

- Name, Slug — **Required**

## NewsCardModel

- Heading, Slug, Published Date, Excerpt, Body, Author — **Required**
- Cover Image — **Default (derived placeholder)** — mapper resolves `coverImageUrl` (real or placeholder) and `hasCoverImage` (non-rendering consumers only)
- Author's nested Asset (photo) — **Flag** (`hasAuthorPhoto`)
- TeamModel relation — **Flag** (`hasTeamTag`) — general club news is a valid, intentional state

## FixtureModel

- Date, StartTime, EndTime, Location, Home Team, Away Team, Heading, TeamModel relation — **Required**
- Cover Image — **Flag** (`hasCoverImage`)
- Affiliations (repeatable) — **Default**, empty array is a legitimate state

## PlayerModel

- Name, Position, TeamModel relation — **Required**
- Jersey Number — **Flag** (`hasJerseyNumber`) — `0` is a valid number, cannot double as "unset"

## TrainingModel

- Venue, Date, StartTime, EndTime, Training Type, Coach, TeamModel relation — **Required**
- Information — **Default**, `""`

## TeamPageModel

- Heading, Cover Image, TeamModel relation — **Required** — low-frequency, set-once content; image is intentionally mandatory here unlike NewsCardModel
- Subheading — **Default**, `""`

## SponsorModel

- Name, Logo, URL, Tier — **Required** — URL required deliberately: an unlinked sponsor is a client-relationship risk, not just a data gap. URL format enforced via Hygraph regex validation at the field level.
- Tagline — **Default**, `""`

## HeroModel

- Heading, Cover Image — **Required**
- CTA Label + CTA URL — **Flag**, paired as one (`hasCTA`) — if either is missing, do not render the CTA; never show a label with no link or a link with no label
- Subheading — **Default**, `""`

## ResultModel

- Home Team, Home Score, Away Team, Away Score, TeamModel relation, Background Image, isActive — **Required**
- Date — **Optional** — **Flag** (`hasDate`)

**Not stored, derived in the mapper:**

- `isStale` — `(currentDate - publishedAt) > 28 days`, using Hygraph's system-managed `publishedAt`, not the Date field above
- `isVisible` — `isActive && !isStale`. `isActive` can hide a fresh result early; it cannot bring back a stale one. This is the single flag both the team-page result banner and the homepage "previous results" section check — if `isVisible` is false, the UI renders nothing for that result.
- Winner/margin — deliberately not stored or derived. Feature is a visual "reflection of a previous result" only; no winner/score-comparison logic needed.

Deliberately decoupled from FixtureModel — no reference between them. A Result is a one-time archival entry made after a game, not an ongoing record kept in sync with its Fixture; referencing would add admin friction (finding/selecting the matching fixture from a growing list) for a sync-safety benefit that doesn't apply here, since nothing ever edits both records over time. Home Team/Away Team/Location/Date pattern intentionally not duplicated from Fixture — Location and Date were dropped entirely rather than referenced, since the banner doesn't need them.

Background Image is one of three pre-set branded assets (mens/womens/juniors), selected per result — not a fresh upload each time. Guards against an admin accidentally pairing a result with the wrong team's branding.
