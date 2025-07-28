import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build where clause
    const whereClause = {
      authorId: params.userId,
      isDeleted: false,
    };

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
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: {
        userId: params.userId,
        comments,
        totalComments,
        pagination: {
          page,
          limit,
          total: totalComments,
          totalPages: Math.ceil(totalComments / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
