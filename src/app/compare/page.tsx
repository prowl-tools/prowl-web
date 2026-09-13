import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CompareHero from '@/components/compare/CompareHero';
import UniqueAngle from '@/components/compare/UniqueAngle';
import CompareMatrix from '@/components/compare/CompareMatrix';
import NotForYou from '@/components/compare/NotForYou';
import Testimonials from '@/components/compare/Testimonials';
import CompareFaq from '@/components/compare/CompareFaq';
import CompareCta from '@/components/compare/CompareCta';
import { rssAlternateTypes } from '@/lib/rss';

const PAGE_TITLE = 'Prowl vs Maestro, Playwright & XCUITest — an honest comparison';
const PAGE_DESCRIPTION =
  'How Prowl compares to Maestro, Playwright, and XCUITest. A Maestro, Playwright, and XCUITest alternative that tests native macOS apps and web apps from one YAML file — with a fair "best for" on each and an honest "not for you if".';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  // Canonical to /compare (PQW-010 pattern). `types` re-included so RSS
  // autodiscovery survives Next's shallow `alternates` merge.
  alternates: {
    canonical: '/compare',
    types: rssAlternateTypes,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: 'https://prowl.tools/compare',
    siteName: 'Prowl',
    type: 'website',
    locale: 'en_US',
    // The root file-convention image applies to descendants, but this page's
    // own openGraph object replaces the parent through shallow merging, so the
    // site-wide card is referenced explicitly (mirrors /blog).
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    creator: '@prowltools',
    images: ['/opengraph-image'],
  },
};

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <CompareHero />
        <UniqueAngle />
        <CompareMatrix />
        <NotForYou />
        {/* Renders nothing until real, attributed testimonials exist. */}
        <Testimonials />
        <CompareFaq />
        <CompareCta />
      </main>
      <Footer />
    </div>
  );
}
