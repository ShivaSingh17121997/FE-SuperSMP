'use client';

import React from 'react';
import { Users, GraduationCap, Globe, Award } from 'lucide-react';

const stats = [
  { label: 'Schools', value: '500+', icon: GraduationCap },
  { label: 'Students', value: '250K+', icon: Users },
  { label: 'States', value: '12+', icon: Globe },
  { label: 'Uptime', value: '99.9%', icon: Award },
];

const team = [
  { name: 'Rahul Sharma', role: 'CEO & Founder', bio: 'Former EdTech leader with 10+ years in education technology.' },
  { name: 'Priya Nair', role: 'CTO', bio: 'Full-stack architect passionate about scalable education platforms.' },
  { name: 'Amit Patel', role: 'Head of Product', bio: 'Product leader focused on creating delightful user experiences.' },
  { name: 'Sneha Gupta', role: 'Head of Customer Success', bio: 'Dedicated to helping schools get the most from SuperSMP.' },
];

export default function AboutPage() {
  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-6">
            Building the Future of <span className="gradient-text">School Management</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            We started SuperSMP with a simple belief: every school deserves access to world-class management tools, regardless of size or budget. Today, we serve 500+ schools across India, helping them save time, reduce costs, and focus on what matters most — education.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-primary-600" />
                  </div>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                  <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-6">Our Mission</h2>
          <p className="text-lg text-text-secondary leading-relaxed">
            To empower every school with intelligent, affordable, and easy-to-use technology that transforms how they operate, communicate, and educate. We believe that when schools run better, students learn better.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-surface-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-text-primary text-center mb-16">Our Leadership Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-border text-center hover:shadow-md transition-all">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-base font-semibold text-text-primary">{member.name}</h3>
                <p className="text-sm text-primary-600 mb-3">{member.role}</p>
                <p className="text-sm text-text-secondary">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
