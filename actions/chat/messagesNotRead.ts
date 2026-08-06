"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUnreadMessagesCount() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        count: 0,
      };
    }

    const unreadCount = await prisma.message.aggregate({
      _count: {
        id: true,
      },
      where: {
        readAt: null,
        senderId: {
          not: session.user.id,
        },
        chat: {
          OR: [
            {
              teacherId: session.user.id,
            },
            {
              studentId: session.user.id,
            },
          ],
        },
      },
    });

    return {
      success: true,
      count: unreadCount._count.id,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      count: 0,
    };
  }
}