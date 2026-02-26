'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Grid,
  Skeleton,
} from '@kintree/ui';
import { useDYKQuiz } from '@/hooks/useDYKQuiz';
import { useFamily } from '@/hooks/useFamily';
import { useFamilyTree } from '@/hooks/useFamilyTree';
import { createClient } from '@/lib/supabase';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function DYKPage() {
  const { stats, isLoading: quizLoading, questions } = useDYKQuiz();
  const { currentFamily, isLoading: familyLoading } = useFamily();
  const { persons } = useFamilyTree();
  const supabase = useMemo(() => createClient(), []);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  // Fetch detective challenges
  useEffect(() => {
    async function fetchChallenges() {
      setIsLoadingChallenges(true);
      try {
        const { data, error } = await supabase
          .from('detective_challenges')
          .select('id, title, description, points, difficulty')
          .eq('is_active', true)
          .limit(3);

        if (error) {
          console.error('Error fetching challenges:', error);
          // Use default challenges if fetch fails
          setChallenges([
            {
              id: '1',
              title: 'Interview a Grandparent',
              description: 'Record a conversation with a grandparent about their childhood',
              points: 50,
              difficulty: 'medium',
            },
            {
              id: '2',
              title: 'Find an Old Photo',
              description: 'Locate and digitize a photo from before 1980',
              points: 25,
              difficulty: 'easy',
            },
            {
              id: '3',
              title: 'Research Immigration Records',
              description: 'Find immigration records for an ancestor',
              points: 100,
              difficulty: 'hard',
            },
          ]);
        } else {
          setChallenges(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoadingChallenges(false);
      }
    }

    fetchChallenges();
  }, [supabase]);

  const categories = [
    { id: 'maternal', name: 'Maternal Line', icon: <WomanIcon />, progress: stats.categoryProgress.maternal },
    { id: 'paternal', name: 'Paternal Line', icon: <ManIcon />, progress: stats.categoryProgress.paternal },
    { id: 'self', name: 'Personal History', icon: <MirrorIcon />, progress: stats.categoryProgress.self },
    { id: 'extended', name: 'Extended Family', icon: <FamilyGroupIcon />, progress: stats.categoryProgress.extended },
  ];

  // Calculate knowledge gaps based on family data
  const knowledgeGaps = useMemo(() => {
    const gaps = [];

    // Check for missing birth dates
    const missingBirthDates = persons.filter(p => !p.birthDate);
    if (missingBirthDates.length > 0) {
      gaps.push({
        title: 'Birth Dates',
        description: `${missingBirthDates.length} person(s) missing birth date`,
        icon: <CalendarIcon />,
      });
    }

    // Check for missing birth places
    const missingBirthPlaces = persons.filter(p => !p.birthPlace);
    if (missingBirthPlaces.length > 0) {
      gaps.push({
        title: 'Birth Places',
        description: `${missingBirthPlaces.length} person(s) missing birth place`,
        icon: <GlobeIcon />,
      });
    }

    // Check for older generations
    const generations = new Set(persons.map(p => {
      if (p.birthDate) {
        const year = new Date(p.birthDate).getFullYear();
        return Math.floor((2024 - year) / 25);
      }
      return 0;
    }));

    if (generations.size < 3) {
      gaps.push({
        title: 'More Generations',
        description: 'Add information about grandparents and great-grandparents',
        icon: <UserQuestionIcon />,
      });
    }

    // If no gaps found, show encouragement
    if (gaps.length === 0) {
      gaps.push({
        title: 'Great Job!',
        description: 'Your family tree is quite complete',
        icon: <StarIcon />,
      });
    }

    return gaps.slice(0, 3);
  }, [persons]);

  const isLoading = quizLoading || familyLoading;

  if (isLoading) {
    return (
      <Container size="lg" padding={false}>
        <div className="mb-6">
          <Skeleton width={200} height={32} />
          <Skeleton width={300} height={20} className="mt-2" />
        </div>
        <Skeleton height={200} className="mb-6 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton height={300} className="rounded-2xl" />
          <Skeleton height={300} className="rounded-2xl" />
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" padding={false}>
      {/* Header with gradient text */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Do You Know?</h1>
          <p className="text-neutral-500 mt-1">Test your family knowledge</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dyk/challenges">
            <Button variant="outline" leftIcon={<TrophyIcon />}>
              Challenges
            </Button>
          </Link>
          <Link href="/dyk/quiz">
            <Button leftIcon={<PlayIcon />}>
              Start Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Score Overview - Hero Card with gradient and decorative elements */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        {/* Animated background circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 animate-float" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-accent-400/20 animate-pulse-glow" />

        <Card padding="lg" className="relative bg-gradient-hero text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-white/70 mb-1 font-medium">Your Family Knowledge Score</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold">{stats.score}%</span>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {stats.level === 'high' ? 'Expert' : stats.level === 'medium' ? 'Intermediate' : 'Beginner'}
                </Badge>
              </div>
              <p className="text-white/70 mt-3">
                {stats.correct} out of {stats.answered} questions answered correctly
              </p>
              {questions.length > 0 && (
                <p className="text-white/50 text-sm mt-1">
                  {questions.length - stats.answered} questions available
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <CircularProgress value={stats.score} size={140} />
            </div>
          </div>
        </Card>
      </div>

      {/* No Family Warning */}
      {!currentFamily && (
        <Card padding="lg" className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200">
              <AlertIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Create your family first</h3>
              <p className="text-amber-700 text-sm">
                To generate quiz questions, you first need to create your family and add people.
              </p>
            </div>
            <Link href="/">
              <Button size="sm">Go to Home</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* No Persons Warning */}
      {currentFamily && persons.length === 0 && (
        <Card padding="lg" className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg shadow-blue-200">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Add people to your tree</h3>
              <p className="text-blue-700 text-sm">
                Quiz questions are generated from your family tree. Add people to start!
              </p>
            </div>
            <Link href="/tree">
              <Button size="sm">Go to Tree</Button>
            </Link>
          </div>
        </Card>
      )}

      <Grid cols={2} gap="lg" responsive>
        {/* Categories with animated progress bars */}
        <Card padding="md" className="hover-lift">
          <CardHeader title="Quiz Categories" subtitle="Your progress by family line" />
          <CardContent>
            <div className="space-y-5">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center gap-4 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-neutral-800">
                        {category.name}
                      </span>
                      <span className="text-sm font-bold text-primary-600">{category.progress}%</span>
                    </div>
                    <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out progress-bar-gradient"
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {questions.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <Link href="/dyk/quiz">
                  <Button fullWidth className="group">
                    <span className="mr-2">
                      {stats.answered > 0
                        ? `Continue Quiz (${questions.length - stats.answered} remaining)`
                        : `Start Quiz (${questions.length} questions)`}
                    </span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detective Challenges */}
        <Card padding="md" className="hover-lift">
          <CardHeader
            title="Detective Challenges"
            subtitle="Earn points by researching your family"
            action={
              <Link href="/dyk/challenges">
                <Button variant="ghost" size="sm">
                  View all
                </Button>
              </Link>
            }
          />
          <CardContent>
            {isLoadingChallenges ? (
              <div className="space-y-3">
                <Skeleton height={80} className="rounded-xl" />
                <Skeleton height={80} className="rounded-xl" />
                <Skeleton height={80} className="rounded-xl" />
              </div>
            ) : (
              <div className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    className="p-4 rounded-xl border border-neutral-100 hover:border-primary-200 bg-white hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all cursor-pointer group animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                          {challenge.title}
                        </h4>
                        <p className="text-sm text-neutral-500 mt-1">
                          {challenge.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          challenge.difficulty === 'easy'
                            ? 'success'
                            : challenge.difficulty === 'medium'
                              ? 'warning'
                              : 'error'
                        }
                        glow
                        size="sm"
                      >
                        {challenge.points} pts
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Knowledge Gaps */}
        <Card padding="md" className="col-span-full hover-lift">
          <CardHeader title="Improvement Areas" subtitle="Missing information in your family tree" />
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {knowledgeGaps.map((gap, index) => (
                <GapCard
                  key={index}
                  title={gap.title}
                  description={gap.description}
                  icon={gap.icon}
                  delay={index * 100}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
}

function CircularProgress({ value, size }: { value: number; size: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-50"
        style={{ background: `conic-gradient(from 0deg, rgba(255,255,255,0.3) ${value}%, transparent ${value}%)` }}
      />

      <svg className="transform -rotate-90 relative z-10" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.7)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl font-bold">{value}</span>
          <span className="text-xl opacity-70">%</span>
        </div>
      </div>
    </div>
  );
}

function GapCard({
  title,
  description,
  icon,
  delay = 0,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="p-5 rounded-2xl bg-gradient-to-br from-accent-50 to-amber-50 border border-accent-100 hover:border-accent-200 transition-all hover:-translate-y-1 cursor-pointer animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-amber-400 flex items-center justify-center mb-4 text-white shadow-lg shadow-accent-200">
        {icon}
      </div>
      <h4 className="font-semibold text-neutral-900">{title}</h4>
      <p className="text-sm text-neutral-600 mt-1">{description}</p>
    </div>
  );
}

// Icons
function TrophyIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V8M14 22V8" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function UserQuestionIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function WomanIcon() {
  return (
    <svg className="w-5 h-5 inline-block text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="5" />
      <path d="M12 12v10M9 16h6" />
    </svg>
  );
}

function ManIcon() {
  return (
    <svg className="w-5 h-5 inline-block text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="7" r="5" />
      <path d="M12 12v10M8 22l4-10 4 10" />
    </svg>
  );
}

function MirrorIcon() {
  return (
    <svg className="w-5 h-5 inline-block text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="3" width="14" height="18" rx="4" />
      <path d="M9 7l6 10M13 7l2 4" />
    </svg>
  );
}

function FamilyGroupIcon() {
  return (
    <svg className="w-5 h-5 inline-block text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="7" r="4" />
      <path d="M2 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <circle cx="17" cy="7" r="3" />
      <path d="M22 21v-2a3 3 0 00-1.5-2.6M14 15a4 4 0 014 4v2" />
    </svg>
  );
}
