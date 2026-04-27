// app/courses/[courseId]/study/[lessonId]/page.tsx
// Server Component — loads lesson data and renders correct viewer

import { notFound, redirect } from "next/navigation";
import { getStudyPageData } from "@/actions/study";
import { LessonView } from "@/components/study/LessonView";
import { LessonType } from "@/types/study";

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export async function generateMetadata({ params }: Props) {
    const resolvedParams  = await params;
  const result = await getStudyPageData(resolvedParams.courseId, resolvedParams.lessonId);
  if (!result.success || !result.data.currentLesson) {
    return { title: "Lesson" };
  }
  return {
    title: `${result.data.currentLesson.title} — ${result.data.course.title}`,
  };
}

export default async function LessonPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  const result = await getStudyPageData(courseId, lessonId);

  if (!result.success) {
    redirect(`/courses/${courseId}?error=${encodeURIComponent(result.error)}`);
  }

  const { currentLesson, currentModule, nextLesson, prevLesson, course, modules } =
    result.data;

  if (!currentLesson) {
    notFound();
  }

  return (
    <LessonView
      lesson={currentLesson}
      module={currentModule}
      course={course}
      modules={modules}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
    />
  );
}