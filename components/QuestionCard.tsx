"use client";

import { motion } from "framer-motion";
import { Question } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionCardProps {
    question: Question;
    selectedAnswer: string | null;
    onAnswerChange: (answer: string) => void;
    isSubmitted: boolean;
}

export function QuestionCard({
    question,
    selectedAnswer,
    onAnswerChange,
    isSubmitted,
}: QuestionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="w-full">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl leading-tight text-right">
                        {question.question}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {question.type === "mcq" && question.choices ? (
                        <RadioGroup
                            value={selectedAnswer || ""}
                            onValueChange={onAnswerChange}
                            disabled={isSubmitted}
                            className="space-y-2"
                        >
                            {question.choices.map((choice, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Label
                                        htmlFor={`choice-${index}`}
                                        className={`flex items-center justify-start p-3 rounded-lg border transition-all duration-200 cursor-pointer gap-3
                                            ${selectedAnswer === choice
                                                ? "bg-primary/10 border-primary ring-1 ring-primary"
                                                : "bg-card hover:bg-muted border-border"}
                                            ${isSubmitted && choice === question.answer ? "border-primary" : ""}
                                        `}
                                    >
                                        <RadioGroupItem
                                            value={choice}
                                            id={`choice-${index}`}
                                            className="h-5 w-5 border-2 border-primary text-primary shrink-0"
                                        />
                                        <span className="text-base leading-relaxed text-right flex-1">
                                            {choice}
                                        </span>
                                    </Label>
                                </motion.div>
                            ))}
                        </RadioGroup>
                    ) : (
                        <div className="space-y-2">
                            {[
                                { id: "true", label: "صح", value: "صح" },
                                { id: "false", label: "خطأ", value: "خطأ" }
                            ].map((option, index) => (
                                <motion.div
                                    key={option.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Label
                                        htmlFor={option.id}
                                        className={`flex items-center justify-start p-3 rounded-lg border transition-all duration-200 cursor-pointer gap-3
                                            ${selectedAnswer === option.value
                                                ? "bg-primary/10 border-primary ring-1 ring-primary"
                                                : "bg-card hover:bg-muted border-border"}
                                        `}
                                    >
                                        <Checkbox
                                            id={option.id}
                                            checked={selectedAnswer === option.value}
                                            onCheckedChange={(checked) =>
                                                checked && onAnswerChange(option.value)
                                            }
                                            disabled={isSubmitted}
                                            className="h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary shrink-0"
                                        />
                                        <span className="text-base leading-relaxed text-right flex-1">
                                            {option.label}
                                        </span>
                                    </Label>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
