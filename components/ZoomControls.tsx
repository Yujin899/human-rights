"use client";

import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    onCenter: () => void;
    currentZoom: number;
    isFullScreen?: boolean;
}

export function ZoomControls({
    onZoomIn,
    onZoomOut,
    onReset,
    onCenter,
    currentZoom,
    isFullScreen
}: ZoomControlsProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/80 backdrop-blur-md border rounded-full shadow-2xl p-1.5 flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                disabled={currentZoom <= 0.5}
                title="تصغير"
                className="rounded-full h-8 w-8"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>

            <div
                className="px-2 py-1 text-xs font-bold min-w-[50px] text-center cursor-pointer hover:bg-accent rounded-md transition-colors"
                onClick={onCenter}
                title="إعادة التوسيط"
            >
                {Math.round(currentZoom * 100)}%
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                disabled={currentZoom >= 3}
                title="تكبير"
                className="rounded-full h-8 w-8"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px h-4 bg-border mx-1" />

            <Button
                variant="ghost"
                size="icon"
                onClick={onCenter}
                title="إعادة ضبط"
                className="rounded-full h-8 w-8"
            >
                <RotateCcw className="h-3.5 w-3.5" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={onReset}
                title={isFullScreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
                className="rounded-full h-8 w-8 text-primary"
            >
                {isFullScreen ? (
                    <Minimize2 className="h-4 w-4" />
                ) : (
                    <Maximize2 className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}
