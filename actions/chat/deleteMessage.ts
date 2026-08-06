"use server";

import {prisma} from "@/lib/prisma";
import {auth} from "@/auth";
interface DeleteMessageProps {
  messageId: string;
}

export async function deleteMessage({
  messageId,
  
}: DeleteMessageProps) {
  try {
    const message = await prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      return {
        success: false,
        message: "Message not found.",
      };
    }
    
   const session = await auth();

if (!session?.user?.id) {
  return {
    success: false,
    message: "Unauthorized.",
  };
}

if (message.senderId !== session.user.id) {
  return {
    success: false,
    message: "Unauthorized.",
  };
}

    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });

    return {
      success: true,
      message: "Message deleted successfully.",
    };
  } catch (error) {
    console.error("Delete Message Error:", error);

    return {
      success: false,
      message: "Failed to delete message.",
    };
  }
}