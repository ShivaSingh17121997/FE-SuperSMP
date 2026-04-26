'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { PUBLIC_NAV, APP_NAME } from '@/constants';
import { GraduationCap, Menu, X, ArrowRight } from 'lucide-react';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-border shadow-xs'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className={cn('text-xl font-bold tracking-tight', scrolled ? 'text-text-primary' : 'text-white')}>
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {PUBLIC_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  scrolled ? 'text-text-secondary hover:text-text-primary' : 'text-white/80 hover:text-white'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                'text-sm font-medium px-4 py-2 rounded-lg transition-colors',
                scrolled ? 'text-text-secondary hover:text-text-primary' : 'text-white/90 hover:text-white'
              )}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn('md:hidden p-2 rounded-lg cursor-pointer', scrolled ? 'text-text-primary' : 'text-white')}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-border animate-slide-down">
          <nav className="px-4 py-4 space-y-1">
            {PUBLIC_NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary rounded-lg"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border mt-4">
              <Link href="/login" className="block px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-secondary rounded-lg">
                Sign In
              </Link>
              <Link href="/register" className="block px-4 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-lg text-center">
                Start Free Trial
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
