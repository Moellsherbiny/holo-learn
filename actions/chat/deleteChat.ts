"use server";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {auth} from "@/auth";

export async function deleteChat(chatId: string): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) 
    throw new Error("Unauthorized.");

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
    throw new Error("Chat not found.");
  }

  if (chat.teacherId !== session.user.id && chat.studentId !== session.user.id) {
    throw new Error("Unauthorized.");
  }

  await prisma.chat.delete({
    where: {
      id: chatId,
    },
  });

  revalidatePath("/chat");
}