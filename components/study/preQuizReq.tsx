import Link from "next/link";
import { BookOpen, ClipboardCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface PreQuizRequiredProps {
  courseId: string;
  quizId: string;
  title: string;
}

export function PreQuizRequired({
  courseId,
  quizId,
  title,
}: PreQuizRequiredProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F1117] px-6">
      <Card className="w-full max-w-xl border-white/10 bg-[#181B23] text-white shadow-2xl">
        <CardHeader className="items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15">
            <ClipboardCheck className="h-8 w-8 text-amber-400" />
          </div>

          <div>
            <CardTitle className="text-2xl">
              يجب أداء الاختبار القبلي أولاً
            </CardTitle>

            <CardDescription className="mt-2 text-base leading-7 text-slate-400">
              لا يمكنك البدء في دراسة هذا الكورس قبل إتمام الاختبار القبلي،
              حيث يساعد هذا الاختبار في قياس مستواك الحالي ومقارنة تقدمك بعد
              الانتهاء من دراسة المحتوى.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400 mb-1">
              الاختبار المطلوب
            </p>

            <p className="font-medium text-white">
              {title}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="flex-1">
              <Link href={`/student/quizzes/${quizId}`}>
                <ClipboardCheck className="me-2 h-4 w-4" />
                ابدأ الاختبار القبلي
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1"
            >
              <Link href={`/courses/${courseId}`}>
                <BookOpen className="me-2 h-4 w-4" />
                العودة إلى صفحة الكورس
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}