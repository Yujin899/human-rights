"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight, ArrowLeft, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import questionsData from "@/data/questions.json";
import { getCorrectAnswerText } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";

export default function StudyMode() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const chunkQuestions = questionsData.questions.filter((q) =>
        chunkLectures.includes(q.lecture_number)
    );

    const [currentIndex, setCurrentIndex] = useState(0);

    if (!chunk || chunkQuestions.length === 0) {
        router.push("/");
        return null;
    }

    const currentQuestion = chunkQuestions[currentIndex];
    const isLast = currentIndex === chunkQuestions.length - 1;
    const isFirst = currentIndex === 0;

    // Get the correct answer text
    const correctAnswerText = getCorrectAnswerText(
        currentQuestion.answer,
        currentQuestion.choices
    );

    return (
        <div className="min-h-screen bg-background py-4 sm:py-6 md:py-8 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl font-bold">وضع الدراسة - {chunk.name}</h1>
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

                {/* Progress */}
                <div className="text-center text-sm text-muted-foreground">
                    السؤال {currentIndex + 1} من {chunkQuestions.length}
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl leading-relaxed">
                                    {currentQuestion.question}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* MCQ Choices */}
                                {currentQuestion.type === "mcq" && currentQuestion.choices && (
                                    <div className="space-y-2">
                                        {currentQuestion.choices.map((choice, idx) => {
                                            const isCorrect = choice === correctAnswerText;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`p-3 rounded-lg border-2 flex items-center justify-start transition-all duration-200 gap-3
                                                        ${isCorrect
                                                            ? "bg-primary/10 border-primary"
                                                            : "bg-muted border-transparent"
                                                        }`}
                                                >
                                                    {isCorrect && (
                                                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                            <span className="text-primary-foreground text-xs font-bold">✓</span>
                                                        </div>
                                                    )}
                                                    <div className="text-right flex-1">
                                                        <p className="font-medium">{choice}</p>
                                                        {isCorrect && (
                                                            <p className="text-sm text-primary mt-1">
                                                                ✓ الإجابة الصحيحة
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* True/False with Checkboxes */}
                                {currentQuestion.type === "true_false" && (
                                    <div className="space-y-3">
                                        {["صح", "خطأ"].map((option) => {
                                            const isCorrect = option === currentQuestion.answer;
                                            return (
                                                <div
                                                    key={option}
                                                    className={`p-4 rounded-lg border-2 flex items-center justify-start transition-all duration-200 gap-3
                                                        ${isCorrect
                                                            ? "bg-primary/10 border-primary"
                                                            : "bg-muted border-transparent"
                                                        }`}
                                                >
                                                    <div
                                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center shrink-0 ${isCorrect
                                                            ? "bg-primary border-primary"
                                                            : "bg-muted border-border"
                                                            }`}
                                                    >
                                                        {isCorrect && (
                                                            <span className="text-primary-foreground font-bold text-sm">
                                                                {option === "صح" ? "✓" : "✕"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right flex-1">
                                                        <p className="font-medium">{option}</p>
                                                        {isCorrect && (
                                                            <span className="text-sm text-primary">
                                                                الإجابة الصحيحة
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Explanation */}
                                <Card className="bg-primary/5 border-primary/20">
                                    <CardHeader>
                                        <CardTitle className="text-lg">الشرح</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                    </CardContent>
                                </Card>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <Button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        disabled={isFirst}
                        variant="outline"
                    >
                        <ArrowRight className="ml-2 h-4 w-4" />
                        السابق
                    </Button>

                    <Button
                        onClick={() =>
                            isLast ? router.push("/") : setCurrentIndex(currentIndex + 1)
                        }
                    >
                        {isLast ? "العودة للرئيسية" : "التالي"}
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
