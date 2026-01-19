"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { clearSession } from "@/lib/localStorage";

interface ResetButtonProps {
    onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
    const handleReset = () => {
        if (
            confirm("هل أنت متأكد من أنك تريد إعادة تعيين التقدم؟ سيتم حذف جميع الإجابات.")
        ) {
            clearSession();
            onReset();
        }
    };

    return (
        <Button variant="outline" onClick={handleReset} size="sm">
            <RotateCcw className="ml-2 h-4 w-4" />
            إعادة تعيين التقدم
        </Button>
    );
}
