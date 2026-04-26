'use client';

import React, { useState } from 'react';
import { Button, Input, Textarea } from '@/components/ui';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="pt-24">
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">Get in Touch</h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Have questions? Want a demo? We&apos;d love to hear from you. Our team responds within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Email</h3>
                  <p className="text-sm text-text-secondary">hello@supersmp.com</p>
                  <p className="text-sm text-text-secondary">support@supersmp.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Phone</h3>
                  <p className="text-sm text-text-secondary">+91-11-4000-5000</p>
                  <p className="text-sm text-text-secondary">Mon-Sat, 9am-6pm IST</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Office</h3>
                  <p className="text-sm text-text-secondary">123 Tech Park, Sector 62</p>
                  <p className="text-sm text-text-secondary">Noida, UP 201301</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2 bg-surface p-8 rounded-2xl border border-border">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-success-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Message Sent!</h3>
                  <p className="text-sm text-text-secondary">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Full Name" placeholder="John Doe" required />
                    <Input label="Email" type="email" placeholder="john@school.edu" required />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Phone" placeholder="+91-9876543210" />
                    <Input label="School Name" placeholder="Your school name" />
                  </div>
                  <Textarea label="Message" placeholder="Tell us about your needs..." rows={4} required />
                  <Button type="submit" size="lg" icon={Send} fullWidth>
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
