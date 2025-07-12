import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
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
      include: {
        replies: true,
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Delete thread and all replies (cascade)
    await prisma.forumThread.delete({
      where: { id: params.threadId },
    });

    return NextResponse.json({
      message: "Thread deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting thread:", error);
    return NextResponse.json(
      { error: "Failed to delete thread" },
      { status: 500 }
    );
  }
}
