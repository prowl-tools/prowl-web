# Changelog

All notable changes to the Prowl Tools marketing site (`prowl.tools`) are documented here.

## [Unreleased]

### Fixed
- Blog post bodies no longer render their YAML frontmatter as content. The MDX
  compiler (`@next/mdx`) had no `remark-frontmatter` plugin, so the frontmatter
  block appeared as a bold heading at the top of every post (the closing `---`
  turned it into a setext heading); metadata parsing (gray-matter in
  `src/lib/blog.ts`) was unaffected. `next.config.ts` now registers
  `remark-frontmatter`, and the blog hunt asserts frontmatter text is not
  visible in the rendered post.
- Scroll-reveal animations no longer trigger React's "A props object containing a
  `key` prop is being spread into JSX" console error on every page load.
  `useScrollReveal` returned its remount `key` inside the spreadable props object;
  it now returns `{ remountKey, motionProps }` so the key is passed directly
  (`key={reveal.remountKey}`) and only key-free motion props are spread — across
  all 13 consuming components.

### Removed
- Removed Prowl Hub and Prowl Infra Hub from the site (PQW-025; both repos were
  retired and archived 2026-08-26). Deleted the `hub` and `infra` product entries
  and everything that rendered from them — the suite hero, the three-product
  showcase, the "Docs for every tool" hub, the nav Products menu, the footer
  Products/Docs columns, the `ProductIcon` set, the "Community Hub" section, and
  `src/lib/products.ts` itself — plus the `/cli` and `/docs` routes now that the
  homepage *is* the product page. `/cli`, `/hub`, and `/infra` permanently
  redirect to `/`; `/docs` redirects to `docs.prowl.tools`. The launch blog post
  no longer links to the Hub, and the `cli-page` / `docs-page` hunts were dropped.
