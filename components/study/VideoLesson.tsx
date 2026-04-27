"use client";

// components/study/lessons/VideoLesson.tsx

import { useState } from "react";
import { FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LessonWithProgress } from "@/types/study";

interface Props {
  lesson: LessonWithProgress;
}

export function VideoLesson({ lesson }: Props) {
  const [showTranscript, setShowTranscript] = useState(false);

  if (!lesson.videoUrl) {
    return (
      <div className="rounded-xl bg-white/3 border border-white/5 p-8 text-center text-white/40 text-sm">
        No video available for this lesson.
      </div>
    );
  }

  // Detect if it's a YouTube URL or a direct video file
  const isYoutube =
    lesson.videoUrl.includes("youtube.com") ||
    lesson.videoUrl.includes("youtu.be");

  const youtubeEmbedUrl = isYoutube
    ? lesson.videoUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "www.youtube.com/embed/")
    : null;

  return (
    <div className="space-y-4">
      {/* Player */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl">
        {isYoutube && youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={lesson.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <video
            src={lesson.videoUrl}
            controls
            className="absolute inset-0 w-full h-full"
            controlsList="nodownload"
          />
        )}
      </div>

      {/* Content / description */}
      {lesson.content && (
        <div
          className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* Transcript accordion */}
      {lesson.transcript && (
        <div className="rounded-xl border border-white/8 overflow-hidden">
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/3 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Transcript
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                showTranscript && "rotate-180"
              )}
            />
          </button>
          {showTranscript && (
            <div className="px-4 py-4 border-t border-white/5 text-sm text-white/50 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {lesson.transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}