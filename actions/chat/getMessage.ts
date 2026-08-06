"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface GetMessagesProps {
  chatId: string;
}

export async function getMessages({ chatId }: GetMessagesProps) {
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
        id: true,
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

    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      success: true,
      data: messages,
    };
  } catch (error) {
    console.error("Get Messages Error:", error);

    return {
      success: false,
      message: "Failed to get messages.",
    };
  }
}