"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Plus, 
  ArrowUpRight, 
  GraduationCap,
  Settings2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getTeacherDashboardData } from "@/actions/teacher/teacherDashboard";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function TeacherDashboard() {
  const t = useTranslations("Teacher");
  const common = useTranslations("Common");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    avgQuizScore: 0,
    courses: [] as any[],
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await getTeacherDashboardData({
          userId: session.user.id,
        });
        setStats({
          totalStudents: data.totalstudents,
          activeCourses: data.activeCourses,
          avgQuizScore: data.avgQuizScore,
          courses: data.courses,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [session?.user?.id]);

  const statCards = [
    {
      title: t("totalStudents"),
      value: stats.totalStudents,
      icon: Users,
      color: "text-blue-600",
      border: "border-b-blue-500",
      description: isRTL ? "إجمالي المنضمين" : "Total enrollments",
    },
    {
      title: t("activeCourses"),
      value: stats.activeCourses,
      icon: BookOpen,
      color: "text-emerald-600",
      border: "border-b-emerald-500",
      description: isRTL ? "مناهجك المنشورة" : "Published curricula",
    },
    {
      title: t("avgQuizScore"),
      value: `${stats.avgQuizScore.toFixed(1)}%`,
      icon: BarChart3,
      color: "text-amber-600",
      border: "border-b-amber-500",
      description: isRTL ? "أداء الطلاب" : "Student performance",
    },
  ];

  return (
    <div className="space-y-10 pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* Dynamic Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b pb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            {isRTL ? "مرحباً بك مجدداً في لوحة التحكم الخاصة بك." : "Welcome back to your teaching command center."}
          </p>
        </div>
        <Button 
          size="lg"
          className="w-full md:w-auto rounded-xl h-12 px-6 bg-zinc-900 dark:bg-white dark:text-black hover:opacity-90 shadow-xl shadow-zinc-200 dark:shadow-none transition-all active:scale-95 gap-2" 
          asChild
        >
          <Link href="/teacher/courses/new">
            <Plus className="h-5 w-5" /> {t("createCourse")}
          </Link>
        </Button>
      </div>

      {/* Stats Cards with Bottom Accent Borders */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className={cn(
            "border-none bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden border-b-4",
            stat.border
          )}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                    {stat.title}
                  </p>
                  <div className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white">
                    {loading ? "..." : stat.value}
                  </div>
                </div>
                <div className={cn("p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-[12px] text-zinc-400 font-medium">
                <ArrowUpRight className="h-3 w-3 me-1 text-emerald-500" />
                {stat.description}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modernized Courses Section */}
      <Card className="border-none shadow-sm bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">{t("myCourses")}</CardTitle>
            <CardDescription>Monitor enrollment and status of your classes</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold">
            {isRTL ? "عرض الكل" : "View All"}
          </Button>
        </CardHeader>
        <CardContent className="px-2 sm:px-6 pb-6">
          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-50/50 dark:bg-zinc-800/50">
                <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800">
                  <TableHead className="text-start h-12 font-bold text-zinc-900 dark:text-zinc-100">{t("courseTitle")}</TableHead>
                  <TableHead className="text-start h-12 font-bold text-zinc-900 dark:text-zinc-100">{t("students")}</TableHead>
                  <TableHead className="text-start h-12 font-bold text-zinc-900 dark:text-zinc-100">{t("status")}</TableHead>
                  <TableHead className="text-end h-12 font-bold text-zinc-900 dark:text-zinc-100">{common("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.courses.length > 0 ? (
                  stats.courses.map((course) => (
                    <TableRow key={course.id} className="group border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      <TableCell className="py-4 text-start font-bold text-zinc-700 dark:text-zinc-300">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-zinc-400" />
                          </div>
                          {course.title}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-start">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-zinc-400" />
                          <span className="font-medium">{course._count.enrollments}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 text-start">
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-none px-3 py-1 font-bold">
                          {isRTL ? "نشط" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-end">
                        <Button variant="ghost" asChild size="sm" className="rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
                          <Link href={`/teacher/courses/${course.id}`} className="flex items-center gap-2">
                            <Settings2 className="h-4 w-4" />
                            <span className="hidden sm:inline">{common("manage")}</span>
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center text-zinc-400">
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="h-8 w-8 opacity-20" />
                        <p className="font-medium">{loading ? "..." : common("noData")}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}