"use client";

// components/study/lessons/TextLesson.tsx

import type { LessonWithProgress } from "@/types/study";

interface Props {
  lesson: LessonWithProgress;
}

export function TextLesson({ lesson }: Props) {
  if (!lesson.content) {
    return (
      <div className="rounded-xl bg-white/3 border border-white/5 p-8 text-center text-white/40 text-sm">
        No content available for this lesson.
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white/3 border border-white/5 p-6 sm:p-8">
      <div
        className="
          prose prose-invert max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-a:text-violet-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-fuchsia-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/8
          prose-blockquote:border-violet-500 prose-blockquote:text-white/50
          prose-li:text-white/70
          prose-img:rounded-lg
        "
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />
    </div>
  );
}