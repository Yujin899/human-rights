"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressBarProps {
    current: number;
    total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = Math.round((current / total) * 100);

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">التقدم</span>
                        <span className="text-muted-foreground">
                            {current} من {total}
                        </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-center text-xs text-muted-foreground">
                        {percentage}% مكتمل
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
