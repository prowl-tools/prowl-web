import { compareFaqItems } from '@/lib/compare-faq-data';

export default function CompareFaq() {
  return (
    <section className="px-6 pb-22">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Comparison FAQ</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted">
          The questions developers ask when choosing between Prowl and the tool they already know.
        </p>

        <div className="mt-8 space-y-3">
          {compareFaqItems.map((item) => (
            <details key={item.question} className="rounded-xl border border-border bg-surface-elevated p-4 open:border-cyan/35">
              <summary className="cursor-pointer list-none text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-sm">
                {item.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
