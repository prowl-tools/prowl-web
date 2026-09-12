'use client';

import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import { testimonials } from '@/lib/testimonials-data';

/**
 * Renders real user quotes when — and only when — there are any. The
 * `testimonials` array is intentionally empty for now (see
 * `src/lib/testimonials-data.ts`), so this component renders nothing on the
 * live page: no fabricated quotes, no visible placeholder. When real,
 * attributed, permission-cleared testimonials are added to the data module,
 * this section appears automatically.
 */
export default function Testimonials() {
  const reveal = useScrollReveal();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <SectionReveal>
      <section className="px-6 pb-20">
        <motion.div className="mx-auto w-full max-w-7xl" variants={staggerContainer} {...reveal}>
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            From the people using it
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            What developers say
          </motion.h2>

          <motion.div variants={staggerContainer} className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <motion.figure
                key={`${testimonial.name}-${testimonial.quote}`}
                variants={fadeUp}
                className="flex flex-col rounded-xl border border-border bg-surface-elevated p-6"
              >
                <blockquote className="text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{testimonial.name}</span>
                  <span className="text-muted"> &middot; {testimonial.role}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
