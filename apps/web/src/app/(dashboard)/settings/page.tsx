'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Badge,
  Skeleton,
} from '@kintree/ui';
import { useFamily } from '@/hooks/useFamily';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/lib/auth-provider';

export default function SettingsPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const user = useAuthStore((state) => state.user);
  const { currentFamily, currentUserRole, isLoading: familyLoading } = useFamily();

  const [familyName, setFamilyName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#ff6b47');
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Update local state when family data loads
  useEffect(() => {
    if (currentFamily) {
      setFamilyName(currentFamily.name);
      setPrimaryColor(currentFamily.primaryColor || '#ff6b47');
    }
  }, [currentFamily]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // TODO: Implement save functionality
    setTimeout(() => setIsSaving(false), 1000);
  };

  if (familyLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 pb-24">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-neutral-500 mt-2 text-lg">
          Manage your account and family preferences
        </p>
      </div>

      <div className="space-y-8 animate-slide-up">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-neutral-400" />
            Your Profile
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <Avatar
              name={`${user?.firstName || ''} ${user?.lastName || ''}`}
              src={user?.avatarUrl}
              size="xl"
              className="w-24 h-24 text-2xl"
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-neutral-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-neutral-500 mb-2">{user?.email}</p>
              {currentUserRole && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-wider">
                  {currentUserRole}
                </span>
              )}
            </div>
            <div className="md:ml-auto">
              <button className="px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 font-medium text-sm hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Family Settings */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-neutral-400" />
            Family Preferences
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-2">
                Family Name
              </label>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all"
                placeholder="e.g. The Garcia Family"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-900 mb-4">
                Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {['#ff6b47', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#000000'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className={`w-10 h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${primaryColor === color ? 'ring-2 ring-offset-2 ring-neutral-900' : ''
                      }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {primaryColor === color && <CheckIcon className="w-5 h-5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm shadow-md hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isSaving && <Spinner className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Settings Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Members */}
          <Link href="/settings/members" className="group">
            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UsersIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Members</h3>
              <p className="text-sm text-neutral-500">Manage access and roles</p>
            </div>
          </Link>

          {/* Security */}
          <Link href="/security" className="group">
            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Security</h3>
              <p className="text-sm text-neutral-500">Password and privacy</p>
            </div>
          </Link>

          {/* Notifications */}
          <div className="group cursor-pointer">
            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BellIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Notifications</h3>
              <p className="text-sm text-neutral-500">Alert preferences</p>
            </div>
          </div>

          {/* Help */}
          <div className="group cursor-pointer">
            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <HelpIcon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-1">Help & Support</h3>
              <p className="text-sm text-neutral-500">FAQs and contact</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOutIcon className="w-5 h-5" />
            {isSigningOut ? 'Signing out...' : 'Sign Out'}
          </button>
          <p className="text-center text-xs text-neutral-400 mt-4">
            KinTree v2.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      <Skeleton width={150} height={40} className="mb-2" />
      <Skeleton width={250} height={24} className="mb-10" />

      <Skeleton height={200} className="rounded-3xl mb-8" />
      <Skeleton height={300} className="rounded-3xl mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton height={140} className="rounded-3xl" />
        <Skeleton height={140} className="rounded-3xl" />
      </div>
    </div>
  );
}

// Icons
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
