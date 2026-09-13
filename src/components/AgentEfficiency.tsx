'use client';

import { type ReactNode } from 'react';
import { motion } from 'motion/react';
import { highlights } from '@/lib/agent-data';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { useScrollReveal } from '@/lib/reveal';
import SectionReveal from '@/components/ui/SectionReveal';

const CYAN = 'text-cyan-500 dark:text-cyan-300';
const GREEN = 'text-emerald-500 dark:text-emerald-300';
const PURPLE = 'text-violet-500 dark:text-violet-300';
const MUTED = 'text-zinc-300 dark:text-zinc-400';
const YELLOW = 'text-amber-500 dark:text-amber-300';

/* ---------- Code snippet ---------- */

const prowlCode: ReactNode = (
  <>
    <span className={MUTED}>$</span> <span className={CYAN}>prowl</span> analyze <span className={GREEN}>https://app.com/login</span> <span className={YELLOW}>--json</span>{'\n'}
    {'  '}<span className={MUTED}>|</span> <span className={CYAN}>prowl</span> generate <span className={YELLOW}>--intent</span> <span className={GREEN}>&quot;test login&quot;</span> <span className={YELLOW}>--stdout</span>{'\n'}
    {'\n'}
    <span className={MUTED}>$</span> <span className={CYAN}>prowl</span> run <span className={GREEN}>login</span> <span className={YELLOW}>--json</span>{'\n'}
    <span className={`${GREEN} font-bold`}>PASS</span> login (622ms) 5/5 steps{'\n'}
    <span className={PURPLE}>exitCode</span><span className={MUTED}>:</span> <span className={YELLOW}>0</span>
  </>
);

const prowlYaml: ReactNode = (
  <>
    <span className={PURPLE}>name</span><span className={MUTED}>:</span> <span className={GREEN}>login</span>{'\n'}
    <span className={PURPLE}>steps</span><span className={MUTED}>:</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>navigate</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;/login&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>fill</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Email&quot;</span> <span className={GREEN}>&quot;{'{{TEST_EMAIL}}'}&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>fill</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Password&quot;</span> <span className={GREEN}>&quot;{'{{TEST_PASSWORD}}'}&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>click</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;Sign in&quot;</span>{'\n'}
    {'  '}<span className={MUTED}>-</span> <span className={CYAN}>assert</span><span className={MUTED}>:</span> <span className={YELLOW}>visible</span> <span className={GREEN}>&quot;Dashboard&quot;</span>
  </>
);

const mcpConfig: ReactNode = (
  <>
    <span className={MUTED}>{'{'}</span>{'\n'}
    {'  '}<span className={PURPLE}>&quot;mcpServers&quot;</span><span className={MUTED}>: {'{'}</span>{'\n'}
    {'    '}<span className={PURPLE}>&quot;prowl&quot;</span><span className={MUTED}>: {'{'}</span>{'\n'}
    {'      '}<span className={PURPLE}>&quot;command&quot;</span><span className={MUTED}>:</span> <span className={GREEN}>&quot;prowl&quot;</span><span className={MUTED}>,</span>{'\n'}
    {'      '}<span className={PURPLE}>&quot;args&quot;</span><span className={MUTED}>:</span> <span className={MUTED}>[</span><span className={GREEN}>&quot;mcp&quot;</span><span className={MUTED}>]</span>{'\n'}
    {'    '}<span className={MUTED}>{'}'}</span>{'\n'}
    {'  '}<span className={MUTED}>{'}'}</span>{'\n'}
    <span className={MUTED}>{'}'}</span>
  </>
);

/* ---------- MCP tools ---------- */

const mcpTools: { name: string; desc: string }[] = [
  { name: 'list_hunts', desc: 'Hunt names in run order' },
  { name: 'run_hunt', desc: 'Run one hunt, get the full result' },
  { name: 'run_suite', desc: 'Run all hunts, auto-log failures as bugs' },
  { name: 'list_projects', desc: 'Registered projects in the registry' },
];

/* ---------- Highlight icons ---------- */

function HighlightIcon({ icon }: { icon: string }) {
  const cls = 'w-6 h-6 text-cyan';

  switch (icon) {
    case 'json':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 3H6a2 2 0 0 0-2 2v2" /><path d="M16 3h2a2 2 0 0 1 2 2v2" />
          <path d="M8 21H6a2 2 0 0 1-2-2v-2" /><path d="M16 21h2a2 2 0 0 0 2-2v-2" />
          <path d="M9 12h6" /><path d="M12 9v6" />
        </svg>
      );
    case 'api':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 6h2l4 6-4 6H4" /><path d="M20 6h-2l-4 6 4 6h2" />
        </svg>
      );
    case 'analyze':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          <path d="M8 11h6" /><path d="M11 8v6" />
        </svg>
      );
    case 'generate':
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l1.09 3.26L16 6l-2.91.74L12 10l-1.09-3.26L8 6l2.91-.74L12 2z" />
          <path d="M5 15l.65 1.95L7.5 17.6l-1.85.65L5 20.2l-.65-1.95L2.5 17.6l1.85-.65L5 15z" />
          <path d="M19 12l.65 1.95 1.85.65-1.85.65L19 17.2l-.65-1.95-1.85-.65 1.85-.65L19 12z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ---------- Component ---------- */