- Removed Prowl Code Review from the marketing site (PQW-026; counterpart of
  `prowl-code-review` #69). prowl-review moved to maintenance mode as an internal
  tool (owner decision, 2026-08-26), leaving the site's current catalog at three
  entries: Prowl CLI, Prowl Hub, and Prowl Infra Hub (Hub/Infra retirement is
  tracked in PQW-025). Deleted the `/code-review` route (`src/app/code-review/`,
  page + `opengraph-image`) with no redirect — the URL now 404s — the `CodeReview`
  component, the `code-review` entry in `src/lib/products.ts`, its `ProductIcon`
  variant, and the `/code-review`
  sitemap entry. Dropped every `review.prowl.tools` link and trimmed the Code
  Review mentions from the root layout description, the `/docs` hub description,
  the "own your keys" suite pillar, the `SuiteHero` copy, and the "Three tools"
  showcase/hunt count. Updated the landing hunts (`nav-desktop.yml`,
  `docs-page.yml`, `homepage.yml`) and deleted `code-review-page.yml`.

### Changed
- The homepage's full "How Prowl compares" table is replaced by a slim teaser band
  ("How does Prowl compare?") linking to the new `/compare` page (owner decision,
  2026-09-12, cutting homepage length): `src/components/Comparison.tsx` is removed,
  `src/components/CompareTeaser.tsx` takes its slot, and the capability matrix plus
  every comparative claim now render only on `/compare` (the
  `src/lib/comparison-data.ts` module and its tests are unchanged — `/compare`'s
  matrix still consumes it as the single source of claims).

### Added
- Competitive-positioning comparison page at `/compare` (implements the cross-repo
  item `prowl` PROWL-037 / GTM-002): a dedicated, SEO/GEO-targeted landing page for
  "Maestro / Playwright / XCUITest alternative" searches. Sections: a hero, Prowl's desktop-first
  unique angle, a per-tool capability card
  grid (one card per tool with status icons, Prowl's card accented — owner pick from
  three format options, 2026-09-12) reusing
  `src/lib/comparison-data.ts` as the single source of claims, an honest "not for
  you if…" section, a testimonials block that renders nothing while its data array is
  intentionally empty (no fabricated quotes/logos ever), and a comparison FAQ
  carrying the page-wide trademark disclaimer. (A practitioner pain-point section
  and per-competitor "best for" profiles were drafted and then cut — owner
  decision, 2026-09-12: not relevant enough to keep.)
  Claims live in reviewable data modules (`src/lib/competitors-data.ts`,
  `src/lib/compare-faq-data.ts`, `src/lib/testimonials-data.ts`) — factual, dated
  (`compareAsOf`), non-disparaging, with a trademark disclaimer naming every
  competitor and Prowl's mobile/macOS targets kept labelled experimental (LEGAL-004).
  Page metadata sets a `/compare` canonical, OG, and Twitter cards; the route is added
  to the sitemap (priority 0.9) and linked from the nav (desktop + mobile) and the
  footer Resources column. Unit tests cover the data modules and the sitemap entry,
  and a `compare` hunt asserts the sections, the single `h1`, the CTA, and that no
  testimonial placeholder renders.
- Desktop-first homepage (PQW-027, re-scoping PQW-024): a new hero that leads with
  native macOS apps and web apps from one YAML hunt (using the menu bar example
  from the macOS target guide), a "Change the target, not the test" section that
  shows one portable hunt against a `macos` and a `web` target with Android/iOS
  Simulator marked experimental, a "Why Prowl" section stating the mission as four
  commitments (agents/humans, data stays in your repo, bring your own key, Apache-2.0),
  a factual four-column comparison table (Prowl, Maestro, Playwright, XCUITest)
  backed by `src/lib/comparison-data.ts` with a trademark disclaimer, and a
  `legacy-routes` hunt covering the retired-route redirects.
- Canonical URLs for the remaining routes (PQW-010): `alternates.canonical` is
  now set for `/` (in `src/app/page.tsx`, deliberately not the root layout so it
  is not inherited by unrelated pages), `/blog` (which also collapses `?tag=`
  filter URLs onto `/blog`, removing the duplicate-content risk), and each blog
  post (per-post canonical in `createBlogPostMetadata`). Follows the existing
  product/docs pattern of relative paths resolved against `metadataBase`.
- RSS feed improvements (PQW-009): the blog feed builder moved to a pure,
  unit-tested `src/lib/rss.ts` (`escapeXml`, `buildBlogFeed`,
  `rssAlternateTypes`). `<link>`/`<guid>`/`<atom:link>` URLs are now
  XML-escaped (previously interpolated raw); `src/app/blog/feed.xml/route.ts`
  declares `export const dynamic = "force-static"` documenting that
  `lastBuildDate` is intentionally the build timestamp (the site redeploys on
  content changes); the feed is added to `src/app/sitemap.ts`; and site-wide
  RSS autodiscovery (`<link rel="alternate" type="application/rss+xml">`) is
  emitted via `alternates.types` on the root layout, re-included on pages that
  set their own canonical.
- Blog post social images (PQW-008): `generateMetadata` in
  `src/app/blog/[slug]/page.tsx` now sets `openGraph.images` and
  `twitter.images` from the post's `image` frontmatter (resolved against
  `metadataBase`), falling back to the site-wide card (PQW-004) when a post
  declares none. Previously the parsed `image` field was never used and posts
  had no preview image.
- Open Graph / Twitter social preview cards (PQW-004): a shared 1200x630
  `ImageResponse` generator (`src/lib/og-image.tsx`) — dark brand background with
  the Prowl mascot logo, wordmark, section eyebrow, one-line headline, and the
  `prowl.tools` domain — wired through the `opengraph-image` file convention at the
  root (`src/app/opengraph-image.tsx`) and per-section variants for `/cli`,
  `/code-review`, and `/docs`. Each route now emits `og:image` and
  `twitter:image` (1200x630) and every page's `twitter.card` is
  `summary_large_image`; the root file-convention image applies to descendants,
  while `/blog` references the site-wide card explicitly because its own
  shallow-merged metadata object replaces the parent `openGraph` object.
