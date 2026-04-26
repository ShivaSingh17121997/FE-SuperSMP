'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { GraduationCap, Mail, ArrowLeft, Send } from 'lucide-react';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-secondary px-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-lg">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-primary">SuperSMP</span>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-success-500" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Check Your Email</h2>
            <p className="text-sm text-text-secondary mb-6">We&apos;ve sent a password reset link to your email address.</p>
            <Link href="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Forgot Password?</h2>
            <p className="text-sm text-text-secondary mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>
            <form onSubmit={handleSubmit(() => setSent(true))} className="space-y-5">
              <Input label="Email Address" type="email" icon={Mail} placeholder="admin@school.edu" error={errors.email?.message} {...register('email')} />
              <Button type="submit" fullWidth size="lg">Send Reset Link</Button>
            </form>
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary inline-flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
