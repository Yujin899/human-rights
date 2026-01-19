"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home } from "lucide-react";
import Link from "next/link";
import questionsData from "@/data/questions.json";
import { getCorrectAnswerText } from "@/lib/validation";
import { getChunkById, getChunkLectures } from "@/lib/chunks";
import { ZoomControls } from "@/components/ZoomControls";

export default function StudyModePDF() {
    const params = useParams();
    const router = useRouter();
    const chunkId = parseInt(params.chunk as string);

    const chunk = getChunkById(chunkId);
    const chunkLectures = getChunkLectures(chunkId);

    const chunkQuestions = questionsData.questions.filter((q) =>
        chunkLectures.includes(q.lecture_number)
    );

    const [zoom, setZoom] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.1, 2));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleToggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    if (!chunk || chunkQuestions.length === 0) {
        router.push("/");
        return null;
    }

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
                    height: isFullScreen ? "100vh" : "calc(100vh - 80px)"
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
