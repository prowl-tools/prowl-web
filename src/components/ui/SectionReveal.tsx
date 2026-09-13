'use client';

import { motion } from 'motion/react';
import { fadeUp } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
  const reveal = useScrollReveal();

  return (
    <motion.div
      variants={fadeUp}
      key={reveal.remountKey}
      {...reveal.motionProps}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
