"use client";

import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
    currentZoom: number;
    isFullScreen?: boolean;
}

export function ZoomControls({ onZoomIn, onZoomOut, onReset, currentZoom, isFullScreen }: ZoomControlsProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border rounded-lg shadow-lg p-2 flex items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={onZoomOut}
                disabled={currentZoom <= 0.5}
                title="تصغير"
            >
                <ZoomOut className="h-4 w-4" />
            </Button>

            <div className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
                {Math.round(currentZoom * 100)}%
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={onZoomIn}
                disabled={currentZoom >= 2}
                title="تكبير"
            >
                <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
                variant="outline"
                size="icon"
                onClick={onReset}
                title={isFullScreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
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
