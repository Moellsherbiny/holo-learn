"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function requireTeacher() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user.id;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function createCourse(data: {
  title: string;
  description?: string;
  thumbnail?: string;
}) {
  const teacherId = await requireTeacher();
  const course = await prisma.course.create({
    data: { ...data, teacherId },
  });
  revalidatePath("/teacher/courses");
  return course;
}

export async function updateCourse(
  id: string,
  data: { title?: string; description?: string; thumbnail?: string }
) {
  await requireTeacher();
  const course = await prisma.course.update({ where: { id }, data });
  revalidatePath("/teacher/courses");
  revalidatePath(`/teacher/courses/${id}`);
  return course;
}

export async function deleteCourse(id: string) {
  await requireTeacher();
  await prisma.course.delete({ where: { id } });
  revalidatePath("/teacher/courses");
}

export async function getTeacherCourses() {
  const teacherId = await requireTeacher();
  return prisma.course.findMany({
    where: { teacherId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { modules: true, enrollments: true } },
    },
  });
}

export async function getCourseDetail(courseId: string) {
  const teacherId = await requireTeacher();
  return prisma.course.findFirst({
    where: { id: courseId, teacherId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: { orderBy: { order: "asc" } },
        },
      },
    },
  });
}

// ─── Modules ──────────────────────────────────────────────────────────────────

export async function createModule(data: {
  courseId: string;
  title: string;
  description?: string;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  order: number;
}) {
  await requireTeacher();
  const mod = await prisma.module.create({ data });
  revalidatePath(`/teacher/courses/${data.courseId}`);
  return mod;
}

export async function updateModule(
  id: string,
  courseId: string,
  data: {
    title?: string;
    description?: string;
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
    order?: number;
  }
) {
  await requireTeacher();
  const mod = await prisma.module.update({ where: { id }, data });
  revalidatePath(`/teacher/courses/${courseId}`);
  return mod;
}

export async function deleteModule(id: string, courseId: string) {
  await requireTeacher();
  await prisma.module.delete({ where: { id } });
  revalidatePath(`/teacher/courses/${courseId}`);
}

export async function reorderModules(
  courseId: string,
  items: { id: string; order: number }[]
) {
  await requireTeacher();
  await Promise.all(
    items.map((item) =>
      prisma.module.update({ where: { id: item.id }, data: { order: item.order } })
    )
  );
  revalidatePath(`/teacher/courses/${courseId}`);
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function createLesson(data: {
  moduleId: string;
  courseId: string;
  title: string;
  type: "VIDEO" | "TEXT" | "MATERIAL" | "AR_MODEL";
  content?: string;
  videoUrl?: string;
  materialUrl?: string;
  arModelUrl?: string;
  transcript?: string;
  order: number;
}) {
  await requireTeacher();
  const { courseId, ...lessonData } = data;
  const lesson = await prisma.lesson.create({ data: lessonData });
  revalidatePath(`/teacher/courses/${courseId}`);
  return lesson;
}

export async function updateLesson(
  id: string,
  courseId: string,
  data: {
    title?: string;
    type?: "VIDEO" | "TEXT" | "MATERIAL" | "AR_MODEL";
    content?: string;
    videoUrl?: string;
    materialUrl?: string;
    arModelUrl?: string;
    transcript?: string;
    order?: number;
  }
) {
  await requireTeacher();
  const lesson = await prisma.lesson.update({ where: { id }, data });
  revalidatePath(`/teacher/courses/${courseId}`);
  return lesson;
}

export async function deleteLesson(id: string, courseId: string) {
  await requireTeacher();
  await prisma.lesson.delete({ where: { id } });
  revalidatePath(`/teacher/courses/${courseId}`);
}

export async function reorderLessons(
  moduleId: string,
  courseId: string,
  items: { id: string; order: number }[]
) {
  await requireTeacher();
  await Promise.all(
    items.map((item) =>
      prisma.lesson.update({ where: { id: item.id }, data: { order: item.order } })
    )
  );
  revalidatePath(`/teacher/courses/${courseId}`);
}

 
// ─── Get teacher courses (simple list for LP form) ───────────────────────────
export async function getTeacherCoursesSimple() {
  const teacherId = await requireTeacher();
  return prisma.course.findMany({
    where: { teacherId },
    orderBy: { title: "asc" },
    select: { id: true, title: true, thumbnail: true },
  });
}

 