export default function AgentEfficiency() {
  const reveal = useScrollReveal();

  return (
    <SectionReveal>
      <section id="agent-efficiency" className="px-6 pb-24 max-w-5xl mx-auto scroll-mt-20">
        <motion.div
          key={reveal.remountKey}
          {...reveal.motionProps}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Built for AI-assisted development</h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted">
              AI agents can analyze a page or an app, generate hunts, and execute tests through
              the CLI or a native MCP server — deterministic results, structured output,
              no UI reasoning required. Generation runs on your own provider key.
            </p>
          </motion.div>

          {/* Code panel */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-cyan/30 bg-surface-elevated p-6 ring-1 ring-cyan/10 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Three-command pipeline</h3>
              <span className="text-xs font-mono text-cyan">analyze → generate → run</span>
            </div>

            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-mono text-muted">login.yml</p>
                <pre className="overflow-x-auto rounded-md border border-border-subtle bg-code-bg p-4 text-xs leading-relaxed text-zinc-200 dark:text-zinc-300 font-mono">
                  <code>{prowlYaml}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-mono text-muted">terminal output</p>
                <pre className="overflow-x-auto rounded-md border border-border-subtle bg-code-bg p-4 text-xs leading-relaxed text-zinc-200 dark:text-zinc-300 font-mono">
                  <code>{prowlCode}</code>
                </pre>
              </div>
            </div>

            <ul className="space-y-1.5 text-sm text-muted">
              <li className="flex gap-2"><span className="text-cyan shrink-0">+</span>Deterministic execution — same YAML hunt, same result every time</li>
              <li className="flex gap-2"><span className="text-cyan shrink-0">+</span>Structured JSON output and exit codes for agent branching</li>
              <li className="flex gap-2"><span className="text-cyan shrink-0">+</span>No UI reasoning — Prowl drives the browser or the Accessibility tree</li>
              <li className="flex gap-2"><span className="text-cyan shrink-0">+</span>Simple CLI interface — works standalone or as part of a larger agent toolchain</li>
            </ul>
          </motion.div>

          {/* MCP panel */}
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-violet-500/30 bg-surface-elevated p-6 ring-1 ring-violet-500/10 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Native MCP server</h3>
              <span className="text-xs font-mono text-violet-500 dark:text-violet-300">prowl mcp</span>
            </div>

            <p className="mb-4 text-sm text-muted">
              Run <code className="font-mono text-violet-500 dark:text-violet-300">prowl mcp</code> to
              expose Prowl to any MCP-capable agent — Claude Desktop, Cursor, OpenClaw — as a small set of
              named tools. The agent triggers runs and reads structured results; it never needs shell
              access to your repo.
            </p>

            <div className="mb-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-mono text-muted">mcp client config</p>
                <pre className="overflow-x-auto rounded-md border border-border-subtle bg-code-bg p-4 text-xs leading-relaxed text-zinc-200 dark:text-zinc-300 font-mono">
                  <code>{mcpConfig}</code>
                </pre>
              </div>
              <div>
                <p className="mb-2 text-xs font-mono text-muted">exposed tools</p>
                <ul className="space-y-2.5 rounded-md border border-border-subtle bg-code-bg p-4 text-xs">
                  {mcpTools.map((tool) => (
                    <li key={tool.name} className="flex flex-col gap-0.5">
                      <span className="font-mono text-violet-300">{tool.name}</span>
                      <span className="text-zinc-400">{tool.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <ul className="space-y-1.5 text-sm text-muted">
              <li className="flex gap-2"><span className="text-violet-500 dark:text-violet-300 shrink-0">+</span>No shell access — agents call a fixed set of tools, never arbitrary commands</li>
              <li className="flex gap-2"><span className="text-violet-500 dark:text-violet-300 shrink-0">+</span>Guardrails apply — allowedDomains, forbiddenSelectors, and maxSteps gate every run</li>
              <li className="flex gap-2"><span className="text-violet-500 dark:text-violet-300 shrink-0">+</span>Auto bug-logging — run_suite logs failures as deduplicated tickets in your backlog</li>
              <li className="flex gap-2"><span className="text-violet-500 dark:text-violet-300 shrink-0">+</span>Multi-project — one server drives many repos via a project registry</li>
            </ul>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-surface-elevated p-6 transition-all duration-200 hover:-translate-y-1 hover:border-cyan/40 hover:shadow-lg hover:shadow-cyan/5"
              >
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-surface p-2.5">
                  <HighlightIcon icon={item.icon} />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUp} className="mt-10 text-center">
            <a
              href="https://docs.prowl.tools/agents"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan hover:underline underline-offset-4"
            >
              Agent integration guide
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7" /><path d="M7 7h10v10" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </section>
    </SectionReveal>
  );
}
