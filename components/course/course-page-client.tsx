"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { enrollInCourse } from "@/actions/courses";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Users,
  Layers,
  CheckCircle2,
  PlayCircle,
  FileText,
  Paperclip,
  Lock,
  Loader2,
  BookOpen,
  Monitor,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Navbar from "../layout/navbar";

type Lesson = {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "MATERIAL" | "AR_MODEL";
  order: number;
  completed: boolean;
};

type Module = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  teacherName: string;
  teacherImage: string | null;
  teacherEmail: string | null;
  enrollmentCount: number;
  isEnrolled: boolean;
  createdAt: string;
  modules: Module[];
};

function lessonIcon(type: Lesson["type"]) {
  if (type === "VIDEO")
    return <PlayCircle size={16} className="text-primary shrink-0" />;
  if (type === "TEXT")
    return <FileText size={16} className="text-zinc-400 shrink-0" />;
  return <Paperclip size={16} className="text-zinc-400 shrink-0" />;
}

function progressPercent(modules: Module[]) {
  let total = 0;
  let done = 0;
  modules.forEach((m) =>
    m.lessons.forEach((l) => {
      total++;
      if (l.completed) done++;
    }),
  );
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ModuleItem({
  mod,
  isEnrolled,
  locale,
  courseId,
  defaultOpen,
}: {
  mod: Module;
  isEnrolled: boolean;
  locale: string;
  courseId: string;
  defaultOpen?: boolean;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(defaultOpen ?? false);
  const completedCount = mod.lessons.filter((l) => l.completed).length;
  const total = mod.lessons.length;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/mod">
      <CollapsibleTrigger
        className={cn(
          "w-full flex items-center gap-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4",
          "text-start transition-all duration-200 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        )}
      >
        <span className="shrink-0 w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs font-black flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
          {mod.order}
        </span>

        <div className="flex-1 min-w-0">
          <span className="text-[12px] font-medium text-zinc-400">
            {t("courses.lessons", {
              completed: completedCount,
              total,
            })}

            {isEnrolled && completedCount > 0 && ` • ${t("done")}`}
          </span>
        </div>

        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-zinc-400 transition-transform duration-300",
            open && "rotate-180 text-primary",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
        <div className="mt-2 mx-4 ps-6 border-s-2 border-zinc-100 dark:border-zinc-800 flex flex-col gap-1 pb-4 pt-2">
          {mod.description && (
            <p className="text-sm text-zinc-500 mb-4 ps-2">{mod.description}</p>
          )}
          {mod.lessons.map((lesson) => (
            <div key={lesson.id}>
              {isEnrolled ? (
                <Link
                  href={`/${locale}/courses/${courseId}/lessons/${lesson.id}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all group/item",
                    "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                  )}
                >
                  {lesson.completed ? (
                    <div className="bg-emerald-500/10 p-1 rounded-full">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  ) : (
                    lessonIcon(lesson.type)
                  )}
                  <span
                    className={cn(
                      "flex-1 truncate text-zinc-600 dark:text-zinc-400 group-hover/item:text-zinc-900 dark:group-hover/item:text-white",
                      lesson.completed && "opacity-50 font-normal",
                    )}
                  >
                    {lesson.title}
                  </span>
                  <ArrowRight
                    size={14}
                    className="text-zinc-300 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all"
                  />
                </Link>
              ) : (
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-zinc-400 opacity-60">
                  <Lock size={14} className="shrink-0" />
                  <span className="truncate">{lesson.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function CourseDetailClient({
  course,
  userId,
  locale,
}: {
  course: Course;
  userId: string | null;
  locale: string;
}) {
  const t = useTranslations("courses");
  const router = useRouter();
  const isRtl = locale === "ar";
  const [isPending, startTransition] = useTransition();

  const pct = progressPercent(course.modules);
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0,
  );
  const BackIcon = isRtl ? ChevronRight : ChevronLeft;

  const handleEnroll = () => {
    if (!userId) {
      router.push(`/${locale}/auth/signin`);
      return;
    }
    startTransition(async () => {
      await enrollInCourse(course.id);
      router.refresh();
    });
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-zinc-950"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Navbar />

      {/* ── Header Area ──────────────────────────────────────────── */}
      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <Link
            href={`/${locale}/courses`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-primary transition-colors"
          >
            <BackIcon
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            {t("backToCourses")}
          </Link>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-12 pt-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Course Info */}
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                  <Monitor size={14} />
                  {t("dept")}
                </div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-zinc-900 dark:text-white">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Enhanced Stats Row */}
              <div className="flex flex-wrap gap-y-4 gap-x-8">
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <Users size={16} className="text-blue-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {course.enrollmentCount}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {t("students")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <Layers size={16} className="text-purple-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {course.modules.length}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {t("modules")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <BookOpen size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {totalLessons}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      {t(`lessons`, {
                        completed: 0,
                        total: totalLessons,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <Calendar size={16} className="text-amber-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">
                      {formatDate(course.createdAt, locale)}
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                      Created
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructor Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 w-fit shadow-sm">
                <Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800">
                  <AvatarImage src={course.teacherImage ?? undefined} />
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-sm font-black">
                    {course.teacherName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-0.5">
                    {t("instructor")}
                  </p>
                  <p className="text-base font-bold text-zinc-900 dark:text-white">
                    {course.teacherName}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Enrollment Card */}
            <div className="lg:w-80 xl:w-96 shrink-0">
              <div className="sticky top-24 rounded-[2rem] border-none bg-white dark:bg-zinc-900 overflow-hidden shadow-2xl shadow-zinc-200 dark:shadow-none">
                <div className="relative aspect-video w-full">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-300">
                      <Monitor size={60} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  {!course.isEnrolled && (
                    <Badge className="absolute bottom-4 left-4 bg-white text-black font-black uppercase tracking-tighter border-none px-3">
                      Limited Seats
                    </Badge>
                  )}
                </div>

                <div className="p-8 space-y-6">
                  {course.isEnrolled ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                            {t("yourProgress")}
                          </span>
                          <span className="text-2xl font-black text-primary">
                            {pct}%
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          className="h-2.5 bg-zinc-100 dark:bg-zinc-800"
                        />
                      </div>
                      <Button
                        asChild
                        className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                        size="lg"
                      >
                        <Link href={`/${locale}/courses/${course.id}/study`}>
                          {pct > 0 ? t("continueLearning") : t("startLearning")}
                          <ArrowRight className="ms-2 h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        className="w-full h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
                        size="lg"
                        onClick={handleEnroll}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : userId ? (
                          t("enrollNow")
                        ) : (
                          t("signInToEnroll")
                        )}
                      </Button>
                      <p className="text-sm text-center font-medium text-zinc-500">
                        ✨ {t("freeEnrollment")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Curriculum Section ────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              {t("curriculum")}
            </h2>
            <p className="text-zinc-500 font-medium">
              Follow the structured path to master this subject
            </p>
          </div>

          <div className="grid gap-4">
            {course.modules.map((mod, idx) => (
              <ModuleItem
                key={mod.id}
                mod={mod}
                isEnrolled={course.isEnrolled}
                locale={locale}
                courseId={course.id}
                defaultOpen={idx === 0}
              />
            ))}
            {course.modules.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2rem]">
                <BookOpen className="h-12 w-12 text-zinc-200 mb-4" />
                <p className="text-lg font-bold text-zinc-400">
                  {t("noModules")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
