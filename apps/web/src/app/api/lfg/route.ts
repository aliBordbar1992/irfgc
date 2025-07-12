import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createLFGSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  gameSlug: z.string().min(1, "Game is required"),
  platform: z.enum(["PC", "PS5", "PS4", "XBOX", "SWITCH"]),
  region: z.enum([
    "TEHRAN",
    "ISFAHAN",
    "SHIRAZ",
    "TABRIZ",
    "MASHHAD",
    "ONLINE",
  ]),
  rank: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const platform = searchParams.get("platform");
    const region = searchParams.get("region");
    const rank = searchParams.get("rank");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: {
      gameSlug?: string;
      platform?: "PC" | "PS5" | "PS4" | "XBOX" | "SWITCH";
      region?:
        | "TEHRAN"
        | "ISFAHAN"
        | "SHIRAZ"
        | "TABRIZ"
        | "MASHHAD"
        | "ONLINE";
      rank?: string;
      isActive?: boolean;
    } = { isActive: true };

    if (gameSlug) where.gameSlug = gameSlug;
    if (platform && ["PC", "PS5", "PS4", "XBOX", "SWITCH"].includes(platform)) {
      where.platform = platform as "PC" | "PS5" | "PS4" | "XBOX" | "SWITCH";
    }
    if (
      region &&
      ["TEHRAN", "ISFAHAN", "SHIRAZ", "TABRIZ", "MASHHAD", "ONLINE"].includes(
        region
      )
    ) {
      where.region = region as
        | "TEHRAN"
        | "ISFAHAN"
        | "SHIRAZ"
        | "TABRIZ"
        | "MASHHAD"
        | "ONLINE";
    }
    if (rank) where.rank = rank;

    const [lfgPosts, total] = await Promise.all([
      prisma.lFGPost.findMany({
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
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.lFGPost.count({ where }),
    ]);

    return NextResponse.json({
      data: lfgPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching LFG posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch LFG posts" },
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
    const validatedData = createLFGSchema.parse(body);

    // Check if game exists
    const game = await prisma.game.findUnique({
      where: { slug: validatedData.gameSlug },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const lfgPost = await prisma.lFGPost.create({
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
      },
    });

    return NextResponse.json(
      { data: lfgPost, message: "LFG post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating LFG post:", error);
    return NextResponse.json(
      { error: "Failed to create LFG post" },
      { status: 500 }
    );
  }
}
