'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import { notForYou } from '@/lib/competitors-data';

export default function NotForYou() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section className="px-6 pb-20">
        <motion.div className="mx-auto w-full max-w-5xl" variants={staggerContainer} {...reveal}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            Honest limits
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Prowl isn&apos;t for you if&hellip;
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            We would rather you pick the right tool than the wrong one. Here is when something
            else fits better today.
          </motion.p>

          <motion.div variants={staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2">
            {notForYou.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface-elevated p-6"
              >
                <h3 className="flex items-start gap-2 text-base font-semibold">
                  <span aria-hidden="true" className="mt-0.5 text-muted">&mdash;</span>
                  <span>{item.title}</span>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
