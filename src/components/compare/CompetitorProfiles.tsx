'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import { competitorDisclaimer, competitorProfiles } from '@/lib/competitors-data';

export default function CompetitorProfiles() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="best-for" className="px-6 pb-20 scroll-mt-20">
        <motion.div className="mx-auto w-full max-w-7xl" variants={staggerContainer} {...reveal}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            A fair comparison
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What each tool is best at
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            No tool wins everywhere. Here is where each of these is the genuinely better choice —
            and how Prowl relates to it.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2">
            {competitorProfiles.map((profile) => (
              <motion.article
                key={profile.name}
                variants={fadeUp}
                className="flex flex-col rounded-xl border border-border bg-surface-elevated p-6"
              >
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{profile.what}</p>

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan">Best for</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-foreground">{profile.bestFor}</p>
                </div>

                <div className="mt-4 border-t border-border-subtle pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    How Prowl relates
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{profile.prowlAngle}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-4 max-w-4xl text-xs leading-relaxed text-muted">
            {competitorDisclaimer}
          </motion.p>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
