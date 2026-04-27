"use client";

// components/study/StudySidebar.tsx

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  PlayCircle,
  FileText,
  Paperclip,
  Layers,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModuleWithProgress, LessonWithProgress } from "@/types/study";
import { LessonType, StudentLevel } from "@/types/study";

interface Props {
  courseId: string;
  modules: ModuleWithProgress[];
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
}

const lessonIcon = {
  [LessonType.VIDEO]: PlayCircle,
  [LessonType.TEXT]: FileText,
  [LessonType.MATERIAL]: Paperclip,
  [LessonType.AR_MODEL]: Layers,
};

const levelColor: Record<StudentLevel, string> = {
  [StudentLevel.BEGINNER]: "text-emerald-400 bg-emerald-400/10",
  [StudentLevel.INTERMEDIATE]: "text-amber-400 bg-amber-400/10",
  [StudentLevel.ADVANCED]: "text-rose-400 bg-rose-400/10",
};

export function StudySidebar({
  courseId,
  modules,
  progressPercent,
  completedLessons,
  totalLessons,
}: Props) {
  const params = useParams();
  const activeLessonId = params?.lessonId as string | undefined;

  // Default: open the module that contains the active lesson
  const defaultOpen = modules.find((m) =>
    m.lessons.some((l) => l.id === activeLessonId)
  )?.id;

  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(defaultOpen ? [defaultOpen] : modules[0] ? [modules[0].id] : [])
  );

  function toggleModule(id: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress summary */}
      <div className="p-4 border-b border-white/5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white/40">Your progress</span>
          <span className="text-violet-400 font-semibold tabular-nums">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-500 to-fuchsia-500 transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">
          {progressPercent}% complete
        </p>
      </div>

      {/* Modules list */}
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map((mod, modIdx) => {
          const isOpen = openModules.has(mod.id);
          return (
            <div key={mod.id} className="border-b border-white/5 last:border-0">
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/3 transition-colors group"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/30 font-mono">
                  {modIdx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                    {mod.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded",
                        levelColor[mod.level]
                      )}
                    >
                      {mod.level.toLowerCase()}
                    </span>
                    <span className="text-[11px] text-white/30">
                      {mod.completedCount}/{mod.totalCount}
                    </span>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-white/30 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Lessons list */}
              {isOpen && (
                <ul className="pb-2">
                  {mod.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseId={courseId}
                      isActive={lesson.id === activeLessonId}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

function LessonItem({
  lesson,
  courseId,
  isActive,
}: {
  lesson: LessonWithProgress;
  courseId: string;
  isActive: boolean;
}) {
  const Icon = lessonIcon[lesson.type] ?? FileText;

  return (
    <li>
      <Link
        href={`/courses/${courseId}/study/${lesson.id}`}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 pl-12 text-sm transition-all",
          isActive
            ? "bg-violet-500/15 text-white border-r-2 border-violet-500"
            : "text-white/50 hover:text-white/80 hover:bg-white/3"
        )}
      >
        {/* Completion indicator */}
        {lesson.isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-white/20 shrink-0" />
        )}

        {/* Lesson type icon */}
        <Icon
          className={cn(
            "w-3.5 h-3.5 shrink-0",
            isActive ? "text-violet-400" : "text-white/25"
          )}
        />

        {/* Title */}
        <span className="flex-1 truncate">{lesson.title}</span>

        {/* AR badge */}
        {lesson.type === LessonType.AR_MODEL && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-fuchsia-400 bg-fuchsia-400/10 px-1.5 py-0.5 rounded shrink-0">
            AR
          </span>
        )}
      </Link>
    </li>
  );
}