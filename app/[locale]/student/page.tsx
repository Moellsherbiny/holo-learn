"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowRight,
  PlayCircle,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudentDashboardData } from "@/actions/student/dashboard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function StudentDashboard() {
  const t = useTranslations("Student");
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      try {
        const dashboardData = await getStudentDashboardData(session.user.id);
        setData(dashboardData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session?.user?.id]);

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!data) return <div>No data found.</div>;

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <header className="relative overflow-hidden rounded-3xl bg-zinc-900 p-8 text-white shadow-xl dark:bg-white dark:text-black">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              {t("title")}, {session?.user?.name?.split(" ")[0]}! 👋
            </h2>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md dark:bg-black/10 dark:text-black">
                {data.userLevel}
              </Badge>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
                {data.latestLesson
                  ? "Ready to pick up where you left off?"
                  : "Start your first course today!"}
              </p>
            </div>
          </div>
          {data.latestLesson && (
            <Button
              size="lg"
              className="bg-primary text-primary-foreground rounded-full px-8 font-bold shadow-lg shadow-primary/25"
            >
              {t("continueLearning")}
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Progress Card */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              {t("continueLearning")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {data.latestLesson ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Current Lesson
                    </span>
                    <h3 className="font-bold text-xl leading-none">
                      {data.latestLesson.title}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {data.latestLesson.courseTitle} •{" "}
                      {data.latestLesson.moduleTitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                      {data.latestLesson.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Progress
                    value={data.latestLesson.percentage}
                    className="h-3 rounded-full bg-zinc-100 dark:bg-zinc-800"
                  />
                </div>

                <Button className="w-full h-12 rounded-xl group bg-zinc-900 dark:bg-white dark:text-black hover:opacity-90">
                  Resume Now
                  <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
                </Button>
              </>
            ) : (
              <div className="text-center py-10 text-zinc-500">
                You haven't started any lessons yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Sidebar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center">
            <Clock className="h-5 w-5 text-blue-500 mb-3" />
            <div className="text-2xl font-black">
              {data.stats.totalLessonsCompleted}
            </div>
            <div className="text-[11px] uppercase text-zinc-400 font-bold tracking-widest mt-1">
              Lessons Completed
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-center">
            <Star className="h-5 w-5 text-purple-500 mb-3" />
            <div className="text-2xl font-black">
              {data.stats.completedCourses}
            </div>
            <div className="text-[11px] uppercase text-zinc-400 font-bold tracking-widest mt-1">
              Completed Courses
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black tracking-tight">
            {t("enrolledCourses")}
          </h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.courses.map((course: any) => (
            <Card
              key={course.id}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-none bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-10 w-10 text-zinc-300 group-hover:scale-110 transition-transform" />
                  </div>
                )}
              </div>
              <CardContent className="p-5">
                <Link
                  href={`/student/courses/${course.id}`}
                >
                  <h4 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h4>
                </Link>
                <p className="text-sm text-zinc-500 mb-5">
                  Instructor: {course.instructor}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase">
                    <PlayCircle size={14} />
                    {course.completedLessons}/{course.totalLessons}{" "}
                    {t("Course.lessons")}
                  </div>
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold"
                  >
                    {course.percentage.toFixed(0)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
