'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import { painPoints } from '@/lib/competitors-data';

export default function PainPoints() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section className="px-6 pb-20">
        <motion.div className="mx-auto w-full max-w-5xl" variants={staggerContainer} key={reveal.remountKey}
        {...reveal.motionProps}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            Why we built it
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            The frustrations we built around
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            These are the recurring complaints developers have about UI testing. They shaped
            what Prowl is — and where we are honest about what it does not yet do.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-8 space-y-4">
            {painPoints.map((point) => (
              <motion.div
                key={point.pain}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface-elevated p-6"
              >
                <p className="border-l-2 border-cyan/50 pl-4 text-base font-medium italic leading-relaxed text-foreground">
                  {point.pain}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{point.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
