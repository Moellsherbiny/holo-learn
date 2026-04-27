
import {prisma} from "@/lib/prisma";
import { notFound } from "next/navigation";
import ModernCourseClient from "@/components/course/CourseView";
import { auth } from "@/auth";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string; locale: string }> }) {
  const { courseId, locale } = await params;
  const session = await auth();  
  const userId = session?.user?.id; 

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      teacher: true,
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: { 
            orderBy: { order: 'asc' },
            include: { progress: { where: { studentId: userId } } }
          }
        }
      }
    }
  });

  if (!course) notFound();

const courseData = {
  ...course,
  modules: course.modules.map((m) => ({
    ...m,
    lessons: m.lessons.map((l) => ({
      ...l,
      type: String(l.type),
      arModelUrl: l.arModelUrl ?? null,
      videoUrl: l.videoUrl ?? null,
      materialUrl: l.materialUrl ?? null,
      isCompleted:
        l.progress.length > 0 &&
        l.progress[0].completed,
    })),
  })),
};

  return <ModernCourseClient course={courseData} locale={locale} userId={userId} />;
}