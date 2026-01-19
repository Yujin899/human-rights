"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Pencil, Move } from "lucide-react";
import Link from "next/link";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import questionsData from "@/data/questions.json";
import { getCorrectAnswerText } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";
import { DrawingToolbar } from "@/components/DrawingToolbar";
import { ZoomControls } from "@/components/ZoomControls";
import { cn } from "@/lib/utils";
import { TransformWrapper, TransformComponent, useTransformContext } from "react-zoom-pan-pinch";

export default function StudyModePDF() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const chunkQuestions = questionsData.questions.filter((q) =>
        chunkLectures.includes(q.lecture_number)
    );

    const [activeTool, setActiveTool] = useState<"pen" | "highlighter" | "eraser" | "pan">("pen");
    const [penColor, setPenColor] = useState("#000000");
    const [highlightColor, setHighlightColor] = useState("#fef08a");
    const [zoom, setZoom] = useState(1);
    const [showToolbar, setShowToolbar] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDrawingMode, setIsDrawingMode] = useState(true);
    const [canvasHeight, setCanvasHeight] = useState(0);

    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<any>(null);

    // Update canvas height to match content height
    useEffect(() => {
        if (contentRef.current) {
            const updateHeight = () => {
                const height = contentRef.current?.offsetHeight || 0;
                setCanvasHeight(height);
            };

            const resizeObserver = new ResizeObserver(updateHeight);
            resizeObserver.observe(contentRef.current);
            updateHeight();

            return () => resizeObserver.disconnect();
        }
    }, [chunkQuestions]);

    // Handle tool changes
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
        const timer = setTimeout(loadSavedDrawing, 500);
        return () => clearTimeout(timer);
    }, [chunkId]);

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
        <div className="min-h-screen bg-background selection:bg-primary/20">
            {/* Header */}
            {!isFullScreen && (
                <div className="sticky top-0 z-40 bg-background/95 border-b backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className="flex-1">
                            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight">وضع الدراسة - {chunk.name}</h1>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                                المحاضرات {chunk.lectures.join(" - ")} • {chunkQuestions.length} سؤال
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={isDrawingMode ? "default" : "outline"}
                                size="sm"
                                onClick={() => setIsDrawingMode(!isDrawingMode)}
                                className="gap-2 rounded-full font-bold shadow-sm transition-all active:scale-95"
                            >
                                {isDrawingMode ? (
                                    <>
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse ring-2 ring-red-400/20" />
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
                                <Button variant="outline" size="icon" className="rounded-full">
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
                        "fixed top-20 right-4 z-40 md:hidden shadow-2xl transition-all bg-primary text-primary-foreground rounded-full h-12 w-12",
                        isFullScreen && "top-4",
                        showToolbar && "opacity-0 scale-0 pointer-events-none"
                    )}
                    onClick={() => setShowToolbar(true)}
                >
                    <Pencil className="h-6 w-6" />
                </Button>
            )}

            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={3}
                centerOnInit
                wheel={{ step: 0.1 }}
                pinch={{ step: 1 }}
                disabled={activeTool !== "pan" && isDrawingMode}
                panning={{
                    disabled: activeTool !== "pan" && isDrawingMode,
                    excluded: ["button", "input", "select", "textarea", "a"]
                }}
            >
                {({ zoomIn, zoomOut, resetTransform, centerView, state }) => (
                    <>
                        {/* Zoom Controls Overlay */}
                        <ZoomControls
                            onZoomIn={() => zoomIn(0.2)}
                            onZoomOut={() => zoomOut(0.2)}
                            onReset={handleToggleFullScreen}
                            onCenter={() => centerView(1)}
                            currentZoom={state.scale}
                            isFullScreen={isFullScreen}
                        />

                        {/* Main Content Area */}
                        <div
                            className="relative overflow-hidden cursor-move"
                            style={{
                                height: isFullScreen ? "100vh" : "calc(100vh - 80px)",
                                cursor: activeTool === "pan" ? "grab" : "default"
                            }}
                        >
                            <TransformComponent
                                wrapperStyle={{
                                    width: "100%",
                                    height: "100%",
                                }}
                                contentStyle={{
                                    width: "100%",
                                    minHeight: "100%",
                                }}
                            >
                                <div className="w-full min-h-full py-8 sm:py-12 px-4 md:px-8">
                                    <div className="max-w-4xl mx-auto relative group">
                                        {/* Paper Container */}
                                        <div
                                            ref={contentRef}
                                            className="relative shadow-2xl rounded-sm transition-shadow duration-500 overflow-hidden"
                                            style={{
                                                backgroundColor: '#fafaf9',
                                                color: '#1f2937',
                                            }}
                                        >
                                            {/* Drawing Canvas - Layered inside content to be adaptive */}
                                            <div
                                                className={cn(
                                                    "absolute inset-0 z-10",
                                                    isDrawingMode && activeTool !== "pan" ? "pointer-events-auto" : "pointer-events-none"
                                                )}
                                                style={{ height: canvasHeight }}
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
                                                        cursor: isDrawingMode && activeTool !== "pan" ? "crosshair" : "inherit",
                                                        touchAction: "none"
                                                    }}
                                                />
                                            </div>

                                            {/* PDF/Questions Content */}
                                            <div className="relative z-0 p-8 sm:p-12 md:p-16 lg:p-20">
                                                {chunkQuestions.map((question, index) => {
                                                    const correctAnswerText = getCorrectAnswerText(
                                                        question.answer,
                                                        question.choices
                                                    );

                                                    return (
                                                        <div
                                                            key={question.id}
                                                            className="mb-16 pb-12 last:mb-0 last:pb-0 border-b border-gray-100 last:border-0"
                                                        >
                                                            {/* Question Header */}
                                                            <div className="mb-6">
                                                                <div className="flex items-start gap-4 mb-3">
                                                                    <span className="flex items-center justify-center bg-primary text-primary-foreground w-8 h-8 rounded-lg text-sm font-black shrink-0 shadow-sm shadow-primary/20">
                                                                        {index + 1}
                                                                    </span>
                                                                    <h2 className="text-lg sm:text-xl md:text-2xl font-black leading-tight tracking-tight text-slate-900">
                                                                        {question.question}
                                                                    </h2>
                                                                </div>
                                                                <div className="flex gap-2 mr-12 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                                    <span className="px-2 py-0.5 bg-slate-100 rounded">المحاضرة {question.lecture_number}</span>
                                                                    <span className="px-2 py-0.5 bg-slate-100 rounded">{question.type === "mcq" ? "MCQ" : "T/F"}</span>
                                                                </div>
                                                            </div>

                                                            {/* MCQ Choices */}
                                                            {question.type === "mcq" && question.choices && (
                                                                <div className="space-y-3 mb-8 mr-12">
                                                                    {question.choices.map((choice, idx) => {
                                                                        const isCorrect = choice === correctAnswerText;
                                                                        const optionLetter = String.fromCharCode(65 + idx);
                                                                        return (
                                                                            <div key={idx} className="flex items-center gap-3">
                                                                                <span className="font-black text-slate-300 w-4">{optionLetter}</span>
                                                                                <div
                                                                                    className={cn(
                                                                                        "flex-1 p-2.5 rounded-md border border-transparent transition-all",
                                                                                        isCorrect ? "bg-amber-50/50 border-amber-200/50" : ""
                                                                                    )}
                                                                                >
                                                                                    <span className={cn(
                                                                                        "text-base",
                                                                                        isCorrect ? "font-bold text-amber-900" : "text-slate-700"
                                                                                    )}>
                                                                                        {choice}
                                                                                    </span>
                                                                                    {isCorrect && (
                                                                                        <span className="mr-2 text-amber-600 font-black">✓</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            {/* True/False */}
                                                            {question.type === "true_false" && (
                                                                <div className="flex gap-4 mb-8 mr-12">
                                                                    {["صح", "خطأ"].map((option) => {
                                                                        const isCorrect = option === question.answer;
                                                                        return (
                                                                            <div
                                                                                key={option}
                                                                                className={cn(
                                                                                    "px-6 py-2 rounded-md border transition-all text-base font-bold",
                                                                                    isCorrect ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-white border-slate-200 text-slate-400"
                                                                                )}
                                                                            >
                                                                                {option} {isCorrect && "✓"}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}

                                                            {/* Explanation */}
                                                            <div className="bg-blue-50/50 border-r-4 border-blue-500 p-6 mr-12 rounded-l-xl">
                                                                <h3 className="font-black mb-2 flex items-center gap-2 text-blue-900 text-xs uppercase tracking-wider">
                                                                    <div className="w-5 h-5 flex items-center justify-center bg-blue-100 rounded-full">💡</div>
                                                                    التفسير العميق
                                                                </h3>
                                                                <p className="leading-relaxed text-sm sm:text-base text-blue-800/80 font-medium">
                                                                    {question.explanation}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TransformComponent>
                        </div>
                    </>
                )}
            </TransformWrapper>

            <style jsx global>{`
                @media print {
                    .page-break-after {
                        page-break-after: always;
                        break-after: page;
                    }
                }
                .react-transform-component {
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </div>
    );
}
