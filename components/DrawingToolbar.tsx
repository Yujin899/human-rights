"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Pencil, Highlighter, Eraser, Trash2, X, Hand, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

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
        <>
            {/* Desktop Toolbar: Floating Sidebar */}
            <div className={cn(
                "fixed top-24 right-4 z-50 bg-background/80 backdrop-blur-md border rounded-2xl shadow-2xl p-3 space-y-4 hidden md:block w-48 transition-all duration-300",
                !isVisible && "opacity-0 translate-x-10 pointer-events-none"
            )}>
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">أدوات الرسم</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <ToolButton
                            active={activeTool === "pan"}
                            onClick={() => onToolChange("pan")}
                            icon={<Hand className="h-4 w-4" />}
                            label="تحريك"
                        />
                        <ToolButton
                            active={activeTool === "pen"}
                            onClick={() => onToolChange("pen")}
                            icon={<Pencil className="h-4 w-4" />}
                            label="قلم"
                        />
                        <ToolButton
                            active={activeTool === "highlighter"}
                            onClick={() => onToolChange("highlighter")}
                            icon={<Highlighter className="h-4 w-4" />}
                            label="تظليل"
                        />
                        <ToolButton
                            active={activeTool === "eraser"}
                            onClick={() => onToolChange("eraser")}
                            icon={<Eraser className="h-4 w-4" />}
                            label="ممحاة"
                        />
                    </div>
                </div>

                <Separator className="bg-border/50" />

                {/* Colors Section */}
                {(activeTool === "pen" || activeTool === "highlighter") && (
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">الألوان</span>
                        <div className="grid grid-cols-4 gap-2">
                            {(activeTool === "pen" ? penColors : highlightColors).map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => activeTool === "pen" ? onColorChange(color.value) : onHighlightColorChange(color.value)}
                                    className={cn(
                                        "h-6 w-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95",
                                        (activeTool === "pen" ? penColor : highlightColor) === color.value
                                            ? "border-primary ring-2 ring-primary/20 scale-110"
                                            : "border-transparent"
                                    )}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <Separator className="bg-border/50" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClear}
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl font-bold text-xs"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    مسح الكل
                </Button>
            </div>

            {/* Mobile Toolbar: Bottom Pinned Bar */}
            <div className={cn(
                "fixed bottom-24 left-4 right-4 z-50 md:hidden transition-all duration-300 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
            )}>
                <div className="bg-background/90 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-2 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-1">
                        <MobileToolButton
                            active={activeTool === "pan"}
                            onClick={() => onToolChange("pan")}
                            icon={<Hand className="h-5 w-5" />}
                        />
                        <MobileToolButton
                            active={activeTool === "pen"}
                            onClick={() => onToolChange("pen")}
                            icon={<Pencil className="h-5 w-5" />}
                        />
                        <MobileToolButton
                            active={activeTool === "highlighter"}
                            onClick={() => onToolChange("highlighter")}
                            icon={<Highlighter className="h-5 w-5" />}
                        />
                        <MobileToolButton
                            active={activeTool === "eraser"}
                            onClick={() => onToolChange("eraser")}
                            icon={<Eraser className="h-5 w-5" />}
                        />
                    </div>

                    <div className="w-px h-6 bg-border mx-1 shrink-0" />

                    <div className="flex items-center gap-1">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-xl relative">
                                    <Palette className="h-5 w-5" />
                                    <div
                                        className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white"
                                        style={{ backgroundColor: activeTool === "pen" ? penColor : highlightColor }}
                                    />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="w-40 p-3 rounded-2xl mb-2 ml-4">
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/60">اختر اللون</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(activeTool === "pen" ? penColors : highlightColors).map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => activeTool === "pen" ? onColorChange(color.value) : onHighlightColorChange(color.value)}
                                                className={cn(
                                                    "h-7 w-7 rounded-full border-2 transition-all",
                                                    (activeTool === "pen" ? penColor : highlightColor) === color.value
                                                        ? "border-primary scale-110"
                                                        : "border-transparent"
                                                )}
                                                style={{ backgroundColor: color.value }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClear}
                            className="text-destructive rounded-xl hover:bg-destructive/10"
                        >
                            <Trash2 className="h-5 w-5" />
                        </Button>

                        {onClose && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="rounded-xl ml-1"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function ToolButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <Button
            variant={active ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            className={cn(
                "w-full justify-start gap-3 rounded-xl transition-all duration-200 group font-bold",
                active ? "shadow-lg shadow-primary/25 translate-x-1" : "hover:bg-accent/50"
            )}
        >
            <div className={cn(
                "transition-transform",
                active && "scale-110"
            )}>
                {icon}
            </div>
            <span className="text-xs">{label}</span>
        </Button>
    )
}

function MobileToolButton({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
    return (
        <Button
            variant={active ? "default" : "ghost"}
            size="icon"
            onClick={onClick}
            className={cn(
                "h-11 w-11 rounded-xl transition-all duration-200 grayscale-0",
                active ? "shadow-lg shadow-primary/30 scale-105" : "text-muted-foreground opacity-70"
            )}
        >
            {icon}
        </Button>
    )
}
