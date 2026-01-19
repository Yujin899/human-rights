"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Pencil } from "lucide-react";
import Link from "next/link";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import questionsData from "@/data/questions.json";
import { getCorrectAnswerText } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { ZoomControls } from "@/components/ZoomControls";
import { cn } from "@/lib/utils";

export default function StudyModePDF() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const chunkQuestions = questionsData.questions.filter((q) =>
        chunkLectures.includes(q.lecture_number)
    );

    const [activeTool, setActiveTool] = useState<"pen" | "highlighter" | "eraser">("pen");
    const [penColor, setPenColor] = useState("#000000");
    const [highlightColor, setHighlightColor] = useState("#fef08a");
    const [zoom, setZoom] = useState(1);
    const [showToolbar, setShowToolbar] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDrawingMode, setIsDrawingMode] = useState(true);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Toggle eraser mode when tool changes
    useEffect(() => {
        if (canvasRef.current && isDrawingMode) {
            if (activeTool === "eraser") {
                canvasRef.current.eraseMode(true);
            } else {
                canvasRef.current.eraseMode(false);
            }
        }
    }, [activeTool, isDrawingMode]);

    // Load saved drawing on mount
    useEffect(() => {
        const loadSavedDrawing = async () => {
            if (canvasRef.current) {
                const savedPaths = localStorage.getItem(`study-drawing-${chunkId}`);
                if (savedPaths) {
                    try {
                        const paths = JSON.parse(savedPaths);
                        if (Array.isArray(paths) && paths.length > 0) {
                            canvasRef.current.loadPaths(paths);
                        }
                    } catch (e) {
                        console.error("Failed to load saved drawing:", e);
                    }
                }
            }
        };
        // Small delay to ensure canvas is ready
        const timer = setTimeout(loadSavedDrawing, 500);
        return () => clearTimeout(timer);
    }, [chunkId]);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleClearCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.clearCanvas();
            localStorage.removeItem(`study-drawing-${chunkId}`);
        }
    };

    const handleCanvasChange = async () => {
        if (canvasRef.current && isDrawingMode) {
            try {
                const paths = await canvasRef.current.exportPaths();
                if (paths && paths.length > 0) {
                    localStorage.setItem(`study-drawing-${chunkId}`, JSON.stringify(paths));
                } else {
                    localStorage.removeItem(`study-drawing-${chunkId}`);
                }
            } catch (e) {
                console.error("Failed to save drawing:", e);
            }
        }
    };

    const handleToggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (!chunk || chunkQuestions.length === 0) {
        router.push("/");
        return null;
    }

    const getStrokeWidth = () => {
        if (activeTool === "highlighter") return 20;
        return 4;
    };

    const getCurrentColor = () => {
        if (activeTool === "highlighter") {
            const hexToRgba = (hex: string) => {
                const r = parseInt(hex.slice(1, 3), 16);
                const g = parseInt(hex.slice(3, 5), 16);
                const b = parseInt(hex.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, 0.4)`;
            };
            return hexToRgba(highlightColor);
        }
        return penColor;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            {!isFullScreen && (
                <div className="sticky top-0 z-40 bg-background border-b backdrop-blur-sm bg-background/95">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-base sm:text-lg md:text-xl font-bold">وضع الدراسة - {chunk.name}</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                المحاضرات {chunk.lectures.join(" - ")} • {chunkQuestions.length} سؤال
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={isDrawingMode ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsDrawingMode(!isDrawingMode)}
                                className="gap-2"
                            >
                                {isDrawingMode ? (
                                    <>
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                        <span>إيقاف الرسم</span>
                                    </>
                                ) : (
                                    <>
                                        <Pencil className="h-4 w-4" />
                                        <span>تفعيل الرسم</span>
                                    </>
                                )}
                            </Button>
                            <Link href="/">
                                <Button variant="outline" size="icon">
                                    <Home className="h-4 w-4" />
                                </Button>
                            </Link>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            )}

            {/* Drawing Toolbar */}
            <DrawingToolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                penColor={penColor}
                onColorChange={setPenColor}
                highlightColor={highlightColor}
                onHighlightColorChange={setHighlightColor}
                onClear={handleClearCanvas}
                isVisible={showToolbar && isDrawingMode}
                onClose={() => setShowToolbar(false)}
            />

            {/* Mobile Toolbar Toggle Button */}
            {isDrawingMode && (
                <Button
                    variant="default"
                    size="icon"
                    className={cn(
                        "fixed top-20 right-4 z-40 md:hidden shadow-lg transition-all bg-primary text-primary-foreground",
                        isFullScreen && "top-4"
                    )}
                    onClick={() => setShowToolbar(!showToolbar)}
                >
                    <Pencil className="h-5 w-5" />
                </Button>
            )}

            {/* Zoom Controls */}
            <ZoomControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleToggleFullScreen}
                currentZoom={zoom}
                isFullScreen={isFullScreen}
            />

            {/* Main Content - Static Container */}
            <div
                className="relative pb-20 overflow-auto"
                style={{
                    height: isFullScreen ? "100vh" : "calc(100vh - 80px)",
                    touchAction: isDrawingMode ? "pan-y pinch-zoom" : "auto"
                }}
            >
                <div className="w-full min-h-full py-4 sm:py-8 px-2 sm:px-4 md:px-6 lg:px-8">
                    {/* Content Container - Static and Centered */}
                    <div className="max-w-5xl mx-auto relative">
                        {/* PDF Content */}
                        <div
                            ref={contentRef}
                            className="shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12 origin-top"
                            style={{
                                backgroundColor: '#fafaf9',
                                color: '#1f2937',
                                transform: `scale(${zoom})`,
                                transformOrigin: "top center",
                                transition: "transform 0.3s ease",
                                marginBottom: zoom > 1 ? `${(zoom - 1) * 100}%` : "0",
                            }}
                        >
                            {/* Questions */}
                            {chunkQuestions.map((question, index) => {
                                const correctAnswerText = getCorrectAnswerText(
                                    question.answer,
                                    question.choices
                                );

                                return (
                                    <div
                                        key={question.id}
                                        className="mb-12 pb-8 last:border-b-0 page-break-after"
                                        style={{
                                            borderBottom: '2px solid #e5e7eb',
                                            pageBreakAfter: "always",
                                            breakAfter: "page",
                                        }}
                                    >
                                        {/* Question Header */}
                                        <div className="mb-4">
                                            <div className="flex items-start gap-3 mb-2">
                                                <span className="inline-flex items-center justify-center bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-base font-bold shrink-0">
                                                    {index + 1}
                                                </span>
                                                <h2 className="text-base sm:text-lg md:text-xl font-bold leading-relaxed" style={{ color: '#111827' }}>
                                                    {question.question}
                                                </h2>
                                            </div>
                                            <p className="text-xs sm:text-sm mr-14" style={{ color: '#6b7280' }}>
                                                المحاضرة {question.lecture_number} • {question.type === "mcq" ? "اختيار متعدد" : "صح أو خطأ"}
                                            </p>
                                        </div>

                                        {/* MCQ Choices */}
                                        {question.type === "mcq" && question.choices && (
                                            <div className="space-y-2 mb-6 mr-14">
                                                <p className="font-semibold text-sm sm:text-base mb-3" style={{ color: '#374151' }}>الخيارات:</p>
                                                {question.choices.map((choice, idx) => {
                                                    const isCorrect = choice === correctAnswerText;
                                                    const optionLetter = String.fromCharCode(65 + idx);
                                                    return (
                                                        <div key={idx} className="py-1.5 leading-relaxed">
                                                            <span className="font-medium text-sm sm:text-base" style={{ color: '#374151' }}>
                                                                {optionLetter}.{" "}
                                                            </span>
                                                            <span
                                                                className="text-sm sm:text-base"
                                                                style={{
                                                                    backgroundColor: isCorrect ? '#fef08a' : 'transparent',
                                                                    color: '#111827',
                                                                    padding: isCorrect ? '2px 6px' : '0',
                                                                    fontWeight: isCorrect ? '600' : '400',
                                                                }}
                                                            >
                                                                {choice}
                                                            </span>
                                                            {isCorrect && (
                                                                <span className="mr-2 text-sm font-bold" style={{ color: '#16a34a' }}>
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* True/False */}
                                        {question.type === "true_false" && (
                                            <div className="space-y-2 mb-6 mr-14">
                                                <p className="font-semibold text-sm sm:text-base mb-3" style={{ color: '#374151' }}>الخيارات:</p>
                                                {["صح", "خطأ"].map((option) => {
                                                    const isCorrect = option === question.answer;
                                                    return (
                                                        <div key={option} className="py-1.5 leading-relaxed">
                                                            <span className="font-medium text-sm sm:text-base" style={{ color: '#374151' }}>
                                                                •{" "}
                                                            </span>
                                                            <span
                                                                className="text-sm sm:text-base"
                                                                style={{
                                                                    backgroundColor: isCorrect ? '#fef08a' : 'transparent',
                                                                    color: '#111827',
                                                                    padding: isCorrect ? '2px 6px' : '0',
                                                                    fontWeight: isCorrect ? '600' : '400',
                                                                }}
                                                            >
                                                                {option}
                                                            </span>
                                                            {isCorrect && (
                                                                <span className="mr-2 text-sm font-bold" style={{ color: '#16a34a' }}>
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Explanation */}
                                        <div className="border-l-4 p-4 mr-14" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
                                            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm sm:text-base" style={{ color: '#1e3a8a' }}>
                                                <span className="text-lg">💡</span>
                                                الشرح
                                            </h3>
                                            <p className="leading-relaxed text-sm sm:text-base" style={{ color: '#1e40af' }}>
                                                {question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Drawing Canvas Overlay */}
                        <div
                            className={cn(
                                "absolute top-0 left-0 w-full",
                                isDrawingMode ? "pointer-events-auto" : "pointer-events-none"
                            )}
                            style={{
                                height: `${zoom * 100}%`,
                            }}
                        >
                            <ReactSketchCanvas
                                ref={canvasRef}
                                strokeWidth={getStrokeWidth()}
                                strokeColor={getCurrentColor()}
                                canvasColor="transparent"
                                eraserWidth={30}
                                onStroke={handleCanvasChange}
                                style={{
                                    border: "none",
                                    width: "100%",
                                    height: "100%",
                                    cursor: isDrawingMode ? "crosshair" : "default",
                                    touchAction: "none" // Force drawing with 1 finger on the canvas
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    .page-break-after {
                        page-break-after: always;
                        break-after: page;
                    }
                }
            `}</style>
        </div>
    );
}
