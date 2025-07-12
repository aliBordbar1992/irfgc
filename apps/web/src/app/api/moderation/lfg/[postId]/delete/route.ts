import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.lFGPost.findUnique({
      where: { id: params.postId },
    });

    if (!post) {
      return NextResponse.json(
        { error: "LFG post not found" },
        { status: 404 }
      );
    }

    // Delete the post
    await prisma.lFGPost.delete({
      where: { id: params.postId },
    });

    return NextResponse.json({
      message: "LFG post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting LFG post:", error);
    return NextResponse.json(
      { error: "Failed to delete LFG post" },
      { status: 500 }
    );
  }
}