- Prowl Review dogfooding: `.github/workflows/prowl-review.yml` (auto review on PRs) and
  `prowl-review-command.yml` (`@prowl-review` chat/commands) run the Claude + Gemini ensemble
  via `prowl-tools/prowl-code-review@v1`, configured by a base-branch-trusted
  `.prowl-review.yml`; posts as `prowl-review[bot]` when the App secrets are set. Requires the
  `PROWL_AI_KEY_ANTHROPIC` / `PROWL_AI_KEY_GEMINI` repo secrets. The placeholder
  `anthropics/claude-code-action` workflows (`claude.yml`, `claude-code-review.yml`) are
  retired, mirroring prowl-code-review.
- Prowl CLI dogfooding setup (PQW-017): `prowl-tools` pinned as a devDependency, `.prowl/`
  scaffolded via `prowl init` (config targets `http://localhost:3002`, starter `hello` hunt),
  an explicit Chromium install script, and `.prowl/runs/` gitignored while config and hunts stay
  committed.
- Prowl hunt suite covering the marketing site (PQW-018): homepage hero, desktop nav with
  Products dropdown, mobile hamburger nav, `/cli`, `/code-review`, and `/docs` pages with
  CTA checks, blog index + `?tag=` filtering + post page, newsletter form presence, dark/light
  theme toggle, and footer links. Hunts are tagged `smoke` (fast core set), `full`, and
  `mobile` (run with `--viewport mobile`) for CI filtering; the starter `hello` hunt is
  superseded by `homepage` and removed.
- Page-specific Twitter metadata for the blog index (PQW-021): `/blog` now emits its own
  `twitter` card (title, description, `creator`) instead of inheriting the root layout's
  homepage Twitter tags.
- CI workflow (PQW-019): `.github/workflows/ci.yml` runs on pull requests and pushes to
  `main` — `npm ci`, `npm run lint`, `npm run build`, then serves the production build
  (`npm run start` on port 3002) and polls it for readiness before running the Prowl hunt
  suite via `prowl ci` against `http://localhost:3002` (desktop hunts tagged `full`, plus the
  `mobile`-tagged hunt with `--viewport mobile`). Chromium is provisioned with
  `playwright install --with-deps chromium`; npm and `~/.cache/ms-playwright` (keyed on the
  installed Playwright version) are cached, and `.prowl/runs/` plus the server log upload as
  artifacts on failure.

### Changed
- Tightened the hero headline to "End-to-end tests for your Mac and web apps, from
  one YAML file." (owner copy edit, 2026-08-29); `homepage.yml` and
  `legacy-routes.yml` assert the new line.
- Repositioned every remaining section for the single product: root metadata and
  OG image, features ("Built for desktop and web apps", native + browser
  selectors), how-it-works, the agents section (`prowl analyze --app`, BYOK
  generation), the FAQ (macOS, iOS/Android, CI-runner answers), the install
  section — which now states plainly that the macOS helper is built from source
  today — and the final CTA. Nav is a flat How it works / Docs / Blog / GitHub.
- Single branded checks row for reviews: the prowl-review auto-review now triggers off the CI
  workflow completing (`workflow_run`) instead of `pull_request`, so the PR checks list shows
  only the branded "Prowl Review" check run (no extra `prowl-review / review` Actions row) and
  reviews only run once CI is green. The workflow resolves exactly one open PR from the
  completed CI run (with an API fallback), gates out forks, and hands the PR number and draft
  state to the action explicitly; CI now subscribes to `ready_for_review` so draft→ready still
  triggers a review.
