"use server";

import { auth } from "@/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
interface SendMessageProps {
  chatId: string;
  content: string;
}

export type ChatMessage = Prisma.MessageGetPayload<{
  include: {
    sender: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
  };
}>;
export async function sendMessage({
  chatId,
  content,
}: SendMessageProps): Promise<ChatMessage> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized.");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error("Message cannot be empty.");
  }

  if (trimmedContent.length > 2000) {
    throw new Error("Message is too long.");
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
    throw new Error("Chat not found.");
  }

  // Ensure the current user belongs to this chat
  if (
    chat.teacherId !== session.user.id &&
    chat.studentId !== session.user.id
  ) {
    throw new Error("Unauthorized.");
  }

  try {
    const message = await prisma.$transaction(async (tx) => {
      const createdMessage = await tx.message.create({
        data: {
          chatId,
          senderId: session.user.id,
          content: trimmedContent,
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
      });

      await tx.chat.update({
        where: { id: chatId },
        data: {
          lastMessageAt: createdMessage.createdAt,
        },
      });
      revalidatePath(`/chat/${chatId}`);
      return createdMessage;
    });
    return message;
  } catch (error) {
    console.error("Send Message Error:", error);
    throw new Error("Failed to send message.");
  }
}
