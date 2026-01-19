"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnswerFeedbackProps {
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
    explanation?: string;
}

export function AnswerFeedback({
    isCorrect,
    correctAnswer,
    userAnswer,
    explanation,
}: AnswerFeedbackProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <Alert
                dir="rtl"
                className={
                    isCorrect
                        ? "bg-primary/10 border-primary"
                        : "bg-muted border-border"
                }
            >
                {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <AlertDescription className="text-base">
                    {isCorrect ? (
                        <span className="font-semibold text-primary">
                            ✅ إجابة صحيحة!
                        </span>
                    ) : (
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                                ❌ إجابة خاطئة
                            </p>
                            <p className="text-sm">
                                اخترت: <span className="font-medium text-destructive">{userAnswer}</span>
                            </p>
                            <p className="text-sm">
                                الإجابة الصحيحة:{" "}
                                <span className="font-bold text-primary">{correctAnswer}</span>
                            </p>
                        </div>
                    )}
                </AlertDescription>
            </Alert>

            {explanation && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <CardHeader className="py-3 px-4">
                            <CardTitle className="text-lg font-bold text-blue-800 dark:text-blue-300">الشرح</CardTitle>
                        </CardHeader>
                        <CardContent className="py-2 px-4 pb-4">
                            <p className="text-base leading-relaxed text-blue-900/80 dark:text-blue-200/80">
                                {explanation}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
