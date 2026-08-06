"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma as db } from "@/lib/prisma";
import type { ActionResult, StudyPageData } from "@/types/study";

type StudyPageError = {
  preQuiz?: {
    id: string;
    title: string;
  };
};

type StudyPageResult =
  | {
      success: true;
      data: StudyPageData;
    }
  | {
      success: false;
      error: string;
      preQuiz?: undefined;
    }
  | {
      success: false;
      error: "PRE_QUIZ_REQUIRED";
      preQuiz: {
        id: string;
        title: string;
      };
    };
// ─── Fetch full course study data ────────────────────────────────────────────

export async function getStudyPageData(
  courseId: string,
  lessonId?: string,
): Promise<StudyPageResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const studentId = session.user.id;

    // Verify enrollment
    const enrollment = await db.enrollment.findUnique({
      where: { courseId_studentId: { courseId, studentId } },
    });

    if (!enrollment) {
      return { success: false, error: "You are not enrolled in this course." };
    }

    // Check if the course has a pre-quiz
    const preQuiz = await db.quiz.findFirst({
      where: {
        courseId,
        quizType: "PREQUIZ",
      },
      select: {
        id: true,
        title: true,
      },
    });
    if (preQuiz) {
      const attempt = await db.quizAttempt.findFirst({
        where: {
          quizId: preQuiz.id,
          studentId,
        },
        select: {
          id: true,
        },
      });

      if (!attempt) {
        return {
          success: false,
          error: "PRE_QUIZ_REQUIRED",
          preQuiz,
        };
      }
    }
    // Fetch course with modules & lessons
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: { select: { id: true, name: true, email: true, image: true } },
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              include: {
                progress: {
                  where: { studentId },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      return { success: false, error: "Course not found." };
    }

    // Build flat lesson list with progress
    const allLessonsFlat = course.modules.flatMap((m) =>
      m.lessons.map((l) => ({
        ...l,
        isCompleted: l.progress.some((p) => p.completed),
      })),
    );

    const totalLessons = allLessonsFlat.length;
    const completedLessons = allLessonsFlat.filter((l) => l.isCompleted).length;
    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    // Build modules with progress
    const modulesWithProgress = course.modules.map((m) => {
      const lessons = m.lessons.map((l) => ({
        ...l,
        isCompleted: l.progress.some((p) => p.completed),
      }));
      return {
        ...m,
        lessons,
        completedCount: lessons.filter((l) => l.isCompleted).length,
        totalCount: lessons.length,
      };
    });

    // Determine current lesson
    const targetLessonId =
      lessonId ??
      allLessonsFlat.find((l) => !l.isCompleted)?.id ??
      allLessonsFlat[0]?.id;

    const currentLessonFlat =
      allLessonsFlat.find((l) => l.id === targetLessonId) ?? null;

    const currentModuleWithProgress = currentLessonFlat
      ? (modulesWithProgress.find((m) =>
          m.lessons.some((l) => l.id === currentLessonFlat.id),
        ) ?? null)
      : null;

    const currentIndex = allLessonsFlat.findIndex(
      (l) => l.id === targetLessonId,
    );
    const prevLesson =
      currentIndex > 0 ? allLessonsFlat[currentIndex - 1] : null;
    const nextLesson =
      currentIndex < allLessonsFlat.length - 1
        ? allLessonsFlat[currentIndex + 1]
        : null;

    return {
      success: true,
      data: {
        course: {
          ...course,
          totalLessons,
          completedLessons,
          progressPercent,
        },
        modules: modulesWithProgress,
        currentLesson: currentLessonFlat,
        currentModule: currentModuleWithProgress,
        nextLesson: nextLesson ?? null,
        prevLesson: prevLesson ?? null,
      },
    };
  } catch (error) {
    console.error("[getStudyPageData]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ─── Mark lesson complete / incomplete ───────────────────────────────────────

export async function toggleLessonProgress(
  lessonId: string,
  courseId: string,
  completed: boolean,
): Promise<
  ActionResult<{
    completed: boolean;
    courseCompleted: boolean;
    postQuizId?: string;
  }>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const studentId = session.user.id;

    // Verify the lesson belongs to the course
    const lesson = await db.lesson.findFirst({
      where: {
        id: lessonId,
        module: { courseId },
      },
    });

    if (!lesson) {
      return { success: false, error: "Lesson not found." };
    }

    const progress = await db.progress.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      update: { completed },
      create: { studentId, lessonId, completed },
    });

    const totalLessons = await db.lesson.count({
      where: {
        module: {
          courseId,
        },
      },
    });

    const completedLessons = await db.progress.count({
      where: {
        studentId,
        completed: true,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    const courseCompleted =
      totalLessons > 0 && completedLessons === totalLessons;

    let postQuizId: string | undefined;

    if (courseCompleted) {
      const postQuiz = await db.quiz.findFirst({
        where: {
          courseId,
          quizType: "POSTQUIZ",
        },
        select: {
          id: true,
        },
      });

      postQuizId = postQuiz?.id;
    }
    revalidatePath(`/courses/${courseId}/study`);
    revalidatePath(`/courses/${courseId}/study/${lessonId}`);

    return {
      success: true,
      data: {
        completed: progress.completed,
        courseCompleted,
        postQuizId,
      },
    };
  } catch (error) {
    console.error("[toggleLessonProgress]", error);
    return { success: false, error: "Failed to update progress." };
  }
}
