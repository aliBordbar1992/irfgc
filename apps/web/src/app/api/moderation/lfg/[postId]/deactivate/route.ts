import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
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

    // Deactivate the post
    const updatedPost = await prisma.lFGPost.update({
      where: { id: params.postId },
      data: {
        isActive: false,
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
      data: updatedPost,
      message: "LFG post deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating LFG post:", error);
    return NextResponse.json(
      { error: "Failed to deactivate LFG post" },
      { status: 500 }
    );
  }
}
