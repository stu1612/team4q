# Task: anonymise public repo docs + harden preview noindex

## Context

This repo is public on GitHub as a portfolio piece. The club has NOT yet agreed
to use the site, so the repo's documentation must not name or identify them.
The site's own content (club name, logo, copy, SEO, JSON-LD) is the product
being offered to the club and must NOT be changed in this task.

The README has already been rewritten. Do not edit README.md.

## Part 1: Audit (report only, change nothing)

Search the whole repo (excluding node_modules, lockfiles, src/gql/generated.ts)
for anything that identifies the club: "team4q", "T4Q", "team4q.se",
the club's full name, Helsingborg + basketball together, club logos/images
in public/ or src/assets/, social links, email addresses, sponsor names.

Report as a table: file · line · what it is · category:

- DOC: documentation / agent config (CLAUDE.md, AGENTS.md, .claude/\*\*, docs, comments)
- META: package.json name, config names, repo-level metadata
- SITE: content the site renders or ships (pages, components, SEO, assets)

## Part 2: Anonymise DOC and META only

After I approve the audit:

- Replace club-identifying references in DOC and META with neutral terms:
  "the club", "a Helsingborg basketball club", "club-site".
- package.json "name" -> "club-site-rebuild".
- Keep every technical decision, rule and skill intact. Change names, not meaning.
- Do not touch anything categorised SITE. Do not rename files or folders.

## Part 3: Harden noindex on the preview

vercel.json already sends `X-Robots-Tag: noindex, nofollow` for the
team4q.vercel.app host. Add a second layer that only applies to non-production:

- A robots meta tag (`noindex, nofollow`) in the base layout, rendered only when
  the build is NOT the club's production domain.
- robots.txt that disallows all crawling on the same condition.
- Production (the club's real domain, once it goes live) must stay indexable.
  Propose how to detect this (e.g. a PUBLIC_SITE_ENV / VERCEL_ENV check, or the
  configured `site` URL) and explain the choice before implementing.

## How to work

- Plan mode. Show the audit table and the plan; wait for my approval before editing.
- Smallest possible diff. No refactors, no new packages.
- Finish with: files changed, and how I can verify the noindex
  (curl -I on the preview, and view-source for the meta tag).
