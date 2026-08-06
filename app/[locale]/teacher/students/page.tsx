"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Search,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

import { getAllStudents } from "@/actions/teacher/getAllStudents";
import { TableCell } from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from "@/components/ui/table";

type Student = {
  id: string;
  name: string;
  email: string;
  image?: string;

  progress: number;

  completedLessons: number;
  totalLessons: number;

  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

  enrollments: {
    id: string;
    title: string;
  }[];
};

export default function StudentsPageClient() {
  const t = useTranslations("students");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    async function loadStudents() {
      try {
        const result = await getAllStudents();
        setStudents(result as Student[]);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();

      return (
        student.name?.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  const totalStudents = students.length;

  const totalEnrollments = students.reduce(
    (acc, student) => acc + student.enrollments.length,
    0,
  );

  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((acc, s) => acc + s.progress, 0) / students.length,
        )
      : 0;

  const completedStudents = students.filter((s) => s.progress === 100).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Header */}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      {/* Search */}

      <Card>
        <CardContent className="p-6">
          <div className="relative ">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table dir="rtl" className="overflow-auto">
              <TableHeader dir="rtl" className="text-right">
                <TableRow dir="rtl" className="text-right">
                  <TableHead className="text-right">الطلاب</TableHead>

                  <TableHead className="text-right">المسجل به</TableHead>

                  <TableHead className="w-55 text-right">التقدم</TableHead>

                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading &&
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <td colSpan={4} className="p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />

                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-64" />
                          </div>

                          <Skeleton className="h-8 w-32" />
                          <Skeleton className="h-8 w-28" />
                        </div>
                      </td>
                    </TableRow>
                  ))}

                {!loading &&
                  filteredStudents.map((student) => {
                    const statusColor =
                      student.status === "COMPLETED"
                        ? "default"
                        : student.status === "IN_PROGRESS"
                          ? "secondary"
                          : "outline";

                    return (
                      <TableRow
                        key={student.id}
                        className="hover:bg-muted/40 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {student.name?.charAt(0).toUpperCase() ?? "S"}
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium leading-none">
                                {student.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {student.enrollments.length > 0 ? (
                              <>
                                {student.enrollments
                                  .slice(0, 2)
                                  .map((course) => (
                                    <Badge key={course.id} variant="secondary">
                                      {course.title}
                                    </Badge>
                                  ))}

                                {student.enrollments.length > 2 && (
                                  <Badge variant="outline">
                                    +{student.enrollments.length - 2}
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No Courses
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>
                                {student.completedLessons}/
                                {student.totalLessons} lessons
                              </span>

                              <span className="font-semibold">
                                {student.progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary transition-all duration-700"
                                style={{
                                  width: `${student.progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant={statusColor}>
                            {student.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          {!loading && filteredStudents.length === 0 && (
            <div className="py-20">
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>{t("noStudents")}</EmptyTitle>

                  <EmptyDescription>
                    {t("noStudentsDescription")}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
