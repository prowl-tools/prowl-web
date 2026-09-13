'use client';

import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useScrollReveal } from '@/lib/reveal';

interface TerminalLine {
  text: string;
  className?: string;
}

interface TypingEffectProps {
  lines: TerminalLine[];
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function TypingEffect({ lines }: TypingEffectProps) {
  const reveal = useScrollReveal('-40px');

  return (
    <motion.span
      className="block"
      key={reveal.remountKey}
      {...reveal.motionProps}
      variants={containerVariants}
    >
      {lines.map((line) => (
        <motion.span
          key={line.text}
          className={`block ${line.className || ''}`}
          variants={lineVariants}
        >
          {line.text}
        </motion.span>
      ))}
    </motion.span>
  );
}
