'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import {
  comparisonColumns,
  comparisonDisclaimer,
  comparisonRows,
} from '@/lib/comparison-data';

/**
 * Capability matrix on /compare. Reuses `comparison-data.ts` — the same single
 * source of reviewable claims the homepage table renders — so the two never
 * drift. The homepage keeps its own `Comparison` section; this is the fuller
 * page's copy of the same data with page-appropriate framing.
 */
export default function CompareMatrix() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="matrix" className="px-6 pb-20 scroll-mt-20">
        <motion.div className="mx-auto w-full max-w-7xl" variants={staggerContainer} {...reveal}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            Capability at a glance
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Side by side
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            The capabilities that most often decide the choice, stated factually from each
            project&apos;s public documentation.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface-elevated"
          >
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">
                Capability comparison of Prowl with Maestro, Playwright, and XCUITest
              </caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    <span className="sr-only">Capability</span>
                  </th>
                  {comparisonColumns.map((column, i) => (
                    <th
                      key={column}
                      scope="col"
                      className={`px-5 py-4 text-sm font-semibold ${i === 0 ? 'text-cyan' : ''}`}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.label} className="border-b border-border-subtle last:border-b-0">
                    <th scope="row" className="px-5 py-4 align-top font-semibold">
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td
                        key={`${row.label}-${comparisonColumns[i]}`}
                        className={`px-5 py-4 align-top leading-relaxed ${i === 0 ? 'text-foreground' : 'text-muted'}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
            {comparisonDisclaimer}
          </motion.p>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
