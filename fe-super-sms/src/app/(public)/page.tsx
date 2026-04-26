'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FEATURES, TESTIMONIALS, PRICING_PLANS, FAQ_ITEMS } from '@/constants';
import { ArrowRight, CheckCircle2, ChevronDown, Star, Sparkles, Play, Shield, Zap, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-primary-950 to-gray-950" />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
      }} />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Trusted by 500+ Schools Nationwide</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Manage Your Entire School in{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              One Smart Platform
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From admissions to alumni — manage students, teachers, attendance, fees, exams, and communication all in one powerful, easy-to-use platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/30 hover:-translate-y-0.5"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <Play className="w-5 h-5" /> Book a Demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Setup in 24hrs</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Used in 12+ States</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-900/20">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
            {/* Simulated dashboard image */}
            <div className="bg-gray-900 p-1">
              <div className="bg-surface rounded-xl p-4">
                <div className="flex gap-4 mb-4">
                  {[
                    { label: 'Total Students', val: '1,850', color: 'bg-primary-50 text-primary-700' },
                    { label: 'Teachers', val: '95', color: 'bg-green-50 text-green-700' },
                    { label: 'Fee Collection', val: '₹12.5L', color: 'bg-amber-50 text-amber-700' },
                    { label: 'Attendance', val: '94%', color: 'bg-purple-50 text-purple-700' },
                  ].map((card, i) => (
                    <div key={i} className={cn('flex-1 rounded-xl p-4', card.color)}>
                      <p className="text-xs font-medium opacity-70">{card.label}</p>
                      <p className="text-xl font-bold mt-1">{card.val}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-40 rounded-xl bg-surface-secondary flex items-center justify-center text-text-tertiary text-sm">
                    📊 Analytics Dashboard
                  </div>
                  <div className="h-40 rounded-xl bg-surface-secondary flex items-center justify-center text-text-tertiary text-sm">
                    📋 Recent Activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  const schools = ['Delhi Public School', "St. Xavier's", 'Greenwood Intl.', 'Cambridge School', 'National Model', 'DAV Public School'];
  return (
    <section className="py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-text-tertiary mb-8 uppercase tracking-wider">Trusted by leading educational institutions</p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {schools.map((school, i) => (
            <span key={i} className="text-lg font-semibold text-text-tertiary/60 hover:text-text-secondary transition-colors">
              {school}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 mb-2 uppercase tracking-wider">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything Your School Needs
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Comprehensive tools designed to streamline every aspect of school management.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-border bg-surface hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-24 bg-surface-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 mb-2 uppercase tracking-wider">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Loved by Schools Everywhere
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-surface p-6 rounded-2xl border border-border hover:shadow-md transition-all">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-text-primary">{t.name}</p>
                <p className="text-xs text-text-tertiary">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 mb-2 uppercase tracking-wider">Pricing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-text-secondary">Start free. Scale as you grow. No hidden fees.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <div
              key={i}
              className={cn(
                'relative rounded-2xl p-8 border transition-all',
                plan.popular
                  ? 'border-primary-600 shadow-xl shadow-primary-600/10 scale-105'
                  : 'border-border hover:shadow-lg'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-text-primary mb-1">{plan.name}</h3>
              <p className="text-sm text-text-secondary mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">₹{plan.price.toLocaleString()}</span>
                <span className="text-text-secondary">{plan.period}</span>
              </div>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                className={cn(
                  'block text-center py-3 px-6 rounded-xl font-semibold transition-all',
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-600/25'
                    : 'bg-surface-secondary text-text-primary hover:bg-surface-tertiary border border-border'
                )}
              >
                {plan.cta}
              </Link>
              <ul className="mt-8 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-surface-secondary" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 mb-2 uppercase tracking-wider">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-text-primary pr-4">{faq.question}</span>
                <ChevronDown className={cn('w-5 h-5 text-text-tertiary shrink-0 transition-transform', openIndex === i && 'rotate-180')} />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-sm text-text-secondary leading-relaxed animate-slide-down">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 p-12 lg:p-20 text-center">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your School?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Join 500+ schools already using SuperSMP to save time, improve communication, and deliver better education.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold bg-white text-primary-700 rounded-xl hover:bg-gray-50 transition-all shadow-lg"
              >
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
