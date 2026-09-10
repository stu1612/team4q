# T4Q — Project Overview

## What this is

A full rebuild of team4q.se, the website for a basketball club based in Helsingborg, Sweden. The existing site is built on an outdated, non-responsive drag-and-drop platform and is being replaced entirely with a modern, architecturally considered stack.

## Who it's for

**The club** — a real basketball club with three active teams (men's, women's, youth/juniors), competing in the Helsingborg/Skåne region. The site needs to serve real visitors: parents checking training times, fans checking fixtures, sponsors expecting visibility, and the club itself needing an easy way to publish news without technical help.

**The developer** — this project is also a deliberate portfolio piece, built to demonstrate hireable skill to the Skåne/Copenhagen tech job market. That context matters for how it's built, not just what it does: architectural decisions are made with the same rigor a professional team would expect, not just "whatever ships fastest." Where a shortcut and a correct-but-slower approach conflict, prefer the approach that's defensible in a technical interview.

## Design intent

Editorial, content-first, not visually chaotic — closer to a professional football club's site (Manchester United, Juventus) translated into basketball, at a scale appropriate for a small regional club rather than a global one. Activity (news, fixtures) is surfaced before static "about" content. Hero sections are emotive, not informational. Brand colours are black, white, and a T4Q red — used deliberately and restrictively, not applied everywhere just because it's the brand colour (see `/accessibility` skill for the exact contrast rules governing this).

Full design reference material — screenshots, extracted patterns, locked and open decisions — lives in `design-brief.md` and `design-patterns.md`.

## Tech stack

- **Framework:** Astro 7, TypeScript (strict mode)
- **CMS:** Hygraph (GraphQL headless CMS) — schema fully built and reconciled against the actual live config
- **Styling:** Tailwind CSS 4 via the Vite plugin — no `tailwind.config.js`, design tokens live in an `@theme` block
- **Data layer:** `graphql-request` (chosen over Apollo — Astro is server-rendered/static, Apollo's client-side caching is dead weight here) + `graphql-codegen` (schema-generated types feed every RD type — never hand-written)
- **Hosting:** Vercel, connected to GitHub, environment variables configured
- **Email:** Resend, for the contact form (the one SSR route on an otherwise static site)
- **Package manager:** pnpm

## How this project is built

This is being built through structured delegation to Claude Code, not line-by-line instruction. The governing principle: **skills define outcomes and structural constraints, not implementation steps.** A skill states what good looks like and pins down decisions that would otherwise cause inconsistency across components — it does not dictate control flow, variable names, or specific code. Where a skill is silent, that's a deliberate space for Claude Code's own judgment, not an oversight to guess around.

Four skills govern this build, all located under the project's skills directory:

- **`/data-mapping`** — the RD → mapper → VM → UI pattern every component follows. Three-file structure (`index.astro`, `mappers.ts`, `types.ts`, plus optional `fallback.ts`), naming conventions, mapper responsibilities, field-level fallback treatment (Required / Flag / Default / Default-with-derived-placeholder).
- **`/graphql`** — all Hygraph communication goes through one centralized client, `hygraphClient.ts`, exposing exactly two functions (`fetchWithFallback`, `fetchOrFail`). Every model is assigned an explicit failure strategy — no model is left for Claude Code to guess about.
- **`/seo`** — no SEO fields in Hygraph, ever. Static pages (everything except `/nyheter/[slug]`) get hand-written SEO/JSON-LD from code constants, because the client will never manage this content. Only news articles derive SEO dynamically from live content.
- **`/accessibility`** — WCAG 2.1 AA as a baseline, not a target. Includes the specific brand-red contrast resolution rule and a Definition of Done checklist.

A companion reference doc, `fallback-reference.md`, holds the model-by-model Required/Flag/Default table — this is data the skills point to, not a skill itself, since it encodes no judgment, just the reconciled schema facts.

## Working relationship

- **Claude Chat** — planning, architectural decisions, feature docs, schema design
- **Claude Code** — implementation, in plan mode by default
- **The developer** — retains authority at every decision and review point; proposals get reviewed and locked before being built on further, the same way the design brief is a proposal input, not a finished spec

## Current Hygraph schema

Ten models, reconciled field-by-field against the live Hygraph config on 2026-08-29 (introspection + record-level verification): `TeamModel`, `NewsCardModel`, `FixtureModel`, `PlayerModel`, `TrainingModel`, `TeamPageModel`, `SponsorModel`, `HeroModel`, `ResultModel`, `ClubMemberModel`. No shared components — team affiliation is three inline fields on `TeamModel` (`teamAffiliation`, `affiliationUrl`, `affiliationLogo`); club members (news authors, training coaches) are the standalone `ClubMemberModel`. `FixtureModel`, `TrainingModel`, `SponsorModel`, and `ResultModel` carry a developer-controlled `isActive` **enum** (`IsActive`: `active | inactive`), distinct from Hygraph's own publish/unpublish state; `HeroModel`, `NewsCardModel`, and `TeamPageModel` have no such field. `PlayerModel` is out of scope for v1 (future roster feature). The team relation is named `teamModel` on every model and is nullable. Full field-level treatment lives in `.claude/skills/data-mapping/fallback-reference.md`.

## Where things stand

See `progress-tracker.md` for the live phase-by-phase checklist. Schema and all four skills are locked; design brief is ready for Claude Code's first design-system proposal; implementation is starting now.

## What's explicitly out of scope for v1

Membership signup with payment, live scores, dark mode. Do not build toward these unless the brief changes.

## What's deferred but planned

League standings table, ICS calendar export, GDPR/cookie consent, club history/trophy timeline, Swedish/English i18n toggle, photo galleries, player season stats, downloads section, FAQ page. Don't build these speculatively — they're not in scope until explicitly requested.

---

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
