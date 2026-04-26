'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useAuth } from '@/hooks';
import { Loader } from '@/components/ui';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Give auth a moment to hydrate
    const timeout = setTimeout(() => {
      const session = localStorage.getItem('smp_auth_token');
      if (!session) {
        router.push('/login');
      } else {
        setChecking(false);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="text-center">
          <Loader className="py-4" />
          <p className="text-sm text-text-secondary mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopNavbar />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
