"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Question } from "@/lib/types";
import { getCorrectAnswerText, shuffleArray } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, RotateCcw, Tally4 } from "lucide-react";
import Link from "next/link";
import questionsData from "@/data/questions.json";
import { cn } from "@/lib/utils";
import { ZoomControls } from "@/components/ZoomControls";

export default function QuizMode() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set());
    const [zoom, setZoom] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const filtered = (questionsData.questions as Question[]).filter((q) =>
            chunkLectures.includes(q.lecture_number)
        );

        // Shuffle questions AND their choices
        const shuffledQuestions = shuffleArray(filtered).map(q => ({
            ...q,
            choices: q.type === "mcq" ? shuffleArray([...(q.choices || [])]) : q.choices
        }));

        setQuestions(shuffledQuestions);
    }, [chunkId, chunkLectures]);

    if (!isMounted || !chunk || questions.length === 0) {
        if (isMounted && !chunk) router.push("/");
        return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
    }

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
    const handleToggleFullScreen = () => setIsFullScreen(!isFullScreen);

    const handleClearAll = () => {
        setSelectedAnswers({});
        setSubmittedQuestions(new Set());
    };

    const handleChoiceClick = (questionId: number, choice: string) => {
        if (submittedQuestions.has(questionId)) return;

        setSelectedAnswers(prev => ({ ...prev, [questionId]: choice }));
        setSubmittedQuestions(prev => {
            const next = new Set(prev);
            next.add(questionId);
            return next;
        });
    };

    // Calculate Score
    const correctCount = Object.entries(selectedAnswers).filter(([qId, choice]) => {
        const question = questions.find(q => q.id === parseInt(qId));
        if (!question) return false;
        return choice === getCorrectAnswerText(question.answer, (questionsData.questions as Question[]).find(origQ => origQ.id === question.id)?.choices || []);
    }).length;

    const progress = questions.length > 0 ? (submittedQuestions.size / questions.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            {!isFullScreen && (
                <div className="sticky top-0 z-40 bg-background border-b shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-lg font-bold">{chunk.name}</h1>
                            <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1.5 text-primary">
                                    <Tally4 className="h-4 w-4" />
                                    <span className="text-sm font-bold">الدرجة: {correctCount} / {questions.length}</span>
                                </div>
                                <div className="flex-1 max-w-[100px] h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleClearAll} className="gap-2 text-destructive hover:text-destructive">
                                <RotateCcw className="h-4 w-4" />
                                إعادة البدء
                            </Button>
                            <Link href="/">
                                <Button variant="outline" size="icon">
                                    <Home className="h-4 w-4" />
                                </Button>
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}

            <ZoomControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleToggleFullScreen}
                currentZoom={zoom}
                isFullScreen={isFullScreen}
            />

            <div
                className="relative pb-20 overflow-auto"
                style={{ height: isFullScreen ? "100vh" : "calc(100vh - 80px)" }}
            >
                <div className="w-full min-h-full py-8 px-4">
                    <div className="max-w-5xl mx-auto relative">
                        {/* Questions Container with Scaling */}
                        <div
                            className="bg-[#fafaf9] shadow-2xl rounded-sm p-4 sm:p-12 min-h-screen relative overflow-hidden"
                            style={{
                                transform: `scale(${zoom})`,
                                transformOrigin: "top center",
                                width: "100%",
                                color: '#1f2937',
                                marginBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : "0",
                                transition: "transform 0.2s ease-out",
                            }}
                        >
                            {/* Question Content */}
                            <div className="relative z-20">
                                {questions.map((question, qIdx) => {
                                    const isSubmitted = submittedQuestions.has(question.id);
                                    const selectedChoice = selectedAnswers[question.id];
                                    // Always use the original answer key logic
                                    const origQuestion = (questionsData.questions as Question[]).find(origQ => origQ.id === question.id);
                                    const correctAnswer = getCorrectAnswerText(question.answer, origQuestion?.choices || []);

                                    return (
                                        <div key={question.id} className="mb-16 border-b-2 border-slate-200 pb-10 last:border-0 relative">
                                            <div className="flex items-start gap-4 mb-6">
                                                <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                                                    {qIdx + 1}
                                                </span>
                                                <h2 className="text-xl font-bold leading-relaxed text-[#111827]">{question.question}</h2>
                                            </div>

                                            <div className="space-y-4 mr-12">
                                                {(question.type === "mcq" ? (question.choices || []) : ["صح", "خطأ"]).map((choice, cIdx) => {
                                                    const isCorrect = choice === correctAnswer;
                                                    const isUserChoice = selectedChoice === choice;
                                                    const canClick = !isSubmitted;

                                                    return (
                                                        <button
                                                            key={`${question.id}-${choice}`}
                                                            onClick={() => handleChoiceClick(question.id, choice)}
                                                            disabled={isSubmitted}
                                                            className={cn(
                                                                "w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-right group",
                                                                "active:scale-[0.98]",
                                                                canClick && "hover:border-primary hover:bg-primary/5 cursor-pointer",
                                                                !canClick && !isSubmitted && "cursor-default opacity-90",
                                                                isSubmitted && isCorrect && "bg-green-100 border-green-500 ring-2 ring-green-200 text-green-900",
                                                                isSubmitted && isUserChoice && !isCorrect && "bg-red-100 border-red-500 ring-2 ring-red-200 text-red-900",
                                                                !isSubmitted && "border-slate-200 bg-white text-slate-700 shadow-sm"
                                                            )}
                                                        >
                                                            <span className={cn(
                                                                "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                                                                isSubmitted && isCorrect ? "border-green-600 bg-green-600 text-white" :
                                                                    canClick ? "border-slate-400 group-hover:border-primary" : "border-slate-300"
                                                            )}>
                                                                {String.fromCharCode(65 + cIdx)}
                                                            </span>
                                                            <span className="text-lg font-semibold flex-1">{choice}</span>

                                                            {isSubmitted && isCorrect && (
                                                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in-50">
                                                                    إجابة صحيحة ✓
                                                                </span>
                                                            )}
                                                            {isSubmitted && isUserChoice && !isCorrect && (
                                                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-in zoom-in-50">
                                                                    إجابتك ✗
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {isSubmitted && (
                                                <div className="mt-8 mr-12 bg-blue-50 border-r-4 border-blue-500 p-6 rounded-l-2xl shadow-sm transition-all animate-in fade-in slide-in-from-right-4">
                                                    <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                                        <span className="text-2xl">💡</span> الشرح والتعليل
                                                    </h3>
                                                    <p className="text-blue-900 leading-relaxed font-medium text-lg">{question.explanation}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
