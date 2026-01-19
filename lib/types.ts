export type QuestionType = "true_false" | "mcq";

export interface Question {
  id: number;
  lecture_number: number;
  type: QuestionType;
  question: string;
  choices?: string[];
  answer: string;
  explanation: string;
}

export interface UserAnswer {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface ExamSession {
  answers: UserAnswer[];
  currentIndex: number;
  score: {
    correct: number;
    incorrect: number;
    total: number;
  };
  timestamp: number;
  lastUpdated: number;
}
