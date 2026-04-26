'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMobileMenuOpen } from '@/store/slices/uiSlice';
import { switchRole } from '@/store/slices/authSlice';
import { markAllAsRead } from '@/store/slices/notificationSlice';
import { useAuth } from '@/hooks';
import { ROLES } from '@/constants';
import type { UserRole } from '@/types';
import { Bell, Menu, Search, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function TopNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount, items: notifications } = useAppSelector(s => s.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    if (roleRef.current && !roleRef.current.contains(e.target as Node)) setShowRoleSwitcher(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleRoleSwitch = (role: UserRole) => {
    dispatch(switchRole(role));
    setShowRoleSwitcher(false);
    router.push(`/dashboard/${role}`);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => dispatch(setMobileMenuOpen(true))}
            className="lg:hidden text-text-secondary hover:text-text-primary cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search students, teachers, fees..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg bg-surface-secondary border-0 placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              aria-label="Global search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Role Switcher (Dev tool) */}
          <div ref={roleRef} className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
            >
              <span>{ROLES.find(r => r.value === user?.role)?.label || 'Role'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showRoleSwitcher && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-xl border border-border py-1 animate-slide-down">
                {ROLES.map(role => (
                  <button
                    key={role.value}
                    onClick={() => handleRoleSwitch(role.value)}
                    className={cn(
                      'w-full px-4 py-2 text-sm text-left hover:bg-surface-secondary transition-colors cursor-pointer',
                      user?.role === role.value && 'bg-primary-50 text-primary-700'
                    )}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-xl shadow-xl border border-border animate-slide-down">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <button
                    onClick={() => dispatch(markAllAsRead())}
                    className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n.id} className={cn('px-4 py-3 hover:bg-surface-secondary border-b border-border-light', !n.isRead && 'bg-primary-50/30')}>
                      <p className="text-sm font-medium text-text-primary">{n.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 hover:bg-surface-secondary rounded-lg transition-colors cursor-pointer"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <ChevronDown className="w-3 h-3 text-text-tertiary hidden sm:block" />
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface rounded-xl shadow-xl border border-border py-1 animate-slide-down">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-text-primary">{user?.name}</p>
                  <p className="text-xs text-text-secondary">{user?.email}</p>
                  <p className="text-xs text-primary-600 mt-0.5 capitalize">{user?.role?.replace('-', ' ')}</p>
                </div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary cursor-pointer">
                  <User className="w-4 h-4" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-surface-secondary cursor-pointer">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
