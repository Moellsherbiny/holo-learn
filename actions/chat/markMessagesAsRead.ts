"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface MarkMessagesAsReadProps {
  chatId: string;
}

export async function markMessagesAsRead({
  chatId,
}: MarkMessagesAsReadProps) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      select: {
        teacherId: true,
        studentId: true,
      },
    });

    if (!chat) {
      return {
        success: false,
        message: "Chat not found.",
      };
    }

    // Ensure the current user belongs to this chat
    if (
      chat.teacherId !== session.user.id &&
      chat.studentId !== session.user.id
    ) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const { count } = await prisma.message.updateMany({
      where: {
        chatId,
        senderId: {
          not: session.user.id,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      success: true,
      updatedCount: count,
    };
  } catch (error) {
    console.error("Mark Messages As Read Error:", error);

    return {
      success: false,
      message: "Failed to mark messages as read.",
    };
  }
}