import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareAsOf,
  competitorDisclaimer,
  competitorNames,
  notForYou,
  uniqueAngles,
} from "../src/lib/competitors-data.ts";

/**
 * The /compare page is comparative advertising (prowl LEGAL-004): every claim
 * about another tool must be a concrete, factual statement, competitors must be
 * named accurately, the disclaimer must date the claims and disown affiliation,
 * and Prowl's own immature targets must stay labelled experimental.
 */
describe("competitors-data", () => {
  it("describes competitors factually rather than disparaging them", () => {
    const banned = /\b(worse|inferior|broken|slow|clunky|bloated|outdated|useless|only\s+prowl)\b/i;
    const claimStrings = [
      ...notForYou.map((item) => item.detail),
      ...uniqueAngles.map((angle) => angle.detail),
    ];
    for (const claim of claimStrings) {
      assert.doesNotMatch(claim, banned, `disparaging language: "${claim}"`);
    }
  });

  it("keeps the experimental caveat on Prowl's mobile and macOS claims", () => {
    const mobileLimit = notForYou.find((item) => /mobile/i.test(item.title));
    assert.ok(mobileLimit, "a 'not for you' item covers native mobile");
    assert.match(mobileLimit.detail, /experimental/i);

    const macosLimit = notForYou.find((item) => /macos/i.test(item.title) || /macos/i.test(item.detail));
    assert.ok(macosLimit, "a 'not for you' item covers the macOS setup");
    assert.match(macosLimit.detail, /source/i);
  });

  it("has an honest 'not for you if' list that points elsewhere", () => {
    assert.ok(notForYou.length >= 3);
    for (const item of notForYou) {
      assert.ok(item.title.trim().length > 0);
      assert.ok(item.detail.trim().length > 0);
    }
    // At least one item should name a competitor as the better fit.
    const namesAnAlternative = notForYou.some((item) =>
      competitorNames.some((name) => item.detail.includes(name)),
    );
    assert.ok(namesAnAlternative, "a limit points the reader at a better-fitting tool");
  });

  it("provides unique angles as page content", () => {
    assert.ok(uniqueAngles.length > 0);
    for (const angle of uniqueAngles) {
      assert.ok(angle.title.trim().length > 0);
      assert.ok(angle.detail.trim().length > 0);
    }
    // The signature positioning claim must appear in the unique angles.
    const leadsWithBoth = uniqueAngles.some((angle) =>
      /macos/i.test(angle.title + angle.detail) && /web/i.test(angle.title + angle.detail),
    );
    assert.ok(leadsWithBoth, "an angle states the native-macOS-plus-web position");
  });

  it("dates the claims and names every competitor in the disclaimer", () => {
    assert.ok(competitorDisclaimer.includes(compareAsOf));
    for (const competitor of competitorNames) {
      assert.ok(competitorDisclaimer.includes(competitor), `disclaimer names ${competitor}`);
    }
    assert.match(competitorDisclaimer, /not affiliated/i);
    assert.match(competitorDisclaimer, /trademarks/i);
  });
});
