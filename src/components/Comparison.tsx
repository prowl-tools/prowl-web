'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import {
  comparisonColumns,
  comparisonDisclaimer,
  comparisonRows,
} from '@/lib/comparison-data';

export default function Comparison() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="compare" className="px-6 pb-24 scroll-mt-20">
        <motion.div
          className="mx-auto w-full max-w-7xl"
          variants={staggerContainer}
          key={reveal.remountKey}
          {...reveal.motionProps}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            How it compares
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Desktop and web from the same file
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            Mobile-first and web-only tools each cover part of a Mac developer&apos;s app; Prowl covers
            the native app and the web app with one test format.
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

          <motion.p variants={fadeUp} className="mt-6 text-sm">
            <Link
              href="/compare"
              className="inline-flex items-center gap-1 font-semibold text-cyan hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-sm"
            >
              See the full comparison
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </motion.p>

          <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
            {comparisonDisclaimer}
          </motion.p>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
