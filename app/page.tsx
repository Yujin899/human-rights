"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookOpen, Brain, FileText } from "lucide-react";
import { motion } from "framer-motion";
import questionsData from "@/data/questions.json";

// Define chunks - grouping lectures together
const CHUNKS = [
  { id: 1, name: "الجزء الأول", lectures: [1, 2, 3] },
  { id: 2, name: "الجزء الثاني", lectures: [4, 5, 6] },
  { id: 3, name: "الجزء الثالث", lectures: [7, 8, 9] },
];

export default function Home() {
  // Calculate question count per chunk
  const chunks = CHUNKS.map((chunk) => ({
    ...chunk,
    questionCount: questionsData.questions.filter((q) =>
      chunk.lectures.includes(q.lecture_number)
    ).length,
  }));

  const totalQuestions = questionsData.questions.length;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 md:py-12 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1 flex-1"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
              بنك اسئلة هيومان
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium">  اختار شوية محاضرات او تقدر تمتحن المنهج كله باسئلة عشوائية</p>
          </motion.div>
          <ThemeToggle />
        </div>

        {/* Full Exam Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <Card className="relative overflow-hidden group bg-primary text-primary-foreground">
            <CardHeader className="relative z-10">
              <CardTitle className="text-3xl font-bold flex items-center gap-4">
                <div className="p-3 bg-primary-foreground/20 rounded-2xl backdrop-blur-md">
                  <FileText className="h-8 w-8" />
                </div>
                الاسئلة مجمعة من ال pdf كاملة
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl leading-relaxed">
                دا كل عدد الاسئلة منغير تكرار مشروحة من pdf المنهج يعني تقدر تختبر نفسك وهيظهرلك الاجابة والاجابة لية صح او لية غلط ({totalQuestions} سؤال)
              </p>
              <Link href="/exam">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-10 h-14 text-lg font-bold"
                >
                  يلا بينا
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chunks Grid */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground whitespace-nowrap">
            هنا الاسئلة متقسمة
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {chunks.map((chunk, index) => (
            <motion.div
              key={chunk.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <Card className="h-full group flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {chunk.name}
                    </CardTitle>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      {chunk.questionCount} سؤال
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-lg">
                    <span className="font-semibold">تغطي:</span>
                    {chunk.lectures.map((l, i) => (
                      <span key={l} className="flex items-center italic">
                        لـ {l}{i < chunk.lectures.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 mt-auto">
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <Link href={`/study/${chunk.id}`} className="w-full">
                      <Button variant="outline" className="w-full justify-start">
                        <BookOpen className="ml-2 h-4 w-4" />
                        دراسة
                      </Button>
                    </Link>
                    <Link href={`/quiz/${chunk.id}`} className="w-full">
                      <Button className="w-full justify-start">
                        <Brain className="ml-2 h-4 w-4" />
                        اختبار
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
