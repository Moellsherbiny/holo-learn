
import { redirect } from "next/navigation";
import { getStudyPageData } from "@/actions/study";
import { StudySidebar } from "@/components/study/StudySidebar";
import { StudyHeader } from "@/components/study/StudyHeader";

interface Props {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}

export default async function StudyLayout({ children, params }: Props) {
  const { courseId } = await params;

  // We fetch without a specific lessonId here; sidebar only needs course + modules
  const result = await getStudyPageData(courseId);

  if (!result.success) {
    redirect(`/courses/${courseId}?error=${encodeURIComponent(result.error)}`);
  }

  const { course, modules } = result.data;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0F1117]">
      {/* Top bar */}
      <StudyHeader course={course} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — hidden on mobile, visible md+ */}
        <aside className="hidden md:flex w-80 lg:w-96 shrink-0 flex-col border-r border-white/5 overflow-y-auto bg-[#13151C]">
          <StudySidebar
            courseId={courseId}
            modules={modules}
            progressPercent={course.progressPercent}
            completedLessons={course.completedLessons}
            totalLessons={course.totalLessons}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}