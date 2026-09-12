import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { compareFaqItems } from "../src/lib/compare-faq-data.ts";
import { competitorNames } from "../src/lib/competitors-data.ts";

/**
 * The comparison FAQ targets "alternative" searches and is comparative
 * advertising like the rest of the page (prowl LEGAL-004): concrete answers,
 * no disparagement, and the competitor names present so the copy actually
 * answers the queries it targets.
 */
describe("compare-faq-data", () => {
  it("has complete question/answer pairs", () => {
    assert.ok(compareFaqItems.length > 0);
    for (const item of compareFaqItems) {
      assert.ok(item.question.trim().length > 0);
      assert.ok(item.answer.trim().length > 0);
    }
  });

  it("does not disparage the tools it names", () => {
    const banned = /\b(worse|inferior|broken|slow|clunky|bloated|outdated|useless)\b/i;
    for (const item of compareFaqItems) {
      assert.doesNotMatch(item.answer, banned, `FAQ answer: "${item.answer}"`);
    }
  });

  it("names the key competitors so it answers alternative searches", () => {
    const haystack = compareFaqItems.map((item) => `${item.question} ${item.answer}`).join(" ");
    for (const competitor of ["Maestro", "Playwright", "XCUITest"] as const) {
      assert.ok(haystack.includes(competitor), `FAQ references ${competitor}`);
    }
    // Sanity: the referenced names are ones the page actually profiles.
    for (const competitor of ["Maestro", "Playwright", "XCUITest"] as const) {
      assert.ok(competitorNames.includes(competitor));
    }
  });
});
