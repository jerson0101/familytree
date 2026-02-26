'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Skeleton,
  Avatar,
} from '@kintree/ui';
import { useFamily } from '@/hooks/useFamily';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { useAuthStore } from '@/stores/authStore';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { currentFamily, families, isLoading: familyLoading, createFamily } = useFamily();
  const { persons, unions, isLoading: treeLoading } = useFamilyTree();

  // If loading, show skeleton
  if (familyLoading) {
    return <DashboardSkeleton />;
  }

  // If no families, show onboarding
  if (families.length === 0) {
    return <OnboardingFlow onCreateFamily={createFamily} />;
  }

  // Calculate stats from real data
  const totalMembers = persons.length;
  const livingMembers = persons.filter(p => p.isLiving).length;
  const generations = calculateGenerations(persons);
  const completionRate = totalMembers === 0 ? 0 : Math.min(100, Math.round((totalMembers / 10) * 100)); // Arbitrary goal of 10 members

  const userName = user?.firstName || 'there';

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-24">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
          Good morning, {userName}
        </h1>
        <p className="text-neutral-500 mt-2 text-lg">
          {currentFamily?.name ? `Managing ${currentFamily.name}` : "Here's what's happening with your family"}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up">
        <CleanStatCard
          label="Family Members"
          value={totalMembers}
          icon={<UsersIcon />}
          delay={0}
        />
        <CleanStatCard
          label="Generations"
          value={generations}
          icon={<TreeIcon />}
          delay={100}
        />
        <CleanStatCard
          label="Living Members"
          value={livingMembers}
          icon={<HeartIcon />}
          delay={200}
        />
        <CleanStatCard
          label="Tree Progress"
          value={`${completionRate}%`}
          icon={<ChartIcon />}
          delay={300}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12 animate-slide-up animation-delay-300">
        <h2 className="text-lg font-bold text-neutral-900 mb-5 pl-1">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard
            href="/tree?action=add"
            title="Add Person"
            subtitle="Grow your tree"
            icon={<PlusIcon className="w-6 h-6 text-white" />}
            color="bg-neutral-900"
          />
          <ActionCard
            href="/tree"
            title="View Tree"
            subtitle="Explore lineage"
            icon={<TreeIcon className="w-6 h-6 text-white" />}
            color="bg-emerald-600"
          />
          <ActionCard
            href="/social"
            title="Post Memory"
            subtitle="Share moments"
            icon={<CameraIcon className="w-6 h-6 text-white" />}
            color="bg-blue-600"
          />
          <ActionCard
            href="/invitations"
            title="Invite Family"
            subtitle="Collaborate"
            icon={<InviteIcon className="w-6 h-6 text-white" />}
            color="bg-purple-600"
          />
        </div>
      </div>

      {/* Recent Activity / Members */}
      <div className="animate-slide-up animation-delay-500">
        <div className="flex items-center justify-between mb-5 pl-1">
          <h2 className="text-lg font-bold text-neutral-900">Recent Additions</h2>
          <Link href="/tree" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            View All
          </Link>
        </div>

        {treeLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton height={80} />
            <Skeleton height={80} />
          </div>
        ) : persons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {persons.slice(0, 6).map((person) => (
              <CleanMemberCard key={person.id} person={person} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// Components

function CleanStatCard({ label, value, icon, delay }: { label: string; value: string | number; icon: React.ReactNode; delay: number }) {
  return (
    <div
      className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-start justify-between min-h-[120px] transition-all hover:shadow-md hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-2 bg-neutral-50 rounded-xl text-neutral-900 mb-3">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</p>
        <p className="text-xs font-medium text-neutral-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ActionCard({ href, title, subtitle, icon, color }: { href: string; title: string; subtitle: string; icon: React.ReactNode; color: string }) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group-hover:border-neutral-200">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform group-hover:scale-110 ${color}`}>
          {icon}
        </div>
        <h3 className="font-bold text-neutral-900 mb-1">{title}</h3>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
    </Link>
  );
}

function CleanMemberCard({ person }: { person: any }) {
  const fullName = `${person.firstName} ${person.lastName || ''}`;
  return (
    <div className="bg-white p-3 pr-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 transition-colors hover:border-neutral-200">
      <Avatar name={fullName} src={person.photoUrl} size="md" />
      <div className="min-w-0">
        <h4 className="font-bold text-neutral-900 text-sm truncate">{fullName}</h4>
        <p className="text-xs text-neutral-500 truncate">
          {person.birthDate ? new Date(person.birthDate).getFullYear() : 'Unknown Year'} • {person.gender?.charAt(0).toUpperCase() + person.gender?.slice(1)}
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white rounded-3xl border border-neutral-100 p-8 text-center">
      <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <UsersIcon className="w-8 h-8 text-neutral-400" />
      </div>
      <h3 className="font-bold text-neutral-900 mb-2">Start your tree</h3>
      <p className="text-neutral-500 text-sm mb-6 max-w-xs mx-auto">
        Your family tree is empty. Add yourself or a relative to get started.
      </p>
      <Link href="/tree?action=add" className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-neutral-800 transition-colors">
        <PlusIcon className="w-4 h-4" />
        Add First Person
      </Link>
    </div>
  );
}

function OnboardingFlow({ onCreateFamily }: { onCreateFamily: (input: { name: string }) => Promise<any> }) {
  const [familyName, setFamilyName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleCreate = async () => {
    if (!familyName.trim()) return;
    setIsCreating(true);
    await onCreateFamily({ name: familyName.trim() });
    setIsCreating(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
            <TreeIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-3">
            Welcome to KinTree
          </h1>
          <p className="text-neutral-500 text-lg">
            Let's start by naming your family group.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-neutral-100">
          <label className="block text-sm font-bold text-neutral-900 mb-2">
            Family Name
          </label>
          <input
            type="text"
            placeholder="e.g., The Garcia Family"
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all mb-6"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
          />

          <button
            onClick={handleCreate}
            disabled={!familyName.trim() || isCreating}
            className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isCreating ? 'Creating...' : 'Create Family'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="mb-10">
        <Skeleton width={300} height={40} />
        <Skeleton width={200} height={24} className="mt-3" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Skeleton height={140} className="rounded-3xl" />
        <Skeleton height={140} className="rounded-3xl" />
        <Skeleton height={140} className="rounded-3xl" />
        <Skeleton height={140} className="rounded-3xl" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton height={160} className="rounded-3xl" />
        <Skeleton height={160} className="rounded-3xl" />
        <Skeleton height={160} className="rounded-3xl" />
        <Skeleton height={160} className="rounded-3xl" />
      </div>
    </div>
  );
}

// Helpers & Icons

function calculateGenerations(persons: any[]): number {
  if (persons.length === 0) return 0;
  if (persons.length < 3) return 1;
  return Math.min(Math.ceil(Math.log2(persons.length + 1)), 7);
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z" />
      <path d="M9 22h6" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function InviteIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
