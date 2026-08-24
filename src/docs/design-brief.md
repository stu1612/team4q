# T4Q Design Brief — for Claude Code's Design System Proposal

## How to use this brief

This is not a finished design system — it's a brief. Propose a design token system (type scale, spacing scale, exact colour values, component treatment for the specific patterns below) based on this. The proposal gets reviewed and locked before any component is built against it — do not treat this as final, and do not build UI directly from it without the proposal-review step happening first.

## Reference Screenshots

- Six screenshots included in /src/images

## Brand Constraints (non-negotiable)

- Colours: black, white, T4Q brand red — no other primary colours
- proposed red #db1d24
- proposed black #181818
- proposed white #fafafa
- Site language: Swedish, `lang="sv"`
- Reference sites are football clubs at a much larger scale than T4Q — borrow _pattern_, not _density_. T4Q is a small regional club; avoid replicating the sheer content volume (multi-row sponsor grids, video carousels, membership banner systems) these sites carry. Match the editorial restraint, not the scale.

## Accessibility Constraint (already decided, not open for revision)

Per the locked `/accessibility` skill: if the brand red fails AA contrast on white or black at a given weight/size, red is restricted to backgrounds, large text (18px+/regular or 14px+/bold), and non-text accents. Body copy and small text default to black. **Never lighten, darken, or otherwise alter the brand red to force a contrast pass — restrict its usage instead.**

Specifically test the brand red in the Man Utd CTA-button shape (white text on solid red background, button scale) before using that pattern — this is the combination most likely to fail AA, and it's the exact button style referenced below.

## Patterns to Propose Against

**Hero (src/images/screenshots/img-1 + img-5)**
Bold condensed type, one dramatic full-bleed photo, sparse copy, single CTA, no competing clutter. Matches T4Q's own principle: hero is emotive, not informational. Maps to `HeroModel` (Heading, Subheading, Cover Image, CTA Label + CTA URL).

**News cards (src/images/screenshots/img-2)**
One large featured card + a grid of smaller cards, each with heading, image, timestamp, and a small tag label. For T4Q, the tag shows the TeamTag value — **HERR / DAM / UNGDOM** — derived from NewsCardModel's TeamTag relation in the mapper, never stored as separate text. General club news (no TeamTag) shows no tag. Maps to `NewsCardModel`.

**Other content (check other images in src/images/screenshots to build content)**

## What the Proposal Should Deliver

- Type scale (heading levels, body, small text)
- Spacing scale
- Exact brand red hex, verified against AA contrast per the constraint above, with usage restrictions stated explicitly if it fails at any weight/size
- Component-level treatment for: Hero, News card (featured + grid variants), Fixture card, Sponsor grid (tiered), Footer
- Explicit flag on the fixture past/upcoming visual-split decision, since it's unresolved
