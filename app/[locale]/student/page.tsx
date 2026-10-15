
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Play,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";

import { getStudentDashboardData } from "@/actions/student/dashboard";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const t = useTranslations("Student");
  const locale = useLocale();
  const { data: session, status } = useSession();

  const isArabic = locale.startsWith("ar");
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      if (status === "loading") return;

      if (!session?.user?.id) {
        setLoading(false);
        setHasError(false);
        return;
      }

      setLoading(true);
      setHasError(false);

      try {
        const result = await getStudentDashboardData(session.user.id);

        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);

        if (!cancelled) {
          setHasError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, status]);

  const homePath = `/${locale}/student`;
  const coursesPath = `/${locale}/student/courses`;

  if (loading || status === "loading") {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="h-48 animate-pulse rounded-3xl bg-muted" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-border/60 bg-card"
            />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl bg-muted/70"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
          <GraduationCap className="size-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">
          {isArabic ? "سجّل الدخول للمتابعة" : "Sign in to continue"}
        </h2>
        <Button asChild className="rounded-xl">
          <Link href={`/${locale}/auth/login`}>
            {isArabic ? "تسجيل الدخول" : "Sign in"}
          </Link>
        </Button>
      </div>
    );
  }

  if (hasError || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <Layers3 className="size-6" />
        </div>
        <h2 className="text-xl font-semibold">
          {isArabic ? "تعذر تحميل لوحة التعلم" : "Couldn't load your dashboard"}
        </h2>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          {isArabic
            ? "حدثت مشكلة أثناء جلب بياناتك. حاول مرة أخرى."
            : "Something went wrong while loading your learning data. Please try again."}
        </p>
        <Button
          onClick={() => {
            setHasError(false);
            setLoading(true);
            void getStudentDashboardData(session.user.id)
              .then(setData)
              .catch((error) => {
                console.error(error);
                setHasError(true);
              })
              .finally(() => setLoading(false));
          }}
          className="rounded-xl"
        >
          {isArabic ? "إعادة المحاولة" : "Try again"}
        </Button>
      </div>
    );
  }

  const firstName =
    session.user.name?.trim().split(/\s+/)[0] ||
    (isArabic ? "بطل التعلم" : "Learner");

  const courses = data.courses ?? [];
  const stats = data.stats ?? {};
  const latestLesson = data.latestLesson;

  const totalCourses = courses.length;
  const completedLessons = Number(stats.totalLessonsCompleted ?? 0);
  const completedCourses = Number(stats.completedCourses ?? 0);
  const overallProgress =
    totalCourses > 0
      ? Math.round(
          courses.reduce(
            (total: number, course: any) =>
              total + Number(course.percentage ?? 0),
            0,
          ) / totalCourses,
        )
      : 0;

  const lessonHref = latestLesson?.id
    ? `/${locale}/student/lessons/${latestLesson.id}`
    : coursesPath;

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-7xl space-y-8 p-4 pb-10 sm:p-6 lg:space-y-10 lg:p-8"
    >
      {/* Welcome section */}
      <section className="relative isolate overflow-hidden rounded-[28px] border border-border/70 bg-card">
        <div className="absolute inset-y-0 end-0 w-1/2 bg-primary/[0.035]" />
        <div className="absolute -end-16 -top-24 size-64 rounded-full border border-primary/10" />
        <div className="absolute -end-5 -top-12 size-44 rounded-full border border-primary/10" />
        <div className="absolute bottom-0 end-0 h-1 w-2/5 bg-primary/70" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              {isArabic ? "مساحة التعلم الخاصة بك" : "Your learning space"}
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[42px]">
              {isArabic ? "أهلًا، " : "Welcome back, "}
              <span className="text-primary">{firstName}</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {latestLesson
                ? isArabic
                  ? "رحلتك التعليمية مستمرة. ارجع إلى آخر درس وصلت إليه وواصل التقدم."
                  : "Your learning journey is in progress. Pick up where you left off and keep moving forward."
                : isArabic
                  ? "كل رحلة كبيرة تبدأ بخطوة صغيرة. اختر كورسًا وابدأ رحلتك التعليمية."
                  : "Every great journey starts with one step. Choose a course and begin learning today."}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 gap-2 rounded-xl px-5">
                <Link href={latestLesson ? lessonHref : coursesPath}>
                  {latestLesson
                    ? isArabic
                      ? "متابعة التعلم"
                      : "Continue learning"
                    : isArabic
                      ? "استكشف الكورسات"
                      : "Explore courses"}
                  <DirectionArrow className="size-4" />
                </Link>
              </Button>

              <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
                <GraduationCap className="size-4 text-primary" />
                <span>
                  {data.userLevel ?? (isArabic ? "المتعلم" : "Learner")}
                </span>
              </div>
            </div>
          </div>

          {/* Progress illustration */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[210px] items-center justify-center lg:me-4">
            <div className="absolute inset-3 rounded-full border border-dashed border-primary/25" />
            <div className="absolute inset-7 rounded-full border border-primary/15" />
            <div className="flex size-32 flex-col items-center justify-center rounded-[30px] border border-border bg-background shadow-sm">
              <BookOpen className="mb-3 size-8 text-primary" strokeWidth={1.6} />
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {overallProgress}%
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                {isArabic ? "متوسط التقدم" : "Average progress"}
              </span>
            </div>
            <div className="absolute end-2 top-5 flex size-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <Target className="size-5 text-primary" />
            </div>
            <div className="absolute bottom-4 start-2 flex size-10 items-center justify-center rounded-xl border border-border bg-background shadow-sm">
              <Trophy className="size-5 text-primary" />
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={BookOpen}
          label={isArabic ? "الكورسات المسجل بها" : "Enrolled courses"}
          value={totalCourses}
          note={isArabic ? "كورس في رحلتك التعليمية" : "Courses in your learning journey"}
          index="01"
        />
        <StatCard
          icon={CheckCircle2}
          label={isArabic ? "الدروس المكتملة" : "Completed lessons"}
          value={completedLessons}
          note={isArabic ? "خطوات أنجزتها بالفعل" : "Lessons completed so far"}
          index="02"
        />
        <StatCard
          icon={Trophy}
          label={isArabic ? "الكورسات المكتملة" : "Completed courses"}
          value={completedCourses}
          note={isArabic ? "إنجازاتك التعليمية" : "Your learning achievements"}
          index="03"
        />
      </section>

      {/* Continue learning */}
      <section className="space-y-4">
        <SectionHeading
          eyebrow={isArabic ? "تابع من حيث توقفت" : "PICK UP WHERE YOU LEFT OFF"}
          title={t("continueLearning")}
          description={
            isArabic
              ? "خطوتك التالية في رحلة التعلم."
              : "Your next step in the learning journey."
          }
        />

        <Card className="overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm">
          {latestLesson ? (
            <CardContent className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_200px] lg:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <Play className="ms-0.5 size-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-primary">
                    {isArabic ? "آخر درس" : "RECENT LESSON"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold leading-snug">
                    {latestLesson.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {[latestLesson.courseTitle, latestLesson.moduleTitle]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-5 flex items-center gap-3">
                    <Progress
                      value={Number(latestLesson.percentage ?? 0)}
                      className="h-1.5 flex-1"
                    />
                    <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                      {Number(latestLesson.percentage ?? 0).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <Button asChild className="h-11 gap-2 rounded-xl">
                <Link href={lessonHref}>
                  {isArabic ? "استكمال الدرس" : "Resume lesson"}
                  <DirectionArrow className="size-4" />
                </Link>
              </Button>
            </CardContent>
          ) : (
            <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">
                  {isArabic ? "لم تبدأ أي درس بعد" : "Your learning journey starts here"}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isArabic
                    ? "افتح أحد الكورسات المسجل بها وابدأ أول درس."
                    : "Open one of your enrolled courses and start your first lesson."}
                </p>
              </div>
              <Button asChild className="gap-2 rounded-xl">
                <Link href={coursesPath}>
                  {isArabic ? "عرض الكورسات" : "View courses"}
                  <DirectionArrow className="size-4" />
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </section>

      {/* Courses */}
      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={isArabic ? "مسارك التعليمي" : "YOUR LEARNING PATH"}
            title={t("enrolledCourses")}
            description={
              isArabic
                ? "تابع تقدمك في كل كورس."
                : "Track your progress across your courses."
            }
          />

          <Button
            asChild
            variant="outline"
            className="h-9 w-fit gap-2 rounded-xl"
          >
            <Link href={coursesPath}>
              {isArabic ? "عرض الكل" : "View all"}
              <ArrowUpLeft
                className={cn("size-4", !isArabic && "rotate-90")}
              />
            </Link>
          </Button>
        </div>

        {courses.length === 0 ? (
          <Card className="rounded-2xl border-dashed border-border bg-card shadow-none">
            <CardContent className="flex flex-col items-center px-6 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                <BookOpen className="size-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-semibold">
                {isArabic ? "لا توجد كورسات لعرضها" : "No courses to show yet"}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {isArabic
                  ? "عندما تتوفر الكورسات في حسابك، ستظهر هنا."
                  : "Your enrolled courses will appear here when available."}
              </p>
              <Button asChild className="mt-5 rounded-xl">
                <Link href={coursesPath}>
                  {isArabic ? "الذهاب إلى الكورسات" : "Go to courses"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course: any, index: number) => {
              const percentage = Math.min(
                100,
                Math.max(0, Number(course.percentage ?? 0)),
              );

              return (
                <Card
                  key={course.id}
                  className="group overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04]"
                >
                  <Link
                    href={`/${locale}/student/courses/${course.id}`}
                    className="block"
                    aria-label={
                      isArabic
                        ? `فتح كورس ${course.title}`
                        : `Open course ${course.title}`
                    }
                  >
                    {/* Course thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden border-b border-border/60 bg-muted">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm">
                            <BookOpen className="size-7" strokeWidth={1.5} />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />

                      <span className="absolute bottom-3 start-3 rounded-lg border border-white/20 bg-black/45 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                        {isArabic ? `كورس ${index + 1}` : `COURSE ${String(index + 1).padStart(2, "0")}`}
                      </span>

                      {percentage >= 100 && (
                        <Badge className="absolute end-3 top-3 gap-1 rounded-lg border-0 bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
                          <CheckCircle2 className="size-3.5 text-primary" />
                          {isArabic ? "مكتمل" : "Completed"}
                        </Badge>
                      )}
                    </div>
                  </Link>

                  <CardContent className="space-y-5 p-5">
                    <div className="min-h-20">
                      <Link
                        href={`/${locale}/student/courses/${course.id}`}
                        className="line-clamp-2 text-base font-semibold leading-6 transition-colors hover:text-primary"
                      >
                        {course.title}
                      </Link>

                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        <GraduationCap className="me-1.5 inline size-3.5 align-text-bottom" />
                        {course.instructor ||
                          (isArabic ? "هيئة التدريس" : "Course instructor")}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground">
                          {isArabic ? "التقدم في الكورس" : "Course progress"}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      <Progress value={percentage} className="h-1.5" />

                      <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5" />
                          {course.completedLessons ?? 0}/
                          {course.totalLessons ?? 0} {t("Course.lessons")}
                        </span>

                        <span className="inline-flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-[-2px]">
                          {isArabic ? "فتح الكورس" : "Open course"}
                          <DirectionArrow className="size-3.5" />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  index,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
  note: string;
  index: string;
}) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm transition-colors hover:border-primary/30">
      <CardContent className="relative flex items-start gap-4 p-5 sm:p-6">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium leading-5 text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
            {note}
          </p>
        </div>

        <span className="text-[10px] font-medium tabular-nums text-muted-foreground/50">
          {index}
        </span>
      </CardContent>
    </Card>
  );
}
