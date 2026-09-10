# T4Q Progress Tracker

Last updated: 2026-09-10 (Phase 4 — Homepage: Hero section)

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

- [ ] Homepage — built section by section
  - [x] Hero
  - [ ] Nyheter (featured + grid)
  - [ ] Matcher & resultat
  - [ ] Våra partners (logo row)
- [ ] `/herrlaget` (establishes team page pattern — includes fixture card past/upcoming decision)
- [ ] `/damlaget`
- [ ] `/ungdomslaget`
- [ ] `/nyheter` + `/nyheter/[slug]`
- [ ] `/sponsorer` (tiered grid)
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
