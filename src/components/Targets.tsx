'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import SectionReveal from '@/components/ui/SectionReveal';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';

// Fixed colors for dark code backgrounds — intentionally not themed
const CYAN = 'text-cyan-light';
const GREEN = 'text-green-400';
const PURPLE = 'text-purple-400';
const MUTED = 'text-zinc-500';
const COMMENT = 'text-zinc-500 italic';

/**
 * A hunt made only of portable steps, so it runs unchanged on the macOS and
 * web targets — the point of the section.
 */
const portableHunt: ReactNode = (
  <>
    <span className={PURPLE}>name</span><span className={MUTED}>:</span> <span className={GREEN}>save-note</span>{'\n'}
    <span className={PURPLE}>steps</span><span className={MUTED}>:</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>fill</span><span className={MUTED}>:</span>{'\n'}
    {'      '}<span className={GREEN}>&quot;Title&quot;</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Standup notes&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>click</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Save&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>assert</span><span className={MUTED}>:</span>{'\n'}
    {'      '}<span className={PURPLE}>visible</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Saved&quot;</span>
  </>
);

const macosConfig: ReactNode = (
  <>
    <span className={COMMENT}># .prowl/config.yml</span>{'\n'}
    <span className={PURPLE}>target</span><span className={MUTED}>:</span>{'\n'}
    {'  '}<span className={PURPLE}>type</span><span className={MUTED}>:</span> <span className={GREEN}>macos</span>{'\n'}
    {'  '}<span className={PURPLE}>app</span><span className={MUTED}>:</span> <span className={GREEN}>com.example.Notes</span>
  </>
);

const webConfig: ReactNode = (
  <>
    <span className={COMMENT}># .prowl/config.yml</span>{'\n'}
    <span className={PURPLE}>target</span><span className={MUTED}>:</span>{'\n'}
    {'  '}<span className={PURPLE}>type</span><span className={MUTED}>:</span> <span className={GREEN}>web</span>{'\n'}
    {'  '}<span className={PURPLE}>url</span><span className={MUTED}>:</span> <span className={GREEN}>http://localhost:3000</span>
  </>
);

const targets: { name: string; detail: string; status?: string }[] = [
  {
    name: 'macOS',
    detail: 'Native apps through the Accessibility API — windows, sheets, and menu bar extras. Select by accessibility id, role, or label.',
  },
  {
    name: 'Web',
    detail: 'Browsers through Playwright — Chromium, Firefox, and WebKit — with its full selector engine.',
  },
  {
    name: 'Android & iOS Simulator',
    detail: 'The same portable steps on an emulator, a USB device, or the iOS Simulator.',
    status: 'Experimental',
  },
];

function ConfigCard({ label, code }: { label: string; code: ReactNode }) {
  return (
    <div>
      <div className="rounded-t-xl bg-code-surface border border-border-subtle px-4 py-2.5">
        <span className="text-xs font-medium text-muted font-mono">{label}</span>
      </div>
      <pre className="rounded-b-xl bg-code-bg border border-t-0 border-border-subtle p-4 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Targets() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="targets" className="px-6 pb-20 scroll-mt-20">
        <motion.div
          className="mx-auto w-full max-w-7xl"
          variants={staggerContainer}
          key={reveal.remountKey}
          {...reveal.motionProps}
        >
          <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.2em] text-muted">
            One hunt format
          </motion.p>
          <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Change the target, not the test
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 max-w-3xl text-muted">
            A hunt describes what a user does, not how a platform is driven. Point{' '}
            <code className="font-mono text-sm text-cyan">target</code> at a native Mac app
            or a URL and the same steps run against either.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: the portable hunt */}
            <div>
              <div className="rounded-t-xl bg-code-surface border border-border-subtle px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted font-mono">.prowl/hunts/save-note.yml</span>
                <span className="text-xs font-mono text-cyan">runs on both</span>
              </div>
              <pre className="rounded-b-xl bg-code-bg border border-t-0 border-border-subtle p-5 overflow-x-auto font-mono text-sm leading-relaxed text-zinc-300">
                <code>{portableHunt}</code>
              </pre>
            </div>

            {/* Right: swap the target */}
            <div className="grid gap-4">
              <ConfigCard label="native macOS app" code={macosConfig} />
              <ConfigCard label="web app" code={webConfig} />
            </div>
          </motion.div>

          {/* Target chips */}
          <motion.div variants={staggerContainer} className="mt-6 grid gap-4 md:grid-cols-3">
            {targets.map((target) => (
              <motion.div
                key={target.name}
                variants={fadeUp}
                className="rounded-xl border border-border bg-surface-elevated p-5"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold">{target.name}</h3>
                  {target.status && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                      {target.status}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{target.detail}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 max-w-3xl text-sm text-muted">
            Portable steps — click, fill, type, press, assert, screenshot, if, repeat — run on
            every target. Web-only steps such as <code className="font-mono text-xs">navigate</code> and{' '}
            <code className="font-mono text-xs">mockRoute</code> are rejected up front on a native
            target with a clear error, not ten minutes into a CI run.
          </motion.p>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
