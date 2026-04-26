import { notFound } from "next/navigation";
import { getCourseDetail } from "@/actions/teacher/teacher";
import { EditCourseClient } from "@/components/teacher/edit-course-client";

export const dynamic = "force-dynamic";

export default async function EditCoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const [course] = await Promise.all([
    getCourseDetail(params.courseId),
  ]);

  if (!course) notFound();

  return (
    <EditCourseClient
      course={course}
    />
  );
}