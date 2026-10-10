// Shared class strings for photo cards (NewsCard, HomeMosaic tiles), so the overlay and
// accent stay identical everywhere instead of drifting as copies. Full literal strings —
// Tailwind's scanner picks them up from this file.

/** Eased bottom-up scrim. Many stops (no visible banding), darkest across the bottom ~half
 *  where bottom-left text sits, clear at the top so the photo stays vivid. Large-text
 *  headings need 3:1 — the ≥70% band behind them holds that even over a white wall. */
export const CARD_SCRIM =
  "bg-[linear-gradient(to_top,rgb(0_0_0/0.9)_0%,rgb(0_0_0/0.85)_30%,rgb(0_0_0/0.7)_50%,rgb(0_0_0/0.4)_68%,rgb(0_0_0/0.12)_85%,rgb(0_0_0/0)_100%)]";

/** Red accent stroke above a card's meta line — grows in length and thickness on hover
 *  (the card needs `group`). */
export const CARD_STROKE =
  "mb-3 block h-0.5 w-10 origin-left bg-brand-red transition-transform duration-500 ease-out group-hover:scale-x-150 group-hover:scale-y-200 motion-reduce:transition-none";

/** Faint shadow under white text on photos — covers leftover bright spots the scrim misses. */
export const CARD_TEXT_SHADOW = "[text-shadow:0_1px_2px_rgb(0_0_0/0.35)]";

/** The same shadow from md up only, for cards whose mobile layout puts the text on white. */
export const CARD_TEXT_SHADOW_MD = "md:[text-shadow:0_1px_2px_rgb(0_0_0/0.35)]";
