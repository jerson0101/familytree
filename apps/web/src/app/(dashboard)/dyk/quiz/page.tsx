'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  Button,
  Skeleton,
} from '@kintree/ui';
import { useDYKQuiz, type QuizQuestion } from '@/hooks/useDYKQuiz';

export default function QuizPage() {
  const router = useRouter();
  const { getQuizQuestions, submitAnswer, stats, isLoading } = useDYKQuiz();

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionsLoadedRef = useRef(false);

  // Load quiz questions only once when data is ready
  useEffect(() => {
    if (!isLoading && !questionsLoadedRef.current) {
      questionsLoadedRef.current = true;
      const questions = getQuizQuestions(10);
      setQuizQuestions(questions);

      if (questions.length === 0) {
        setQuizComplete(true);
      }
    }
  }, [isLoading, getQuizQuestions]);

  const currentQuestion = quizQuestions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    const answer = currentQuestion.answerType === 'text' ? textAnswer : selectedAnswer;
    if (!answer) return;

    setIsSubmitting(true);
    const correct = await submitAnswer(currentQuestion.id, answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
    }

    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setTextAnswer('');

    if (currentIndex + 1 >= quizQuestions.length) {
      setQuizComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <Container size="md" padding={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Skeleton width={400} height={300} />
        </div>
      </Container>
    );
  }

  if (quizComplete) {
    const percentage = quizQuestions.length > 0
      ? Math.round((correctCount / quizQuestions.length) * 100)
      : 0;

    return (
      <Container size="md" padding={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card padding="lg" className="w-full max-w-md text-center">
            <div className="mb-6">
              {percentage >= 80 ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyIcon className="w-10 h-10 text-green-600" />
                </div>
              ) : percentage >= 50 ? (
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="w-10 h-10 text-yellow-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookIcon className="w-10 h-10 text-blue-600" />
                </div>
              )}

              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {quizQuestions.length === 0
                  ? '¡No hay preguntas disponibles!'
                  : percentage >= 80
                    ? '¡Excelente!'
                    : percentage >= 50
                      ? '¡Buen trabajo!'
                      : '¡Sigue aprendiendo!'}
              </h2>

              {quizQuestions.length > 0 && (
                <>
                  <p className="text-4xl font-bold text-primary-600 mb-2">
                    {correctCount} / {quizQuestions.length}
                  </p>
                  <p className="text-neutral-500">
                    Respondiste correctamente el {percentage}% de las preguntas
                  </p>
                </>
              )}

              {quizQuestions.length === 0 && (
                <p className="text-neutral-500">
                  Agrega más personas a tu árbol familiar para generar preguntas del quiz.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Button fullWidth onClick={() => router.push('/dyk')}>
                Volver al inicio
              </Button>
              {quizQuestions.length > 0 && (
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    setQuizComplete(false);
                    setCurrentIndex(0);
                    setCorrectCount(0);
                    setShowResult(false);
                    setSelectedAnswer(null);
                    setTextAnswer('');
                    questionsLoadedRef.current = false;
                    // Need to reload with fresh questions
                    const questions = getQuizQuestions(10);
                    setQuizQuestions(questions);
                    if (questions.length === 0) {
                      setQuizComplete(true);
                    }
                  }}
                >
                  Jugar de nuevo
                </Button>
              )}
            </div>
          </Card>
        </div>
      </Container>
    );
  }

  if (!currentQuestion) {
    return (
      <Container size="md" padding={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card padding="lg" className="w-full max-w-md text-center">
            <p className="text-neutral-500">Cargando preguntas...</p>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container size="md" padding={false}>
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dyk')}>
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Salir
          </Button>
          <span className="text-sm text-neutral-500">
            Pregunta {currentIndex + 1} de {quizQuestions.length}
          </span>
        </div>
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card padding="lg" className="mb-6">
        {/* Category & Difficulty */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentQuestion.category === 'maternal' ? 'bg-pink-100 text-pink-700' :
            currentQuestion.category === 'paternal' ? 'bg-blue-100 text-blue-700' :
            currentQuestion.category === 'self' ? 'bg-purple-100 text-purple-700' :
            'bg-green-100 text-green-700'
          }`}>
            {currentQuestion.category === 'maternal' ? 'Línea Materna' :
             currentQuestion.category === 'paternal' ? 'Línea Paterna' :
             currentQuestion.category === 'self' ? 'Personal' : 'Familia Extendida'}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {currentQuestion.points} pts
          </span>
        </div>

        {/* Question */}
        <h2 className="text-xl font-semibold text-neutral-900 mb-6">
          {currentQuestion.question}
        </h2>

        {/* Answer Options */}
        {!showResult ? (
          <div className="space-y-3">
            {currentQuestion.answerType === 'text' ? (
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            ) : (
              currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                    selectedAnswer === option
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <span className={selectedAnswer === option ? 'text-primary-700' : 'text-neutral-700'}>
                    {option}
                  </span>
                </button>
              ))
            )}

            <Button
              fullWidth
              size="lg"
              className="mt-4"
              disabled={currentQuestion.answerType === 'text' ? !textAnswer.trim() : !selectedAnswer}
              loading={isSubmitting}
              onClick={handleSubmitAnswer}
            >
              Confirmar respuesta
            </Button>
          </div>
        ) : (
          /* Result */
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-red-600" />
                )}
                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </span>
              </div>
              {!isCorrect && (
                <p className="text-sm text-neutral-600">
                  La respuesta correcta es: <strong>{currentQuestion.correctAnswer}</strong>
                </p>
              )}
            </div>

            <Button fullWidth size="lg" onClick={handleNextQuestion}>
              {currentIndex + 1 >= quizQuestions.length ? 'Ver resultados' : 'Siguiente pregunta'}
            </Button>
          </div>
        )}
      </Card>

      {/* Current Score */}
      <div className="text-center text-sm text-neutral-500">
        Respuestas correctas: {correctCount} / {currentIndex + (showResult ? 1 : 0)}
      </div>
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
