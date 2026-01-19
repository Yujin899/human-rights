import { UserAnswer } from "./types";

/**
 * Normalize answer for comparison
 */
export function normalizeAnswer(answer: string): string {
  return answer.toLowerCase().trim();
}

/**
 * Validate user answer against correct answer
 * Handles both direct answers and A/B/C format
 * Handles both direct answers and ا/ب/ج format
 */
export function validateAnswer(
  userAnswer: string,
  correctAnswer: string,
  choices?: string[]
): boolean {
  // For MCQ with ا/ب/ج format
  const arabicLabels: Record<string, number> = { "ا": 0, "ب": 1, "ج": 2 };
  const normalizedCorrect = correctAnswer.trim();

  if (choices && normalizedCorrect in arabicLabels) {
    const answerIndex = arabicLabels[normalizedCorrect];
    if (answerIndex >= 0 && answerIndex < choices.length) {
      return normalizeAnswer(userAnswer) === normalizeAnswer(choices[answerIndex]);
    }
  }

  // Direct comparison
  return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);
}

/**
 * Get the correct answer text from ا/ب/ج format
 */
export function getCorrectAnswerText(
  correctAnswer: string,
  choices?: string[]
): string {
  const arabicLabels: Record<string, number> = { "ا": 0, "ب": 1, "ج": 2 };
  const normalizedCorrect = correctAnswer.trim();

  if (choices && normalizedCorrect in arabicLabels) {
    const answerIndex = arabicLabels[normalizedCorrect];
    if (answerIndex >= 0 && answerIndex < choices.length) {
      return choices[answerIndex];
    }
  }
  return correctAnswer;
}

/**
 * Calculate score percentage from answers array
 */
export function calculateScore(answers: UserAnswer[]): {
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
} {
  const correct = answers.filter((a) => a.isCorrect).length;
  const total = answers.length;
  const incorrect = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return {
    correct,
    incorrect,
    total,
    percentage,
  };
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[] | readonly T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
