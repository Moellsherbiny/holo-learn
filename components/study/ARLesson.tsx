"use client";

import "@google/model-viewer";
import {
  Layers,
  Info,
  Smartphone,
  AlertTriangle,
} from "lucide-react";
import type { LessonWithProgress } from "@/types/study";

// تعريف عنصر model-viewer لـ TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src: string;
        alt?: string;
        ar?: boolean;
        "ar-modes"?: string;
        "camera-controls"?: boolean;
        "auto-rotate"?: boolean;
        "shadow-intensity"?: string | number;
        exposure?: string | number;
        poster?: string;
        loading?: "auto" | "eager" | "lazy";
        reveal?: "auto" | "interaction";
        "touch-action"?: string;
        style?: React.CSSProperties;
      };
    }
  }
}

interface Props {
  lesson: LessonWithProgress;
}

/**
 * ARLesson باستخدام Google Model Viewer
 *
 * المميزات:
 * - عرض نموذج 3D داخل الصفحة.
 * - زر AR يظهر تلقائيًا داخل العارض.
 * - يعمل على Android عبر Scene Viewer.
 * - يعمل على iPhone عبر Quick Look.
 * - يعمل على الأجهزة الداعمة لـ WebXR.
 * - لا يحتاج Hiro Marker أو AR.js.
 */
export function ARLesson({ lesson }: Props) {
  const modelUrl = lesson.arModelUrl;

  return (
    <div className="space-y-4">
      {/* محتوى الدرس */}
      {lesson.content && (
        <div
          className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: lesson.content }}
        />
      )}

      {/* إذا لم يوجد نموذج */}
      {!modelUrl && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-amber-300">
              No AR model is attached to this lesson.
            </p>
          </div>
        </div>
      )}

      {/* AR Viewer */}
      {modelUrl && (
        <div className="rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-fuchsia-500/10">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-fuchsia-400" />
              <span className="text-sm font-semibold text-fuchsia-300">
                AR Experience
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-400">
                AR
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-white/40">
              <Smartphone className="w-3 h-3" />
              Mobile AR
            </div>
          </div>

          {/* Model Viewer */}
          <div className="p-4 space-y-3">
            <div className="relative w-full rounded-lg overflow-hidden bg-black/30 border border-white/5">
              {/* @ts-ignore */}
              <model-viewer
                src={modelUrl}
                alt={lesson.title || "3D Model"}
                ar
                ar-modes="scene-viewer quick-look webxr"
                camera-controls
                auto-rotate
                shadow-intensity="1"
                exposure="1"
                loading="eager"
                reveal="auto"
                touch-action="pan-y"
                style={{
                  width: "100%",
                  height: "70vh",
                  minHeight: "500px",
                  backgroundColor: "transparent",
                }}
              />
            </div>

            {/* Instructions */}
            <div className="w-full rounded-lg bg-white/3 border border-white/5 p-3 space-y-2 text-xs text-white/50">
              <p className="flex items-start gap-2">
                <span className="text-fuchsia-400 font-bold shrink-0">
                  1.
                </span>
                Rotate and zoom the 3D model directly in the viewer.
              </p>

              <p className="flex items-start gap-2">
                <span className="text-fuchsia-400 font-bold shrink-0">
                  2.
                </span>
                Tap the AR button that appears inside the viewer.
              </p>

              <p className="flex items-start gap-2">
                <span className="text-fuchsia-400 font-bold shrink-0">
                  3.
                </span>
                Point your phone at a flat surface to place the model in
                the real world.
              </p>
            </div>

            {/* Note */}
            <p className="flex items-center gap-1.5 text-xs text-white/30">
              <Info className="w-3.5 h-3.5" />
              AR works on supported mobile devices using Android Scene
              Viewer, Apple Quick Look, or WebXR.
            </p>
          </div>
        </div>
      )}

      {/* رابط ملف النموذج */}
      {modelUrl && (
        <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/3 border border-white/5">
          <span className="text-xs text-white/40">3D Model File</span>

          <a
            href={modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            Open File
          </a>
        </div>
      )}
    </div>
  );
}