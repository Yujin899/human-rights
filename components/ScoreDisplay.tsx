"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
    correct: number;
    incorrect: number;
    total: number;
    percentage: number;
    onRestart: () => void;
}

export function ScoreDisplay({
    correct,
    incorrect,
    total,
    percentage,
    onRestart,
}: ScoreDisplayProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl mx-auto"
        >
            <Card className="text-center">
                <CardHeader>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="flex justify-center mb-4"
                    >
                        <Trophy className="h-20 w-20 text-yellow-500" />
                    </motion.div>
                    <CardTitle className="text-3xl text-right">النتيجة النهائية</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-6xl font-bold text-primary"
                    >
                        {percentage}%
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-2"
                        >
                            <p className="text-sm text-muted-foreground">المجموع</p>
                            <Badge variant="secondary" className="text-lg px-4 py-2">
                                {total}
                            </Badge>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-2"
                        >
                            <p className="text-sm text-muted-foreground">صحيحة</p>
                            <Badge
                                variant="secondary"
                                className="text-lg px-4 py-2 bg-primary/20 text-primary"
                            >
                                {correct}
                            </Badge>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-2"
                        >
                            <p className="text-sm text-muted-foreground">خاطئة</p>
                            <Badge
                                variant="outline"
                                className="text-lg px-4 py-2"
                            >
                                {incorrect}
                            </Badge>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button onClick={onRestart} size="lg" className="w-full sm:w-auto">
                            <RotateCcw className="ml-2 h-5 w-5" />
                            بدء اختبار جديد
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
