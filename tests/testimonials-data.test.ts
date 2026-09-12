import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { testimonials } from "../src/lib/testimonials-data.ts";

/**
 * Guard against shipping fabricated or half-filled testimonials
 * (prowl PROWL-037 / GTM-002: never fabricate quotes, names, or logos). The
 * array is expected to be empty for now; if a real quote is ever added it must
 * be fully attributed — every field present and non-empty — so nothing
 * anonymous or placeholder-shaped can render on the live page.
 */
describe("testimonials-data", () => {
  it("is an array", () => {
    assert.ok(Array.isArray(testimonials));
  });

  it("has no placeholder or partial entries", () => {
    for (const testimonial of testimonials) {
      for (const [field, value] of Object.entries(testimonial)) {
        assert.equal(typeof value, "string", `${field} is a string`);
        assert.ok(value.trim().length > 0, `${field} is non-empty (no placeholder)`);
      }
    }
  });
});
