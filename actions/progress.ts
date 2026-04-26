"use server"

import { revalidatePath } from "next/cache";
import {prisma} from "@/lib/prisma";

export async function toggleLessonProgress(lessonId: string, studentId: string, isCompleted: boolean) {
  try {
    await prisma.progress.upsert({
      where: {
        studentId_lessonId: {
          studentId,
          lessonId,
        },
      },
      update: { completed: isCompleted },
      create: {
        studentId,
        lessonId,
        completed: isCompleted,
      },
    });

    revalidatePath("/[locale]/courses/[id]", "page");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update progress" };
  }
}