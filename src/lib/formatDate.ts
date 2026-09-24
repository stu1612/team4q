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

// The same date split into separately styled parts (the fixture card's date panel). A bare
// "YYYY-MM-DD" parses as UTC midnight, so formatting in UTC always yields that calendar day,
// whatever the server's time zone. Month abbreviations lose their trailing dot ("okt." → "okt").
const SV_DATE_PARTS = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "UTC",
  weekday: "short",
  day: "numeric",
  month: "short",
});

export interface DatePartsSv {
  weekday: string;
  day: string;
  month: string;
}

export function formatDatePartsSv(iso: string): DatePartsSv {
  const parts = SV_DATE_PARTS.formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    weekday: part("weekday").replace(/\.$/, ""),
    day: part("day"),
    month: part("month").replace(/\.$/, ""),
  };
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
