# T4Q Progress Tracker

Last updated: 2026-08-25

## Status at a glance

| Phase                                   | Status         |
| --------------------------------------- | -------------- |
| Planning — skills, schema, design brief | ✅ Done        |
| Phase 1 — Foundation                    | ⬜ Not started |
| Phase 2 — HG Connection                 | ⬜ Not started |
| Phase 3 — Global                        | ⬜ Not started |
| Phase 4 — UI Build                      | ⬜ Not started |
| Phase 5 — Quality                       | ⬜ Not started |
| Phase 6 — Launch                        | ⬜ Not started |

---

## Planning ✅

- [x] Stack locked (Astro 7, Hygraph, Tailwind 4, graphql-request/codegen, Vercel, Resend, pnpm)
- [x] Hygraph schema built and reconciled field-by-field against actual config (9 models: Team, NewsCard, Fixture, Player, Training, TeamPage, Sponsor, Hero, Result)
- [x] `/accessibility` skill — locked
- [x] `/data-mapping` skill — locked
- [x] `/graphql` skill — locked
- [x] `/seo` skill — locked
- [x] `fallback-reference.md` — locked, matches reconciled schema
- [x] Design brief + 8 reference screenshots — ready for Claude Code proposal

**Open before Phase 1 starts:**

- [x] Design system locked (type scale, spacing scale, exact brand red hex + AA verification) — implemented directly as `@theme` tokens in `global.css` rather than a separate proposal doc; see COMPLETED TASKS below
- [x] `fallback.ts` content drafted for the four `fetchWithFallback` models (News, Sponsor, Hero, TeamPage) — see COMPLETED TASKS below

---

## Phase 1 — Foundation

- [ ] Folder structure (`src/components/[name]/{index.astro,mappers.ts,types.ts,fallback.ts?}`)
- [ ] Page routes scaffolded (`/`, `/mens`, `/womens`, `/juniors`, `/news`, `/news/[slug]`, `/sponsors`, `/contact`)
- [ ] Dummy data matching reconciled HG field shapes (not the original pre-reconciliation guesses)
- [ ] Data mapping pattern validated end-to-end (RD → mapper → VM → UI) on at least one component

## Phase 2 — HG Connection

- [ ] `hygraphClient.ts` built — query validation + HTTP client, exposes `fetchWithFallback` / `fetchOrFail`
- [ ] graphql-codegen wired up, generating RD types from live schema
- [ ] Swap dummy data for real HG responses, model by model

## Phase 3 — Global

- [ ] `Base.astro` layout (nav, footer)
- [ ] SEO component + `src/constants/seo.ts` (static SEO data) + dynamic derivation for `/news/[slug]`
- [x] `@theme` design tokens — done ahead of phase, see COMPLETED TASKS
- [ ] 404 page
- [ ] Astro hybrid mode config (static + SSR for `/contact`)
- [ ] HG → Vercel rebuild webhook
- [ ] `src/constants/contact.ts`

## Phase 4 — UI Build

- [ ] Homepage
- [ ] `/mens` (establishes team page pattern — includes fixture card past/upcoming decision)
- [ ] `/womens`
- [ ] `/juniors`
- [ ] `/news` + `/news/[slug]`
- [ ] `/sponsors` (tiered grid)
- [ ] `/contact` + Resend

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

- **2026-08-25 — Design system tokens.** Went straight from brief to locked `@theme` tokens in `global.css` (colours, Oswald/Source Sans 3 self-hosted variable fonts, full type scale with paired line-height/letter-spacing/weight), skipping the intermediate written-proposal step. Brand red verified against WCAG AA: 4.77:1 on white (passes, narrow margin), 3.56:1 on black (fails normal text — restriction on red-on-black confirmed necessary, not hypothetical). Ratios are documented as a comment in `global.css` itself. Fixture past/upcoming visual split resolved (black result box vs. outlined upcoming box + primary red CTA). Typeface pairing (Oswald + Source Sans 3) was a developer decision, not assumed.
- **2026-08-25 — Workflow doc established.** `workflow.md` added: Plan → Confirm → Execute → Review → Build loop, git-command scope (read-only always fine, mutating ops are the developer's), scope discipline, and on-demand doc/skill reading per feature rather than reading everything up front.
- **2026-08-25 — Fallback data for the four `fetchWithFallback` models.** Created `types.ts` + `fallback.ts` under `src/components/{Hero,TeamPage,NewsCard,Sponsor}/` (interim hand-written RD types, flagged for replacement once graphql-codegen lands in Phase 2 — no `mappers.ts`/`index.astro` yet, that's Phase 1's own item). Content is fully populated per field (no fields left empty to exercise a flag=false path), using the real uploaded assets in `src/images/fallback/` as static imports so Astro's `<Image>` optimizes them. Sponsor data uses the club's real sponsors (Edument, Swedbank, Sparbanken Skåne, Loka, Direkten) — initially flagged two URLs as inferred and left `tier` as an `"unset"` placeholder; developer has since verified all URLs directly, corrected `SponsorTier` to the real Hygraph enum (`"main" | "partner" | "community"`), and set real tier values per sponsor. `t4q-logo.png` (the club's own logo, initially misfiled into the sponsors asset folder) has been relocated by the developer to `src/images/logos/`. Added `typescript` + `@astrojs/check` as devDependencies (pinned to TypeScript 6.x — 7.x's native compiler isn't yet supported by `astro check`) since there was previously no way to type-check standalone `.ts` files not yet wired into a page. Re-verified `astro check` (0 errors) and `astro build` after these edits.
