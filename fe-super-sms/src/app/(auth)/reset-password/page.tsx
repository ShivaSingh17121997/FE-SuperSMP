'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { GraduationCap, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
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

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Password Reset!</h2>
            <p className="text-sm text-text-secondary mb-6">Your password has been successfully reset.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Sign In
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-text-primary mb-1">Reset Password</h2>
            <p className="text-sm text-text-secondary mb-8">Create a new password for your account.</p>
            <form onSubmit={handleSubmit(() => setSuccess(true))} className="space-y-5">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                placeholder="Min 8 characters"
                error={errors.password?.message}
                rightElement={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-text-tertiary hover:text-text-secondary cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                placeholder="Repeat password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <Button type="submit" fullWidth size="lg">Reset Password</Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
