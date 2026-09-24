# T4Q Progress Tracker

Last updated: 2026-09-24 (Phase 4 — team pages: /herrlaget, /damlaget, /ungdomslaget redesigned)

## Status at a glance

| Phase                                   | Status         |
| --------------------------------------- | -------------- |
| Planning — skills, schema, design brief | ✅ Done        |
| Phase 1 — Foundation                    | ✅ Done        |
| Phase 2 — HG Connection                 | ✅ Done        |
| Phase 3 — Global                        | ✅ Done        |
| Phase 4 — UI Build                      | 🟨 In progress |
| Phase 5 — Quality                       | ⬜ Not started |
| Phase 6 — Launch                        | ⬜ Not started |

---

## Planning ✅

- [x] Stack locked (Astro 7, Hygraph, Tailwind 4, graphql-request/codegen, Vercel, Resend, pnpm)
- [x] Hygraph schema built and reconciled field-by-field against actual config — re-reconciled 2026-08-29 against live schema + content (10 models: Team, NewsCard, Fixture, Player, Training, TeamPage, Sponsor, Hero, Result, ClubMember; no shared components)
- [x] `/accessibility` skill — locked
- [x] `/data-mapping` skill — locked
- [x] `/graphql` skill — locked
- [x] `/seo` skill — locked
- [x] `fallback-reference.md` — matches live schema (re-reconciled 2026-08-29)
- [x] Design brief + 8 reference screenshots — ready for Claude Code proposal

**Open before Phase 1 starts:**

- [x] Design system locked (type scale, spacing scale, exact brand red hex + AA verification) — implemented directly as `@theme` tokens in `global.css` rather than a separate proposal doc; see COMPLETED TASKS below
- [x] `fallback.ts` content drafted for the four `fetchWithFallback` models (News, Sponsor, Hero, TeamPage) — see COMPLETED TASKS below

---

## Phase 1 — Foundation

- [x] Folder structure (`src/components/[name]/{index.astro,mappers.ts,types.ts,fallback.ts?}`)
- [x] Page routes scaffolded (`/`, `/mens`, `/womens`, `/juniors`, `/news`, `/news/[slug]`, `/sponsors`, `/contact`) — renamed to Swedish slugs in Phase 3 (`/herrlaget`, `/damlaget`, `/ungdomslaget`, `/nyheter`, `/nyheter/[slug]`, `/sponsorer`, `/kontakt`)
- [x] Dummy data matching reconciled HG field shapes (not the original pre-reconciliation guesses)
- [x] Data mapping pattern validated end-to-end (RD → mapper → VM → UI) on at least one component

## Phase 2 — HG Connection

- [x] `hygraphClient.ts` built — query validation + HTTP client, exposes `fetchWithFallback` / `fetchOrFail`
- [x] Hygraph permissions locked down (PAT Read/Published-only, public Content API disabled) — verified by live probing
- [x] Schema re-reconciled against live Hygraph + real content (major drift — see COMPLETED TASKS); `fallback-reference.md` + `CLAUDE.md` updated
- [x] Interim types / fallback / dummy / mappers realigned to the reconciled shape (pre-codegen)
- [x] graphql-codegen wired up, generating RD types from live schema
- [x] Swapped to real HG responses, model by model (Hero, NewsCard, Sponsor, TeamPage, Fixture, Training, Result)

`PlayerModel` is out of scope for v1 (future roster feature) — no query, mapper, or dummy data.

### How codegen is set up

- `codegen.ts` at repo root; `pnpm codegen` = `node --env-file=.env …` (schema pulled from
  the live endpoint with the PAT). Output: `src/gql/generated.ts`, **committed** (54 lines,
  deterministic) so Vercel builds don't need a Hygraph round-trip. Rerun `pnpm codegen`
  after any Hygraph schema change, before touching mappers.
- **Plugin: `typescript-operations` only.** The planned `typescript` + `typescript-operations`
  pairing emitted duplicate identifiers for every selection-set enum (`IsActive`,
  `SponsorTier`, `TrainingType`) in this codegen v6 — not fixable via `preResolveTypes` /
  `onlyOperationTypes`. `typescript-operations` alone is self-contained (its own `Exact`
  helper + the enums it uses + the `[Name]Query` result types), which is all the RD types
  need. `enumsAsTypes`, `skipTypename`, `avoidOptionals: { field: true }`, scalar map applied.
- **RD types** in each `types.ts` derive from `[Name]Query` (e.g.
  `HeroRD = Omit<HeroContentQuery["heroModels"][number], "coverImage"> & { coverImage: RawImage }`).
  Only image fields are widened — `RawImage` (`src/lib/resolveImage.ts`) adds the local-import
  arm so `fallback.ts` keeps build-optimised images; a live response supplies `{ url, width, height }`.
- **`[Name]ResponseRD`** = the query-result wrapper (`{ heroModels: HeroRD[] }`); that's the
  `T` in `fetchWithFallback<T>` / `fetchOrFail<T>`, so fallback data flows through the mapper
  identically to a real response.
- **Images**: `resolveImage` / `resolveImageOrNull` narrow the RD image union to
  `ImageMetadata | string`; `src/components/ResolvedImage.astro` is the single place that
  branches local-vs-remote for `<Image>`. `astro.config.mjs` has
  `image.domains: ["eu-west-2.graphassets.com"]` so remote Hygraph assets optimise at build.
- **`fetchOrFail` models**: `dummy.ts` deleted for Fixture / Training / Result. Fixture &
  Training mappers return a discriminated `{ ok: true; … } | { ok: false; contact }`
  (contact from `src/constants/contact.ts` — phone is a TODO placeholder); Result returns
  `[]` on failure (cosmetic banner, render nothing). The full message-block UI is Phase 4/5.
- **`/news/[slug].astro`** still uses the hardcoded `"placeholder"` slug — the article detail
  route is Phase 4.

## Phase 3 — Global

- [x] `Base.astro` layout (nav, footer)
- [x] SEO component + `src/constants/seo.ts` (static SEO data) — dynamic derivation for `/nyheter/[slug]` deferred to Phase 4
- [x] `@theme` design tokens — done ahead of phase, see COMPLETED TASKS
- [x] 404 page
- [x] Astro on-demand config — `@astrojs/vercel` adapter; `output` stays `static`, only `/kontakt` sets `prerender = false`
- [x] HG → Vercel rebuild webhook — created by the developer 2026-09-10 (dashboard config, not code)
- [x] `src/constants/contact.ts` — created in Phase 2 for the fetchOrFail message block (phone number still a TODO placeholder)

**Throwaway scaffolding Phase 3/4 replaces** (safe to delete, not patterns to preserve):
~~`src/pages/index.astro`'s inline `<nav>` + the 5 component test-renders~~ (removed in Phase 3);
~~each page stub's own `<html>`/`<head>`~~ (removed in Phase 3 — every page now wraps `Base.astro`);
the per-component `index.astro` test templates (Phase 4 builds real branded UI). Permanent: all `mappers.ts` / `types.ts` /
`fallback.ts`, `src/gql/`, `src/lib/*` (incl. `resolveImage.ts`, `teamLabel.ts`),
`src/components/ResolvedImage.astro`, `src/constants/*`.

