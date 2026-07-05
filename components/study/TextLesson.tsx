"use client";

import type { LessonWithProgress } from "@/types/study";
import ReactMarkdown from "react-markdown"
interface Props {
  lesson: LessonWithProgress;
}

export function TextLesson({ lesson }: Props) {
   if (!lesson.content) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/3 p-8 text-center text-sm text-white/40">
        No content available for this lesson.
      </div>
    );
  }

   return (
    <div className="rounded-xl border border-white/5 bg-white/3 p-6 sm:p-8">
      <article
        className="
          prose
          prose-invert
          max-w-none

          prose-headings:text-white
          prose-headings:font-bold

          prose-p:text-white/75
          prose-p:leading-8

          prose-strong:text-white

          prose-a:text-violet-400
          hover:prose-a:text-violet-300

          prose-li:text-white/75

          prose-blockquote:border-violet-500
          prose-blockquote:text-white/60

          prose-img:rounded-xl

          prose-table:block
          prose-table:w-full
          prose-table:overflow-x-auto

          prose-th:text-white
          prose-th:border
          prose-th:border-white/10

          prose-td:border
          prose-td:border-white/10
          prose-td:text-white/75

          prose-code:bg-white/5
          prose-code:px-1.5
          prose-code:py-0.5
          prose-code:rounded
          prose-code:text-pink-300

          prose-pre:bg-[#0f172a]
          prose-pre:border
          prose-pre:border-white/10
          prose-pre:rounded-xl
          prose-pre:p-4
          prose-pre:overflow-x-auto
        "
      >
        <ReactMarkdown
         
          components={{
            pre({ children }) {
              return (
                <pre
                  dir="ltr"
                  className="overflow-x-auto rounded-xl bg-[#0f172a] p-4"
                >
                  {children}
                </pre>
              );
            },
            code({ className, children, ...props }) {
              const isBlock = className?.includes("language-");

              if (isBlock) {
                return (
                  <code
                    dir="ltr"
                    className={className}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <code
                  dir="ltr"
                  className="rounded bg-white/5 px-1.5 py-0.5 text-pink-300"
                  {...props}
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}