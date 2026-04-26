"use server";
import { prisma } from "@/lib/prisma";
import { CoursePageData } from "@/types/course";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCourseById(courseId: string) {
  return prisma.course.findUnique({
    where: { id: courseId },
  });
}

export async function getAllCourses() {
  return prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
        teacher: true,
      _count: {
        select: {
          enrollments: true,
          modules: true,
        },
      },
    },
  });
}

export async function getCoursePageData(
  courseId: string,
  currentUserId?: string,
): Promise<CoursePageData | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: {
        select: { id: true, name: true, image: true, email: true },
      },
      _count: {
        select: { enrollments: true },
      },
      modules: {
        orderBy: { createdAt: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
            include: {
              // only pull the current student's progress rows
              progress: currentUserId
                ? { where: { studentId: currentUserId }, select: { completed: true } }
                : false,
            },
          },
        },
      },
    },
  });

  if (!course) return null;

  const isEnrolled = currentUserId
    ? !!(await prisma.enrollment.findUnique({
        where: { courseId_studentId: { courseId, studentId: currentUserId } },
      }))
    : false;

  return { ...course, isEnrolled };
}



export async function enrollInCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Upsert-safe — @@unique([courseId, studentId]) prevents duplicates
  await prisma.enrollment.create({
    data: {
      courseId,
      studentId: session.user.id,
    },
  });

  revalidatePath(`/courses/${courseId}`);
  revalidatePath("/courses");
}

export async function markLessonComplete(lessonId: string, completed: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.progress.upsert({
    where: { studentId_lessonId: { studentId: session.user.id, lessonId } },
    update: { completed },
    create: { studentId: session.user.id, lessonId, completed },
  });

  revalidatePath(`/courses`);
}