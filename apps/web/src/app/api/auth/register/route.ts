import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeUsername, normalizeEmail } from "@/lib/normalization";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password } = registerSchema.parse(body);

    // Normalize username and email for case-insensitive checks
    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = normalizeEmail(email);

    // Check if username already exists (case-insensitive)
    const existingUser = await prisma.user.findUnique({
      where: { usernameNormalized: normalizedUsername },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if email already exists (case-insensitive, if provided)
    if (normalizedEmail) {
      const existingEmailUser = await prisma.user.findFirst({
        where: { emailNormalized: normalizedEmail },
      });

      if (existingEmailUser) {
        return NextResponse.json(
          { error: "Email is already registered" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with both original and normalized fields
    const user = await prisma.user.create({
      data: {
        name,
        username,
        usernameNormalized: normalizedUsername,
        email,
        emailNormalized: normalizedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
