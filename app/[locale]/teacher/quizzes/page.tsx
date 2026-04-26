import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { QuizClient } from "@/components/quizzes/teacher/quiz-client";

export default async function TeacherQuizzesPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const quizzes = await prisma.quiz.findMany({
    where: {
      course: {
        teacherId: session.user.id,
      },
    },
    include: {
      course: true,
      questions: true,
      quizAttempts: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
   const courses = await prisma.course.findMany({
    where: {
      teacherId: session.user.id,
    },
    select: {
      id: true,
      title: true,
    },
    orderBy: {
      title: "asc",
    },
  });
  const stats = {
    totalQuizzes: quizzes.length,
    totalQuestions: quizzes.reduce(
      (sum, quiz) => sum + quiz.questions.length,
      0
    ),
    totalAttempts: quizzes.reduce(
      (sum, quiz) => sum + quiz.quizAttempts.length,
      0
    ),
  };

  return <QuizClient quizzes={quizzes} courses={courses} stats={stats} />;
}