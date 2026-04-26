'use client';

import React from 'react';
import Link from 'next/link';
import { PRICING_PLANS } from '@/constants';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function PricingPage() {
  return (
    <main className="pt-24">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Start with a 14-day free trial. No credit card required. Upgrade or downgrade anytime.
            </p>
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
                <h2 className="text-xl font-semibold text-text-primary mb-1">{plan.name}</h2>
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
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
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
    </main>
  );
}
