import Link from 'next/link';
import SectionReveal from '@/components/ui/SectionReveal';

/**
 * Slim homepage pointer to the /compare page. Replaces the full "How Prowl
 * compares" table that used to render here (owner decision, 2026-09-12): the
 * capability matrix and every comparative claim now live only on /compare, so
 * the homepage stays short and the legally-sensitive copy has one home.
 */
export default function CompareTeaser() {
  return (
    <SectionReveal>
      <section id="compare" className="px-6 pb-24 scroll-mt-20">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-xl border border-border bg-surface-elevated p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">How does Prowl compare?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              An honest look at Maestro, Playwright, and XCUITest — what each is best at, and
              where Prowl leads.
            </p>
          </div>
          <Link
            href="/compare"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-gradient-to-r from-gradient-from to-gradient-to px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-cyan/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
          >
            See the full comparison
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
    </SectionReveal>
  );
}
