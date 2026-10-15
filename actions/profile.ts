
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().trim().toLowerCase(),
  image: z.union([z.url(), z.literal("")]),
});

export async function updateUser(data: {
  name: string;
  email: string;
  image: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updateProfileSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid profile data");
  }

  const { name, email, image } = parsed.data;

  // Prevent assigning an email address already used by another account.
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser && existingUser.id !== session.user.id) {
    throw new Error("Email already in use");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      email,
      image: image || null,
    },
  });

  revalidatePath("/profile");

  return { success: true };
}

export async function becomeAsTeacher(userId: string) {
  const session = await auth();

  if (!session?.user?.id || session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "STUDENT") {
    throw new Error("Only students can request this action");
  }

  // Keep this direct role change only if your intended workflow
  // allows students to become teachers immediately.
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "TEACHER" },
  });

  revalidatePath("/profile");

  return { success: true };
}
