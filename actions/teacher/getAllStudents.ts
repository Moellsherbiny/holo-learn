"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getAllStudents() {
  const session = await auth();

  if (!session?.user?.id) return [];

  const teacherId = session.user.id;

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      enrollments: {
        some: {
          course: {
            teacherId,
          },
        },
      },
    },

    include: {
      enrollments: {
        where: {
          course: {
            teacherId,
          },
        },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lessons: true,
                },
              },
            },
          },
        },
      },

      progress: {
        where: {
          completed: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });

  return students.map((student) => {
    const totalLessons = student.enrollments.reduce((acc, enrollment) => {
      return (
        acc +
        enrollment.course.modules.reduce((mAcc, module) => {
          return mAcc + module.lessons.length;
        }, 0)
      );
    }, 0);

    const completedLessons = student.progress.length;

    const progress =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

    if (progress === 0) {
      status = "NOT_STARTED";
    } else if (progress === 100) {
      status = "COMPLETED";
    } else {
      status = "IN_PROGRESS";
    }

    return {
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,

      progress,

      completedLessons,

      totalLessons,

      status,

      enrollments: student.enrollments.map((e) => ({
        id: e.course.id,
        title: e.course.title,
      })),
    };
  });
}