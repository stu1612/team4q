// Swedish display-date formatting, shared by any mapper that needs to turn a raw
// Hygraph Date string (ISO, e.g. "2026-08-21") into copy a visitor reads. Date formatting
// is a mapper responsibility per /data-mapping — never done in a template.

const SV_DATE = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" });

export function formatDateSv(iso: string): string {
  return SV_DATE.format(new Date(iso));
}

// Short form with weekday for fixture cards, e.g. "lör 19 sep".
const SV_DATE_WEEKDAY = new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric", month: "short" });

export function formatDateWeekdaySv(iso: string): string {
  return SV_DATE_WEEKDAY.format(new Date(iso));
}

// The club plays in Helsingborg, so "has this match finished" is judged on Swedish wall-clock
// time, not the server's (Vercel runs in UTC). The sv-SE locale renders "YYYY-MM-DD HH:mm",
// which compares correctly as a plain string against `${date} ${time}` — no offset maths.
const STOCKHOLM_NOW = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** True once the given Swedish date ("YYYY-MM-DD") and time ("HH:mm") have passed. */
export function hasPassedStockholm(date: string, time: string): boolean {
  return `${date} ${time}` < STOCKHOLM_NOW.format(new Date());
}
