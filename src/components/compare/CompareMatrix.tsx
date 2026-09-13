'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import {
  comparisonColumns,
  comparisonDisclaimer,
  comparisonRows,
  type ComparisonStatus,
} from '@/lib/comparison-data';

/**
 * Capability section on /compare, rendered as one card per tool (owner
 * decision, 2026-09-12 — replaces the dense table format). `comparison-data.ts`
 * stays the single source of reviewable claims; this component only projects
 * its rows into per-tool columns.
 */

const statusLabels: Record<Exclude<ComparisonStatus, null>, string> = {
  yes: 'Supported',
  no: 'Not supported',
  partial: 'Partial support',
};

function StatusIcon({ status }: { status: Exclude<ComparisonStatus, null> }) {
  if (status === 'yes') {
    return (
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green/10"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
    );
  }

  if (status === 'partial') {
    return (
      <span
        aria-hidden="true"
        className="box-border flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-dashed border-muted"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted">
          <path d="M5 12c2.2-3 4.6-3 7 0s4.8 3 7 0" />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/10"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-muted">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </span>
  );
}

export default function CompareMatrix() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="matrix" className="px-6 pb-20 scroll-mt-20">
        <motion.div
          className="mx-auto w-full max-w-7xl"
          variants={staggerContainer}
          key={reveal.remountKey}
          {...reveal.motionProps}
        >
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

          <motion.div variants={staggerContainer} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {comparisonColumns.map((column, columnIndex) => {
              const isProwl = columnIndex === 0;

              return (
                <motion.article
                  key={column}
                  variants={fadeUp}
                  className={`relative flex flex-col gap-5 overflow-hidden rounded-xl border bg-surface-elevated p-6 ${
                    isProwl ? 'border-cyan/45 shadow-lg shadow-cyan/10' : 'border-border'
                  }`}
                >
                  {isProwl && (
                    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gradient-from to-gradient-to" />
                  )}
                  <h3 className={`text-lg font-semibold ${isProwl ? 'text-cyan' : 'text-foreground'}`}>
                    {column}
                  </h3>

                  {comparisonRows.map((row) => {
                    const cell = row.cells[columnIndex];

                    return (
                      <div key={row.label} className="flex flex-col gap-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                          {row.label}
                        </p>
                        <div className="flex items-start gap-2">
                          {cell.status !== null && <StatusIcon status={cell.status} />}
                          <p className={`text-sm leading-relaxed ${isProwl ? 'text-foreground' : 'text-muted'}`}>
                            {cell.status !== null && (
                              <span className="sr-only">{statusLabels[cell.status]}: </span>
                            )}
                            {cell.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.article>
              );
            })}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
            {comparisonDisclaimer}
          </motion.p>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
