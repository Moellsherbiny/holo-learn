"use client";

import type { LessonWithProgress } from "@/types/study";
import ReactMarkdown from "react-markdown";

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
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 sm:p-8">
      <article
        dir="rtl"
        className="
          prose
          prose-invert
          max-w-none
          text-right

          prose-headings:font-bold
          prose-headings:text-white
          prose-headings:tracking-tight

          prose-h1:text-4xl
          prose-h1:mb-8
          prose-h1:mt-2

          prose-h2:text-3xl
          prose-h2:mt-12
          prose-h2:mb-6
          prose-h2:border-b
          prose-h2:border-white/10
          prose-h2:pb-3

          prose-h3:text-2xl
          prose-h3:mt-10
          prose-h3:mb-4

          prose-h4:text-xl
          prose-h4:mt-8
          prose-h4:mb-3

          prose-p:my-6
          prose-p:leading-[2.2]
          prose-p:text-white/75

          prose-strong:text-white
          prose-strong:font-semibold

          prose-em:text-white/80

          prose-ul:my-6
          prose-ul:space-y-3

          prose-ol:my-6
          prose-ol:space-y-3

          prose-li:text-white/75
          prose-li:leading-8

          prose-a:text-violet-400
          hover:prose-a:text-violet-300

          prose-blockquote:my-8
          prose-blockquote:border-r-4
          prose-blockquote:border-l-0
          prose-blockquote:border-violet-500
          prose-blockquote:bg-white/5
          prose-blockquote:rounded-xl
          prose-blockquote:px-6
          prose-blockquote:py-4
          prose-blockquote:text-white/70

          prose-img:rounded-xl
          prose-img:shadow-lg
          prose-img:mx-auto

          prose-hr:my-10
          prose-hr:border-white/10

          prose-table:block
          prose-table:w-full
          prose-table:overflow-x-auto
          prose-table:rounded-xl

          prose-th:border
          prose-th:border-white/10
          prose-th:bg-white/5
          prose-th:text-white
          prose-th:px-4
          prose-th:py-3

          prose-td:border
          prose-td:border-white/10
          prose-td:text-white/75
          prose-td:px-4
          prose-td:py-3

          prose-code:text-pink-300
          prose-code:bg-white/5
          prose-code:px-1.5
          prose-code:py-1
          prose-code:rounded-md
          prose-code:before:content-none
          prose-code:after:content-none

          prose-pre:my-8
          prose-pre:bg-[#0f172a]
          prose-pre:border
          prose-pre:border-white/10
          prose-pre:rounded-xl
          prose-pre:p-5
          prose-pre:overflow-x-auto
        "
      >
        <ReactMarkdown
          components={{
            pre({ children }) {
              return (
                <pre
                  dir="ltr"
                  className="overflow-x-auto rounded-xl border border-white/10 bg-[#0f172a] p-5 text-left"
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
                  className="rounded-md bg-white/5 px-1.5 py-1 text-pink-300"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            img({ ...props }) {
              return (
                <img
                  {...props}
                  className="mx-auto my-8 rounded-xl border border-white/10"
                />
              );
            },

            table({ children }) {
              return (
                <div className="my-8 overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full border-collapse">
                    {children}
                  </table>
                </div>
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