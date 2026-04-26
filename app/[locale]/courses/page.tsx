
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CoursesClient from "@/components/course/CourseClient";

export default async function CoursesPage() {
  const session = await auth();

  // Fetch all courses with teacher info and enrollment/module counts
  const courses = await prisma.course.findMany({
    include: {
      teacher: { select: { id: true, name: true, image: true } },
      _count: {
        select: { enrollments: true, modules: true },
      },
      // If user is logged in, check if they're enrolled
      enrollments: session?.user?.id
        ? { where: { studentId: session.user.id }, select: { id: true } }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  // Count completed lessons per course for enrolled user
  let progressMap: Record<string, { completed: number; total: number }> = {};

  if (session?.user?.id) {
    const progressData = await prisma.progress.findMany({
      where: { studentId: session.user.id },
      include: { lesson: { select: { moduleId: true, module: { select: { courseId: true } } } } },
    });

    const lessonCountPerCourse = await prisma.lesson.groupBy({
      by: ["moduleId"],
      _count: { id: true },
    });

    // Build total lessons per course
    const moduleToCount: Record<string, number> = {};
    lessonCountPerCourse.forEach((l) => {
      moduleToCount[l.moduleId] = l._count.id;
    });

    // Build progress map
    for (const p of progressData) {
      const courseId = p.lesson.module.courseId;
      if (!progressMap[courseId]) progressMap[courseId] = { completed: 0, total: 0 };
      if (p.completed) progressMap[courseId].completed++;
    }

    // Add total counts
    const modules = await prisma.module.findMany({ select: { id: true, courseId: true } });
    for (const m of modules) {
      if (!progressMap[m.courseId]) progressMap[m.courseId] = { completed: 0, total: 0 };
      progressMap[m.courseId].total += moduleToCount[m.id] ?? 0;
    }
  }

  // Serialize for client component
  const serialized = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description ?? null,
    thumbnail: c.thumbnail ?? null,
    teacherName: c.teacher.name ?? "Unknown",
    teacherImage: c.teacher.image ?? null,
    enrollmentCount: c._count.enrollments,
    moduleCount: c._count.modules,
    isEnrolled: Array.isArray(c.enrollments) && c.enrollments.length > 0,
    progress: progressMap[c.id] ?? null,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <CoursesClient
      courses={serialized}
      userId={session?.user?.id ?? null}
    />
  );
}