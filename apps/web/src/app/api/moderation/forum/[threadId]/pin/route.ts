import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await prisma.forumThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Toggle pin status
    const updatedThread = await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        isPinned: !thread.isPinned,
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
        updatedThread.isPinned ? "pinned" : "unpinned"
      } successfully`,
    });
  } catch (error) {
    console.error("Error pinning thread:", error);
    return NextResponse.json(
      { error: "Failed to pin thread" },
      { status: 500 }
    );
  }
}
