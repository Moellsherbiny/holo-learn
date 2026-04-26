"use client";

import { useState, useMemo, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  LayoutGrid,
  List,
  ChevronDown,
  BookOpen,
  Users,
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Monitor,
  Cpu,
  Filter,
} from "lucide-react";
import Navbar from "../layout/navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CourseItem = {
  id: string;
  title: string;
  description: string | null;
  thumbnail: string | null;
  teacherName: string;
  teacherImage: string | null;
  enrollmentCount: number;
  moduleCount: number;
  isEnrolled: boolean;
  progress: { completed: number; total: number } | null;
  createdAt: string;
};

type SortKey = "newest" | "popular" | "title";
type ViewMode = "grid" | "list";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function progressPercent(p: { completed: number; total: number } | null) {
  if (!p || p.total === 0) return 0;
  return Math.round((p.completed / p.total) * 100);
}

function teacherInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Decorative hologram-themed placeholder SVG when no thumbnail
function CoursePlaceholder({ seed }: { seed: string }) {
  const hue = (seed.charCodeAt(0) * 37 + seed.charCodeAt(1 % seed.length) * 13) % 360;
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: `hsl(${hue} 35% 14%)` }}
    >
      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={`grid-${seed}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${seed})`} />
      </svg>
      {/* Center icon */}
      <Monitor
        size={40}
        style={{ color: `hsl(${hue} 70% 65%)` }}
        className="drop-shadow-lg relative z-10"
      />
    </div>
  );
}

// ─── Course Card (grid) ────────────────────────────────────────────────────────

