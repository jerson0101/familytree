'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Button,
  Badge,
  Skeleton,
} from '@kintree/ui';
import { createClient } from '@/lib/supabase';
import { useFamily } from '@/hooks/useFamily';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'interview' | 'research' | 'documentation' | 'photo';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  suggested_questions?: string[];
  is_active: boolean;
  isCompleted?: boolean;
  completedAt?: string;
}

const defaultChallenges: Challenge[] = [
  {
    id: 'default-1',
    title: 'Entrevista a un Abuelo',
    description: 'Graba una conversación con un abuelo sobre sus memorias de infancia',
    category: 'interview',
    difficulty: 'medium',
    points: 50,
    requirements: [
      'Grabar al menos 15 minutos de conversación',
      'Preguntar sobre su hogar de infancia',
      'Documentar al menos 3 hechos familiares nuevos',
    ],
    is_active: true,
  },
  {
    id: 'default-2',
    title: 'Digitaliza Fotos Antiguas',
    description: 'Encuentra y escanea al menos 5 fotos familiares de antes de 1980',
    category: 'photo',
    difficulty: 'easy',
    points: 25,
    requirements: [
      'Encontrar al menos 5 fotos de antes de 1980',
      'Escanearlas en alta resolución',
      'Etiquetar cada foto con nombres y fechas aproximadas',
    ],
    is_active: true,
  },
  {
    id: 'default-3',
    title: 'Investiga Registros de Inmigración',
    description: 'Encuentra registros de viaje de un ancestro que vino de otro país',
    category: 'research',
    difficulty: 'hard',
    points: 100,
    requirements: [
      'Identificar un ancestro que inmigró',
      'Buscar en bases de datos de inmigración',
      'Documentar el nombre del barco, fecha y puerto de entrada',
    ],
    is_active: true,
  },
  {
    id: 'default-4',
    title: 'Crea un Libro de Recetas',
    description: 'Recopila y documenta 5 recetas tradicionales familiares',
    category: 'documentation',
    difficulty: 'medium',
    points: 40,
    requirements: [
      'Recopilar 5 recetas de familiares',
      'Documentar el origen e historia de cada receta',
      'Incluir historias familiares asociadas',
    ],
    is_active: true,
  },
];

const categoryColors = {
  interview: 'bg-blue-100 text-blue-700',
  photo: 'bg-purple-100 text-purple-700',
  research: 'bg-orange-100 text-orange-700',
  documentation: 'bg-green-100 text-green-700',
};

