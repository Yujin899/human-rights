"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question, UserAnswer } from "@/lib/types";
import { validateAnswer, calculateScore, getCorrectAnswerText, shuffleArray } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";
import { QuestionCard } from "@/components/QuestionCard";
import { AnswerFeedback } from "@/components/AnswerFeedback";
import { ProgressBar } from "@/components/ProgressBar";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";
import questionsData from "@/data/questions.json";

export default function QuizMode() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        // Filter and shuffle questions for the chunk quiz
        const filtered = (questionsData.questions as Question[]).filter((q) =>
            chunkLectures.includes(q.lecture_number)
        );
        setQuestions(shuffleArray(filtered));
    }, [chunkId, chunkLectures]); // Added chunkLectures to dependencies

    if (!chunk || (questions.length === 0 && currentIndex === 0 && !isCompleted)) {
        if (!chunk) router.push("/");
        return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
    }

    const currentQuestion = questions[currentIndex];

    const handleSubmit = () => {
        if (!selectedAnswer) return;

        const isCorrect = validateAnswer(
            selectedAnswer,
            currentQuestion.answer,
            currentQuestion.choices
        );

        const newAnswer: UserAnswer = {
            questionId: currentQuestion.id,
            userAnswer: selectedAnswer,
            isCorrect,
            timestamp: Date.now(),
        };

        setUserAnswers([...userAnswers, newAnswer]);
        setIsSubmitted(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setIsSubmitted(false);
        } else {
            setIsCompleted(true);
        }
    };

    const handleRestart = () => {
        const filtered = (questionsData.questions as Question[]).filter((q) =>
            chunkLectures.includes(q.lecture_number)
        );
        setQuestions(shuffleArray(filtered));
        setCurrentIndex(0);
        setUserAnswers([]);
        setSelectedAnswer(null);
        setIsSubmitted(false);
        setIsCompleted(false);
    };

    const score = calculateScore(userAnswers);
    const correctAnswerText = getCorrectAnswerText(
        currentQuestion.answer,
        currentQuestion.choices
    );

    if (isCompleted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <div className="absolute top-4 left-4 flex items-center gap-3">
                    <Link href="/">
                        <Button variant="outline" size="icon">
                            <Home className="h-5 w-5" />
                        </Button>
                    </Link>
                    <ThemeToggle />
                </div>
                <ScoreDisplay
                    correct={score.correct}
                    incorrect={score.incorrect}
                    total={score.total}
                    percentage={score.percentage}
                    onRestart={handleRestart}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold">اختبار - {chunk.name}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            المحاضرات {chunk.lectures.join(" - ")}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link href="/">
                            <Button variant="outline" size="icon">
                                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                            </Button>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar
                    current={currentIndex + 1}
                    total={questions.length}
                />

                {/* Question Card */}
                <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onAnswerChange={setSelectedAnswer}
                    isSubmitted={isSubmitted}
                />

                {/* Answer Feedback */}
                {isSubmitted && (
                    <AnswerFeedback
                        isCorrect={userAnswers[userAnswers.length - 1].isCorrect}
                        correctAnswer={correctAnswerText}
                        userAnswer={selectedAnswer || ""}
                        explanation={currentQuestion.explanation}
                    />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-center">
                    {!isSubmitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedAnswer}
                            size="lg"
                            className="w-full sm:w-auto px-12"
                        >
                            تأكيد الإجابة
                        </Button>
                    ) : (
                        <Button onClick={handleNext} size="lg" className="w-full sm:w-auto px-12">
                            {currentIndex === questions.length - 1
                                ? "عرض النتيجة"
                                : "السؤال التالي"}
                            <ChevronLeft className="mr-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