function CourseCard({ course, locale }: { course: CourseItem; locale: string }) {
  const t = useTranslations();
  const pct = progressPercent(course.progress);
  const isRtl = locale === "ar";

  return (
    <Link
      href={`/${locale}/courses/${course.id}`}
      className={cn(
        "group flex flex-col rounded-xl border bg-card text-card-foreground",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        "overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <CoursePlaceholder seed={course.id} />
        )}

        {/* Status badge */}
        <div className={cn("absolute top-2", isRtl ? "left-2" : "right-2")}>
          {course.isEnrolled ? (
            <Badge className="bg-emerald-500/90 text-white border-0 text-[11px]">
              <CheckCircle2 size={11} className="me-1" />
              {t("courses.enrolled")}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[11px] backdrop-blur-sm bg-background/70">
              <Lock size={10} className="me-1" />
              {t("courses.notEnrolled")}
            </Badge>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto">
          <span className="flex items-center gap-1">
            <Layers size={11} />
            {course.moduleCount} {t("courses.modules")}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {course.enrollmentCount}
          </span>
        </div>

        {/* Progress bar (if enrolled) */}
        {course.isEnrolled && course.progress && (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>{t("courses.progress", {percent: progressPercent(course.progress)})}</span>
              <span className="font-medium tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </div>
        )}

        {/* Teacher */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/60">
          <Avatar className="h-5 w-5">
            <AvatarImage src={course.teacherImage ?? undefined} />
            <AvatarFallback className="text-[9px]">
              {teacherInitials(course.teacherName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-muted-foreground truncate">{course.teacherName}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Course Row (list) ────────────────────────────────────────────────────────

function CourseRow({ course, locale }: { course: CourseItem; locale: string }) {
  const t = useTranslations();
  const pct = progressPercent(course.progress);

  return (
    <Link
      href={`/${locale}/courses/${course.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-xl border bg-card px-4 py-3",
        "transition-all duration-150 hover:shadow-sm hover:bg-accent/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        {course.thumbnail ? (
          <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="80px" />
        ) : (
          <CoursePlaceholder seed={course.id} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          {course.isEnrolled && (
            <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] shrink-0">
              {t("courses.enrolled")}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers size={11} />
            {course.moduleCount} {t("courses.modules")}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {course.enrollmentCount}
          </span>
          <span className="flex items-center gap-1 truncate">
            <BookOpen size={11} />
            {course.teacherName}
          </span>
        </div>

        {course.isEnrolled && course.progress && (
          <div className="flex items-center gap-2">
            <Progress value={pct} className="h-1 flex-1" />
            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">{pct}%</span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2 w-full mt-2" />
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query: string }) {
  const t = useTranslations();
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
          <Cpu size={36} className="text-muted-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center">
          <Search size={12} className="text-muted-foreground" />
        </div>
      </div>
      <div>
        <p className="font-medium text-sm">{t("courses.emptyTitle")}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {query ? t("courses.emptySearch", { query }) : t("courses.emptyDesc")}
        </p>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ courses, userId }: { courses: CourseItem[]; userId: string | null }) {
  const t = useTranslations();
  const enrolled = courses.filter((c) => c.isEnrolled).length;
  const totalStudents = courses.reduce((sum, c) => sum + c.enrollmentCount, 0);

  return (
    <div className="flex flex-wrap gap-4 sm:gap-8 text-sm">
      <div className="flex flex-col">
        <span className="text-2xl font-bold tabular-nums">{courses.length}</span>
        <span className="text-xs text-muted-foreground">{t("courses.statTotal")}</span>
      </div>
      {userId && (
        <div className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums text-emerald-500">{enrolled}</span>
          <span className="text-xs text-muted-foreground">{t("courses.statEnrolled")}</span>
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-2xl font-bold tabular-nums">{totalStudents}</span>
        <span className="text-xs text-muted-foreground">{t("courses.statStudents")}</span>
      </div>
    </div>
  );
}

// ─── Main CoursesClient ───────────────────────────────────────────────────────

export default function CoursesClient({
  courses,
  userId,
}: {
  courses: CourseItem[];
  userId: string | null;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [filterEnrolled, setFilterEnrolled] = useState(false);

  const filtered = useMemo(() => {
    let list = [...courses];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q)
      );
    }

    // Enrolled filter
    if (filterEnrolled) list = list.filter((c) => c.isEnrolled);

    // Sort
    if (sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (sort === "popular") list.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
    else if (sort === "title") list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [courses, query, sort, filterEnrolled]);

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Navbar />
      {/* ── Page hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b bg-card">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Gradient fade */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-card pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary text-sm font-medium">
                <Monitor size={15} />
                <span>{t("courses.dept")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("courses.pageTitle")}
              </h1>
              <p className="text-sm text-muted-foreground max-w-lg">
                {t("courses.pageSubtitle")}
              </p>
            </div>
            <StatsBar courses={courses} userId={userId} />
          </div>
        </div>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────── */}
      <div className="sticky top-14 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
                isRtl ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t("courses.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn("h-9 text-sm", isRtl ? "pr-9" : "pl-9")}
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Enrolled filter — only for logged-in users */}
            {userId && (
              <Button
                variant={filterEnrolled ? "default" : "outline"}
                size="sm"
                className="h-9 text-xs gap-1.5"
                onClick={() => setFilterEnrolled((v) => !v)}
              >
                <CheckCircle2 size={13} />
                {t("courses.myCoursesBtn")}
              </Button>
            )}

            {/* Sort */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5">
                  <Filter size={13} />
                  {t(`courses.sort.${sort}`)}
                  <ChevronDown size={12} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRtl ? "start" : "end"} className="min-w-35">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(v) => setSort(v as SortKey)}
                >
                  {(["newest", "popular", "title"] as SortKey[]).map((k) => (
                    <DropdownMenuRadioItem key={k} value={k} className="text-xs">
                      {t(`courses.sort.${k}`)}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* View toggle */}
            <div className="flex rounded-md border overflow-hidden">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors",
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors border-s",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
                aria-label="List view"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Result count */}
        {query && (
          <p className="text-xs text-muted-foreground mb-5">
            {t("courses.resultCount", { count: filtered.length, query })}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className={view === "grid" ? "grid grid-cols-1" : "flex flex-col"}>
            <EmptyState query={query} />
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((course) => (
              <CourseRow key={course.id} course={course} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}