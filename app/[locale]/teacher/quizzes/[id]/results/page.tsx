import { prisma } from "@/lib/prisma";

export default async function QuizResultsPage({
  params,
}: {
  params: { quizId: string };
}) {
  const attempts = await prisma.quizAttempt.findMany({
    where: {
      quizId: params.quizId,
    },
    include: {
      student: true,
    },
    orderBy: {
      score: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Results</h1>

      {attempts.map((attempt) => (
        <div
          key={attempt.id}
          className="rounded-xl border p-4 flex justify-between"
        >
          <span>{attempt.student.name}</span>
          <span>{attempt.score}%</span>
        </div>
      ))}
    </div>
  );
}