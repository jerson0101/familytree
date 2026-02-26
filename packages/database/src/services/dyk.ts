/**
 * Do You Know (DYK) Service
 * Handles quiz questions, responses, and detective challenges
 */

import { getSupabaseClient } from '../client';
import type { DYKResponse as DBDYKResponse } from '../types';

export interface DYKQuestion {
  id: string;
  question: string;
  category: 'maternal' | 'paternal' | 'self' | 'extended';
  difficulty: 'easy' | 'medium' | 'hard';
  relatedPersonId?: string;
  answerType: 'text' | 'date' | 'multiple_choice' | 'yes_no';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface DYKResponseInput {
  familyId: string;
  userId: string;
  questionId: string;
  response: string;
  isCorrect: boolean;
  responseTime?: number; // milliseconds
}

export interface DYKScore {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  level: 'low' | 'medium' | 'high';
  categoryScores: {
    maternal: number;
    paternal: number;
    self: number;
    extended: number;
  };
}

export interface DetectiveChallenge {
  id: string;
  title: string;
  description: string;
  category: 'interview' | 'research' | 'documentation' | 'photo';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  requirements: string[];
  suggestedQuestions?: string[];
}

// Default questions template
const DEFAULT_QUESTIONS: Omit<DYKQuestion, 'id'>[] = [
  // Maternal line questions
  {
    question: "What is your maternal grandmother's maiden name?",
    category: 'maternal',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'Where was your maternal grandmother born?',
    category: 'maternal',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: "What was your mother's childhood nickname?",
    category: 'maternal',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  {
    question: 'What year did your maternal grandparents get married?',
    category: 'maternal',
    difficulty: 'medium',
    answerType: 'date',
    points: 10,
  },
  {
    question: "What was your maternal grandfather's occupation?",
    category: 'maternal',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  // Paternal line questions
  {
    question: "What is your paternal grandmother's maiden name?",
    category: 'paternal',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'Where did your paternal grandfather grow up?',
    category: 'paternal',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  {
    question: "What was your father's first job?",
    category: 'paternal',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'How did your paternal grandparents meet?',
    category: 'paternal',
    difficulty: 'hard',
    answerType: 'text',
    points: 15,
  },
  {
    question: "What was your paternal grandmother's favorite recipe?",
    category: 'paternal',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  // Self/personal questions
  {
    question: 'What is the story behind your name?',
    category: 'self',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'What family tradition do you remember most fondly?',
    category: 'self',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'What is the oldest family heirloom you know about?',
    category: 'self',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  // Extended family questions
  {
    question: 'How many first cousins do you have?',
    category: 'extended',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'What country did your ancestors emigrate from?',
    category: 'extended',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  {
    question: 'Who is the oldest living relative in your family?',
    category: 'extended',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'What is a family story that gets told at gatherings?',
    category: 'extended',
    difficulty: 'easy',
    answerType: 'text',
    points: 5,
  },
  {
    question: 'Have any relatives served in the military? Which branch and when?',
    category: 'extended',
    difficulty: 'hard',
    answerType: 'text',
    points: 15,
  },
  {
    question: 'What medical conditions run in your family?',
    category: 'extended',
    difficulty: 'medium',
    answerType: 'text',
    points: 10,
  },
  {
    question: 'What is the furthest back you can trace your family tree?',
    category: 'extended',
    difficulty: 'hard',
    answerType: 'text',
    points: 15,
  },
];

// Default detective challenges
const DEFAULT_CHALLENGES: Omit<DetectiveChallenge, 'id'>[] = [
  {
    title: 'Interview a Grandparent',
    description: 'Record a conversation with a grandparent about their childhood memories',
    category: 'interview',
    difficulty: 'medium',
    points: 50,
    requirements: [
      'Record at least 15 minutes of conversation',
      'Ask about their childhood home',
      'Learn about their school experiences',
      'Document at least 3 new family facts',
    ],
    suggestedQuestions: [
      'What was your house like growing up?',
      'What games did you play as a child?',
      'What was school like for you?',
      'What was your favorite family meal?',
    ],
  },
  {
    title: 'Digitize Old Photos',
    description: 'Find and scan/photograph at least 5 old family photos from before 1980',
    category: 'photo',
    difficulty: 'easy',
    points: 25,
    requirements: [
      'Find at least 5 photos from before 1980',
      'Scan or photograph them in high resolution',
      'Label each photo with names and approximate dates',
      'Upload them to the family tree',
    ],
  },
  {
    title: 'Research Immigration Records',
    description: 'Find immigration or travel records for an ancestor who came from another country',
    category: 'research',
    difficulty: 'hard',
    points: 100,
    requirements: [
      'Identify an ancestor who immigrated',
      'Search Ellis Island or other immigration databases',
      'Document the ship name, date, and port of entry',
      'Find the original hometown they came from',
    ],
  },
  {
    title: 'Create a Recipe Book',
    description: 'Collect and document 5 traditional family recipes',
    category: 'documentation',
    difficulty: 'medium',
    points: 40,
    requirements: [
      'Gather 5 recipes from family members',
      'Document the origin and history of each recipe',
      'Include any family stories associated with the dish',
      'Add photos if possible',
    ],
  },
  {
    title: 'Map Family Locations',
    description: 'Create a map of all the places your family has lived over generations',
    category: 'research',
    difficulty: 'medium',
    points: 35,
    requirements: [
      'Research where at least 3 generations lived',
      'Document addresses or cities when possible',
      'Note approximate dates for each location',
      'Identify any migration patterns',
    ],
  },
];

/**
 * Get DYK questions for a family
 */
export async function getDYKQuestions(
  familyId: string,
  count: number = 20
): Promise<DYKQuestion[]> {
  const supabase = getSupabaseClient();

  // Try to get custom questions from database
  const { data: customQuestions } = await supabase
    .from('dyk_questions')
    .select('*')
    .eq('family_id', familyId)
    .limit(count);

  // If we have custom questions, return them
  if (customQuestions && customQuestions.length >= count) {
    return customQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
      answerType: q.answer_type,
      options: q.options,
      correctAnswer: q.correct_answer,
      points: q.points,
      relatedPersonId: q.related_person_id,
    }));
  }

  // Otherwise, return default questions with generated IDs
  const questions = DEFAULT_QUESTIONS.slice(0, count).map((q, i) => ({
    ...q,
    id: `default-${i}`,
  }));

  return questions;
}

/**
 * Save a DYK response
 */
export async function saveDYKResponse(
  input: DYKResponseInput
): Promise<DBDYKResponse> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('dyk_responses')
    .insert({
      family_id: input.familyId,
      user_id: input.userId,
      question_id: input.questionId,
      response: input.response,
      is_correct: input.isCorrect,
      response_time_ms: input.responseTime,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Calculate DYK score for a user
 */
export async function calculateDYKScore(
  familyId: string,
  userId: string
): Promise<DYKScore> {
  const supabase = getSupabaseClient();

  // Get all responses for this user
  const { data: responses, error } = await supabase
    .from('dyk_responses')
    .select('*')
    .eq('family_id', familyId)
    .eq('user_id', userId);

  if (error) throw error;

  const totalQuestions = DEFAULT_QUESTIONS.length;
  const answeredQuestions = responses?.length || 0;
  const correctAnswers = responses?.filter((r) => r.is_correct).length || 0;

  const score = answeredQuestions > 0
    ? Math.round((correctAnswers / answeredQuestions) * 100)
    : 0;

  // Calculate level
  let level: 'low' | 'medium' | 'high' = 'low';
  if (correctAnswers >= 15) {
    level = 'high';
  } else if (correctAnswers >= 8) {
    level = 'medium';
  }

  // Calculate category scores (simplified)
  const categoryScores = {
    maternal: 0,
    paternal: 0,
    self: 0,
    extended: 0,
  };

  // In a real implementation, we'd calculate per-category scores
  // For now, distribute the score evenly
  Object.keys(categoryScores).forEach((key) => {
    categoryScores[key as keyof typeof categoryScores] = score;
  });

  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    score,
    level,
    categoryScores,
  };
}

/**
 * Get detective challenges based on user's DYK score
 */
export async function getDetectiveChallenges(
  familyId: string,
  userId: string
): Promise<DetectiveChallenge[]> {
  // Get user's score to customize challenges
  const score = await calculateDYKScore(familyId, userId);

  // Filter challenges based on score level
  let challenges = DEFAULT_CHALLENGES.map((c, i) => ({
    ...c,
    id: `challenge-${i}`,
  }));

  // Users with low scores get easier challenges
  if (score.level === 'low') {
    challenges = challenges.filter((c) => c.difficulty !== 'hard');
  }

  // Users with high scores get bonus hard challenges
  if (score.level === 'high') {
    challenges = challenges.sort((a, b) => {
      const difficultyOrder = { hard: 0, medium: 1, easy: 2 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });
  }

  return challenges;
}

/**
 * Mark a challenge as completed
 */
export async function completeChallenge(
  familyId: string,
  userId: string,
  challengeId: string,
  evidence?: string
): Promise<void> {
  const supabase = getSupabaseClient();

  await supabase.from('completed_challenges').insert({
    family_id: familyId,
    user_id: userId,
    challenge_id: challengeId,
    evidence,
    completed_at: new Date().toISOString(),
  });
}

/**
 * Get completed challenges for a user
 */
export async function getCompletedChallenges(
  familyId: string,
  userId: string
): Promise<string[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('completed_challenges')
    .select('challenge_id')
    .eq('family_id', familyId)
    .eq('user_id', userId);

  if (error) throw error;

  return data?.map((c) => c.challenge_id) || [];
}
