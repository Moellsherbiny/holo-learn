import { getTranslations } from "next-intl/server";
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

  // Transform data for the client
  const courseData = {
    ...course,
    modules: course.modules.map(m => ({
      ...m,
      lessons: m.lessons.map(l => ({
        ...l,
        isCompleted: l.progress.length > 0 && l.progress[0].completed
      }))
    }))
  };

  return <ModernCourseClient course={courseData} locale={locale} userId={userId} />;
}