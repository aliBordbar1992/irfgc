import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id: params.threadId },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Toggle lock status
    const updatedThread = await prisma.forumThread.update({
      where: { id: params.threadId },
      data: {
        isLocked: !thread.isLocked,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
        game: {
          select: { slug: true, fullName: true },
        },
      },
    });

    return NextResponse.json({
      data: updatedThread,
      message: `Thread ${
        updatedThread.isLocked ? "locked" : "unlocked"
      } successfully`,
    });
  } catch (error) {
    console.error("Error locking thread:", error);
    return NextResponse.json(
      { error: "Failed to lock thread" },
      { status: 500 }
    );
  }
}
