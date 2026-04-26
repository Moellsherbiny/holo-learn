"use server";

import { prisma } from "@/lib/prisma"; 

export async function getStudentDashboardData(userId: string) {
  try {
    // 1. Get User Level and Profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, name: true }
    });

    // 2. Get Enrolled Courses with Progress
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: userId },
      include: {
        course: {
          include: {
            teacher: { select: { name: true } },
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: { studentId: userId }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    const courses = enrollments.map((enrollment) => {
      const allLessons = enrollment.course.modules.flatMap(m => m.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter(l => l.progress[0]?.completed).length;
      const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

      return {
        id: enrollment.course.id,
        title: enrollment.course.title,
        instructor: enrollment.course.teacher.name,
        thumbnail: enrollment.course.thumbnail,
        totalLessons,
        completedLessons,
        percentage
      };
    });

    // 3. Get the "Latest" Lesson (Last updated progress)
    const latestProgressRecord = await prisma.progress.findFirst({
      where: { studentId: userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        lesson: {
          include: {
            module: {
              include: { course: true }
            }
          }
        }
      }
    });

    // 4. Global Stats
    const completedCoursesCount = courses.filter(c => c.percentage === 100).length;

    return {
      userLevel: user?.level || "BEGINNER",
      courses,
      stats: {
        completedCourses: completedCoursesCount,
        // Since watchTime isn't in your schema, we'll use lessons completed as a proxy or 0
        totalLessonsCompleted: courses.reduce((acc, c) => acc + c.completedLessons, 0)
      },
      latestLesson: latestProgressRecord ? {
        title: latestProgressRecord.lesson.title,
        moduleTitle: latestProgressRecord.lesson.module.title,
        courseTitle: latestProgressRecord.lesson.module.course.title,
        percentage: courses.find(c => c.id === latestProgressRecord.lesson.module.courseId)?.percentage || 0
      } : null
    };

  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}