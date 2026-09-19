// Swedish display-date formatting, shared by any mapper that needs to turn a raw
// Hygraph Date string (ISO, e.g. "2026-08-21") into copy a visitor reads. Date formatting
// is a mapper responsibility per /data-mapping — never done in a template.

const SV_DATE = new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" });

export function formatDateSv(iso: string): string {
  return SV_DATE.format(new Date(iso));
}
