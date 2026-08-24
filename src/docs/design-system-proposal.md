# T4Q Design System Proposal

## How to use this document

This is a proposal, not a locked spec — it responds to `design-brief.md` and is meant to be reviewed and either locked or sent back with changes. Nothing here should be built against until it's locked. Once locked, Phase 3 turns the values below into an actual `@theme` block in `global.css` — this document does not implement them.

---

## 1. Brand red — AA verification

The brief flagged this as the one contrast combination most likely to fail and asked for it to be tested before use. Computed WCAG 2.1 contrast ratios for the three proposed hex values:

| Combination | Ratio | AA normal text (4.5:1) | AA large text / UI (3:1) |
| --- | --- | --- | --- |
| `#db1d24` red on `#fafafa` white (or white text on red fill) | **4.77:1** | ✅ Passes | ✅ Passes |
| `#db1d24` red on `#181818` black (red text on black) | **3.56:1** | ❌ Fails | ✅ Passes |
| `#181818` black on `#fafafa` white | ≈17:1 | ✅ Passes | ✅ Passes |
| `#fafafa` white on `#181818` black | ≈17:1 | ✅ Passes | ✅ Passes |

**Verdict on the flagged risk:** the solid-red-button-with-white-text pattern (Man Utd CTA shape) **passes AA**, but at 4.77:1 against a 4.5:1 minimum — a margin of 0.27, not a comfortable buffer. Two consequences:

- Never lighten or add opacity to the red for hover/active button states — either move could drop under 4.5:1. Use a darkening or a non-colour signal (underline, scale, shadow) for interaction states instead.
- Red text/red fill directly against the black background must stay restricted to large text (18px+/regular or 14px+/bold), backgrounds, and non-text accents, per the `/accessibility` skill's rule — confirmed necessary here, not a hypothetical.

No change to the proposed hex values is needed. Black-on-white and white-on-black need no restriction.

---

## 2. Type scale

Mobile-first `rem` scale (1rem = 16px base). Small sizes are deliberately kept out of the red-restricted zone (below 18px/regular, 14px/bold) so body copy never has to choose between "on-brand" and "compliant."

| Token | Size | Weight | Line-height | Use |
| --- | --- | --- | --- | --- |
| `text-display` | 3rem → 4.5rem (clamp, scales with viewport) | 800 | 1.05 | Hero heading only |
| `text-h1` | 2.25rem | 700 | 1.15 | Page title |
| `text-h2` | 1.75rem | 700 | 1.2 | Section heading |
| `text-h3` | 1.375rem | 600 | 1.25 | Card heading, sub-section |
| `text-h4` | 1.125rem | 600 | 1.3 | Small card heading |
| `text-body` | 1rem | 400 | 1.6 | Body copy |
| `text-small` | 0.875rem | 400 | 1.5 | Meta text, captions |
| `text-label` | 0.75rem | 700 (bold, uppercase, tracked) | 1.2 | Tags, timestamps, buttons |

`text-label` at 12px bold falls just under the 14px/bold "large text" threshold — this is why the TeamTag pill (§4) uses it as **white text on a red background**, not red text on anything, keeping it inside the verified 4.77:1 combination rather than the failing 3.56:1 one.

**Open decision — typeface:** the brief calls for "bold condensed type" on the hero but doesn't name a face. Two candidate pairings, both variable fonts (single file, good performance, self-hostable to avoid a third-party font request):

- **Barlow Condensed** (700/800) for display/headings + **Inter** for body — condensed without being hard to read at small sizes, wide language support including Swedish characters (å/ä/ö).
- **Oswald** (600/700) for display/headings + **Source Sans 3** for body — slightly more editorial/masthead feel, closer to the football-club reference sites.

Needs a developer pick before Phase 3 — not locking one here.

---

## 3. Spacing scale

Recommend using Tailwind 4's default `--spacing` scale (4px base unit, e.g. `p-4` = 1rem) as-is rather than defining a parallel custom scale — it already covers the full range this site needs, and a second scale would just be a second thing to keep in sync with no benefit.

The only proposed additions are two semantic tokens for section-level rhythm, since "space between major sections" is a recurring decision that's worth naming once instead of repeating a raw utility everywhere:

- `--spacing-section-y`: `6rem` (desktop) / `3rem` (mobile) — vertical padding between major homepage/team-page sections
- `--spacing-container-x`: `1.5rem` (mobile) / `2rem` (tablet+) — horizontal page gutter

---

## 4. Component treatments

### Hero (`img-3`, `img-5`)

Full-bleed cover image, dark linear scrim (bottom-to-top, black at ~70% opacity fading to transparent) over the lower two-thirds — this guarantees the text contrast independent of whatever the photo underneath looks like, rather than hoping a given photo is dark enough. `text-display` heading in white, `text-h4`-weight subheading in white at reduced opacity (90%, not lower — dropping further risks contrast on lighter photos even under the scrim). Single CTA, solid red fill / white text, positioned inside the scrim zone only. No secondary CTA, no carousel — matches the brief's "no competing clutter" instruction and the out-of-scope note on video carousels.

### News card (`img-2`)

One large featured card (image + heading + tag + timestamp) followed by a grid of smaller cards, same anatomy at reduced scale. TeamTag pill: `text-label` white-on-red (HERR / DAM / UNGDOM), rendered only when NewsCardModel's TeamTag relation resolves — general club news shows no pill, not an empty one. Timestamp: `text-small`, black — never red, since it's below the red-safe size threshold.

### Fixture card — past/upcoming split (`img-6`)

This resolves the brief's explicitly open decision. Two distinct visual states, differentiated by shape and label — not colour alone (WCAG 1.4.1, avoids relying on colour perception):

- **Past (result):** score shown in a solid black pill/box, white text, e.g. `2–0 FT` — unambiguous, high-contrast, immediately reads as "settled." Secondary-style CTA below (outlined, black border/text) — a result is informational, not an action to drive.
- **Upcoming:** kickoff time shown in a light/outlined box (white fill, black border and text), lower visual weight than the result box so it doesn't compete with it. Primary CTA below is the solid red / white text button — this is the moment worth driving action on (come watch), and it's exactly the verified-safe red combination from §1.

### Sponsor grid, tiered (`img-4`)

Two tiers only, per the brief's "borrow pattern, not density" instruction — a club this size doesn't need the multi-row tiered systems the reference sites use:

- **Main tier:** full-colour logos, larger size, capped at 2–3 per row.
- **Supporting tier:** greyscale by default (matches `img-4`'s treatment exactly), reverting to full colour on hover/focus, smaller and wrapped in a denser grid.

### Footer

Black (`#181818`) background, white/`#fafafa` text and links — verified ≈17:1, no restriction needed. Structure: nav link groups (teams / club / contact), social icon row with `aria-label` on every icon per the `/accessibility` skill (icons carry no visible text), contact details sourced from `src/constants/contact.ts` (per `/graphql`, never hardcoded), copyright line. Red usage here stays non-text — a thin accent rule, an active-link underline, or an icon hover state — never red body text on the black background, per §1.

---

## Summary of what needs a developer decision

- [ ] Lock or revise the values above (type scale, spacing tokens, component treatments)
- [ ] Pick a typeface pairing from §2's two candidates (or supply a different one)
- [ ] Confirm the fixture past/upcoming resolution in §4 matches intent
