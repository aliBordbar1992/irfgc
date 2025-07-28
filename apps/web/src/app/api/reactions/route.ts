import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reactionSchema = z.object({
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
  emoji: z.string().min(1, "Emoji is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Get user session - reactions require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { contentId, contentType, emoji } = reactionSchema.parse(body);

    // Use a transaction to handle reaction toggle
    const result = await prisma.$transaction(async (tx) => {
      // Check if user already has a reaction for this content
      const existingReaction = await tx.reaction.findUnique({
        where: {
          contentId_contentType_userId: {
            contentId,
            contentType,
            userId: session.user.id,
          },
        },
      });

      if (existingReaction) {
        // If user already reacted with the same emoji, remove the reaction
        if (existingReaction.emoji === emoji) {
          await tx.reaction.delete({
            where: {
              id: existingReaction.id,
            },
          });
          return { action: "removed", reaction: null };
        } else {
          // If user reacted with a different emoji, update the reaction
          const updatedReaction = await tx.reaction.update({
            where: {
              id: existingReaction.id,
            },
            data: {
              emoji,
            },
          });
          return { action: "updated", reaction: updatedReaction };
        }
      } else {
        // Create new reaction
        const newReaction = await tx.reaction.create({
          data: {
            contentId,
            contentType,
            emoji,
            userId: session.user.id,
          },
        });
        return { action: "created", reaction: newReaction };
      }
    });

    return NextResponse.json({
      success: true,
      action: result.action,
      reaction: result.reaction,
    });
  } catch (error) {
    console.error("Error handling reaction:", error);

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

    // Get user session to check if user has reacted
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    // Get reactions for this content
    const reactions = await prisma.reaction.findMany({
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
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Group reactions by emoji
    const reactionCounts = reactions.reduce(
      (
        acc: Record<
          string,
          {
            count: number;
            users: Array<{ id: string; name: string; avatar: string | null }>;
          }
        >,
        reaction
      ) => {
        const emoji = reaction.emoji;
        if (!acc[emoji]) {
          acc[emoji] = {
            count: 0,
            users: [],
          };
        }
        acc[emoji].count++;
        acc[emoji].users.push({
          id: reaction.user.id,
          name: reaction.user.name,
          avatar: reaction.user.avatar,
        });
        return acc;
      },
      {}
    );

    // Check if current user has reacted
    const userReaction = userId
      ? reactions.find((r) => r.userId === userId)
      : null;

    return NextResponse.json({
      data: {
        contentId,
        contentType,
        reactions: reactionCounts,
        userReaction: userReaction ? userReaction.emoji : null,
        totalReactions: reactions.length,
      },
    });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
