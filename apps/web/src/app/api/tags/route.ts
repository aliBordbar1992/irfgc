import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "Tag name is required")
    .max(50, "Tag name must be at most 50 characters"),
  description: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        slug?: { contains: string; mode: "insensitive" };
      }>;
    } = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    // @ts-expect-error - Temporary fix for TypeScript recognition
    const tags = await prisma.tag.findMany({
      where,
      orderBy: { name: "asc" },
      take: limit,
    });

    return NextResponse.json({ data: tags });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
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
    const validatedData = createTagSchema.parse(body);

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if tag with same name or slug already exists
    // @ts-expect-error - Temporary fix for TypeScript recognition
    const existingTag = await prisma.tag.findFirst({
      where: {
        OR: [{ name: validatedData.name }, { slug: slug }],
      },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 400 }
      );
    }

    // @ts-expect-error - Temporary fix for TypeScript recognition
    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        slug: slug,
        description: validatedData.description,
        color: validatedData.color,
      },
    });

    return NextResponse.json(
      { data: tag, message: "Tag created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.format() },
        { status: 400 }
      );
    }

    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
