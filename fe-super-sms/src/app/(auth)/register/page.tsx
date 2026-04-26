'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/hooks';
import { GraduationCap, Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  adminName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: 'Passwords must match', path: ['confirmPassword'] });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, getDashboardPath } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setError('');

    const result = await registerUser({
      schoolName: data.schoolName,
      adminName: data.adminName,
      email: data.email,
      phone: data.phone,
      password: data.password,
    });

    setIsLoading(false);

    if (result.success) {
      router.push(getDashboardPath('school-admin'));
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        <div className="relative flex flex-col items-center justify-center w-full px-16 text-white">
          <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/20">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Start Your Free Trial</h1>
          <p className="text-lg text-white/70 text-center max-w-md">
            Join 500+ schools already transforming their operations with SuperSMP.
          </p>
          <ul className="mt-10 space-y-4 text-white/80">
            {['14-day free trial', 'No credit card required', 'Full access to all features', 'Free onboarding support'].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="2" /></svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-surface overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">SuperSMP</span>
          </div>

          <h2 className="text-2xl font-bold text-text-primary mb-1">Create your account</h2>
          <p className="text-sm text-text-secondary mb-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign in</Link>
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger-50 border border-red-200 text-sm text-danger-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="School Name" icon={Building2} placeholder="Delhi Public School" error={errors.schoolName?.message} {...register('schoolName')} />
            <Input label="Your Name" icon={User} placeholder="Rajesh Kumar" error={errors.adminName?.message} {...register('adminName')} />
            <Input label="Email Address" type="email" icon={Mail} placeholder="admin@school.edu" error={errors.email?.message} {...register('email')} />
            <Input label="Phone Number" icon={Phone} placeholder="+91-9876543210" error={errors.phone?.message} {...register('phone')} />
            <Input
              label="Password"
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
            <Input label="Confirm Password" type="password" icon={Lock} placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

            <Button type="submit" fullWidth size="lg" isLoading={isLoading} icon={ArrowRight} iconPosition="right" className="mt-2">
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-text-tertiary">
            By creating an account, you agree to our{' '}
            <Link href="#" className="text-primary-600 hover:underline">Terms</Link> and{' '}
            <Link href="#" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
