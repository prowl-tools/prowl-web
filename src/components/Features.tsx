'use client';

import { motion } from 'motion/react';
import { features } from '@/lib/features-data';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';

function FeatureIcon({ icon }: { icon: string }) {
  const cls = 'w-6 h-6 text-cyan';

  switch (icon) {
    case 'yaml':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6h2l4 6-4 6H4" /><path d="M20 6h-2l-4 6 4 6h2" />
        </svg>
      );
    case 'target':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case 'artifacts':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 3v18" />
        </svg>
      );
    case 'lock':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 1 1 8 0v4" />
        </svg>
      );
    case 'watch':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
        </svg>
      );
    case 'ci':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case 'eye':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 'mock':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 12h4l3-9 6 18 3-9h4" />
        </svg>
      );
    case 'branch':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="6" r="3" /><circle cx="6" cy="6" r="3" /><circle cx="18" cy="18" r="3" />
          <path d="M6 9v6a3 3 0 0 0 3 3h6" /><path d="M18 9v9" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Features() {
  const reveal = useScrollReveal();

  return (
    <section className="px-6 pb-24 max-w-5xl mx-auto">
      <motion.div
        key={reveal.remountKey}
        {...reveal.motionProps}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-center mb-14">
          Built for desktop and web apps
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="group rounded-xl border border-border bg-surface-elevated p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-lg hover:shadow-cyan/5"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-surface p-2.5">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
