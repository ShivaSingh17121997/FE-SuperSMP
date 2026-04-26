'use client';

import React from 'react';
import { FEATURES } from '@/constants';

export default function FeaturesPage() {
  return (
    <main className="pt-24">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Powerful Features for Modern Schools
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Every tool your school needs to run efficiently, communicate effectively, and deliver exceptional education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="group p-8 rounded-2xl border border-border bg-surface hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-text-primary mb-3">{feature.title}</h2>
                  <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
