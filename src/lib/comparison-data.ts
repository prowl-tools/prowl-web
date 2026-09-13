/**
 * "How Prowl compares" capability data, rendered as per-tool cards on
 * /compare. Every cell must be a factual, verifiable claim drawn from each
 * project's public documentation (prowl LEGAL-004 — FTC comparative-advertising
 * guidelines): describe what each tool does, never disparage. Re-check `asOf`
 * when editing a cell.
 *
 * Each cell carries a machine-readable `status` (drives the card's icon) plus
 * the factual `text` shown beside it; `status: null` renders text only (for
 * rows like languages, where support levels don't apply).
 */

export const comparisonAsOf = "August 2026";

export const comparisonColumns = ["Prowl", "Maestro", "Playwright", "XCUITest"] as const;

/** Support level rendered as the cell's icon; `null` renders text alone. */
export type ComparisonStatus = "yes" | "no" | "partial" | null;

export interface ComparisonCell {
  status: ComparisonStatus;
  text: string;
}

export interface ComparisonRow {
  label: string;
  /** One cell per entry in `comparisonColumns`, in order. */
  cells: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell];
}

export const comparisonRows: ComparisonRow[] = [
  {
    label: "Native macOS apps",
    cells: [
      { status: "yes", text: "Accessibility API, menu bar extras included" },
      { status: "no", text: "Not supported" },
      { status: "partial", text: "Electron apps only, experimental" },
      { status: "yes", text: "Apps built with Xcode" },
    ],
  },
  {
    label: "Web apps",
    cells: [
      { status: "yes", text: "Playwright — Chromium, Firefox, WebKit" },
      { status: "yes", text: "Supported" },
      { status: "yes", text: "Chromium, Firefox, WebKit" },
      { status: "no", text: "Not supported" },
    ],
  },
  {
    label: "Native mobile apps",
    cells: [
      { status: "partial", text: "Android & iOS Simulator — experimental" },
      { status: "yes", text: "iOS and Android" },
      { status: "no", text: "Not supported" },
      { status: "yes", text: "iOS only" },
    ],
  },
  {
    label: "Tests are written in",
    cells: [
      { status: null, text: "YAML" },
      { status: null, text: "YAML" },
      { status: null, text: "JavaScript / TypeScript, Python, Java, .NET" },
      { status: null, text: "Swift / Objective-C" },
    ],
  },
  {
    label: "Runs from",
    cells: [
      { status: null, text: "One CLI — any terminal or CI" },
      { status: null, text: "CLI (requires Java)" },
      { status: null, text: "Test runner / CLI" },
      { status: null, text: "Xcode / xcodebuild" },
    ],
  },
];

export const comparisonDisclaimer =
  `Based on each project's public documentation as of ${comparisonAsOf}. Maestro, Playwright, and XCUITest are trademarks of their respective owners; Prowl is not affiliated with or endorsed by them.`;
