"use client";

// components/study/lessons/MaterialLesson.tsx

import { Download, FileText, ExternalLink } from "lucide-react";
import type { LessonWithProgress } from "@/types/study";

interface Props {
  lesson: LessonWithProgress;
}

function getFilename(url: string): string {
  try {
    const parts = new URL(url).pathname.split("/");
    return decodeURIComponent(parts[parts.length - 1] || "material");
  } catch {
    return "material";
  }
}

function isPdf(url: string): boolean {
  return url.toLowerCase().includes(".pdf");
}

export function MaterialLesson({ lesson }: Props) {
  if (!lesson.materialUrl) {
    return (
      <div className="rounded-xl bg-white/3 border border-white/5 p-8 text-center text-white/40 text-sm">
        No material available for this lesson.
      </div>
    );
  }

  const filename = getFilename(lesson.materialUrl);
  const showPreview = isPdf(lesson.materialUrl);

  return (
    <div className="space-y-4">
      {/* Description */}
      {lesson.content && (
        <div
          className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* Material card */}
      <div className="rounded-xl border border-white/8 bg-white/3 p-5 flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
          <FileText className="w-6 h-6 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{filename}</p>
          <p className="text-xs text-white/40 mt-0.5">Downloadable material</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={lesson.materialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open
          </a>
          <a
            href={lesson.materialUrl}
            download={filename}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>

      {/* PDF preview embed */}
      {showPreview && (
        <div className="rounded-xl overflow-hidden border border-white/5 bg-black">
          <p className="text-xs text-white/30 px-4 py-2 border-b border-white/5">
            Preview
          </p>
          <iframe
            src={`${lesson.materialUrl}#view=FitH`}
            title={`${lesson.title} preview`}
            className="w-full h-150"
          />
        </div>
      )}
    </div>
  );
}