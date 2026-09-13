/**
 * Data behind the `/compare` competitive-positioning page (implements the
 * cross-repo item prowl PROWL-037 / GTM-002).
 *
 * Comparative-advertising rules (prowl LEGAL-004 — FTC guidelines) apply to
 * every string in this module exactly as they do to `comparison-data.ts`:
 *
 *  - Every claim about another tool must be factual and verifiable from that
 *    project's own public documentation. Describe what each tool is good at;
 *    never disparage it.
 *  - Re-check `compareAsOf` (shared with the homepage table) whenever a claim
 *    is edited, and keep `competitorNames` in sync with the trademark
 *    disclaimer so every named tool is disowned as an affiliation.
 *  - Prowl's own mobile and macOS targets are labelled experimental wherever
 *    they appear (macOS ships its helper from source today — mirror the
 *    prowl README's honesty, see PQW-028).
 */

import { comparisonAsOf } from "./comparison-data.ts";

/** Shared "claims current as of" date — single source with the homepage table. */
export const compareAsOf = comparisonAsOf;

/**
 * The competitors named anywhere on the page (the capability cards, the "not
 * for you if…" section, and the FAQ). Drives the trademark disclaimer and is
 * asserted in the unit test so the two never drift.
 */
export const competitorNames = ["Maestro", "Playwright", "XCUITest", "Cypress", "Selenium"] as const;

export interface UniqueAngle {
  title: string;
  detail: string;
}

/**
 * Prowl's positioning — desktop-first (macOS leads, web second), agent-native,
 * and the one position no incumbent holds: native macOS and web from one file.
 */
export const uniqueAngles: UniqueAngle[] = [
  {
    title: "Native macOS and web from one YAML file",
    detail:
      "The position no incumbent holds: a single hunt runs against a native macOS app — windows, sheets, and menu bar extras through the Accessibility API — and against a web app through Playwright. Change the target, not the test.",
  },
  {
    title: "YAML that reads like the user's journey",
    detail:
      "A hunt is about a dozen lines describing what a person does — click, fill, assert — with no instrumentation build, no Xcode project, and no test code to compile before it runs.",
  },
  {
    title: "Agent-native by design",
    detail:
      "prowl run --json returns structured results an agent can branch on, prowl analyze extracts ranked selectors as JSON, and prowl mcp exposes Prowl to any MCP-capable agent as named tools. Prowl also imports as a Node library.",
  },
  {
    title: "Playwright power on the web",
    detail:
      "On the web target Prowl runs Playwright under the hood — the same auto-waiting and Chromium, Firefox, and WebKit engines — so the web half of your app is covered by a proven engine, not a reimplementation.",
  },
  {
    title: "Self-sovereign, bring your own key",
    detail:
      "Hunts, run history, screenshots, and visual baselines live under .prowl/ in your repo. AI-assisted steps run on your own provider key, paid directly to the provider — no dashboard to sign into, no metered pricing, no lock-in.",
  },
  {
    title: "Escape hatches when YAML isn't enough",
    detail:
      "runHunt composition, if / repeat, runtime variables, and evalScript / runScript handle the awkward flows — and the library API lets you graduate a gnarly journey to TypeScript without leaving Prowl.",
  },
];

export interface NotForYouItem {
  title: string;
  detail: string;
}

/**
 * The honest "Prowl is not for you if…" section. Each item points the reader at
 * the tool that genuinely fits their situation better — the page's honesty is
 * the point, not a caveat to soften.
 */
export const notForYou: NotForYouItem[] = [
  {
    title: "You need mature native mobile testing today",
    detail:
      "Prowl's iOS Simulator and Android targets are experimental. If native iOS and Android coverage is your priority right now, Maestro is the stronger, more established choice.",
  },
  {
    title: "You want tests written in a full programming language",
    detail:
      "Hunts are YAML with escape hatches, not a general-purpose language. If you want your suite in TypeScript, JavaScript, Python, or another language with a large ecosystem, reach for Playwright, Cypress, or Selenium.",
  },
  {
    title: "You live in Xcode and want in-process APIs",
    detail:
      "If your team writes tests in Swift alongside the app and wants to reach its internal APIs in-process, XCUITest is the better fit than Prowl's external, accessibility-driven approach.",
  },
  {
    title: "You need a zero-setup macOS install today",
    detail:
      "The macOS target is experimental and its helper (prowl-macdriver) is built from source right now; a signed, prebuilt helper is the next milestone. If you need a two-minute macOS install this week, it isn't there yet — the web target, however, needs only Node and a browser.",
  },
];

/**
 * Trademark and freshness disclaimer. Mirrors `comparisonDisclaimer` and must
 * name every tool in `competitorNames`. Kept in sync by the unit test.
 */
export const competitorDisclaimer =
  `Comparisons are based on each project's public documentation as of ${compareAsOf}. ` +
  `${competitorNames.join(", ").replace(/, ([^,]*)$/, ", and $1")} are trademarks of their respective owners; ` +
  `Prowl is not affiliated with or endorsed by them.`;
