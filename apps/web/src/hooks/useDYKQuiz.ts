'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import { useFamily } from './useFamily';
import { useFamilyTree } from './useFamilyTree';

export interface QuizQuestion {
    id: string;
    question: string;
    category: 'maternal' | 'paternal' | 'self' | 'extended';
    difficulty: 'easy' | 'medium' | 'hard';
    answerType: 'multiple_choice' | 'text' | 'date' | 'yes_no';
    options?: string[];
    correctAnswer: string;
    relatedPersonId?: string;
    relatedPersonName?: string;
    points: number;
}

export interface QuizStats {
    totalQuestions: number;
    answered: number;
    correct: number;
    score: number;
    level: 'beginner' | 'medium' | 'high';
    categoryProgress: {
        maternal: number;
        paternal: number;
        self: number;
        extended: number;
    };
}

export interface QuizResponse {
    questionId: string;
    response: string;
    isCorrect: boolean;
    answeredAt: string;
}

export function useDYKQuiz() {
    const supabase = useMemo(() => createClient(), []);
    const { currentFamily } = useFamily();
    const { persons, unions } = useFamilyTree();

    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [responses, setResponses] = useState<QuizResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<QuizStats>({
        totalQuestions: 0,
        answered: 0,
        correct: 0,
        score: 0,
        level: 'beginner',
        categoryProgress: { maternal: 0, paternal: 0, self: 0, extended: 0 },
    });

    // Generate questions based on family data
    const generateQuestions = useCallback((): QuizQuestion[] => {
        if (persons.length === 0) return [];

        const generatedQuestions: QuizQuestion[] = [];

        persons.forEach((person, index) => {
            const personName = `${person.firstName} ${person.lastName || ''}`.trim();

            // Birth date question
            if (person.birthDate) {
                const birthYear = new Date(person.birthDate).getFullYear();
                const wrongYears = [birthYear - 2, birthYear + 3, birthYear - 5].filter(y => y > 1900);

                generatedQuestions.push({
                    id: `birth-year-${person.id}`,
                    question: `¿En qué año nació ${personName}?`,
                    category: index % 2 === 0 ? 'maternal' : 'paternal',
                    difficulty: 'medium',
                    answerType: 'multiple_choice',
                    options: shuffleArray([birthYear.toString(), ...wrongYears.map(String)]),
                    correctAnswer: birthYear.toString(),
                    relatedPersonId: person.id,
                    relatedPersonName: personName,
                    points: 10,
                });

                // Birth month question
                const birthMonth = new Date(person.birthDate).toLocaleDateString('es', { month: 'long' });
                const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                const wrongMonths = months.filter(m => m !== birthMonth.toLowerCase()).slice(0, 3);

                generatedQuestions.push({
                    id: `birth-month-${person.id}`,
                    question: `¿En qué mes nació ${personName}?`,
                    category: index % 2 === 0 ? 'maternal' : 'paternal',
                    difficulty: 'hard',
                    answerType: 'multiple_choice',
                    options: shuffleArray([birthMonth, ...wrongMonths]),
                    correctAnswer: birthMonth,
                    relatedPersonId: person.id,
                    relatedPersonName: personName,
                    points: 15,
                });
            }

            // Birth place question
            if (person.birthPlace) {
                generatedQuestions.push({
                    id: `birth-place-${person.id}`,
                    question: `¿Dónde nació ${personName}?`,
                    category: index % 2 === 0 ? 'maternal' : 'paternal',
                    difficulty: 'hard',
                    answerType: 'text',
                    correctAnswer: person.birthPlace,
                    relatedPersonId: person.id,
                    relatedPersonName: personName,
                    points: 20,
                });
            }

            // Gender question
            generatedQuestions.push({
                id: `gender-${person.id}`,
                question: `¿${personName} es hombre o mujer?`,
                category: 'extended',
                difficulty: 'easy',
                answerType: 'multiple_choice',
                options: ['Hombre', 'Mujer'],
                correctAnswer: person.gender === 'male' ? 'Hombre' : 'Mujer',
                relatedPersonId: person.id,
                relatedPersonName: personName,
                points: 5,
            });

            // Is living question
            generatedQuestions.push({
                id: `living-${person.id}`,
                question: `¿${personName} está vivo/a actualmente?`,
                category: 'extended',
                difficulty: 'easy',
                answerType: 'yes_no',
                options: ['Sí', 'No'],
                correctAnswer: person.isLiving ? 'Sí' : 'No',
                relatedPersonId: person.id,
                relatedPersonName: personName,
                points: 5,
            });
        });

        // Relationship questions from unions
        unions.forEach((union) => {
            const partner1 = persons.find(p => p.id === union.partner1Id);
            const partner2 = persons.find(p => p.id === union.partner2Id);

            if (partner1 && partner2) {
                const p1Name = `${partner1.firstName} ${partner1.lastName || ''}`.trim();
                const p2Name = `${partner2.firstName} ${partner2.lastName || ''}`.trim();

                generatedQuestions.push({
                    id: `spouse-${union.id}`,
                    question: `¿Quién es el/la esposo/a de ${p1Name}?`,
                    category: 'extended',
                    difficulty: 'medium',
                    answerType: 'multiple_choice',
                    options: shuffleArray([p2Name, ...persons.filter(p => p.id !== partner2.id && p.id !== partner1.id).slice(0, 3).map(p => `${p.firstName} ${p.lastName || ''}`.trim())]),
                    correctAnswer: p2Name,
                    relatedPersonId: partner1.id,
                    relatedPersonName: p1Name,
                    points: 10,
                });

                // Marriage year question
                if (union.startDate) {
                    const marriageYear = new Date(union.startDate).getFullYear();
                    const wrongYears = [marriageYear - 3, marriageYear + 2, marriageYear - 7];

                    generatedQuestions.push({
                        id: `marriage-year-${union.id}`,
                        question: `¿En qué año se casaron ${p1Name} y ${p2Name}?`,
                        category: 'extended',
                        difficulty: 'hard',
                        answerType: 'multiple_choice',
                        options: shuffleArray([marriageYear.toString(), ...wrongYears.map(String)]),
                        correctAnswer: marriageYear.toString(),
                        relatedPersonId: union.id,
                        points: 15,
                    });
                }
            }
        });

        // Count family members question
        if (persons.length > 0) {
            const wrongCounts = [persons.length - 2, persons.length + 3, persons.length + 1].filter(n => n > 0);

            generatedQuestions.push({
                id: 'family-count',
                question: '¿Cuántas personas hay en tu árbol familiar?',
                category: 'self',
                difficulty: 'easy',
                answerType: 'multiple_choice',
                options: shuffleArray([persons.length.toString(), ...wrongCounts.map(String)]),
                correctAnswer: persons.length.toString(),
                points: 5,
            });
        }

        return shuffleArray(generatedQuestions);
    }, [persons, unions]);

    // Fetch existing responses from database
    const fetchResponses = useCallback(async () => {
        if (!currentFamily?.id) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('dyk_responses')
                .select('question_id, response, is_correct, completed_at')
                .eq('family_id', currentFamily.id)
                .eq('user_id', user.id);

            if (error) {
                // Silently ignore if table doesn't exist - quiz works without persistence
                const isTableMissing = error.message?.includes('does not exist') ||
                    error.message?.includes('Could not find');
                if (!isTableMissing) {
                    console.error('Error fetching responses:', error);
                }
                return;
            }

            const mappedResponses: QuizResponse[] = (data || []).map((r: any) => ({
                questionId: r.question_id,
                response: r.response,
                isCorrect: r.is_correct,
                answeredAt: r.completed_at,
            }));

            setResponses(mappedResponses);
        } catch (err) {
            console.error('Error:', err);
        }
    }, [currentFamily?.id, supabase]);

    // Calculate stats
    useEffect(() => {
        const totalQuestions = questions.length;
        const answered = responses.length;
        const correct = responses.filter(r => r.isCorrect).length;
        const score = answered > 0 ? Math.round((correct / answered) * 100) : 0;

        let level: 'beginner' | 'medium' | 'high' = 'beginner';
        if (score >= 80) level = 'high';
        else if (score >= 50) level = 'medium';

        // Calculate category progress
        const categoryProgress = { maternal: 0, paternal: 0, self: 0, extended: 0 };
        const categoryCounts = { maternal: 0, paternal: 0, self: 0, extended: 0 };
        const categoryCorrect = { maternal: 0, paternal: 0, self: 0, extended: 0 };

        questions.forEach(q => {
            categoryCounts[q.category]++;
            const response = responses.find(r => r.questionId === q.id);
            if (response?.isCorrect) {
                categoryCorrect[q.category]++;
            }
        });

        Object.keys(categoryProgress).forEach(cat => {
            const key = cat as keyof typeof categoryProgress;
            categoryProgress[key] = categoryCounts[key] > 0
                ? Math.round((categoryCorrect[key] / categoryCounts[key]) * 100)
                : 0;
        });

        setStats({
            totalQuestions,
            answered,
            correct,
            score,
            level,
            categoryProgress,
        });
    }, [questions, responses]);

    // Load questions and responses
    useEffect(() => {
        setIsLoading(true);
        const generated = generateQuestions();
        setQuestions(generated);
        fetchResponses().finally(() => setIsLoading(false));
    }, [generateQuestions, fetchResponses]);

    // Submit answer
    const submitAnswer = useCallback(async (questionId: string, answer: string): Promise<boolean> => {
        if (!currentFamily?.id) return false;

        const question = questions.find(q => q.id === questionId);
        if (!question) return false;

        // Check if answer is correct
        let isCorrect = false;
        if (question.answerType === 'text') {
            // For text answers, do case-insensitive comparison
            isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        } else {
            isCorrect = answer === question.correctAnswer;
        }

        // Function to update local state
        const updateLocalState = () => {
            setResponses(prev => {
                const existing = prev.findIndex(r => r.questionId === questionId);
                const newResponse = {
                    questionId,
                    response: answer,
                    isCorrect,
                    answeredAt: new Date().toISOString(),
                };

                if (existing >= 0) {
                    const updated = [...prev];
                    updated[existing] = newResponse;
                    return updated;
                }
                return [...prev, newResponse];
            });
        };

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Still update local state even without auth
                updateLocalState();
                return isCorrect;
            }

            // Save response directly with the generated question ID
            // No need to create a dyk_questions record for dynamically generated questions
            const pointsEarned = isCorrect ? question.points : 0;
            const { error: responseError } = await supabase
                .from('dyk_responses')
                .upsert({
                    family_id: currentFamily.id,
                    user_id: user.id,
                    question_id: questionId, // Use the original generated ID
                    response: answer,
                    is_correct: isCorrect,
                    points_earned: pointsEarned,
                    completed_at: new Date().toISOString(),
                }, {
                    onConflict: 'family_id,user_id,question_id'
                });

            if (responseError) {
                // Silently ignore if table doesn't exist - quiz still works locally
                const isTableMissing = responseError.message?.includes('does not exist') ||
                    responseError.message?.includes('Could not find');
                if (!isTableMissing) {
                    console.error('Error saving response:', responseError);
                }
            }

            // Update local state
            updateLocalState();

            return isCorrect;
        } catch (err) {
            console.error('Error submitting answer:', err);
            return false;
        }
    }, [currentFamily?.id, questions, supabase]);

    // Get unanswered questions for quiz
    const getQuizQuestions = useCallback((count: number = 10): QuizQuestion[] => {
        const answeredIds = new Set(responses.map(r => r.questionId));
        const unanswered = questions.filter(q => !answeredIds.has(q.id));
        return unanswered.slice(0, count);
    }, [questions, responses]);

    return {
        questions,
        responses,
        stats,
        isLoading,
        submitAnswer,
        getQuizQuestions,
        refreshQuestions: () => {
            const generated = generateQuestions();
            setQuestions(generated);
        },
    };
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
