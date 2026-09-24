// Primary site navigation — single source, since Base's header nav (Nav.astro) and the
// footer's "Sidan" column (Footer.astro) render the exact same link list.

export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/", label: "Hem" },
  { href: "/herrlaget", label: "Herrlaget" },
  { href: "/damlaget", label: "Damlaget" },
  { href: "/ungdomslaget", label: "Ungdomslaget" },
  { href: "/nyheter", label: "Nyheter" },
  { href: "/#partners", label: "Sponsorer" },
  { href: "/kontakt", label: "Kontakt" },
];
