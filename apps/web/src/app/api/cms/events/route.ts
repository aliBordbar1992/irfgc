import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameSlug = searchParams.get("gameSlug");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    let endpoint = `/events?populate=*&pagination[page]=${page}&pagination[pageSize]=${limit}&sort[0]=startDate:asc`;

    if (gameSlug) {
      endpoint += `&filters[game][slug][$eq]=${gameSlug}`;
    }

    const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching events from CMS:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
    const {
      title,
      description,
      type,
      startDate,
      endDate,
      location,
      maxParticipants,
      featured,
      gameSlug,
    } = body;

    // Validate required fields
    if (!title || !description || !type || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get game ID if gameSlug is provided
    let gameId = null;
    if (gameSlug) {
      const gameResponse = await fetch(
        `${STRAPI_URL}/api/games?filters[slug][$eq]=${gameSlug}`,
        {
          headers: {
            Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          },
        }
      );

      if (gameResponse.ok) {
        const gameData = await gameResponse.json();
        if (gameData.data && gameData.data.length > 0) {
          gameId = gameData.data[0].id;
        }
      }
    }

    const eventData = {
      data: {
        title,
        description,
        type,
        startDate,
        endDate,
        location,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        featured,
        game: gameId,
        status: "UPCOMING",
        currentParticipants: 0,
      },
    };

    const response = await fetch(`${STRAPI_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating event in CMS:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
