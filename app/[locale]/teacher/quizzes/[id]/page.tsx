import { auth } from "@/auth";
import QuizManager from "@/components/quizzes/teacher/quiz-details";
import { prisma } from "@/lib/prisma";
import { Check } from "lucide-react";
import { notFound, redirect } from "next/navigation";
export default async function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

 const quiz = await prisma.quiz.findUnique({
    where: { id: resolvedParams.id },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
if (!quiz) notFound();
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">إدارة الاختبار: {quiz.title}</h1>
        <p className="text-muted-foreground">تعديل الأسئلة والخيارات الحالية</p>
      </div>

      
      <QuizManager quizId={quiz.id} initialData={quiz} />
    </div>
  );
}
