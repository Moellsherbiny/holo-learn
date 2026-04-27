"use client";

// components/study/StudyHeader.tsx

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { CourseWithProgress } from "@/types/study";

interface Props {
  course: CourseWithProgress;
}

export function StudyHeader({ course }: Props) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0F1117] z-10 shrink-0">
      {/* Back link */}
      <Link
        href={`/courses/${course.id}`}
        className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline">Back to Course</span>
      </Link>

      {/* Course title */}
      <div className="flex items-center gap-2 text-sm font-medium text-white/80 truncate max-w-[40%] sm:max-w-sm">
        <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
        <span className="truncate">{course.title}</span>
      </div>

      {/* Progress pill */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
          <span className="text-violet-400 font-semibold">
            {course.completedLessons}/{course.totalLessons}
          </span>
          lessons
        </div>
        <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <span className="text-xs text-white/40 tabular-nums">
          {course.progressPercent}%
        </span>
      </div>
    </header>
  );
}