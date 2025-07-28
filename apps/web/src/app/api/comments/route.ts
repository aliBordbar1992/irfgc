import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment too long"),
  contentId: z.string().min(1, "Content ID is required"),
  contentType: z.enum([
    "FORUM_THREAD",
    "FORUM_REPLY",
    "LFG_POST",
    "NEWS_POST",
    "USER",
    "NEWS",
    "POST",
    "EVENT",
    "COMMENT",
  ]),
  parentId: z.string().optional(), // For replies
});

const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(1000, "Comment too long"),
});

export async function POST(request: NextRequest) {
  try {
    // Get user session - comments require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { content, contentId, contentType, parentId } =
      createCommentSchema.parse(body);

    // If this is a reply, validate the parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, contentId: true, contentType: true },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }

      // Ensure the parent comment is on the same content
      if (
        parentComment.contentId !== contentId ||
        parentComment.contentType !== contentType
      ) {
        return NextResponse.json(
          { error: "Parent comment must be on the same content" },
          { status: 400 }
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        contentId,
        contentType,
        authorId: session.user.id,
        parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        parent: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    // If this is a reply, create a notification for the parent comment author
    if (
      parentId &&
      comment.parent &&
      comment.parent.author.id !== session.user.id
    ) {
      try {
        await prisma.notification.create({
          data: {
            userId: comment.parent.author.id,
            type: "COMMENT_REPLY",
            title: "New Reply to Your Comment",
            message: `${session.user.name} replied to your comment`,
            contentId: contentId,
            contentType: contentType,
          },
        });
      } catch (error) {
        console.error("Failed to create notification:", error);
        // Don't fail the comment creation if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      action: "created",
      comment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");
    const contentType = searchParams.get("contentType");
    const sortBy = searchParams.get("sortBy") || "date"; // "date" | "replies"
    const sortOrder = searchParams.get("sortOrder") || "desc"; // "asc" | "desc"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const parentId = searchParams.get("parentId"); // For getting replies to a specific comment

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: "Content ID and content type are required" },
        { status: 400 }
      );
    }

    // Validate content type
    const validContentTypes = [
      "FORUM_THREAD",
      "FORUM_REPLY",
      "LFG_POST",
      "NEWS_POST",
      "USER",
      "NEWS",
      "POST",
      "EVENT",
      "COMMENT",
    ];
    if (!validContentTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // Get user session to check if user has commented
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Build where clause
    const whereClause: {
      contentId: string;
      contentType:
        | "FORUM_THREAD"
        | "FORUM_REPLY"
        | "LFG_POST"
        | "NEWS_POST"
        | "USER"
        | "NEWS"
        | "POST"
        | "EVENT"
        | "COMMENT";
      isDeleted: boolean;
      parentId?: string | null;
    } = {
      contentId,
      contentType: contentType as
        | "FORUM_THREAD"
        | "FORUM_REPLY"
        | "LFG_POST"
        | "NEWS_POST"
        | "USER"
        | "NEWS"
        | "POST"
        | "EVENT"
        | "COMMENT",
      isDeleted: false,
    };

    if (parentId) {
      whereClause.parentId = parentId;
    } else {
      whereClause.parentId = null; // Only top-level comments
    }

    // Build order by clause
    const orderBy: {
      _count?: { replies: "asc" | "desc" };
      createdAt?: "asc" | "desc";
    } = {};
    if (sortBy === "replies") {
      orderBy._count = { replies: sortOrder as "asc" | "desc" };
    } else {
      orderBy.createdAt = sortOrder as "asc" | "desc";
    }

    // Get comments with pagination
    const [comments, totalComments] = await Promise.all([
      prisma.comment.findMany({
        where: whereClause,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          parent: {
            select: {
              id: true,
              author: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({
        where: whereClause,
      }),
    ]);

    // Get user's comment if they have one
    let userComment = null;
    if (userId) {
      userComment = await prisma.comment.findFirst({
        where: {
          contentId,
          contentType: contentType as
            | "FORUM_THREAD"
            | "FORUM_REPLY"
            | "LFG_POST"
            | "NEWS_POST"
            | "USER"
            | "NEWS"
            | "POST"
            | "EVENT"
            | "COMMENT",
          authorId: userId,
          isDeleted: false,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
      });
    }

    return NextResponse.json({
      data: {
        contentId,
        contentType,
        comments,
        totalComments,
        userComment,
        pagination: {
          page,
          limit,
          total: totalComments,
          totalPages: Math.ceil(totalComments / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user session - comments require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { content } = updateCommentSchema.parse(body);

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, isDeleted: true },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.isDeleted) {
      return NextResponse.json(
        { error: "Comment has been deleted" },
        { status: 400 }
      );
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        parent: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      action: "updated",
      comment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user session - comments require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if comment exists and user owns it
    const existingComment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true, isDeleted: true },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.isDeleted) {
      return NextResponse.json(
        { error: "Comment has already been deleted" },
        { status: 400 }
      );
    }

    if (existingComment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    // Soft delete the comment
    await prisma.comment.update({
      where: { id: commentId },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      success: true,
      action: "deleted",
      comment: null,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
