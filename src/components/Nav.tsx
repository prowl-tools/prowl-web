'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

const linkClass =
  'hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-sm';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-lg transition-colors ${
        scrolled ? 'bg-background/80 border-b border-border' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded-sm">
          <Image src="/static/img/prowl-logo.png" alt="Prowl logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">Prowl</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6 text-sm">
          <Link href="/#how-it-works" className={linkClass}>How it works</Link>
          <Link href="/compare" className={linkClass}>Compare</Link>
          <a href="https://docs.prowl.tools" target="_blank" rel="noopener noreferrer" className={linkClass}>
            Docs
          </a>
          <Link href="/blog" className={linkClass}>Blog</Link>
          <a href="https://github.com/prowl-tools/prowl" target="_blank" rel="noopener noreferrer" className={linkClass}>
            GitHub
          </a>
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="relative h-9 w-9 rounded-lg border border-border bg-surface hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan flex items-center justify-center"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-background/95 backdrop-blur-lg px-6 py-4 space-y-3 text-sm">
          <Link href="/#how-it-works" className={`block ${linkClass}`} onClick={() => setMenuOpen(false)}>How it works</Link>
          <Link href="/compare" className={`block ${linkClass}`} onClick={() => setMenuOpen(false)}>Compare</Link>
          <a href="https://docs.prowl.tools" target="_blank" rel="noopener noreferrer" className={`block ${linkClass}`}>
            Docs
          </a>
          <Link href="/blog" className={`block ${linkClass}`} onClick={() => setMenuOpen(false)}>Blog</Link>
          <a href="https://github.com/prowl-tools/prowl" target="_blank" rel="noopener noreferrer" className={`block ${linkClass}`}>
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
