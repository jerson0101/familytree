import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient with decorative elements */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
        {/* Decorative floating circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float-slow animation-delay-300" />
        <div className="absolute bottom-40 left-32 w-24 h-24 bg-white/10 rounded-full blur-lg animate-float animation-delay-500" />
        <div className="absolute bottom-20 right-40 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float-slow animation-delay-700" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 shadow-elevated">
            <TreeIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
            Welcome to KinTree
          </h1>
          <p className="text-xl text-white/80 max-w-md leading-relaxed">
            Connect with your roots. Build your family tree, preserve memories, and discover your heritage.
          </p>

          {/* Feature list */}
          <div className="mt-12 space-y-4">
            <FeatureItem icon={<UsersIcon />} text="Build your family tree together" />
            <FeatureItem icon={<HeartIcon />} text="Preserve precious memories" />
            <FeatureItem icon={<ShieldIcon />} text="Secure and private" />
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-4 lg:p-8 relative">
        {/* Mobile gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-accent-50/50 lg:hidden" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo for mobile */}
          <div className="text-center mb-8 lg:hidden">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-primary">
              <TreeIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient-hero">KinTree</h1>
            <p className="text-neutral-500 mt-1">Family Operating System</p>
          </div>

          {/* Content */}
          <div className="animate-slide-up">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/90">
      <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}

function TreeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z" />
      <path d="M9 22h6" />
      <path d="M8 12c-2 0-4-1-4-3M16 12c2 0 4-1 4-3" />
    </svg>
  );
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

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-5 h-5'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
