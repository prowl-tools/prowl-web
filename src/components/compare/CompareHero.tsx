'use client';

import { motion } from 'motion/react';
import GradientText from '@/components/ui/GradientText';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { revealVisible } from '@/lib/reveal';

export default function CompareHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-18 sm:pt-22">
      {/* Background gradient glow — matches the homepage hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-25 dark:opacity-35 blur-3xl"
        style={{
          background: 'radial-gradient(circle at center, var(--cyan) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="relative mx-auto w-full max-w-4xl text-center"
        variants={staggerContainer}
        {...revealVisible}
      >
        <motion.p
          variants={fadeUp}
          className="inline-flex rounded-full border border-border bg-surface px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted"
        >
          How Prowl compares
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mx-auto mt-7 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
        >
          How does Prowl <GradientText>compare</GradientText>?
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        >
          Every one of these tools is genuinely good at something. Prowl holds the one
          position none of them do: it tests a native macOS app — menu bar extras included —
          and a web app from the same YAML file. Here is an honest look at where each fits,
          and where Prowl leads.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
        >
          <a
            href="https://docs.prowl.tools"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-gradient-from to-gradient-to px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-cyan/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            Get started
          </a>
          <a
            href="#matrix"
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold transition hover:border-cyan/60 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            Compare capabilities
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
