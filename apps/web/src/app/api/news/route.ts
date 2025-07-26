import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  gameSlug: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  coverImage: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const includeDeleted = searchParams.get("includeDeleted") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (gameSlug && gameSlug !== "general") {
      where.gameSlug = gameSlug;
    } else if (gameSlug === "general") {
      where.gameSlug = null;
    }

    if (status) {
      if (status.includes(",")) {
        // Handle multiple statuses (for dashboard)
        where.status = { in: status.split(",") };
      } else {
        where.status = status;
      }
    } else {
      // For public requests (no status specified), only show published news
      where.status = "PUBLISHED";
    }

    if (featured !== null && featured !== undefined) {
      where.featured = featured === "true";
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { author: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filter out soft-deleted news unless explicitly requested
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const [newsPosts, total] = await Promise.all([
      prisma.newsPost.findMany({
        where,
        include: {
          game: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.newsPost.count({ where }),
    ]);

    return NextResponse.json({
      data: newsPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createNewsSchema.parse(body);

    // Check if game exists (skip validation for "general")
    if (validatedData.gameSlug && validatedData.gameSlug !== "general") {
      const game = await prisma.game.findUnique({
        where: { slug: validatedData.gameSlug },
      });

      if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
    }

    const newsPost = await prisma.newsPost.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        authorId: session.user.id,
        status: validatedData.status,
        featured: validatedData.featured,
        ...(validatedData.gameSlug &&
          validatedData.gameSlug !== "general" && {
            gameSlug: validatedData.gameSlug,
          }),
        ...(validatedData.tags && { tags: validatedData.tags }),
        ...(validatedData.thumbnail && { thumbnail: validatedData.thumbnail }),
        ...(validatedData.coverImage && {
          coverImage: validatedData.coverImage,
        }),
      },
      include: {
        game: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      { data: newsPost, message: "News post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating news post:", error);
    return NextResponse.json(
      { error: "Failed to create news post" },
      { status: 500 }
    );
  }
}
