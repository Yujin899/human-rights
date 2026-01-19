"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Highlighter, Eraser, Trash2, X, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawingToolbarProps {
    activeTool: "pen" | "highlighter" | "eraser" | "pan";
    onToolChange: (tool: "pen" | "highlighter" | "eraser" | "pan") => void;
    penColor: string;
    onColorChange: (color: string) => void;
    highlightColor: string;
    onHighlightColorChange: (color: string) => void;
    onClear: () => void;
    isVisible?: boolean;
    onClose?: () => void;
}

const penColors = [
    { name: "أسود", value: "#000000" },
    { name: "أحمر", value: "#ef4444" },
    { name: "أزرق", value: "#3b82f6" },
    { name: "أخضر", value: "#22c55e" },
];

const highlightColors = [
    { name: "أصفر", value: "#fef08a" },
    { name: "أخضر فاتح", value: "#86efac" },
    { name: "أزرق فاتح", value: "#93c5fd" },
    { name: "وردي", value: "#fbcfe8" },
];

export function DrawingToolbar({
    activeTool,
    onToolChange,
    penColor,
    onColorChange,
    highlightColor,
    onHighlightColorChange,
    onClear,
    isVisible = true,
    onClose,
}: DrawingToolbarProps) {
    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed top-20 right-4 z-50 bg-background border rounded-lg shadow-lg p-3 space-y-3",
            isVisible ? "block" : "hidden md:block"
        )}>
            {/* Close button for mobile */}
            {onClose && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 md:hidden h-6 w-6"
                    onClick={onClose}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-muted-foreground">أدوات الرسم</span>

                {/* Drawing Tools */}
                <div className="flex flex-col gap-1">
                    <Button
                        variant={activeTool === "pan" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolChange("pan")}
                        className="w-full justify-start gap-2"
                    >
                        <Hand className="h-4 w-4" />
                        تحريك
                    </Button>
                    <Button
                        variant={activeTool === "pen" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolChange("pen")}
                        className="w-full justify-start gap-2"
                    >
                        <Pencil className="h-4 w-4" />
                        قلم
                    </Button>
                    <Button
                        variant={activeTool === "highlighter" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolChange("highlighter")}
                        className="w-full justify-start gap-2"
                    >
                        <Highlighter className="h-4 w-4" />
                        تظليل
                    </Button>
                    <Button
                        variant={activeTool === "eraser" ? "default" : "outline"}
                        size="sm"
                        onClick={() => onToolChange("eraser")}
                        className="w-full justify-start gap-2"
                    >
                        <Eraser className="h-4 w-4" />
                        ممحاة
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Pen Colors */}
            {activeTool === "pen" && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">لون القلم</span>
                    <div className="grid grid-cols-2 gap-1">
                        {penColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => onColorChange(color.value)}
                                className={cn(
                                    "h-8 rounded border-2 transition-all",
                                    penColor === color.value ? "border-primary scale-105" : "border-transparent"
                                )}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Highlighter Colors */}
            {activeTool === "highlighter" && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">لون التظليل</span>
                    <div className="grid grid-cols-2 gap-1">
                        {highlightColors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => onHighlightColorChange(color.value)}
                                className={cn(
                                    "h-8 rounded border-2 transition-all",
                                    highlightColor === color.value ? "border-primary scale-105" : "border-transparent"
                                )}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-col gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClear}
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                >
                    <Trash2 className="h-4 w-4" />
                    مسح الكل
                </Button>
            </div>
        </div>
    );
}
