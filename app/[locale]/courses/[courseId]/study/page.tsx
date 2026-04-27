import { redirect } from "next/navigation";
import { getStudyPageData } from "@/actions/study";

interface Props {
  params: Promise<{ courseId: string }>;
  searchParams: { lesson?: string };
}

export default async function StudyPage({ params, searchParams }: Props) {
  const { courseId } = await params;
  const lessonId = searchParams.lesson;

  const result = await getStudyPageData(courseId, lessonId);

  if (!result.success) {
    // You can render a dedicated error UI instead
    redirect(`/courses/${courseId}?error=${encodeURIComponent(result.error)}`);
  }

  const { currentLesson } = result.data;

  if (currentLesson) {
    redirect(
      `/courses/${courseId}/study/${currentLesson.id}`
    );
  }

  // No lessons in the course at all
  redirect(`/courses/${courseId}`);
}