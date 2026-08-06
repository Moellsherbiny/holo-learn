"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/client";

interface CreateChatProps {
  receiverId: string;
}

export async function createChat({ receiverId }: CreateChatProps) {
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

    const teacherId =
      currentUser.role === UserRole.TEACHER
        ? currentUser.id
        : receiverId;

    const studentId =
      currentUser.role === UserRole.STUDENT
        ? currentUser.id
        : receiverId;

    const existingChat = await prisma.chat.findUnique({
      where: {
        teacherId_studentId: {
          teacherId,
          studentId,
        },
      },
    });

    if (existingChat) {
      return {
        success: true,
        chat: existingChat,
      };
    }

    const chat = await prisma.chat.create({
      data: {
        teacherId,
        studentId,
      },
    });

    return {
      success: true,
      chat,
    };
  } catch (error) {
    console.error("Create Chat Error:", error);

    return {
      success: false,
      message: "Failed to create chat.",
    };
  }
}