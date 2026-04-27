"use client";

// components/study/LessonView.tsx

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLessonProgress } from "@/actions/study";
import { LessonType } from "@/types/study";
import type {
  LessonWithProgress,
  ModuleWithProgress,
  CourseWithProgress,
} from "@/types/study";

import { VideoLesson } from "./VideoLesson";
import { TextLesson } from "./TextLesson";
import { MaterialLesson } from "./MaterialLesson";
import { ARLesson } from "./ARLesson";
import { StudySidebar } from "./StudySidebar";

interface Props {
  lesson: LessonWithProgress;
  module: ModuleWithProgress | null;
  course: CourseWithProgress;
  modules: ModuleWithProgress[];
  nextLesson: LessonWithProgress | null;
  prevLesson: LessonWithProgress | null;
}

export function LessonView({
  lesson,
  module,
  course,
  modules,
  nextLesson,
  prevLesson,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(
    lesson.isCompleted
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleToggleComplete() {
    const newVal = !optimisticCompleted;
    setOptimisticCompleted(newVal); // optimistic UI
    setError(null);

    startTransition(async () => {
      const result = await toggleLessonProgress(
        lesson.id,
        course.id,
        newVal
      );
      if (!result.success) {
        setOptimisticCompleted(!newVal); // rollback
        setError(result.error);
      }
    });
  }

  function navigateTo(targetLesson: LessonWithProgress) {
    router.push(`/courses/${course.id}/study/${targetLesson.id}`);
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-80 bg-[#13151C] border-r border-white/5 overflow-y-auto z-10">
            <StudySidebar
              courseId={course.id}
              modules={modules}
              progressPercent={course.progressPercent}
              completedLessons={course.completedLessons}
              totalLessons={course.totalLessons}
            />
          </aside>
        </div>
      )}

      <div className="flex flex-col min-h-full">
        {/* Lesson content area */}
        <div className="flex-1">
          {/* Mobile top bar */}
          <div className="flex md:hidden items-center gap-3 px-4 py-3 border-b border-white/5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm text-white/60 truncate">{lesson.title}</span>
          </div>

          {/* Lesson renderer */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {/* Breadcrumb */}
            {module && (
              <p className="text-xs text-white/30 mb-4 truncate">
                {course.title}
                <span className="mx-1.5">›</span>
                {module.title}
              </p>
            )}

            {/* Lesson title */}
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
              {lesson.title}
            </h1>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400">
                {error}
              </div>
            )}

            {/* Lesson content switch */}
            {lesson.type === LessonType.VIDEO && (
              <VideoLesson lesson={lesson} />
            )}
            {lesson.type === LessonType.TEXT && (
              <TextLesson lesson={lesson} />
            )}
            {lesson.type === LessonType.MATERIAL && (
              <MaterialLesson lesson={lesson} />
            )}
            {lesson.type === LessonType.AR_MODEL && (
              <ARLesson lesson={lesson} />
            )}
          </div>
        </div>

        {/* Bottom navigation bar */}
        <div className="sticky bottom-0 border-t border-white/5 bg-[#0F1117]/95 backdrop-blur-md">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            {/* Prev */}
            <button
              onClick={() => prevLesson && navigateTo(prevLesson)}
              disabled={!prevLesson}
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors",
                prevLesson
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-white/20 cursor-not-allowed"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Mark complete */}
            <button
              onClick={handleToggleComplete}
              disabled={isPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                optimisticCompleted
                  ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20"
                  : "bg-violet-600 hover:bg-violet-500 text-white"
              )}
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : optimisticCompleted ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span>
                {optimisticCompleted ? "Completed" : "Mark complete"}
              </span>
            </button>

            {/* Next */}
            <button
              onClick={() => nextLesson && navigateTo(nextLesson)}
              disabled={!nextLesson}
              className={cn(
                "flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors",
                nextLesson
                  ? "text-white/60 hover:text-white hover:bg-white/5"
                  : "text-white/20 cursor-not-allowed"
              )}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}