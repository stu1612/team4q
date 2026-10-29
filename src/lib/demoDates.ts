// Dates for the demo.ts data sets, relative to when the page renders, so demo fixtures are
// always upcoming and demo results always inside their visibility window. Calendar days are
// Swedish wall-clock days, matching formatDate.ts.

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** "YYYY-MM-DD" for today + `days` (negative for the past), Stockholm time. */
export function demoDate(days: number): string {
  return new Date(Date.now() + days * MS_PER_DAY).toLocaleDateString("sv-SE", {
    timeZone: "Europe/Stockholm",
  });
}

/** Full ISO timestamp `days` ago, for publishedAt-style system fields. */
export function demoTimestamp(daysAgo: number): string {
  return new Date(Date.now() - daysAgo * MS_PER_DAY).toISOString();
}
