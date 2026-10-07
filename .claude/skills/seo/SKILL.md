# SEO Skill

## Intent

SEO is the developer's responsibility, not the client's. No HG SEO fields exist, and none should be added — the client has no time or need to manage SEO, so it is not built as editable content.

Almost all SEO is static, hand-written once by the developer at build time — homepage, team pages, the training page and the news listing page all fall into this category, because their content is low-frequency and dev-controlled. The one exception is `/nyheter/[slug]`, where article volume and client-driven publishing make dynamic derivation from NewsCardModel worth the complexity. Static-by-default, dynamic only where it earns its cost.

## Outcomes

- Single SEO component handles all meta tag and JSON-LD rendering, regardless of whether its props are static constants or derived VM values
- Global defaults set once in base layout
- Static pages pull hand-written SEO data from code constants — never from HG
- `/nyheter/[slug]` derives SEO from the article's own VM values
- JSON-LD is correct per page type, and is never emitted from fallback or failure-state content
- Client unaware SEO exists — no admin burden, no HG schema footprint

## File Structure

```
src/components/SEO/index.astro   — renders meta tags and JSON-LD in document head
src/layouts/Base.astro           — imports SEO component, passes global defaults
src/constants/seo.ts             — hand-written static SEO data for every non-dynamic page, keyed by page/team
```

## Global SEO — Base Layout

Set once in `Base.astro`. Never changes page to page.

- Site name — T4Q Helsingborg
- Default meta description — club description in Swedish
- Default OG image — `public/og-default.jpg` (static, 1200×630; absolute URL)
- Canonical URL — derived from `Astro.url`
- `lang="sv"` on the html element
- Favicon
- Robots meta — index, follow
- Astro sitemap integration — auto-generated on build (must be explicitly configured in `astro.config.mjs` — does not work without it)

## Static SEO Data — `src/constants/seo.ts`

Hand-written once, imported directly by the page — no fetch, no HG involvement, no client-facing admin surface. This is configuration, not content: the client never edits it, so it has no reason to live in a CMS.

| Page                                         | Source                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Homepage `/`                                 | `SEO_STATIC.home`                                                                                                                                            |
| `/herrlaget`, `/damlaget`, `/ungdomslaget`   | `SEO_STATIC.team['mens' \| 'womens' \| 'juniors']` — keyed in code per team, not derived from any TeamModel field, since TeamModel has no SEO data of its own |
| `/traning` (all teams' training)             | `SEO_STATIC.training`                                                                                                                                        |
| `/nyheter` (listing page)                    | `SEO_STATIC.newsListing`                                                                                                                                     |

There is no contact page — contact is `mailto:` only (`/kontakt` was dropped 2026-10-01), so the club's contact details live on the homepage Organization JSON-LD below.

Each entry supplies title, description, ogImage, and jsonLd in full — the page passes it straight to the SEO component, unmodified.

## Dynamic SEO — `/nyheter/[slug]` only

The one page that derives SEO from live content:

| Prop        | Source                                                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title       | Article heading                                                                                                                                            |
| Description | Article excerpt                                                                                                                                            |
| OG Image    | Article's resolved cover image — the real image if present, the derived placeholder if not (see `/data-mapping`'s Cover Image treatment for NewsCardModel) |
| JSON-LD     | NewsArticle, built from the article's own VM values — see below                                                                                            |

If the article's own fetch used its fallback content (i.e. `fetchWithFallback` served `fallback.ts` rather than a real HG response), SEO derivation still runs normally — the fallback content is realistic, RD-shaped placeholder data by design, so it produces valid (if generic) SEO output rather than needing to be suppressed. This is different from the JSON-LD suppression rule below, which applies to `fetchOrFail` failure states, not `fetchWithFallback` content.

## SEO Component Props

- title: string
- description: string
- ogImage: string
- canonical: string
- jsonLd: object | null

`jsonLd` is the one optional prop — see JSON-LD Suppression below for when it's omitted. Every other prop is always required, whether it came from a static constant or a derived VM value. The SEO component only renders what it's given — it never derives, fetches, or falls back on its own.

