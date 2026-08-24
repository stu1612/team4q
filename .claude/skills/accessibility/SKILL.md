# Accessibility Skill

## Intent

Accessibility is built in from the start, not retrofitted. Every component is keyboard navigable, screen reader friendly, and meets WCAG 2.1 AA standard. The Nordic market takes accessibility seriously — this is not optional.

## Outcomes

- WCAG 2.1 AA compliance across all pages
- Semantic HTML on every component
- All interactive elements keyboard accessible
- All images have appropriate alt text
- Focus states visible on all interactive elements
- ARIA used only where semantic HTML is insufficient

## WCAG Target

AA — not AAA. AA is the standard requirement and achievable across all page types.

## Semantic HTML Rules

- Use the correct element for the job — never a `div` where a `button`, `nav`, `main`, `article`, `section`, `header`, `footer` or `aside` is appropriate
- One `h1` per page — derived from page heading
- Heading hierarchy is sequential — never skip from `h1` to `h3`
- `nav` element wraps all navigation — main nav and footer nav separately
- `main` wraps primary page content on every page
- `article` wraps news cards and news article pages
- `ul` or `ol` for lists — never `div` with repeated children
- `button` for actions, `a` for navigation — never swap them

## Alt Text Strategy

Alt text is derived from existing VM values — never left empty on meaningful images.

| Image type          | Alt text source                      |
| ------------------- | ------------------------------------ |
| News cover image    | Article heading                      |
| Team cover image    | Team heading                         |
| Player photo        | Player name                          |
| Sponsor logo        | Sponsor name                         |
| Hero image          | Hero heading                         |
| Fixture cover image | Home team vs Away team               |
| Decorative images   | `alt=""` — empty string, not omitted |

Never omit the `alt` attribute entirely — omission causes screen readers to read the file name.

## Focus States

- All interactive elements use `focus-visible` — not `focus`
- `focus-visible` shows focus ring on keyboard navigation only — not on mouse click
- Never remove focus styles with `outline: none` without replacing them
- Tailwind `focus-visible:` utilities handle this — use them consistently
- Focus ring must meet AA contrast ratio against its background

## Keyboard Navigation

- All interactive elements reachable via Tab key
- Logical tab order follows visual reading order
- Skip to main content link at top of every page — visually hidden, visible on focus, and must be the first focusable element in the DOM
- Modal or dropdown menus must trap focus while open and return focus on close
- No keyboard traps anywhere on the site

## ARIA Usage

Use ARIA only when semantic HTML cannot communicate the role, state or property.

- `aria-label` on icon-only buttons and links — e.g. social media links in footer
- `aria-current="page"` on active nav link
- `aria-expanded` on mobile nav toggle button
- `aria-hidden="true"` on decorative icons and images that already have adjacent text
- `aria-live` on dynamic content regions if content updates without page reload
- Never use ARIA to override incorrect semantic HTML — fix the HTML instead

## Colour Contrast

T4Q brand colours — black and red on white backgrounds.

- Black on white — passes AA ✓
- White on black — passes AA ✓
- Red on white — verify specific brand red hex passes AA before shipping
- White on red — verify specific brand red hex passes AA before shipping
- Use a contrast checker before finalising any colour combination

**If the brand red fails AA contrast** on white or black at the weight/size in use: red is restricted to backgrounds, large text (18px+ regular or 14px+ bold), and non-text accents. Body copy and small text default to black. Do not lighten, darken, or otherwise alter the brand red to force a pass — restrict its usage instead. Colour changes to a locked brand colour are a design decision, not an accessibility fix.

## Image Optimisation and Accessibility

- Always use Astro's Image component — never bare `img` tags
- Width and height attributes always set — prevents layout shift
- HG asset URLs are absolute — pass directly to Astro Image `src`
- Lazy loading on all images below the fold — `loading="lazy"`
- Hero image above the fold — `loading="eager"`

## Definition of Done

Before a component or page is considered complete, verify:

- [ ] Full page navigable via Tab/Shift+Tab in logical order, no keyboard traps
- [ ] Every focusable element shows a visible `focus-visible` ring meeting AA contrast
- [ ] Every meaningful image has non-empty alt text; every decorative image has `alt=""`
- [ ] Actual brand red/white and red/black combinations checked against a contrast tool, not assumed
- [ ] Heading hierarchy for the page, read in isolation, is sequential with no skipped levels
- [ ] Manual keyboard navigation tested by hand — automated tools miss interaction failures

## Gotchas

- Never use `div` or `span` as a button — it breaks keyboard navigation and screen readers
- ARIA labels on social links are mandatory — an icon with no text has no accessible name without it