## Phase 4 — UI Build

- [x] Homepage — built section by section
  - [x] Hero
  - [x] Nyheter (responsive 5-card mosaic)
  - [x] Senaste resultat (latest-result banner) + Kommande matcher (upcoming fixture cards) — two independent sections, results first
  - [x] Våra partners (logo row)
  - [x] Om oss (Mission) + commercial-slot / contact CTA grid — layout and styling done; commercial-slot no-slot fallback and a real `/kontakt` CTA target still open
  - [x] Homepage design-polish pass (section headers, hover effects, tag labels)
  - [x] Matcher & resultat — Kommande matcher + Senaste resultat combined under one heading (`FixtureResultBanner`)
  - [x] Homepage mobile pass (tighter spacing, left-aligned, stronger image scrims)
  - [x] Fixture cards redesigned ("match ticket") + result banner as a centred scoreboard
- [x] Global: mobile nav drawer (native `<dialog>`), footer redesign, Instagram/Facebook links in nav + footer
- [x] `/herrlaget` (establishes team page pattern — includes fixture card past/upcoming decision)
- [x] `/damlaget`
- [x] `/ungdomslaget` (youth variant of the team page — age-group pathway, parents' checklist)
- [x] Team pages redesign (herr/dam/ungdom): league badge, static intro, training with coach contact, upcoming-only fixtures, scoreboard results
- [ ] `/nyheter` + `/nyheter/[slug]`
- [x] ~~`/sponsorer`~~ — removed 2026-09-24; sponsors live only in the homepage section (nav → `/#partners`)
- [ ] `/kontakt` + Resend

## Phase 5 — Quality

- [ ] Accessibility audit against `/accessibility` skill's Definition of Done
- [ ] Error states verified per `/graphql`'s failure-strategy table (message block vs silent, per model)
- [ ] Empty states per component
- [ ] Image optimisation audit
- [ ] Lighthouse / Core Web Vitals — target 95+

## Phase 6 — Launch

- [ ] Real content populated in HG
- [ ] Webhook confirmed working
- [ ] _Optional, decided 2026-09-24 — not required:_ switch `HYGRAPH_API_URL` (`.env` + Vercel,
      all environments) to Hygraph's CDN endpoint, `https://eu-west-2.cdn.hygraph.com/content/<projectId>/master`.
      - Audit result: production is already safe. ISR limits Hygraph traffic to about 14 requests per hour whatever the traffic (`/` makes 6 per render, `/herrlaget` and `/damlaget` 4 each), plus one set per deploy.
      - The dev-server 429s ("Too Many Requests") come from the regular endpoint (`api-eu-west-2.hygraph.com`), which clears its whole project cache on every Studio edit. Refreshing while editing therefore sends uncached, rate-limited requests.
      - The CDN endpoint clears only the model that changed, and cache hits aren't rate-limited. It was tested with the current read-only PAT and returned 200 with correct data.
      - The only code change is the env comment in `astro.config.mjs`.
      - Verify with `pnpm codegen` (no diff), `astro build`, and `x-vercel-cache: HIT` on a second load of `/`.
      - Do it sooner if dev 429s start getting in the way.
- [ ] Domain pointed to Vercel
- [ ] Final Lighthouse check

---

## Deferred / On the Horizon

- League standings table (extends Fixtures data)
- ICS calendar export
- GDPR/cookie consent
- Club history/trophy timeline
- Swedish/English i18n toggle
- Photo galleries
- Player season stats
- Downloads section
- FAQ page

## Explicitly Out of Scope for v1

- Membership signup + payment
- Live scores
- Dark mode

## COMPLETED TASKS

- use this section to write a brief review of completed tasks. This section will act as a review for the developer to keep track of progress. Mark each task completed with a date, review (anything else you feel is usefull). Keep the review short but concise.

- **2026-09-24 (evening) — Phase 4: team pages redesigned + `/ungdomslaget` built.**
  - **Shared composition** for all three pages: header → static intro → Träningstider → Kommande matcher → Resultat.
  - **Header (TeamPage):**
    - A live league badge (TeamModel affiliation: logo, name, "Se tabellen ↗" to profixio) and jump links to training and matches.
    - A stronger mobile scrim.
    - The affiliation fields are added to the TeamPage query. The fallback leaves them null, so the badge hides during an outage.
  - **Static intro:**
    - New `TeamIntro` component, with content in `src/constants/teamContent.ts`. It's code, not Hygraph, by developer decision.
    - Heading, copy, a 3-fact row, a photo composition, and a recruitment CTA (#traning + mailto).
    - Optional `tone: "youth"`, `stages` (age-group photo cards), `goodToKnow` (checklist), a second photo, and per-image `position`.
  - **Träningstider:**
    - Session cards use the fixture date panel, then type, time range, venue and notes.
    - Each session's coach is shown with photo, name, role, mailto and tel links. `email` and `contactNumber` are now queried (public-facing per fallback-reference).
    - The de-duplicated "Tränare" sub-section is removed. Date parts and ISO times moved into the mapper (the template no longer formats dates).
  - **Fixtures:**
    - The match ticket is extracted to a shared `FixtureCard.astro` (homepage + team pages).
    - Team pages show upcoming fixtures only (`getUpcomingFixtureVMsByTeam`). Past matches belong to Resultat, which has the score.
  - **Results:** compact black scoreboard cards (red bar, chip · SLUTRESULTAT, date, losing side dimmed).
  - **`/ungdomslaget`:**
    - Rounded photos, pill labels, and gently tilted age cards (straight on mobile, no transition under reduced motion).
    - A "Från första studsen till juniorlaget" pathway (7–10 / 11–14 / 15–19, TODO(club) to confirm) and a parents' first-training checklist.
  - **Fix — codegen had been broken since the 2026-09-22 team-page commit.** The `${X_FIELDS}` string interpolation is unreadable to graphql-tag-pluck. It's converted to real fragments (`FixtureFields` / `ResultFields` / `TrainingFields`) and `generated.ts` is regenerated, so the `…ByTeam` queries are now type-generated too.
  - `astro check` (0 errors) + `astro build` pass. Verified on the dev server against live Hygraph for all three pages.
  - **Open for the club:**
    - All intro copy is a draft.
    - Several photos are stock or AI-looking: `mens-cover`, `women-news`, `team4q_mission_jnr`, `junior-cover`.
    - Guardian consent is needed for the youth photos.
    - The Hygraph covers are low-res (960–1000px).
    - The youth league badge reads "Pojkar" while the header shows a girls' squad (one affiliation per team).
    - All current training sessions are dated in the past.
  - **Not checked in a browser:** breakpoints for the intro photo composition, the youth stage-card tilt, and training cards with long emails.

- **2026-09-24 (later) — Phase 4: homepage mobile pass, mobile nav drawer, footer redesign, social links, fixture + result redesign.**
  - **Homepage mobile** (below md; desktop unchanged via `md:` restores):
    - Sections use `py-10 md:py-18` and heading rows `mb-4 md:mb-6`.
    - Headings and text are left-aligned: the Mission/Sponsor two-rule headers drop the left rule, and Mission copy, fixture cards and the result banner are left-aligned.
    - The result score stacks on three lines, in a shorter band (`min-h-72`).
    - Stronger mobile scrims on the Hero and news cards (0.8 → 0.5 → 0.2), so wrapped text never sits on bare photo.
    - The Mission images sit in one 3-up row. CommercialSlot uses `p-5` and a `text-2xl` title.
    - Sponsor logos use a centred 2-col grid for both tiers (`last:odd:col-span-2` centres a lone logo).
  - **Social links:**
    - The confirmed Instagram/Facebook URLs are in `CLUB_CONTACT`, which also feeds Organization `sameAs`.
    - New shared `SOCIAL_LINKS` (contact.ts) and `SocialIcon.astro`, used by the nav and footer, so the SVG paths live in one place.
    - The desktop nav icons are at the end of the row, in full `text-brand-red` (3.56:1). They were `/80`, which is about 2.6:1 and fails WCAG 1.4.11 non-text contrast.
  - **Mobile nav drawer (below lg):**
    - A native modal `<dialog>` (`showModal`), so focus containment, Escape, an inert page behind it and focus return are handled by the browser, not hand-rolled.
    - Slides in from the right at `h-dvh` × `calc(100vw-5rem)`, stopping just past the header logo, which stays visible. The `::backdrop` is transparent (it still closes on tap), and the drawer has no logo of its own. Large Oswald links with a red left bar for `aria-current`, links fading in one after another via `starting:`, and a tagline, email and socials pinned to the bottom.
    - Closes on ✕, Escape, a backdrop tap, a link tap (needed for `/#partners`) and a resize to lg. Page scroll is locked while it's open, and all motion is off under reduced motion.
  - **Footer** (developer-refined):
    - An image band (junior-cover, 70% scrim) with the "Mer än basket." tagline and 48px square social buttons.
    - A `2fr 1fr 1fr` grid: club, page links in 2 columns, contact + training venues.
    - Centred below md, left-aligned from md up. The club name is hidden on mobile, matching the nav.
    - Same `max-w-6xl` content width as every section.
  - **Fixture cards ("match ticket", homepage only):**
    - A black date panel (weekday / huge day number / month) beside a `zinc-100` body with a 4px red top bar. The body has the team chip plus kickoff time, the stacked team names with a visible "mot", a divider, then venue and competition.
    - Left-aligned at every width, and deliberately image-free.
    - New `formatDatePartsSv` (formatDate.ts) formats in UTC, since a date-only ISO string is UTC midnight, so the day is always right whatever the server time zone. It also removes the trailing dot from Swedish month abbreviations.
    - `FixtureVM` gains `weekdayShort` / `dayNumber` / `monthShort`. `TeamFixtureList` is unchanged and can adopt the design in the team-page pass.
  - **Result banner:**
    - A scoreboard grid (`[1fr auto auto auto 1fr]` from md), so the score sits dead centre whatever the name lengths. It uses two "team ··· score" rows on mobile, with DOM order kept as the reading order.
    - The losing side is dimmed to `white/70`, which still meets 3:1 for large text over the scrim, based on new mapper flags `homeWon` / `awayWon`.
    - A red top bar and a "chip · SLUTRESULTAT" label line.
    - The gap between fixtures and result is now `gap-8 md:gap-12`.
  - `scroll-padding-top` raised to 5.5rem for the ~79px header (54px logo).
  - `astro check` (0 errors, 0 hints) + `astro build` pass.
  - **Not checked in a browser:** drawer animations and width, the result row at 768px with a long away name, the mobile fixture top row, the 1024px nav row with the icons, and the footer band crop.

- **2026-09-24 — Phase 4: Matcher & resultat section, mobile type consistency, sticky nav, `/sponsorer` removed.**
  - **Matcher & resultat:** the new `FixtureResultBanner` wraps the upcoming fixture cards and the latest-result banner under one visible h2. `Fixture` and `Result` now render `<div>`s with sr-only h3s. That fixes Result's `aria-labelledby` pointing at a heading that no longer existed, and two nested sections sharing one label. Spacing moved to the wrapper.
  - **Type:** section h2s use `text-3xl md:text-5xl font-extrabold`, card h3s use `text-2xl font-extrabold`, and Mission body text is `text-body md:text-lg`. The Sponsor heading was left unchanged on purpose. Oswald's maximum weight is 700, so `font-extrabold` renders the same as `font-bold`.
  - **Nav:** `fixed` became `sticky top-0`, so the header no longer covers the top of each page. `html { scroll-padding-top: 5rem }` keeps anchor jumps below the header. The skip link was raised to `z-[60]` so the nav no longer hides it. Fixed an existing bug where no menu showed between 768 and 1023px (toggle `md:hidden` vs list `lg:flex`); the toggle is now `lg:hidden`.
  - **`/sponsorer` removed:** the page, `SEO_STATIC.sponsors` and the `/seo` skill rows are gone. The nav/footer "Sponsorer" link now goes to `/#partners` (`id` on the Sponsor section). The old URL returns 404, with no redirect by choice. Earlier log entries that mention `/sponsorer` are left as history.
  - **Also:** a new Hero focal point, new Mission images, and an optional Phase 6 item to switch Hygraph to its CDN endpoint (dev-only 429s; production is already limited by ISR).
  - `astro check` (0 errors) and `astro build` pass.
  - **Not checked in a browser:** whether 7 links fit one row at 1024px, and whether `/#partners` lands correctly from a team page.

- **2026-09-23 — Phase 4, Homepage: design-polish pass + Om oss + CommercialSlot.** Developer-led visual pass over the homepage sections. **Section headers** unified as `text-5xl font-extrabold uppercase` with a hairline rule. **NewsCard:** tag pill replaced by plain uppercase label text; a short red accent stroke above each card grows in length and thickness on hover; card images scale to 105% on hover (`group` on the `<article>`, all transitions disabled under `motion-reduce`). **Result:** banner reworked into a contained image block under the heading; scrim is a 75/60/50% gradient (not flat) — the ≥55% band behind the centred score/date keeps white text ≥4.5:1; score sizes made responsive (was `text-8xl` unwrapped, which overflowed on mobile). **Cleanups:** removed non-existent `justify-left`/`stroke-*`/`text-md` classes (`text-md` is not a theme token; now `text-body`), fixed "Senaste result" typo, deleted commented-out markup. **New `Mission` ("Om oss")** section (developer-authored copy; three-team image row, centre image larger via `md:grid-cols-[1fr_1.6fr_1fr]`, all `aspect-square object-cover`). **New `CommercialSlot`** — `mappers.ts` reuses `getSponsorVMs()` (no new query) and returns the first active sponsor with `hasCommercialSlot` + `commercialImage`, `CommercialSlotVM` = `{ sponsorName, sponsorUrl, logo, image, tagline }`; the first commercial-slot consumer (previously "no consumer reads it yet"). 1×2 grid: left card = commercial image + 60% scrim + logo on a white chip + tagline, whole card links to the sponsor URL; right card = `team-news.jpg` + scrim + "Bli en del av T4Q" CTA copy, whole card is a `mailto:info@team4q.se` (`CONTACT_EMAIL` constant — swap for `/kontakt` once the form exists). Both cards share the news-card image-zoom hover. **Bug fixed:** `NewsCard/fallback.ts` still imported the renamed `team-news.jpeg` (now `.jpg`) — would have broken the fallback path. `astro check` (0 errors, 59 files) + `astro build` green. **Not visually verified headlessly — worth eyeballing:** all new sections at 375/768/1024/1400px; logo-chip legibility for each sponsor logo; scrim contrast over the commercial image. **Open:** commercial-slot fallback when no sponsor has a slot (currently the whole section renders nothing — to be decided); Sponsor heading is now a full sentence in an `h2` (deliberate, sponsor-facing); `Sponsor/index.astro` still not linking to `/sponsorer`.

- **2026-09-22 — Phase 4: `/herrlaget` + `/damlaget` — team page pattern established.** Both replace the identical placeholder shells with the composition the stub comments already named: `TeamPage` header + `Resultat` + `Matcher` + `Träningstider`, section order matching that order. `/ungdomslaget` deliberately excluded — the developer wants it to look different and will plan it separately, so it's untouched (still the placeholder stub). Both new pages are `export const prerender = false` (ISR, same as `/`) since fixture upcoming/past and result staleness depend on the current time. **Resolves the design brief's long-flagged, never-built "fixture past/upcoming visual split"** — per explicit developer direction during planning: one combined fixture list per team (not split from Results), each card styled by its own `isUpcoming` flag rather than two separate fetches. **Team filtering, new pattern:** `Fixture`, `Result`, and `Training` mappers each gained a second, `where: { teamModel: { slug: $slug } }`-filtered GraphQL query alongside their existing unfiltered one (`getFixtureVMsByTeam`, `getResultVMsByTeam`, `getTrainingVMsByTeam`) — mirrors `TeamPageBySlugQuery`'s existing precedent, the only prior team-filtered query in the codebase. Homepage components (`Fixture/index.astro`, `Result/index.astro`) are untouched; shared query field-selections were factored into template-string constants (`FIXTURE_FIELDS` etc.) so the filtered/unfiltered queries and their `toVM` stay in sync. **New UI, per developer's explicit direction (not what was first proposed — see below):** `Fixture/TeamFixtureList.astro` — every active fixture for the team, sorted upcoming-first (soonest first) then past (most recent first), same responsive card grid as the homepage's Kommande matcher; upcoming cards keep the existing outlined white-box + bordered kickoff-time treatment, past cards flip to a filled black box (reusing Result's established black = past/archival visual language) with the kickoff-time box replaced by a plain "Spelad" label — Fixture has no score field, so that's the ceiling of what a past fixture card can say. `Result/TeamResultsList.astro` — a **separate** section, compact grid of the team's visible results (same black styling, no per-card photo, unlike the homepage's single full-bleed banner), since `ResultModel` is the only model that actually carries a score; renders nothing when the team has no visible result, same as the homepage banner. `Training/index.astro` — built for real for the first time (was an empty stub); schedule cards (venue, weekday+date, time range, `trainingTypeLabel`, optional `information`) plus a "Tränare" sub-section of the team's coaches, **de-duplicated by name** across all sessions (`TrainingListVM`'s `ok` branch gained a `coaches: CoachVM[]` field, computed in the mapper — a coach on multiple sessions gets one card, not one per session). No date filtering on Training, confirmed with the developer — `isActive` stays the sole gate, exactly as it already worked. `TeamPage/index.astro` built for real too — a shorter Hero-style cover band (`clamp(20rem,50vh,32rem)` vs Hero's `clamp(28rem,70vh,44rem)`), reusing `getTeamPageVM(slug)` as-is (already fully wired since Phase 2, no mapper/type changes needed). **Deliberately no further abstraction:** `herrlaget.astro`/`damlaget.astro` are each a short, explicit composition of the same four components with their own team slug — no shared "TeamPageLayout" wrapper; two usages didn't justify one, matching this codebase's standing reuse-deferred convention. `astro check` (0 errors, 55 files) + `astro build` green — `/herrlaget` and `/damlaget` build as ISR functions (not prerendered), `/ungdomslaget` still static. Verified against live Hygraph on the dev server: Herrlaget shows exactly its own data (1 result, 2 past + 1 upcoming fixture, 3 training sessions + coaches with no Dam/Ungdom leakage), Damlaget likewise team-isolated. Failure-path verified (dead `HYGRAPH_API_URL`, restarted dev server, restored after): TeamPage header falls back to local content, Matcher and Träningstider both show their message blocks, Resultat quietly disappears — same pattern already established on the homepage. **Not visually verified headlessly — worth eyeballing:** breakpoints at 375/768/1024/1400px, especially the past-fixture black card legibility and the coach avatar/card layout (both genuinely new patterns, not built anywhere else in the codebase yet).

- **2026-09-22 — SponsorModel schema: `hasCommercialSlot` + `commercialImage` fields wired up (data layer only, no UI yet).** Developer added two fields to `SponsorModel` in Hygraph for a future commercial-slot feature: `hasCommercialSlot` (`Boolean!`, required) and `commercialImage` (`Asset`, nullable). Confirmed the exact shape via direct schema introspection before touching code — `commercialImage` is a plain nullable Asset field (same shape as `logo`), not a special relation; the CMS's "Two-way reference" tag is just how Hygraph implements any Asset field internally. Live content check: all 6 sponsors currently have `hasCommercialSlot: false` / `commercialImage: null`. Documented in `fallback-reference.md` as a **Flag** pair — unusual among the project's Flag fields in that Hygraph provides the boolean directly rather than the mapper deriving it from the companion field's presence, so the mapper just passes `hasCommercialSlot` straight through. **Bug caught and fixed:** the developer's own first pass at wiring this up hit a real type error — `src/gql/generated.ts` had gone stale (typed `commercialImage` as non-nullable), so `SponsorRD`/`SponsorVM` and the mapper were built against the wrong shape. Reran `pnpm codegen` against the live schema to get the correct `{ url, width, height } | null` type, then fixed the three dependent files: `SponsorRD.commercialImage` widened to `RawImage | null` (mirrors `logo`'s widening, but nullable); `SponsorVM.commercialImage` changed from an optional property (`?:`) to explicit `ImageMetadata | string | null`; mapper swapped `resolveImage` for `resolveImageOrNull` (the established nullable-image helper, already used elsewhere for e.g. `profileImage`). The developer's `fallback.ts` dummy data was already correctly shaped and didn't need changes — Edument exercises the true path (`hasCommercialSlot: true` + a new local asset `src/images/fallback/sponsors/edument_cover_image.jpg`), the other five mirror live reality (`false`/`null`). `astro check` (0 errors, 53 files) + `astro build` green. **Not consumed by any UI yet** — `Sponsor/index.astro` (the "Våra partners" row, see below) doesn't read either field; this is prep work for a later commercial-slot feature.

- **2026-09-22 — Phase 4, Homepage: Våra partners section — Homepage complete.** Final homepage section; replaces the throwaway `Sponsor/index.astro` test stub (bare `<ul>`, `alt=""`) with the real branded build. **Two independently-wrapping rows, grouped by the existing `SponsorTier` enum (`main | partner | community`) — no new Hygraph field needed**, raised and resolved in conversation before implementation: `main` tier renders larger in a top row, `partner` + `community` share a smaller bottom row. Grouping logic (`getSponsorGroups()`, new in `Sponsor/mappers.ts`) partitions the existing `getSponsorVMs()` output by tier — kept in the mapper per `/data-mapping` ("mapper resolves, UI only renders"), not the template. New `SponsorGroupsVM` type in `Sponsor/types.ts`. Each row uses `flex flex-wrap` (not a grid) so it scales past today's 6 sponsors without competing for space against the other row. Fixed the stub's accessibility bug: logo `alt` is now `sponsor.name` (sponsor logos are meaningful/linked, not decorative, per `/accessibility`'s alt-text table) — previously `alt=""`. Sponsor links open `target="_blank" rel="noopener"`, matching the Footer's existing external-link precedent. `tagline` deliberately not rendered — live data has null taglines for every sponsor; only `fallback.ts` populates them, so rendering it would be an inconsistent surface. No link to `/sponsorer` — that route is still an unbuilt placeholder shell (`<h1>Sponsorer</h1>`), revisit once its tiered grid is actually built. **Data-layer addition:** `ResolvedImage.astro` gained an optional `fit` prop (forwarded to `astro:assets`' `<Image>`, additive/backward-compatible — Hero/Result omit it and keep their existing implicit `cover` crop behavior unchanged), used as `fit="contain"` for sponsor logos so uploaded assets of very different aspect ratios (confirmed 1.0–3.38 across the six fallback logos) render without cropping inside a fixed-size cell. `astro check` (0 errors, 53 files) + `astro build` green. Verified against live Hygraph on the dev server: live content actually has **2** `main`-tier sponsors today (Edument, Loka) vs. fallback's 1 — confirms the grouping logic handles a >1 main-tier count correctly (2 sponsors in the top row, 4 in the bottom), not just the single-sponsor case originally anticipated. Verified the `fetchWithFallback` failure path too: pointed `HYGRAPH_API_URL` at a dead host, restarted the dev server, confirmed all 6 fallback sponsors still render with correct alt text — Sponsor must never show an error state or disappear, and doesn't. **Not visually verified headlessly — worth eyeballing:** breakpoint check at 375/768/1024/1400px for row-wrap spacing, and whether a single lone main-tier logo (a real possibility once live content is edited) looks stranded/off-center alone in its row. **Note:** there is a separate, unrelated uncommitted change already sitting in `Result/index.astro` (visual refinement of the Senaste resultat banner to a full-height band) — untouched by this task, left for the developer to commit separately.

- **2026-09-19 — Phase 4, Homepage: Senaste resultat + Kommande matcher sections.** Two independent homepage sections, results first (`<Result />` then `<Fixture />` in `src/pages/index.astro`). Each component owns its own `<section>` + `h2` and knows nothing about the other; `Result` wraps the whole section (heading included) in its null check, so no visible result / stale / failed fetch renders nothing at all, per `/graphql`. **`Fixture/index.astro`**: next 3 upcoming fixtures as outlined cards (locked "upcoming" treatment) in a 1→2→3 column grid — team tag (HERR/DAM/UNGDOM), `<time>` date + kickoff, teams as the card `h3` (`vs` is `aria-hidden`, an sr-only "mot" carries it for screen readers), league line from the team's affiliation, location. Cards are deliberately not links (no fixtures route / per-match URL exists) and carry no cover image (every live record shares one). `fetchOrFail` failure → a full message block with `CLUB_CONTACT` email (+ phone when set, matching the Footer's `tel:` pattern); none upcoming → "Inga kommande matcher just nu." **`Result/index.astro`**: single full-width banner, decorative `backgroundImage` (`alt=""`) under the shared bottom-up scrim, team tag, score in display type, date. **Data layer (all mapper-side):** `FixtureVM` gains `isUpcoming` (compound flag — `!hasPassedStockholm(date, endTime)`, so a match in progress stays visible), `dateLabel`, `timeLabel`, `isoDateTime`, `tagLabel`; new `getUpcomingFixtureVMs(limit)` (filter + sort + slice) over the unchanged `getFixtureVMs()` so team pages can make their own past/upcoming call; `ResultVM` gains `dateLabel` / `tagLabel`, new `getLatestResultVM()`. `src/lib/formatDate.ts` gains `formatDateWeekdaySv` and `hasPassedStockholm` (judges Swedish wall-clock via `Intl` `Europe/Stockholm` → `"YYYY-MM-DD HH:mm"`, string-comparable, no offset maths; Vercel runs UTC). **Freshness — a deliberate architecture change:** "upcoming" and the 28-day result expiry depend on the current time, which a prerendered page freezes at build. Per the Astro/`@astrojs/vercel` docs, ISR only applies to on-demand pages, so `/` is now `export const prerender = false` with `vercel({ isr: { expiration: 3600, exclude: ['/kontakt'] } })` (adapter-wide setting — `/kontakt` is the SSR form route and must never be cached). Built output verified: `/` → `_isr` function (`expiration: 3600`), `/kontakt` → uncached `_render`, sitemap still lists both, other routes still prerendered. `fallback-reference.md` updated with the now-implemented `isUpcoming`. `astro check` (0 errors, 53 files) + `astro build` green; verified against live Hygraph on the dev server — 3 upcoming cards (the three past September fixtures correctly absent), latest result banner, section order Nyheter → Senaste resultat → Kommande matcher; with `HYGRAPH_API_URL` pointed at a dead host the fixtures show the message block, the result section is absent, and Hero/Nyheter still render from fallbacks. **Not visually verified headlessly — worth eyeballing:** layout at 375/768/1024/1400px and legibility of the white text over the banner image. **Open, deferred to Phase 5:** with ISR a transient Hygraph failure would cache the fixtures message block for up to an hour (mitigation: a short cache lifetime on failure via response headers). **Data note:** all three live results were published 2026-08-27 and hit the 28-day expiry on 2026-09-24 — the Senaste resultat section will disappear until a new result is published. Content typo still open in Hygraph: one fixture's location reads "Idrottshalen".

- **2026-09-19 — Phase 4, Homepage: Nyheter section.** Second homepage section, built directly into `NewsCard/index.astro` for its one current use (no shared/parameterised component — reuse gets reviewed later). A fixed **5-card square mosaic**, mobile-first: **base** = 1 column, every card full-bleed (image + scrim, text bottom-left); **md** = 2 columns, cards 1–4 in a 2×2 and card 5 spanning both columns as a 2:1 banner, all full-bleed; **lg** = 3 columns (`card1 card2 card3 / card4 card5`, card 5 `col-span-2` beside card 4) where cards 1 and 5 stay full-bleed and cards 2/3/4 switch to half image / half white text panel. Cards 2/3/4 are one DOM tree whose classes flip at `lg` (no duplicated markup per breakpoint); CSS Grid auto-placement does the positioning from plain DOM order + one `col-span-2` on card 5. Below `md` each card also carries an underlined **"Läs mer"** cue — `aria-hidden` (Swedish, matching site copy) rather than a second link, since the heading's stretched `::after` already makes the whole card clickable. Data side (all additive): new `src/lib/formatDate.ts` (`formatDateSv`, sv-SE), `teamTagShort` in `teamLabel.ts` (HERR/DAM/UNGDOM per design-brief), `NewsCardVM` gains `dateLabel` / `tagLabel` / `href`, and `fallback.ts` grew from 4 to **5 entries, newest-first** so a Hygraph outage still fills the mosaic. The section renders nothing if fewer than 5 items are available rather than a mosaic with holes. Fixed a bug found along the way: on full-bleed cards the text block was `relative`, so it became the containing block and the stretched link only covered the text — now `z-10` on the text block + `isolate` on the `<article>`, so the whole card is clickable. `astro check` (0 errors, 53 files) + `astro build` green; verified in the built output — 5 articles, exactly one `col-span-2`, real Hygraph headings in newest-first order, sv-SE dates, HERR/DAM/UNGDOM tags, alt = heading, and the `lg` override rules emitted after the `md`/base rules. **Not visually verified headlessly — worth eyeballing:** the `lg` white text panel is only half of a square card, so around 1024–1200px a 3-line heading + 2-line excerpt could crowd the image half. **Still open in Hygraph (content, not code):** the live Hero `ctaUrl` is `kontakt` (no leading slash — resolves correctly from `/` but is fragile as a relative link; should be `/kontakt`). The earlier heading typo is fixed.

- **2026-09-17 — Phase 4 cleanup pass (committed in `9717a43`).** (1) `Base.astro` split into `layouts/Nav.astro` + `layouts/Footer.astro`, with `NAV_LINKS` extracted to `src/constants/nav.ts` (was duplicated in header and footer); Base is now just the shell (head/SEO, skip-link, `<Nav/> <main/> <Footer/>`). Nav's mobile/desktop switch was moved to `lg:` by the developer; a separate mobile-nav component is planned later. (2) **Tailwind-only styling** — Hero/Nav/Footer/skip-link had drifted into scoped `<style>` blocks contrary to the documented Tailwind approach; all converted to utilities (arbitrary values for the hero gradient/`clamp()`, `aria-[current=page]:` / `data-[open=true]:` variants for nav state). Every non-obvious utility was checked against the compiled CSS before relying on it. Hero also regained `mx-auto` (the original custom CSS had `margin-inline:auto`; dropped in conversion so the 1400px content wrapper hugged the left edge). (3) **Content width** 1152px → **1400px** via one `--container-6xl: 87.5rem` override in `global.css` `@theme` — every `max-w-6xl` picks it up; new sections use `max-w-6xl`, never a literal. (4) **FOUT fix** — the "bouncy" reload/navigation flash was not CMS data (all pages are server-rendered with data baked in) but `@fontsource-variable` shipping `font-display: swap` across 5 (Oswald) / 14 (Source Sans 3) `@font-face` blocks. Replaced with two hand-written Latin-only `@font-face` rules (`font-display: optional`, unicode-range copied from the packages) plus `<link rel="preload">` for both files in `Base.astro` (`?url` imports). Compiled CSS has exactly 2 `@font-face` rules; preload hrefs resolve to real hashed files.

- **2026-09-10 — Phase 4, Homepage: Hero section.** First real branded UI. The homepage is being built one section at a time; deliberately **no** shared/parameterised components or global component-class layer yet — reused markup gets refactored in a later review pass so abstraction doesn't block UI iteration. `Hero/index.astro` is now a full-bleed `<section>` (`min-height: clamp(28rem,70vh,44rem)`): live Hygraph cover image via `ResolvedImage` (`loading="eager"`, explicit 2400×1350, `object-cover`), a bottom-up black gradient scrim for text legibility, then `h1` (the page's only h1 — `--text-display` Oswald uppercase white), subheading (gated on the new `hasSubheading` VM flag), and a solid brand-red CTA button (white text, 4.77:1 AA ✓, white `focus-visible` ring). Styling is a component-scoped `<style>` using the `@theme` tokens — no `global.css` change. The `<img>` is emitted by the `ResolvedImage` child so it carries no scope hash; its positioning rule is written `.hero :global(.hero__img)` to reach it through the scoped parent. Only mapper change: `HeroVM.hasSubheading` (2 lines, single-use, additive). `src/pages/index.astro` now mounts `<Hero />` in `<Base>`; the placeholder `<h1>` is gone. `astro check` (0 errors, 49 files) + `astro build` green — `/` prerenders, hero asset optimised to `_astro/*.webp`, Organization JSON-LD intact. A stale dev-server process was 500ing on `/_image` for the remote asset; a fresh `astro dev` serves it 200 — not a code issue. **Content bugs to fix in Hygraph (not code):** the live `HeroModel` record has `ctaUrl: "/contact"` (dead route since the Phase 3 rename — should be `/kontakt`) and a heading typo ("Team Fourth Quarter**s**"). `fallback.ts` is already correct.

- **2026-09-10 — Phase 3 complete (Global): layout, SEO, routing, on-demand rendering.** `src/layouts/Base.astro` is the single layout every page now wraps — black header with the club logo + disclosure nav (mobile toggle with `aria-expanded`/Escape, `aria-current` active state as a red bottom-rule — a non-text accent, so the brand-red-on-black AA restriction does not apply), skip link, and a four-column footer (logo, sitemap nav, contact from `CLUB_CONTACT`, social icons) where each block self-omits when its data is empty. `src/components/SEO/index.astro` is a pure renderer (title/description/canonical/OG/Twitter + optional JSON-LD `<script>`) — it never fetches or falls back. `src/constants/seo.ts` holds hand-written `SEO_STATIC` for every static page (home `Organization`, `/kontakt` `LocalBusiness`, per-team `SportsTeam` via a `teamEntry` helper; news/sponsors carry no JSON-LD); `Base` derives the canonical URL and applies the global description default. `/nyheter/[slug]` gets an inline placeholder `SeoEntry` — real per-article derivation is Phase 4. Added `src/pages/404.astro`, `public/robots.txt`, `public/og-default.jpg`, `public/logo.png`. **All routes renamed to Swedish slugs:** `/herrlaget /damlaget /ungdomslaget /nyheter /nyheter/[slug] /sponsorer /kontakt` (Hero fallback `ctaUrl` and TeamPage mapper/type comments updated to match). **On-demand rendering:** `astro.config.mjs` gains `site: 'https://team4q.se'`, the `@astrojs/vercel` adapter, and `@astrojs/sitemap`; `output` stays `'static'` and only `/kontakt` opts out with `export const prerender = false`, so it alone builds as a serverless function. `astro check` (0 errors, 49 files) + `astro build` green — 8 static routes prerendered, `/kontakt` as a function, `sitemap-index.xml` emitted. The Hygraph → Vercel rebuild webhook (the last Phase 3 item) was created by the developer on 2026-09-10 — dashboard config, not code. **Developer TODO carried forward:** `src/constants/contact.ts` still has placeholder phone/socials/address — empty strings self-omit everywhere so nothing breaks, but they need real values before launch.
- **2026-08-29 — Phase 2 complete: graphql-codegen + live Hygraph swap.** `codegen.ts` + `pnpm codegen` (`node --env-file=.env`) generate `src/gql/generated.ts` (committed, 54 lines, deterministic) from the live schema. Plugin is **`typescript-operations` only** — pairing it with the `typescript` plugin (the planned approach) emitted duplicate identifiers for every selection-set enum in codegen v6 and no config flag fixed it; `typescript-operations` alone is self-contained and gives exactly the `[Name]Query` result types the RD types need. Each `types.ts` now derives `[Name]RD` from `[Name]Query` (image fields widened via `RawImage` in `src/lib/resolveImage.ts` so `fallback.ts` keeps local build-optimised imports; live responses supply `{ url, width, height }`), plus a `[Name]ResponseRD` wrapper used as the `fetchWithFallback`/`fetchOrFail` `T`. All 7 mappers (Hero, NewsCard, Sponsor, TeamPage, Fixture, Training, Result) now call the real client with an inline `gql` query; `fallback.ts` reshaped to the response wrapper; `dummy.ts` deleted for the three `fetchOrFail` models. Fixture/Training mappers return `{ ok } | { ok:false; contact }` (new `src/constants/contact.ts`, phone TODO); Result returns `[]` on failure. `src/components/ResolvedImage.astro` is the single local-vs-remote `<Image>` branch; `astro.config.mjs` gains `image.domains` for the Hygraph CDN. `astro check` (0 errors, 45 files) + `astro build` (8 pages) green **against live Hygraph** — verified in `dist/`: real headings, `publishedDate_DESC` news order, 6 sponsors, affiliation via `teamModel`, remote assets optimised to `_astro/*.webp`, `teamLabel` derivation. Not done here (Phase 4): the message-block UI, `/news/[slug]` detail route, tiered sponsor grid.
- **2026-08-29 — Phase 2: Hygraph permissions + schema re-reconciliation + interim realignment.**
  - **Permissions.** Live-probed the Hygraph endpoint. Fixed the Permanent Auth Token to `Read · all models · Published stage` only (all mutations + DRAFT reads now 403), and disabled the unauthenticated public Content API entirely (was exposing `users` and `clubMemberModels.email` with no token). Known residual: the PAT's `All models` grant still covers the `User` system model — low severity, build-token only; deferred. See the `project_hygraph-permissions-posture` memory.
  - **Schema drift.** The live schema had diverged significantly from the reconciled reference: `isActive` is now the `IsActive` enum (`active|inactive`), not a boolean, and Hero/NewsCard/TeamPage have no such field; the `team` relation is `teamModel` everywhere and nullable; the two shared components are gone — affiliation moved to three inline fields on `TeamModel`, club member became the standalone `ClubMemberModel` (news author + training coaches, coaches now a 0-to-many list); NewsCard `body` is a `RichText` object; +Intersport sponsor. `fallback-reference.md` fully rewritten against live schema + record-level content; `CLAUDE.md` schema section corrected (9→10 models, no components, enum isActive).
  - **Interim realignment (pre-codegen).** All non-deferred `types.ts` reshaped so RD mirrors the live shape (image fields are an interim `AssetRD | ImageMetadata` union — codegen finalises URL-only). `fallback.ts` (Hero/NewsCard/Sponsor/TeamPage) and `dummy.ts` (Fixture/Training/Result) repopulated with real HG-derived content and shape; `Player/dummy.ts` deleted (deferred). All 8 active mappers updated for `teamModel`, enum visibility (`isActive === "active"` filter), `teamLabel` derivation (new `src/lib/teamLabel.ts` — `herrlaget`→"Herrlaget"), RichText `body.html`, coaches list, affiliation via nested team. TeamPage + Training mappers implemented (were stubs); throwaway homepage templates updated to the new VM field names. `astro check` (0 errors, 43 files) + `astro build` (8 pages) clean; built HTML verified — teamLabel derivation, inactive-fixture filter, Result compound visibility (stale + inactive hidden), partial-vs-full affiliation all behave correctly.

- **2026-08-27 — Phase 2 Task 1: `hygraphClient.ts` built.** The single Hygraph gateway now exists at `src/lib/hygraphClient.ts`, structured per the `/graphql` skill: two internal layers (query validation via `graphql`'s `parse()` before any network call; HTTP layer with one module-level `GraphQLClient`, `Bearer` auth, 10s `AbortSignal.timeout`, failure categorisation) and exactly two exported functions — `fetchWithFallback<T>(query, fallbackData, variables?)` and `fetchOrFail<T>(query, variables?)`. Exports `Result<T>` and `HGError` (`kind: network | timeout | http | graphql`, log-facing only). No component imports, no visitor-facing strings, no per-model logic. Env moved to `astro:env` — `astro.config.mjs` registers `HYGRAPH_API_URL` + `HYGRAPH_TOKEN` as `context: server, access: secret` with `validateSecrets: true`; `.env` unchanged, no new deps. **One deliberate deviation from plan:** signatures take `variables?: Variables` (graphql-request's structural `object`), not a `TypedDocumentNode<T, V>` generic — v7's conditional `variables` type can't resolve against an unbound generic and rejects the call. Callers pass `<T>` explicitly for now; typed-document inference can return via overloads in Task 3 with codegen. Verified with a throwaway `probe.astro` against live Hygraph: `{ __typename }` returns `{ ok: true, data }` / live value; a bad host yields `{ ok: false, error: { kind: "network" } }` + fallback + structured `console.error`; a malformed query throws `hygraphClient: malformed GraphQL query — …` before any request; token and endpoint confirmed absent from `dist/`. `astro check` (0 errors, 43 files) and `astro build` (8 pages) clean, probe removed.

- **2026-08-27 — Homepage dev/test wiring (not Phase 4 UI); Phase 1 complete.** At the developer's request, added a plain-text nav + wired up Hero, NewsCard, Fixture, Result, and Sponsor on `/` so the pipeline can be checked visually in a browser. Explicitly throwaway: no styling, marked with comments to be removed once `Base.astro` (Phase 3) and real branded markup (Phase 4) land. Player and Training were left out — they belong to the team-page pattern, not the homepage. This implemented real `mappers.ts` + VM types for all 5 components (RD → mapper → VM → UI, reading from each component's `fallback.ts`/`dummy.ts` in place of a live Hygraph call, which doesn't exist until Phase 2) — legitimate, permanent mapper logic, not part of the throwaway UI. Result's mapper implements the documented `isStale`/`isVisible` compound-flag derivation from `publishedAt`, filtering internally so no consumer ever needs to check the flag itself; verified against the build output that an active-but-stale dummy result is correctly hidden while two active-and-fresh ones render.
  - **Follow-up round, same day:** developer review caught two violations of the `/data-mapping` skill's "mapper resolves, UI only renders" rule — plain `<img>` instead of `astro:assets`' `<Image />`, and `typeof x === "string" ? x.src : x` type-narrowing ternaries sitting in the templates. Fixed across all 5 components: every image-carrying VM field is now resolved to a plain `ImageMetadata` in the mapper (RD's `ImageMetadata | string` union narrowed down, since only local imports occur before Phase 2's live Hygraph URLs — flagged in comments for revisiting then), and templates call `<Image>` directly with no branching. Result's visibility filter also moved fully into the mapper (was a page-level `.filter()`). Surfaced a real missing dependency in the process: Astro's `<Image />` needs `sharp` for build-time optimization, which wasn't installed — added it (`sharp` now a dependency); rebuild confirms real optimization (e.g. hero cover 367kB → 25kB WebP) where the plain `<img>` version had none. This fully exercises the RD → mapper → VM → UI pattern end-to-end across 5 components, so Phase 1's last item is now checked off — **Phase 1: Foundation is complete.**
  - `astro check` (0 errors, 42 files) and `astro build` (8 pages, all images optimized) verified, plus a manual grep of the built `dist/index.html` confirming dummy content, the Result visibility filter, and real `<Image>`-generated markup (`loading="lazy"`, `.webp` output) all render correctly.

- **2026-08-27 — Phase 1: dummy data for the four `fetchOrFail` models.** Hero/NewsCard/Sponsor/TeamPage already had real dummy data via `fallback.ts` (done ahead of schedule, pre-Phase 1). For Fixture, Training, Player, Result — all `fetchOrFail` — added `dummy.ts` per component instead: a new, explicitly dev-only file, since the `/graphql` skill forbids these four ever having a `fallback.ts` (they show a message block or nothing on failure, never fallback content). Each `dummy.ts` is flagged in a header comment as temporary scaffolding to delete once Phase 2 wires real Hygraph queries — unlike `fallback.ts`, which stays permanently as runtime fallback content. Data covers all three teams (Herrlaget/Damlaget/Ungdomslaget) with realistic Skåne-region opponents, and deliberately mixes flagged-field presence/absence (`coverImage`, `jerseyNumber`, `information`, `date`) to exercise both true/false paths once mappers derive their `hasX` flags. Result's `backgroundImage` reuses the three existing team cover assets per `fallback-reference.md`'s "preset branded asset" rule — no new images needed. Also fixed a bug from the prior folder-structure task: `Training/types.ts`'s `information` field was typed as plain `string`, inconsistent with the established RD pattern of `string | null` for Default-category optional fields (matching `HeroRD.subheading`/`TeamPageRD.subheading`) — corrected. `astro check` (0 errors, 42 files) and `astro build` (8 pages) both verified.

- **2026-08-27 — Phase 1: page routes scaffolded.** All 8 routes now exist: `/`, `/mens`, `/womens`, `/juniors`, `/news`, `/news/[slug]`, `/sponsors`, `/contact`. Each is a standalone stub (own `<html>`/`<head>`/`<title>`, Swedish `<h1>` placeholder) since `Base.astro` doesn't exist until Phase 3 — deliberately not building a shared layout early. `/news/[slug]` uses `getStaticPaths` with a single hardcoded `"placeholder"` slug to prove the dynamic-route pattern compiles and builds, without wiring into NewsCard's fallback data yet (kept separate from Phase 1's dummy-data/end-to-end-mapping items). `/contact` stays a static stub for now — its SSR (Astro hybrid mode) conversion is a Phase 3 item. `astro check` (0 errors, 38 files) and `astro build` (8 pages) both verified.

- **2026-08-25 — Phase 1: component folder structure.** All 8 UI-rendering models now have a `src/components/[name]/` folder matching the `/data-mapping` skill's structure. Hero/NewsCard/Sponsor/TeamPage (already had `types.ts` + `fallback.ts`) got their missing `index.astro` + `mappers.ts` added; Fixture/Training/Player/Result are new folders with real `types.ts` RD interfaces written against `fallback-reference.md`, correctly omitting `fallback.ts` since all four are `fetchOrFail` models. `TeamModel` itself got no folder — it's relation-only, inlined per consumer as `[Component]TeamRD`, matching the existing `NewsCardTeamRD`/`TeamPageTeamRD` precedent. `mappers.ts`/`index.astro` across all 8 are intentionally non-functional stubs (throw/placeholder comment) — real mapper logic and markup are separate Phase 1/Phase 4 items, deferred on purpose since `hygraphClient.ts` doesn't exist until Phase 2. One open item to verify against Hygraph directly: `AffiliationComponent`'s fields weren't in the reconciled reference doc, so `Fixture/types.ts`'s `AffiliationRD` is a placeholder pending confirmation. `astro check` (0 errors) and `astro build` both verified after all additions.

- **2026-08-25 — Design system tokens.** Went straight from brief to locked `@theme` tokens in `global.css` (colours, Oswald/Source Sans 3 self-hosted variable fonts, full type scale with paired line-height/letter-spacing/weight), skipping the intermediate written-proposal step. Brand red verified against WCAG AA: 4.77:1 on white (passes, narrow margin), 3.56:1 on black (fails normal text — restriction on red-on-black confirmed necessary, not hypothetical). Ratios are documented as a comment in `global.css` itself. Fixture past/upcoming visual split resolved (black result box vs. outlined upcoming box + primary red CTA). Typeface pairing (Oswald + Source Sans 3) was a developer decision, not assumed.

- **2026-08-25 — Workflow doc established.** `workflow.md` added: Plan → Confirm → Execute → Review → Build loop, git-command scope (read-only always fine, mutating ops are the developer's), scope discipline, and on-demand doc/skill reading per feature rather than reading everything up front.

- **2026-08-25 — Fallback data for the four `fetchWithFallback` models.** Created `types.ts` + `fallback.ts` under `src/components/{Hero,TeamPage,NewsCard,Sponsor}/` (interim hand-written RD types, flagged for replacement once graphql-codegen lands in Phase 2 — no `mappers.ts`/`index.astro` yet, that's Phase 1's own item). Content is fully populated per field (no fields left empty to exercise a flag=false path), using the real uploaded assets in `src/images/fallback/` as static imports so Astro's `<Image>` optimizes them. Sponsor data uses the club's real sponsors (Edument, Swedbank, Sparbanken Skåne, Loka, Direkten) — initially flagged two URLs as inferred and left `tier` as an `"unset"` placeholder; developer has since verified all URLs directly, corrected `SponsorTier` to the real Hygraph enum (`"main" | "partner" | "community"`), and set real tier values per sponsor. `t4q-logo.png` (the club's own logo, initially misfiled into the sponsors asset folder) has been relocated by the developer to `src/images/logos/`. Added `typescript` + `@astrojs/check` as devDependencies (pinned to TypeScript 6.x — 7.x's native compiler isn't yet supported by `astro check`) since there was previously no way to type-check standalone `.ts` files not yet wired into a page. Re-verified `astro check` (0 errors) and `astro build` after these edits.
