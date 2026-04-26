'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks';
import { GraduationCap, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', email: 'superadmin@supersmp.com', password: 'admin123' },
  { label: 'School Admin', email: 'admin@dps.edu', password: 'school123' },
  { label: 'Principal', email: 'principal@dps.edu', password: 'principal123' },
  { label: 'Teacher', email: 'meena@school.edu', password: 'teacher123' },
  { label: 'Parent', email: 'parent@email.com', password: 'parent123' },
  { label: 'Student', email: 'aarav@student.edu', password: 'student123' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login, getDashboardPath } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError('');

    const result = await login(data.email, data.password);
    setIsLoading(false);

    if (result.success) {
      const session = JSON.parse(localStorage.getItem('smp_auth_user') || '{}');
      router.push(getDashboardPath(session.role));
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setValue('email', account.email);
    setValue('password', account.password);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="relative flex flex-col items-center justify-center w-full px-16 text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center leading-tight">Welcome Back to<br />SuperSMP</h1>
          <p className="text-lg text-white/70 text-center max-w-md">
            Manage your entire school with one powerful, intelligent platform.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs text-white/60 mt-1">Schools</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">250K</p>
              <p className="text-xs text-white/60 mt-1">Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold">99.9%</p>
              <p className="text-xs text-white/60 mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">SuperSMP</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-1">Sign in to your account</h2>
          <p className="text-sm text-text-secondary mb-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Start free trial
            </Link>
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-red-200 text-sm text-danger-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="admin@school.edu"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              placeholder="Enter your password"
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-tertiary hover:text-text-secondary cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isLoading} icon={ArrowRight} iconPosition="right">
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">Quick Login (Demo Accounts)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemo(account)}
                  className="px-3 py-2 text-xs font-medium text-text-secondary bg-surface-secondary hover:bg-surface-tertiary rounded-lg transition-colors text-left cursor-pointer"
                >
                  <span className="block font-semibold text-text-primary">{account.label}</span>
                  <span className="text-text-tertiary">{account.email}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-text-tertiary">
              By signing in, you agree to our{' '}
              <Link href="#" className="text-primary-600 hover:underline">Terms</Link> and{' '}
              <Link href="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
