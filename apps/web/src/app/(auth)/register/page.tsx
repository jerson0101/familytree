'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, Input } from '@kintree/ui';
import { useAuth } from '@/lib/auth-provider';
import { createClient } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
      setIsGoogleLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const { error: signUpError, session } = await signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
        }
      );

      if (signUpError) throw signUpError;

      // If session exists, user is automatically logged in (email confirmation disabled)
      if (session) {
        router.push('/');
        router.refresh();
        return;
      }

      // Show success message - user needs to confirm email
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card padding="lg">
        <CardContent>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-neutral-500 mb-6">
              We&apos;ve sent a confirmation link to <strong>{formData.email}</strong>.
              Click the link to activate your account.
            </p>
            <Link href="/login">
              <Button variant="outline" fullWidth>
                Back to sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="shadow-elevated border-0">
      <CardContent>
        <h2 className="text-xl font-semibold text-center mb-6">Create your account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="John"
              required
              fullWidth
            />
            <Input
              label="Last name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="Doe"
              required
              fullWidth
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="you@example.com"
            required
            fullWidth
          />

          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="At least 8 characters"
            required
            fullWidth
          />

          <Input
            label="Confirm password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            required
            fullWidth
          />

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          <Button type="submit" loading={isLoading} fullWidth disabled={isGoogleLoading}>
            Create account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-neutral-500">or continue with</span>
          </div>
        </div>

        <Button
          variant="outline"
          fullWidth
          leftIcon={<GoogleIcon />}
          onClick={handleGoogleSignUp}
          loading={isGoogleLoading}
          disabled={isLoading}
        >
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-neutral-400 mt-4">
          By creating an account, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </CardContent>
    </Card>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