const categoryLabels = {
  interview: 'Entrevista',
  photo: 'Fotografía',
  research: 'Investigación',
  documentation: 'Documentación',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

const difficultyLabels = {
  easy: 'Fácil',
  medium: 'Medio',
  hard: 'Difícil',
};

export default function DetectiveChallengesPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { currentFamily } = useFamily();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch challenges and completed status
  useEffect(() => {
    async function fetchChallenges() {
      setIsLoading(true);
      try {
        // Fetch challenges from database
        const { data: dbChallenges, error: challengesError } = await supabase
          .from('detective_challenges')
          .select('*')
          .eq('is_active', true);

        let challengesList: Challenge[] = [];

        if (challengesError || !dbChallenges || dbChallenges.length === 0) {
          // Use default challenges if database is empty or error
          challengesList = defaultChallenges;
        } else {
          challengesList = dbChallenges.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            category: c.category,
            difficulty: c.difficulty,
            points: c.points,
            requirements: c.requirements || [],
            suggested_questions: c.suggested_questions,
            is_active: c.is_active,
          }));
        }

        // Fetch completed challenges for current family
        if (currentFamily?.id) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: completed } = await supabase
              .from('completed_challenges')
              .select('challenge_id, completed_at')
              .eq('family_id', currentFamily.id)
              .eq('user_id', user.id);

            if (completed) {
              const completedMap = new Map<string, string>(
                completed.map((c: any) => [c.challenge_id, c.completed_at])
              );

              challengesList = challengesList.map(challenge => ({
                ...challenge,
                isCompleted: completedMap.has(challenge.id),
                completedAt: completedMap.get(challenge.id) as string | undefined,
              }));
            }
          }
        }

        setChallenges(challengesList);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setChallenges(defaultChallenges);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChallenges();
  }, [supabase, currentFamily?.id]);

  // Mark challenge as completed
  const handleCompleteChallenge = async (challengeId: string) => {
    if (!currentFamily?.id) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First ensure challenge exists in database (for default challenges)
      const challenge = challenges.find(c => c.id === challengeId);
      if (!challenge) return;

      let dbChallengeId = challengeId;

      // Check if it's a default challenge that needs to be inserted
      if (challengeId.startsWith('default-')) {
        const { data: newChallenge, error: insertError } = await supabase
          .from('detective_challenges')
          .insert({
            title: challenge.title,
            description: challenge.description,
            category: challenge.category,
            difficulty: challenge.difficulty,
            points: challenge.points,
            requirements: challenge.requirements,
            is_active: true,
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('Error inserting challenge:', insertError);
          return;
        }

        dbChallengeId = newChallenge.id;
      }

      // Insert completed challenge
      const { error: completedError } = await supabase
        .from('completed_challenges')
        .upsert({
          family_id: currentFamily.id,
          user_id: user.id,
          challenge_id: dbChallengeId,
          completed_at: new Date().toISOString(),
        }, {
          onConflict: 'family_id,user_id,challenge_id'
        });

      if (completedError) {
        console.error('Error completing challenge:', completedError);
        return;
      }

      // Update local state
      setChallenges(prev =>
        prev.map(c =>
          c.id === challengeId
            ? { ...c, id: dbChallengeId, isCompleted: true, completedAt: new Date().toISOString() }
            : c
        )
      );

      setSelectedChallenge(null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPoints = challenges.reduce((acc, c) => acc + (c.isCompleted ? c.points : 0), 0);
  const completedCount = challenges.filter((c) => c.isCompleted).length;

  if (isLoading) {
    return (
      <Container size="md" padding={false}>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton width={40} height={40} />
          <Skeleton width={200} height={32} />
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Skeleton height={100} />
          <Skeleton height={100} />
          <Skeleton height={100} />
        </div>
        <div className="space-y-4">
          <Skeleton height={150} />
          <Skeleton height={150} />
          <Skeleton height={150} />
        </div>
      </Container>
    );
  }

  return (
    <Container size="md" padding={false}>
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dyk')}>
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-neutral-900">Desafíos de Detective</h1>
      </div>

      <p className="text-neutral-600 mb-6">
        Completa desafíos para descubrir más sobre tu historia familiar y ganar puntos.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-2">
              <TrophyIcon className="w-5 h-5 text-primary-600" />
            </div>
            <p className="text-3xl font-bold text-primary-600">{totalPoints}</p>
            <p className="text-sm text-neutral-600">Puntos Ganados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <CheckIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{completedCount}</p>
            <p className="text-sm text-neutral-600">Completados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
              <ClockIcon className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-neutral-900">{challenges.length - completedCount}</p>
            <p className="text-sm text-neutral-600">Pendientes</p>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const categoryColor = categoryColors[challenge.category as keyof typeof categoryColors];
          const categoryLabel = categoryLabels[challenge.category as keyof typeof categoryLabels];
          const difficultyColor = difficultyColors[challenge.difficulty as keyof typeof difficultyColors];
          const difficultyLabel = difficultyLabels[challenge.difficulty as keyof typeof difficultyLabels];

          return (
            <Card
              key={challenge.id}
              className={challenge.isCompleted ? 'opacity-75 border-green-200 bg-green-50/30' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-neutral-900">{challenge.title}</h3>
                      {challenge.isCompleted && (
                        <Badge variant="success">Completado</Badge>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">{challenge.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + categoryColor}>
                        {categoryLabel}
                      </span>
                      <span className={'px-2 py-1 rounded-full text-xs font-medium ' + difficultyColor}>
                        {difficultyLabel}
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center gap-1">
                        <StarIcon className="w-4 h-4" />
                        {challenge.points} puntos
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedChallenge(
                      selectedChallenge?.id === challenge.id ? null : challenge
                    )}
                  >
                    {selectedChallenge?.id === challenge.id ? 'Ocultar' : 'Ver Detalles'}
                  </Button>
                </div>

                {selectedChallenge?.id === challenge.id && (
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <h4 className="font-medium text-neutral-900 mb-2">Requisitos:</h4>
                    <ul className="space-y-2 mb-4">
                      {challenge.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {req}
                        </li>
                      ))}
                    </ul>

                    {challenge.suggested_questions && challenge.suggested_questions.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-neutral-900 mb-2">Preguntas Sugeridas:</h4>
                        <ul className="space-y-1">
                          {challenge.suggested_questions.map((question, index) => (
                            <li key={index} className="text-sm text-neutral-600">
                              • {question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!challenge.isCompleted && (
                      <Button
                        size="sm"
                        loading={isSubmitting}
                        onClick={() => handleCompleteChallenge(challenge.id)}
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Marcar como Completado
                      </Button>
                    )}

                    {challenge.isCompleted && challenge.completedAt && (
                      <p className="text-sm text-green-600">
                        Completado el {new Date(challenge.completedAt).toLocaleDateString('es', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Family Warning */}
      {!currentFamily && (
        <Card padding="lg" className="mt-6 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100">
              <AlertIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Crea tu familia primero</h3>
              <p className="text-amber-600 text-sm">
                Para guardar tu progreso en los desafíos, necesitas crear tu familia.
              </p>
            </div>
          </div>
        </Card>
      )}
    </Container>
  );
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V8M14 22V8" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
