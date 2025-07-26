import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateNewsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  gameSlug: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  coverImage: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDeleted = searchParams.get("includeDeleted") === "true";
    const { id } = await params;

    const where: { id: string; deletedAt?: null } = { id };

    // Only include soft-deleted news if explicitly requested
    if (!includeDeleted) {
      where.deletedAt = null;
    }

    const newsPost = await prisma.newsPost.findUnique({
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
    });

    if (!newsPost) {
      return NextResponse.json(
        { error: "News post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: newsPost });
  } catch (error) {
    console.error("Error fetching news post:", error);
    return NextResponse.json(
      { error: "Failed to fetch news post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateNewsSchema.parse(body);
    const { id } = await params;

    // Check if news post exists
    const existingNewsPost = await prisma.newsPost.findUnique({
      where: { id },
    });

    if (!existingNewsPost) {
      return NextResponse.json(
        { error: "News post not found" },
        { status: 404 }
      );
    }

    // Check if game exists (skip validation for "general")
    if (validatedData.gameSlug && validatedData.gameSlug !== "general") {
      const game = await prisma.game.findUnique({
        where: { slug: validatedData.gameSlug },
      });

      if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }
    }

    const updatedNewsPost = await prisma.newsPost.update({
      where: { id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        excerpt: validatedData.excerpt,
        status: validatedData.status,
        featured: validatedData.featured,
        ...(validatedData.gameSlug && validatedData.gameSlug !== "general"
          ? { gameSlug: validatedData.gameSlug }
          : { gameSlug: null }),
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

    return NextResponse.json({
      data: updatedNewsPost,
      message: "News post updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating news post:", error);
    return NextResponse.json(
      { error: "Failed to update news post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if news post exists
    const existingNewsPost = await prisma.newsPost.findUnique({
      where: { id },
    });

    if (!existingNewsPost) {
      return NextResponse.json(
        { error: "News post not found" },
        { status: 404 }
      );
    }

    // Soft delete the news post by setting deletedAt timestamp
    await prisma.newsPost.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "News post deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news post:", error);
    return NextResponse.json(
      { error: "Failed to delete news post" },
      { status: 500 }
    );
  }
}
