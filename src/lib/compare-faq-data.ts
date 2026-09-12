/**
 * FAQ for the `/compare` page. Written to answer the searches this page targets
 * — "Maestro alternative", "Playwright alternative for desktop apps",
 * "XCUITest alternative" — factually and without disparaging any tool
 * (prowl LEGAL-004). Reuses the shared `FaqItem` shape.
 */
import type { FaqItem } from "./faq-data.ts";

export const compareFaqItems: FaqItem[] = [
  {
    question: "Is Prowl a Maestro alternative?",
    answer:
      "For desktop and web, yes. Prowl shares Maestro's YAML-first approach but leads on native macOS apps and web apps from one hunt file. Maestro remains the more mature choice for native iOS and Android testing today; Prowl's mobile targets are experimental.",
  },
  {
    question: "Can Prowl replace Playwright?",
    answer:
      "Prowl runs Playwright under the hood on its web target, so it is less a replacement than a YAML layer over the same engine that also drives a native macOS app. If your suite lives entirely in code and never leaves the browser, Playwright on its own is a great fit; if you want one test format across a Mac app and a web app, that is where Prowl leads.",
  },
  {
    question: "What is an alternative to XCUITest for testing a macOS app?",
    answer:
      "Prowl drives native macOS apps through Apple's Accessibility API from YAML, with no Xcode project or Swift test code — and the same hunt runs against your web app too. XCUITest stays the better choice if you want tests in Swift with in-process access to your app. Note that Prowl's macOS target is experimental and its helper builds from source today.",
  },
  {
    question: "Does Prowl test iOS and Android like Maestro?",
    answer:
      "Prowl has experimental Android and iOS Simulator targets that run the same portable steps, but they are not yet at the maturity of a dedicated mobile framework. For production native-mobile coverage right now, a mobile-first tool such as Maestro is the safer bet.",
  },
  {
    question: "How is Prowl different from Cypress or Selenium?",
    answer:
      "Cypress and Selenium are web-only browser automation tools scripted in code. Prowl describes web journeys in YAML and extends the identical test format to a native macOS app, while running Playwright for the browser half. Choose Cypress or Selenium when you want a code-first, web-only workflow.",
  },
  {
    question: "Why choose Prowl over a code-based framework?",
    answer:
      "Because your app is a Mac app and a web app, and you would rather write one YAML hunt than maintain a Swift suite and a JavaScript suite separately. Prowl is also agent-native — structured JSON output and an MCP server — and self-sovereign: your tests, history, and keys stay in your repo with no metered pricing.",
  },
];