- prowl-review now runs on the keyless Codex subscription provider (#64) on the self-hosted
  Mac mini runner instead of the API-key Claude + Gemini ensemble, so per-review marginal cost
  is $0.00 and no `PROWL_AI_KEY_*` secret is required or passed to the runner. The
  `workflow_run`→CI chain and
  the branded prowl-review[bot] identity (App-token minting) are preserved; the `review` and
  `command` jobs move to `runs-on: [self-hosted, macOS, prowl-review]` behind a mandatory
  same-repo fork gate (public repo), share a non-cancelling Codex concurrency group keyed by
  repository, PR number, and server-derived head repository, and cap at `timeout-minutes: 30`.
  `.prowl-review.yml` pins `provider: codex` / `model: gpt-5.5` /
  `codex.effort: low` (the ensemble block is retained, commented out, as a key-gated fallback).
  The action is pinned to reviewed commit `4e60b282f3837b3f09b2a9d0c74f19eef2804c10`
  until a release tag includes the codex provider. Workflow tests cover the
  mandatory same-repo job gates, guarded PR-head checkouts, queued command
  concurrency, base-config preference, PR-config bootstrap fallback, invalid PR
  candidates, PR metadata API failures, closed PR candidates, fork skips, stale
  heads, malformed output parsing, and fake GitHub API fixture endpoint/option
  validation.
- Prowl Hub and Prowl Infra links (homepage tiles, nav, footer, docs hub) now point at the
  live satellite sites `hub.prowl.tools` and `infra.prowl.tools` instead of internal
  marketing pages.
- FinalCta "How it Works" CTA now uses an approved external docs destination
  (`https://docs.prowl.tools`) with a native `<a>` (PQW-011), keeping the button text and
  styling while aligning the CTA target with review guidelines.
- Infra product renamed "Prowl Infra" → "Prowl Infra Hub" (PQW-013) to match the live
  satellite site's own title; the `name` in `src/lib/products.ts` propagates to the nav
  Products dropdown, footer, and homepage showcase. Satellite URLs (`infra.prowl.tools`) are
  left unchanged. The Prowl Code Review site name is deliberately kept as-is per the owner
  decision recorded in the workspace CLAUDE.md.

### Fixed
- Tightened review coverage for the single-product redirects: the `legacy-routes`
  hunt now asserts the exact final local homepage URL after `/cli`, `/hub`, and
  `/infra`, and unit coverage locks `/docs` as a permanent redirect to
  `https://docs.prowl.tools`.
- Added hunt coverage for the `#how-it-works` anchor used by the nav and final
  CTA links.
- Prowl Review workflow hardening: both `prowl-code-review` action references are pinned to
  reviewed commit `4e60b282f3837b3f09b2a9d0c74f19eef2804c10`, and
  `tests/workflows.test.ts` executes the inline resolve scripts with fake GitHub API responses
  to cover same-repo, fork, command metadata failures, `workflow_run` incomplete metadata,
  missing config, credentialless guarded PR-head checkout, malformed output, run-block
  extraction, PR-number expression replacement, API-failure, ambiguous-match, and stale-head
  branches.
- Duplicate `<h1>` guard in MDX blog posts (PQW-015): `mdx-components.tsx`
  mapped a markdown `#` to `<h1>`, but `PostHeader` already renders the post
  title as the page's single `<h1>`, so a post body starting with `#` would emit
  two `<h1>`s (broken document outline / accessibility). Blog loading now
  rejects markdown `#`, setext h1 underlines, and raw `<h1>` body content so
  blog bodies cannot define their own top-level heading; sections conventionally
  begin at `##`, while deeper headings and intro text remain valid. The MDX
  component map no longer silently remaps `#` to `<h2>`, preserving normal
  heading semantics while enforcing the authoring convention before render. No
  existing post used `#` (the current post starts at `##`), so rendered output is
  unchanged.
- Accessible nav Products menu (PQW-006): the desktop "Products" dropdown was
  CSS-hover / `group-focus-within` only — the trigger had no `aria-expanded`/`aria-controls`,
  no click or keyboard handling, no Escape-to-close, and defaulted to `type="submit"`, failing
  WCAG 2.1 SC 4.1.2 and 1.4.13. It is now a JS-controlled disclosure (WAI-ARIA APG disclosure
  pattern): the trigger is `type="button"` with `aria-expanded` + `aria-controls`, toggles on
  click/Enter/Space, and the menu is dismissible via Escape (returning focus to the trigger) and
  outside-click, and closes when focus leaves it or an item is selected. Visibility is driven by
  React state so the menu links are only in the tab order while it is open, while hover-to-open
  is preserved for mouse users. Open/close decision logic is extracted to a DOM-free
  `src/lib/disclosure.ts` with unit coverage; the `nav-desktop` hunt now asserts `aria-expanded`
  toggling alongside hover-open.
- `/docs` page now has an `<h1>` (PQW-007): `DocsHub` renders its "Docs for every tool"
  heading as an `<h1>` when `standalone` (the `/docs` page body) and keeps it an `<h2>` when
  embedded on the homepage, where the hero owns the page's single `<h1>`. Fixes the broken
  heading hierarchy and weak SEO signal on `/docs` without introducing a duplicate top-level
  heading on `/`.
- Render marketing content visible without JS and fix the LCP/FCP regression (PQW-005):
  every section (heroes, section reveals, and all `whileInView` sections) previously shipped
  its SSR HTML behind motion's inline `opacity:0` `hidden` variant, so content — including the
  hero headline, the LCP element — was invisible until hydration and hidden entirely for no-JS
  visitors and crawlers. A new shared `src/lib/reveal.ts` utility now renders content visible by
  default and applies the entrance animation as a progressive enhancement: `revealVisible`
  (`{ initial: 'visible', animate: 'visible' }`) keeps above-the-fold heroes visible on first
  paint with no re-hide (correct for LCP), and
  `useScrollReveal` (backed by a shared one-shot hydration store and also respecting
  `prefers-reduced-motion`) only enables the `hidden` → `visible` scroll entrance after
  hydration, when below-the-fold sections are off-screen. The post-hydration scroll-reveal props
  include a stable remount key so Motion applies the hidden initial state on the enhanced mount,
  while standalone `/docs` content stays on the visible hero path. Applied across `Hero`,
  `SuiteHero`, `CodeReview`, `SectionReveal`, `TypingEffect`, and every section component. SSR
  HTML now ships zero inline `opacity:0` on content across `/`, `/cli`, `/code-review`, `/docs`,
  `/blog`, with focused `src/lib/reveal.ts` unit coverage for visible, reduced-motion,
  post-hydration, and hydration-store behavior.
- Pointed all X/Twitter links and metadata at the live `@prowltools` account (PQW-022):
  the footer X link (`https://x.com/prowltools`) and every page's `twitter.creator`. Replaces
  the earlier `@prowl` handle, which is not ours (`@prowl` was unavailable when the account was
  renamed from the legacy `@prowlqa`). Does not touch the `@prowl-review` PR bot name.
- Removed legacy "Prowl QA" branding from the site title metadata and hero badge; README now
  says Next.js 16.
- Code hygiene sweep (PQW-014): removed dead exports (`getAllTags` in `src/lib/blog.ts`,
  `fadeIn`/`scaleIn` in `src/lib/animations.ts`) and the unreachable `'exit'` icon case in
  `AgentEfficiency`; added `type="button"` to the remaining non-submit buttons (the Nav mobile
  hamburger, `ThemeToggle`, and the `Install` copy buttons — the Nav Products trigger already
  had it from PQW-006); and replaced index-based React keys with stable keys in `Install`
  (`step.command`), `TypingEffect` (`line.text`), and `CodeExample` (content field plus position,
  since the `- fill` YAML row repeats verbatim). Also fixed two pre-existing TypeScript errors in
  `tests/og-image-content.test.ts` (TS2322/TS18048) so a bare `npx tsc --noEmit` runs clean,
  narrowing the optional-chained `backgroundImage` via `assert.ok` rather than a cast.

### Removed
- Newsletter signup CTA from the blog post footer (`src/components/blog/PostFooter.tsx`)
  (PQW-012). There is no live newsletter: the Buttondown embed action
  (`https://buttondown.com/api/emails/embed-subscribe/prowl`) pointed at an account we do not
  own, so the form silently misdirected/lost real subscriber emails. The rest of the post
  footer (the "Back to all posts" link) is unchanged, and the `blog` hunt's newsletter-form
  assertions were updated in lockstep. This removal is deliberate; restoring a newsletter once
  a real plan exists is tracked separately by PQW-023 (restore the block from git history).
- Internal `/hub` and `/infra` marketing pages and the `SatelliteProductLanding` component;
  the old URLs permanently redirect to the live satellite sites.
