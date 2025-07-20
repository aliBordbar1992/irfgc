import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createGameSchema = z.object({
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(10, "Slug must be at most 10 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be at most 100 characters"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image URL is required"),
  discordUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const isActive = searchParams.get("isActive");

    const where: { slug?: string; isActive?: boolean } = {};
    if (slug) where.slug = slug;
    if (isActive !== null) where.isActive = isActive === "true";

    const games = await prisma.game.findMany({
      where,
      include: {
        _count: {
          select: {
            events: true,
            newsPosts: true,
            lfgPosts: true,
            forumThreads: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch games" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createGameSchema.parse(body);

    // Check if game with slug already exists
    const existingGame = await prisma.game.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingGame) {
      return NextResponse.json(
        { error: "Game with this slug already exists" },
        { status: 409 }
      );
    }

    const game = await prisma.game.create({
      data: {
        ...validatedData,
        discordUrl: validatedData.discordUrl || null,
      },
      include: {
        _count: {
          select: {
            events: true,
            newsPosts: true,
            lfgPosts: true,
            forumThreads: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: game, message: "Game created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
