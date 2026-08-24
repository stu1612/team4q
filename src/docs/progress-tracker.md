# T4Q Progress Tracker

Last updated: 2026-08-24

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

- [ ] Claude Code design system proposal reviewed and locked (type scale, spacing scale, exact brand red hex + AA verification)
- [ ] `fallback.ts` content drafted for the four `fetchWithFallback` models (News, Sponsor, Hero, TeamPage) — RD-shaped, satisfies each model's Required fields

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
- [ ] `@theme` design tokens (from locked Claude Code proposal)
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
