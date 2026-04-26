"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const quizSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  quizType: z.enum(["NORMAL", "PREQUIZ", "POSTQUIZ"]),
});

const questionSchema = z.object({
  text: z.string().min(3),
  type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
});

export async function updateQuiz(
  quizId: string,
  data: unknown
) {
  const values = quizSchema.parse(data);

  await prisma.quiz.update({
    where: { id: quizId },
    data: values,
  });

  revalidatePath(`/teacher/quizzes/${quizId}`);
}

export async function createQuestion(
  quizId: string,
  data: unknown
) {
  const values = questionSchema.parse(data);

  await prisma.question.create({
    data: {
      ...values,
      quizId,
    },
  });

  revalidatePath(`/teacher/quizzes/${quizId}`);
}

export async function updateQuestion(
  quizId: string,
  questionId: string,
  data: unknown
) {
  const values = questionSchema.parse(data);

  await prisma.question.update({
    where: { id: questionId },
    data: values,
  });

  revalidatePath(`/teacher/quizzes/${quizId}`);
}

export async function deleteQuestion(
  quizId: string,
  questionId: string
) {
  await prisma.question.delete({
    where: { id: questionId },
  });

  revalidatePath(`/teacher/quizzes/${quizId}`);
}