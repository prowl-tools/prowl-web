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
 *  - Give each competitor a fair "best for" — the page's credibility comes
 *    from being honest about where a rival is the better choice.
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
 * The competitors named anywhere on the page. Drives the trademark disclaimer
 * and is asserted against the profiles in the unit test so the two never drift.
 */
export const competitorNames = ["Maestro", "Playwright", "XCUITest", "Cypress", "Selenium"] as const;

export interface CompetitorProfile {
  /** Tool name, spelled and capitalised as its own project does. */
  name: string;
  /** What the tool is, in one factual clause. */
  what: string;
  /** A fair, genuine statement of what this tool is best at. */
  bestFor: string;
  /** How Prowl relates — factual, non-disparaging, no "better than" claims. */
  prowlAngle: string;
}

export const competitorProfiles: CompetitorProfile[] = [
  {
    name: "Maestro",
    what: "A mobile UI testing framework from mobile.dev that drives native iOS and Android apps from declarative YAML flows.",
    bestFor:
      "Native mobile teams who want the simplicity of YAML flows for iOS and Android, with built-in tolerance for asynchronous UIs and an optional hosted cloud to run them.",
    prowlAngle:
      "Prowl shares the YAML-first philosophy but leads on the desktop: it drives native macOS apps and web apps from the same hunt file. Its own iOS Simulator and Android targets are experimental, so for production native-mobile coverage today Maestro is the more mature choice.",
  },
  {
    name: "Playwright",
    what: "Microsoft's browser automation library and test runner (Playwright Test) for the web, scripted in TypeScript, JavaScript, Python, Java, or .NET.",
    bestFor:
      "Web teams who want their tests in a full programming language, with a large ecosystem, cross-browser coverage across Chromium, Firefox, and WebKit, tracing, and rich parallelisation.",
    prowlAngle:
      "Prowl runs Playwright under the hood on its web target, so you get the same auto-waiting and Chromium/Firefox/WebKit engines — described in YAML instead of code, and reusable against a native macOS app. When a flow outgrows YAML, Prowl's library API lets you drop into TypeScript, and Playwright itself remains the right tool for web suites that live entirely in code.",
  },
  {
    name: "XCUITest",
    what: "Apple's first-party UI testing framework, written in Swift or Objective-C and run from Xcode or xcodebuild against iOS and macOS apps.",
    bestFor:
      "Teams already working in Xcode and Swift who want in-process APIs, tight integration with their app's own code, and Apple's supported path for iOS and macOS UI tests.",
    prowlAngle:
      "Prowl drives macOS apps from the outside through the Accessibility API, so hunts are YAML rather than Swift and need no Xcode project — and the same steps also run against your web app. XCUITest stays the better fit when you want to write tests in Swift alongside the app and reach in-process APIs. Prowl's macOS target is experimental and its helper builds from source today; a signed, prebuilt helper is the next milestone.",
  },
  {
    name: "Cypress",
    what: "A JavaScript and TypeScript end-to-end test runner for the web with an interactive runner and time-travel debugging.",
    bestFor:
      "Front-end teams who want a developer-friendly, in-browser testing experience with an interactive runner and their tests written in JavaScript or TypeScript.",
    prowlAngle:
      "Prowl covers the same web end-to-end journeys from YAML and extends the same test format to a native macOS app. Cypress remains a strong choice for web-only teams who want an interactive JavaScript authoring loop.",
  },
  {
    name: "Selenium",
    what: "The long-established, W3C WebDriver-based browser automation project with bindings across many programming languages.",
    bestFor:
      "Teams who need broad cross-browser web automation across many language bindings, backed by the mature WebDriver standard and a large grid and integration ecosystem.",
    prowlAngle:
      "Prowl focuses on a single YAML format for web and native macOS apps rather than a multi-language WebDriver API. Selenium is the more established choice when you need its breadth of language bindings and grid infrastructure.",
  },
];

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

export interface PainPoint {
  /** The frustration, paraphrased as a general practitioner pain point. */
  pain: string;
  /** How Prowl addresses it — factual, with honest caveats. */
  answer: string;
}

/**
 * The narrative spine of the page: real testing frustrations (paraphrased from
 * practitioner discussion, prowl 2026-08-16 research) with Prowl's honest
 * answer. These are pain points, NOT testimonials about Prowl — never attribute
 * them to a named person or present them as endorsements.
 */
export const painPoints: PainPoint[] = [
  {
    pain: "“Flakiness drives me up the wall — debugging timing issues or CI failures that pass fine locally.”",
    answer:
      "On the web, Playwright's auto-waiting removes most timing races, and every step is deterministic and scripted rather than a fixed sleep. prowl flaky scores instability across runs and failures cluster so you triage a pattern, not a hundred logs. Honest caveat: the macOS target is black-box accessibility automation, so it asserts on observable UI state rather than an in-process idle signal like Espresso's.",
  },
  {
    pain: "“Reliable, but the boilerplate and the instrumentation build are a slog.”",
    answer:
      "A hunt is about a dozen lines of YAML with no instrumentation build and no compile step. The trade-off is platform coverage: Prowl leads on macOS and web, and its mobile targets stay experimental for now.",
  },
  {
    pain: "“YAML starts to feel like a cage the moment I need more control.”",
    answer:
      "Prowl keeps escape hatches: runHunt composition, if / repeat, runtime variables, and evalScript / runScript for the awkward parts — and the library API to graduate a flow to full TypeScript when it earns it.",
  },
  {
    pain: "“The app has no IDs or anything useful to select on.”",
    answer:
      "Prowl leans on stable selectors — accessibility ids, roles, and labels — and prowl analyze ranks the most robust selector for each element so you are not guessing at brittle ones.",
  },
  {
    pain: "“I want something agent-native and AI-assisted that runs locally on my own key, with no lock-in.”",
    answer:
      "That is Prowl's mission. Structured JSON output and an MCP server make it agent-native, AI-assisted steps run on your own provider key, and everything — hunts, history, baselines — stays in your repo. No metered pricing, no data leaving your machine.",
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
