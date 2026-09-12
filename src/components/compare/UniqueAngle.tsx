'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import { uniqueAngles } from '@/lib/competitors-data';

export default function UniqueAngle() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section className="px-6 pb-20 pt-4">
        <motion.div className="mx-auto w-full max-w-7xl" variants={staggerContainer} {...reveal}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            Where Prowl leads
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            One test format, desktop first
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            Prowl is desktop-first: it leads with native macOS apps and treats the web as the
            second target, both from the same hunt. That is the angle no incumbent holds.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {uniqueAngles.map((angle) => (
              <motion.div
                key={angle.title}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface-elevated p-6"
              >
                <h3 className="text-lg font-semibold">{angle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{angle.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
