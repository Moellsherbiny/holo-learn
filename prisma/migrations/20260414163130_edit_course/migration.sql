/*
  Warnings:

  - You are about to drop the column `difficulty` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `Leaderboard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningPath` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningPathCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LearningPathProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PlacementTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('POSTQUIZ', 'PREQUIZ', 'NORMAL');

-- DropForeignKey
ALTER TABLE "Leaderboard" DROP CONSTRAINT "Leaderboard_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathCourse" DROP CONSTRAINT "LearningPathCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathCourse" DROP CONSTRAINT "LearningPathCourse_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathProgress" DROP CONSTRAINT "LearningPathProgress_learningPathId_fkey";

-- DropForeignKey
ALTER TABLE "LearningPathProgress" DROP CONSTRAINT "LearningPathProgress_studentId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_hostId_fkey";

-- DropForeignKey
ALTER TABLE "PlacementTest" DROP CONSTRAINT "PlacementTest_userId_fkey";

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "difficulty",
ADD COLUMN     "quizType" "QuizType" NOT NULL DEFAULT 'NORMAL';

-- DropTable
DROP TABLE "Leaderboard";

-- DropTable
DROP TABLE "LearningPath";

-- DropTable
DROP TABLE "LearningPathCourse";

-- DropTable
DROP TABLE "LearningPathProgress";

-- DropTable
DROP TABLE "Meeting";

-- DropTable
DROP TABLE "PlacementTest";

-- DropTable
DROP TABLE "Summary";

-- DropEnum
DROP TYPE "QuizDifficulty";
