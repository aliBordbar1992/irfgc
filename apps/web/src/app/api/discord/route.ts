import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");

    // Get Discord webhook configuration
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json({
        data: {
          enabled: false,
          message: "Discord webhook not configured",
        },
      });
    }

    return NextResponse.json({
      data: {
        enabled: true,
        webhookUrl: webhookUrl,
        gameSlug: gameSlug,
      },
    });
  } catch (error) {
    console.error("Error fetching Discord config:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord configuration" },
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
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "send-notification") {
      const { message, gameSlug, eventType } = body;

      if (!message) {
        return NextResponse.json(
          { error: "Message is required" },
          { status: 400 }
        );
      }

      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
      if (!webhookUrl) {
        return NextResponse.json(
          { error: "Discord webhook not configured" },
          { status: 400 }
        );
      }

      // Create Discord embed
      const embed = {
        title: getEmbedTitle(eventType),
        description: message,
        color: getEmbedColor(eventType),
        timestamp: new Date().toISOString(),
        footer: {
          text: "IRFGC Platform",
        },
      };

      if (gameSlug) {
        const game = await prisma.game.findUnique({
          where: { slug: gameSlug },
        });
        if (game) {
          embed.title = `${embed.title} - ${game.fullName}`;
        }
      }

      // Send to Discord webhook
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send Discord notification");
      }

      return NextResponse.json({
        success: true,
        message: "Discord notification sent successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error sending Discord notification:", error);
    return NextResponse.json(
      { error: "Failed to send Discord notification" },
      { status: 500 }
    );
  }
}

function getEmbedTitle(eventType: string): string {
  switch (eventType) {
    case "EVENT":
      return "🎮 New Event";
    case "NEWS":
      return "📰 News Update";
    case "TOURNAMENT":
      return "🏆 Tournament Announcement";
    case "GENERAL":
      return "📢 Community Update";
    default:
      return "📢 IRFGC Update";
  }
}

function getEmbedColor(eventType: string): number {
  switch (eventType) {
    case "EVENT":
      return 0x00ff00; // Green
    case "NEWS":
      return 0x0099ff; // Blue
    case "TOURNAMENT":
      return 0xff9900; // Orange
    case "GENERAL":
      return 0x7289da; // Discord Blurple
    default:
      return 0x7289da;
  }
}
