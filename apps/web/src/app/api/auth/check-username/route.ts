import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeUsername } from "@/lib/normalization";

const checkUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = checkUsernameSchema.parse(body);

    // Normalize username to lowercase for case-insensitive check
    const normalizedUsername = normalizeUsername(username);

    // Check if username already exists (case-insensitive)
    const existingUser = await prisma.user.findUnique({
      where: { usernameNormalized: normalizedUsername },
    });

    return NextResponse.json({
      available: !existingUser,
      username,
      normalizedUsername,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid username format", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
