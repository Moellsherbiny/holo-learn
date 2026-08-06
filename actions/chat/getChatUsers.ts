"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/client";

export async function getChatUsers() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!currentUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const targetRole =
      currentUser.role === UserRole.TEACHER
        ? UserRole.STUDENT
        : UserRole.TEACHER;

    const users = await prisma.user.findMany({
      where: {
        role: targetRole,
        id: {
          not: currentUser.id,
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        level: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: users,
    };
  } catch (error) {
    console.error("Get Chat Users Error:", error);

    return {
      success: false,
      message: "Failed to load users.",
    };
  }
}