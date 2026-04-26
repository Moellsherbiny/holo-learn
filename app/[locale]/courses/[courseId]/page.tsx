import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CourseDetailClient from "@/components/course/course-page-client";
import { getLocale } from "next-intl/server";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await auth();
  const locale = await getLocale();
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: { select: { id: true, name: true, image: true, email: true } },
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              progress: session?.user?.id
                ? { where: { studentId: session.user.id } }
                : false,
            },
          },
        },
      },
      _count: { select: { enrollments: true } },
      enrollments: session?.user?.id
        ? { where: { studentId: session.user.id }, select: { id: true } }
        : false,
    },
  });

  if (!course) notFound();

  const isEnrolled = Array.isArray(course.enrollments) && course.enrollments.length > 0;

  const serialized = {
    id: course.id,
    title: course.title,
    description: course.description ?? null,
    thumbnail: course.thumbnail ?? null,
    teacherName: course.teacher.name ?? "Unknown",
    teacherImage: course.teacher.image ?? null,
    teacherEmail: course.teacher.email ?? null,
    enrollmentCount: course._count.enrollments,
    isEnrolled,
    createdAt: course.createdAt.toISOString(),
    modules: course.modules.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description ?? null,
      level: m.level,
      order: m.order,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        type: l.type,
        order: l.order,
        completed:
          Array.isArray(l.progress) && l.progress.some((p) => p.completed),
      })),
    })),
  };

  return (
    <CourseDetailClient
      course={serialized}
      userId={session?.user?.id ?? null}
      locale={locale}
    />
  );
}