import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createThreadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  gameSlug: z.string().min(1, "Game is required"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: { gameSlug?: string } = {};
    if (gameSlug) where.gameSlug = gameSlug;

    const [threads, total] = await Promise.all([
      prisma.forumThread.findMany({
        where,
        include: {
          game: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.forumThread.count({ where }),
    ]);

    return NextResponse.json({
      data: threads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching forum threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch forum threads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createThreadSchema.parse(body);

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { slug: validatedData.gameSlug },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const thread = await prisma.forumThread.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        game: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: thread, message: "Thread created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating forum thread:", error);
    return NextResponse.json(
      { error: "Failed to create forum thread" },
      { status: 500 }
    );
  }
}
