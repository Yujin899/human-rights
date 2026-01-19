"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface HintPanelProps {
    explanation: string;
    isOpen: boolean;
    onToggle: () => void;
}

export function HintPanel({ explanation, isOpen, onToggle }: HintPanelProps) {
    return (
        <div className="w-full">
            <Button
                variant="outline"
                onClick={onToggle}
                className="mb-3 w-full sm:w-auto"
            >
                <Lightbulb className="ml-2 h-4 w-4" />
                {isOpen ? "إخفاء التلميح" : "عرض التلميح"}
            </Button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-base leading-relaxed">
                                {explanation}
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
