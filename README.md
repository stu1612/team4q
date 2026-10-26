# Basketball club website rebuild

A self-initiated rebuild of the website for a basketball club in Helsingborg with men's, women's and youth teams. The club's current site runs on a drag-and-drop builder and isn't responsive. I built this to show what it could be: a site where the club can publish news, fixtures, results and training times themselves, without needing a developer.

This isn't a commissioned project. I've offered it to the club, and it isn't affiliated with them or live under their domain.

## Who it's for

Parents checking training times, fans checking fixtures, sponsors who expect to be seen, and club volunteers who need to post news from their phone. The design puts activity (news, fixtures, results) ahead of static "about" content.

## Stack

- **Astro** with **TypeScript** in strict mode
- **Hygraph** as a headless CMS, queried over **GraphQL** with `graphql-request`
- **graphql-codegen** to generate types from the live schema, so no response type is written by hand
- **Tailwind CSS 4** through the Vite plugin, with design tokens in an `@theme` block
- **Vercel** for hosting, pnpm for packages

## How the data flows

Every content component follows the same pattern:

```
Hygraph response  ->  mappers.ts  ->  view model  ->  index.astro
   (generated types)   (shape + fallbacks)  (types.ts)     (render only)
```

- **Mappers** are the only place raw CMS data gets reshaped. Components never touch a GraphQL response directly.
- **Fallbacks are decided per field**, not guessed. Each field is marked Required, Flag, Default, or Default with a derived placeholder, so a missing image or empty description has a known outcome.
- **One Hygraph client** exposes two functions: `fetchWithFallback` for content that can degrade gracefully, and `fetchOrFail` for content the page can't work without. Every model is assigned one of them on purpose.

## Other decisions

- **`graphql-request` over Apollo.** The site is server-rendered and static. Apollo's client-side cache would be dead weight.
- **SEO lives in code, not the CMS.** The club won't manage meta tags, so static pages get hand-written SEO and JSON-LD. Only news articles derive SEO from their content.
- **Accessibility is the baseline.** WCAG 2.1 AA, including a specific rule for where the brand red can and can't be used so it keeps enough contrast.
- **Content the club doesn't edit stays in code.** The homepage hero started as a CMS model and was moved back into code when it was clear nobody would change it.

## How it's built

I built this with Claude Code, and the setup is the result of getting it wrong on earlier projects.

**Where I started.** On [Probell](https://github.com/stu1612/probell-astro) I used heavy spec-driven development: long specs and detailed docs, on the idea that more instruction meant better output. When I checked context usage, a large share of each session was going on the agent reading my own documentation rather than doing the work, and the specs kept drifting out of date.

**What I changed.**

- **A short `CLAUDE.md`** that says what the project is and who it's for, then points to the skills instead of repeating them.
- **Four focused [skills](.claude/skills)** for the decisions that would otherwise drift between components: data mapping, GraphQL access, SEO and accessibility. Each one defines the outcome and the hard rules, not the implementation. Where a skill is silent, that's deliberate room for the agent's judgement.
- **Reference data kept separate from judgement.** The field-by-field fallback table lives in its own reference file, so the skills stay short.
- **Plan mode by default.** Every plan is reviewed before anything is built on it, and decisions get locked before more work is stacked on top.

The result is less for the agent to read, fewer places for instructions to contradict each other, and more consistent components. I still read through what it writes. That's where most of my learning comes from.

## Running it

```sh
pnpm install
pnpm codegen    # needs HYGRAPH_API_URL and HYGRAPH_TOKEN in .env
pnpm dev        # localhost:4321
pnpm build
```