## JSON-LD Per Page Type

**Homepage — Organization**

- name, url, logo, sameAs (social URLs from `src/constants/contact.ts`)
- email, telephone (when set) and postal address from `src/constants/contact.ts` — the club's one "who we are and how to reach us" entity, since there is no contact page
- Hand-written in `SEO_STATIC.home`

**`/nyheter/[slug]` — NewsArticle**

- headline from article heading, description from excerpt, image from resolved cover image, datePublished from published date, author from the article's ClubMemberVM (Author)
- The only fully dynamic JSON-LD in the site

**`/herrlaget`, `/damlaget`, `/ungdomslaget` — SportsTeam**

- name, sport ("Basketball"), url (canonical), location (Helsingborg)
- Hand-written per team in `SEO_STATIC.team`

**Fixtures — SportsEvent**

- **Status (2026-10-07): not built yet — scheduled for Phase 5** (see `progress-tracker.md`).
- Not a standalone page. Emitted per-fixture, nested within each team page (`/herrlaget`, `/damlaget`, `/ungdomslaget`), alongside that page's SportsTeam schema — one SportsEvent block per visible fixture: upcoming, active fixtures only, exactly the set the page's fixture cards show.
- **One fetch, shared.** The team page fetches its upcoming fixtures once and passes the same result to both the fixture list and the JSON-LD builder, so the structured data can never describe different matches from the visible cards.
- **Freshness is the page's freshness.** Both come from the same render and the same ISR entry; a Hygraph publish triggers a redeploy via the webhook. No JSON-LD-specific refresh logic, and no fields the club would have to maintain (`eventStatus`, offers).
- name from fixture heading, startDate from date + start time, location from the venue string, homeTeam/awayTeam from the fixture's own fields
- **Only emitted when FixtureModel's fetch succeeded.** If the page is showing the `fetchOrFail` failure message instead of real fixtures (see `/graphql`), no SportsEvent JSON-LD is emitted — there is no real event data to describe, and emitting anything here would be structured data that doesn't match what's visibly on the page.

## JSON-LD Suppression on Failure

JSON-LD is only ever emitted when it describes real, currently-visible content. It is never generated to describe a `fetchOrFail` failure state.

- **Static pages** — JSON-LD is hand-written and has no fetch dependency, so this never applies to them.
- **`fetchOrFail` pages/sections that fail (Fixtures, Training, Results, Players)** — the page renders its failure message (or, for Results/Players, renders nothing) instead of real content. JSON-LD describing that content is omitted entirely for that section — pass `jsonLd: null` to the SEO component (or simply don't emit the nested SportsEvent block for Fixtures) rather than describing content that isn't actually there.
- **`fetchWithFallback` pages (News, Sponsors, TeamPage)** — fallback content is realistic RD-shaped placeholder data by design, not a failure state, so JSON-LD is still generated normally from it. The one exception is `/nyheter/[slug]`: a fallback article is rendered with `noindex`.

## Gotchas

- Never add SEO fields to HG models — this includes team, sponsor, or any other static-page SEO data. It lives in `src/constants/seo.ts`, not the CMS, because the client never edits it.
- Team page SEO is keyed per team (`mens`/`womens`/`juniors`) in code — it is not derived from any TeamModel field, since TeamModel has no SEO data of its own.
- JSON-LD must be valid — validate against schema.org before shipping
- OG image must be an absolute URL — HG asset URLs are absolute by default; static OG images in `seo.ts` must be absolute too
- Canonical URL must always be set — prevents duplicate content issues on Vercel preview URLs
- Sitemap integration must be configured in `astro.config.mjs` — it does not work automatically without the integration added
- `lang="sv"` must be on the html element in `Base.astro` — not just the body
- Social URLs in Organization JSON-LD come from `src/constants/contact.ts` — never hardcoded twice in two places
- Never emit JSON-LD for a `fetchOrFail` section that's currently in its failure state — see JSON-LD Suppression above
