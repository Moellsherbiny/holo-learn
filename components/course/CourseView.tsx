"use client";

import React, { useState, useTransition, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  FileText,
  AlertCircle,
  PackageOpen,
  VideoOff,
  Box,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  Play,
} from "lucide-react";
import { toggleLessonProgress } from "@/actions/progress";

/* ─────────────────────────── helpers ─────────────────────────── */

function getLessonIcon(type: string) {
  switch (type) {
    case "VIDEO":
      return <Play size={13} />;
    case "AR_MODEL":
      return <Box size={13} />;
    case "MATERIAL":
      return <FileText size={13} />;
    default:
      return <BookOpen size={13} />;
  }
}

/* ─────────────────────────── AR Viewer ─────────────────────────── */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "a-scene": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & Record<string, any>, HTMLElement>;
      "a-entity": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & Record<string, any>, HTMLElement>;
      "a-marker": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & Record<string, any>, HTMLElement>;
      "a-camera": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & Record<string, any>, HTMLElement>;
    }
  }
}

function ARViewer({ modelUrl }: { modelUrl: string }) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [mode, setMode] = useState<"3d" | "ar">("3d");

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    Promise.all([
      loadScript("https://aframe.io/releases/1.4.0/aframe.min.js"),
      loadScript("https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"),
    ]).then(() => setScriptsLoaded(true));
  }, []);

  if (!scriptsLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900">
        <div className="text-center space-y-3 text-zinc-400">
          <Box size={40} className="mx-auto animate-pulse" />
          <p className="text-sm">Loading AR engine…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-zinc-950">
      {/* Mode toggle */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex rounded-full border border-white/10 bg-black/60 backdrop-blur-sm overflow-hidden text-xs">
        <button
          onClick={() => setMode("3d")}
          className={cn("px-4 py-1.5 transition-colors", mode === "3d" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white")}
        >
          3D Preview
        </button>
        <button
          onClick={() => setMode("ar")}
          className={cn("px-4 py-1.5 transition-colors", mode === "ar" ? "bg-white text-black font-semibold" : "text-white/60 hover:text-white")}
        >
          AR Marker
        </button>
      </div>

      {mode === "3d" ? (
        /* Plain A-Frame scene — no camera feed, just the model */
        // @ts-ignore
        <a-scene
          key="3d"
          embedded
          style={{ width: "100%", height: "100%" }}
          background="color: #111"
          vr-mode-ui="enabled: false"
        >
          {/* @ts-ignore */}
          <a-entity
            gltf-model={modelUrl}
            position="0 0 -3"
            rotation="0 45 0"
            animation="property: rotation; to: 0 405 0; loop: true; dur: 8000; easing: linear"
            scale="1 1 1"
          />
          {/* @ts-ignore */}
          <a-entity light="type: ambient; intensity: 0.6" />
          {/* @ts-ignore */}
          <a-entity light="type: directional; intensity: 0.8" position="1 2 1" />
          {/* @ts-ignore */}
          <a-camera position="0 1.6 0" look-controls="enabled: true" wasd-controls="enabled: false" />
          {/* @ts-ignore */}
        </a-scene>
      ) : (
        /* @ts-ignore */
        <a-scene
          key="ar"
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          style={{ width: "100%", height: "100%" }}
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; antialias: true;"
        >
          {/* @ts-ignore */ }
          <a-marker preset="hiro">
          {/* @ts-ignore */ }
            <a-entity
              gltf-model={modelUrl}
              position="0 0 0"
              scale="0.05 0.05 0.05"
              />
              {/* @ts-ignore */ }
          </a-marker>
              {/* @ts-ignore */ }
          <a-camera />
              {/* @ts-ignore */ }
        </a-scene>
      )}

      {mode === "ar" && (
        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/50 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
          Point camera at a Hiro marker
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────── Main Component ─────────────────────────── */

export default function ModernCourseClient({ course, locale, userId }: any) {
  const isRTL = locale === "ar";

  // Flat list of all lessons with module info
  const allLessons: any[] = (course.modules ?? []).flatMap((m: any) =>
    (m.lessons ?? []).map((l: any) => ({ ...l, moduleTitle: m.title }))
  );

  const [data, setData] = useState(course);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(allLessons[0]?.id ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const flatLessons = (data.modules ?? []).flatMap((m: any) => m.lessons ?? []);
  const activeLesson = flatLessons.find((l: any) => l.id === activeLessonId) ?? null;

  const totalLessons = flatLessons.length;
  const completedCount = flatLessons.filter((l: any) => l.isCompleted).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const currentIndex = flatLessons.findIndex((l: any) => l.id === activeLessonId);
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < flatLessons.length - 1 ? flatLessons[currentIndex + 1] : null;

  const handleToggle = (lessonId: string, currentStatus: boolean) => {
    if (!userId || !lessonId) return;
    startTransition(async () => {
      const result = await toggleLessonProgress(lessonId, userId, !currentStatus);
      if (result?.success) {
        setData((prev: any) => ({
          ...prev,
          modules: prev.modules.map((m: any) => ({
            ...m,
            lessons: m.lessons.map((l: any) =>
              l.id === lessonId ? { ...l, isCompleted: !currentStatus } : l
            ),
          })),
        }));
      }
    });
  };

  /* ── Sidebar ── */
  const Sidebar = (
    <aside
      className={cn(
        "flex flex-col w-72 shrink-0 border-e bg-secondary",
        "transition-transform duration-200",
        // Mobile: absolute overlay
        "max-lg:fixed max-lg:inset-y-0 max-lg:z-40 max-lg:shadow-2xl",
        isRTL ? "max-lg:right-0" : "max-lg:left-0",
        sidebarOpen ? "max-lg:translate-x-0" : isRTL ? "max-lg:translate-x-full" : "max-lg:-translate-x-full",
        // Desktop: always visible
        "lg:relative lg:translate-x-0"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
            {course.title || "Untitled Course"}
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden shrink-0 p-1 rounded-md hover:bg-accent transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>{completedCount}/{totalLessons} lessons</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-1" />
        </div>
      </div>

      {/* Module list */}
      <ScrollArea className="flex-1 min-h-0 overflow-auto">
        {(data.modules ?? []).length > 0 ? (
          <div className="py-3">
            {data.modules.map((module: any, i: number) => (
              <div key={module.id} className="mb-4">
                <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {i + 1}. {module.title}
                </p>
                {(module.lessons ?? []).length > 0 ? (
                  <div>
                    {module.lessons.map((lesson: any) => {
                      const isActive = lesson.id === activeLessonId;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => { setActiveLessonId(lesson.id); setSidebarOpen(false); }}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors text-start",
                            isActive
                              ? "bg-primary/10 text-primary font-medium border-e-2 border-primary"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className={cn(
                            "shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
                            lesson.isCompleted ? "text-green-500" : "text-muted-foreground/30"
                          )}>
                            {lesson.isCompleted
                              ? <CheckCircle2 size={15} />
                              : <span className={cn("w-3 h-3 rounded-full border", isActive ? "border-primary" : "border-muted-foreground/30")} />}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                          <span className={cn("ms-auto shrink-0 opacity-40", isActive && "opacity-70")}>
                            {getLessonIcon(lesson.type)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="px-4 py-2 text-[11px] italic text-muted-foreground/50">No lessons yet</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
            <PackageOpen size={32} />
            <p className="text-xs">No curriculum yet</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );

  /* ── Media area ── */
  const MediaArea = () => {
    if (!activeLesson) return null;

    if (activeLesson.type === "AR_MODEL" && activeLesson.arModelUrl) {
      return <ARViewer modelUrl={activeLesson.arModelUrl} />;
    }

    if (activeLesson.videoUrl) {
      return <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen />;
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-muted-foreground/30 bg-muted/30">
        <VideoOff size={40} />
        <p className="text-sm">No media for this lesson</p>
      </div>
    );
  };

  return (
    <div
      className="flex h-full overflow-hidden bg-background relative"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {Sidebar}

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-background/80 backdrop-blur-sm shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              {activeLesson
                ? (data.modules ?? []).find((m: any) => m.lessons?.some((l: any) => l.id === activeLessonId))?.title
                : course.title}
            </p>
            <h1 className="text-sm font-semibold truncate">
              {activeLesson?.title ?? "No lesson selected"}
            </h1>
          </div>
          {/* Prev / Next navigation */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={!prevLesson}
              onClick={() => prevLesson && setActiveLessonId(prevLesson.id)}
            >
              {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums w-12 text-center">
              {currentIndex + 1}/{totalLessons}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              disabled={!nextLesson}
              onClick={() => nextLesson && setActiveLessonId(nextLesson.id)}
            >
              {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeLesson ? (
          <ScrollArea className="flex-1 min-h-0 overflow-auto">
            <div className="p-4 lg:p-6 space-y-5 max-w-4xl mx-auto">
              {/* Media */}
              <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 border shadow-sm">
                <MediaArea />
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                {/* Tabs */}
                <Tabs defaultValue="content" className="min-w-0">
                  <TabsList className="h-8 bg-muted/60 rounded-lg p-0.5 text-xs">
                    <TabsTrigger value="content" className="h-7 px-3 text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="h-7 px-3 text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                      Resources
                    </TabsTrigger>
                    {activeLesson.transcript && (
                      <TabsTrigger value="transcript" className="h-7 px-3 text-xs rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        Transcript
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="content" className="mt-3">
                    {activeLesson.content ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                        {activeLesson.content}
                      </div>
                    ) : (
                      <p className="flex items-center gap-2 text-sm italic text-muted-foreground/50 mt-3">
                        <AlertCircle size={14} /> No written content.
                      </p>
                    )}
                  </TabsContent>

                  <TabsContent value="resources" className="mt-3">
                    {activeLesson.materialUrl ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={activeLesson.materialUrl} target="_blank" rel="noopener noreferrer">
                          <FileText size={14} className="me-2 text-blue-500" />
                          Download Material
                        </a>
                      </Button>
                    ) : (
                      <p className="text-sm italic text-muted-foreground/50">No downloadable resources.</p>
                    )}
                  </TabsContent>

                  {activeLesson.transcript && (
                    <TabsContent value="transcript" className="mt-3">
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {activeLesson.transcript}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>

                {/* Mark complete */}
                <div className="shrink-0 flex flex-col gap-2">
                  <Button
                    size="sm"
                    disabled={isPending}
                    variant={activeLesson.isCompleted ? "secondary" : "default"}
                    className="whitespace-nowrap h-9"
                    onClick={() => handleToggle(activeLesson.id, activeLesson.isCompleted)}
                  >
                    {activeLesson.isCompleted ? (
                      <><CheckCircle2 size={14} className="me-1.5 text-green-500" /> Completed</>
                    ) : (
                      "Mark as done"
                    )}
                  </Button>

                  {nextLesson && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="whitespace-nowrap h-9 text-xs text-muted-foreground"
                      onClick={() => setActiveLessonId(nextLesson.id)}
                    >
                      Next <ChevronRight size={13} className="ms-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground/40 p-8">
            <PackageOpen size={48} />
            <div className="text-center space-y-1">
              <p className="font-semibold text-sm text-foreground/60">No content yet</p>
              <p className="text-xs">This course has no lessons. Check back later.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}