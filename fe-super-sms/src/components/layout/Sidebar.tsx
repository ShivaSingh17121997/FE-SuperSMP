'use client';

import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSidebar, setMobileMenuOpen } from '@/store/slices/uiSlice';
import { SIDEBAR_NAV, APP_NAME } from '@/constants';
import { ChevronLeft, GraduationCap, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, isMobileMenuOpen } = useAppSelector(s => s.ui);
  const userRole = useAppSelector(s => s.auth.user?.role);

  const filteredNav = SIDEBAR_NAV.filter(item => userRole && item.roles.includes(userRole));

  const handleToggle = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const closeMobile = useCallback(() => {
    dispatch(setMobileMenuOpen(false));
  }, [dispatch]);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname?.match(/^\/dashboard\/(super-admin|school-admin|principal|teacher|parent|student)$/);
    return pathname?.startsWith(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-bold text-text-primary tracking-tight">{APP_NAME}</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1" aria-label="Sidebar navigation">
        {filteredNav.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href === '/dashboard' ? `/dashboard/${userRole}` : item.href}
              onClick={closeMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-primary-600' : 'text-text-tertiary')} />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {active && !sidebarCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle - desktop only */}
      <div className="hidden lg:block p-3 border-t border-border shrink-0">
        <button
          onClick={handleToggle}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-tertiary hover:bg-surface-secondary hover:text-text-primary transition-colors cursor-pointer"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
          <div className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border flex flex-col z-50">
            <button
              onClick={closeMobile}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-surface border-r border-border h-screen sticky top-0 transition-all duration-300 shrink-0',
          sidebarCollapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
