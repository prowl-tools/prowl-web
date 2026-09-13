import Image from 'next/image';
import Link from 'next/link';

export default function CompareCta() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-border bg-surface p-7 sm:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Test your Mac and web app together</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Try the one tool that covers both
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
              Write one YAML hunt and run it against a native macOS app and a web app.
              Deterministic runs, artifacts in your repo, your own keys — no vendor in the loop.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href="https://docs.prowl.tools"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-gradient-from to-gradient-to px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-cyan/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                Get started
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background/85 px-6 py-3 text-sm font-semibold transition hover:border-cyan/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                See how Prowl works
              </Link>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-xs items-center justify-center rounded-xl border border-border/70 bg-background/75 p-6">
            <Image
              src="/static/img/prowl-mascot.png"
              alt="Prowl mascot"
              width={240}
              height={240}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
