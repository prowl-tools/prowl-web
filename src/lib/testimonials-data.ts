/**
 * User testimonials for the comparison page.
 *
 * IMPORTANT: this array is intentionally EMPTY. Do not fabricate quotes, names,
 * titles, companies, or logos — ever. Add an entry here only when a real user
 * has given a real, attributable quote and permission to publish it. Until then
 * the `Testimonials` component renders nothing, so no placeholder is visible on
 * the live page. (prowl PROWL-037 / GTM-002 acceptance criteria.)
 */

export interface Testimonial {
  /** The exact words the person said, verbatim and approved for publication. */
  quote: string;
  /** The real person's name. */
  name: string;
  /** Their role and/or company, as they agreed to have it shown. */
  role: string;
}

export const testimonials: Testimonial[] = [
  // Real, attributed, permission-cleared quotes go here — nothing else.
];
