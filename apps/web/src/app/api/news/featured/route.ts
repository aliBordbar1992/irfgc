import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: {
      featured: boolean;
      status: "PUBLISHED";
      deletedAt: null;
      gameSlug?: string | null;
    } = {
      featured: true,
      status: "PUBLISHED",
      deletedAt: null,
    };

    if (gameSlug && gameSlug !== "general") {
      where.gameSlug = gameSlug;
    } else if (gameSlug === "general") {
      where.gameSlug = null;
    }

    const featuredNews = await prisma.newsPost.findMany({
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
      take: limit,
    });

    return NextResponse.json({
      data: featuredNews,
      total: featuredNews.length,
    });
  } catch (error) {
    console.error("Error fetching featured news:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured news" },
      { status: 500 }
    );
  }
}
