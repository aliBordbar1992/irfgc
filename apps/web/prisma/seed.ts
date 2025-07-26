import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Create games
  const games = [
    {
      slug: "mk",
      name: "MK",
      fullName: "Mortal Kombat",
      description: "Mortal Kombat community for Iranian players",
      imageUrl: "/images/games/mk.jpg",
      discordUrl: "https://discord.gg/irfgc-mk",
    },
    {
      slug: "sf",
      name: "SF",
      fullName: "Street Fighter",
      description: "Street Fighter community for Iranian players",
      imageUrl: "/images/games/sf.jpg",
      discordUrl: "https://discord.gg/irfgc-sf",
    },
    {
      slug: "tk",
      name: "TK",
      fullName: "Tekken",
      description: "Tekken community for Iranian players",
      imageUrl: "/images/games/tk.jpg",
      discordUrl: "https://discord.gg/irfgc-tk",
    },
    {
      slug: "gg",
      name: "GG",
      fullName: "Guilty Gear",
      description: "Guilty Gear community for Iranian players",
      imageUrl: "/images/games/gg.jpg",
      discordUrl: "https://discord.gg/irfgc-gg",
    },
    {
      slug: "bb",
      name: "BB",
      fullName: "BlazBlue",
      description: "BlazBlue community for Iranian players",
      imageUrl: "/images/games/bb.jpg",
      discordUrl: "https://discord.gg/irfgc-bb",
    },
    {
      slug: "uni",
      name: "UNI",
      fullName: "Under Night In-Birth",
      description: "Under Night In-Birth community for Iranian players",
      imageUrl: "/images/games/uni.jpg",
      discordUrl: "https://discord.gg/irfgc-uni",
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: game,
      create: game,
    });
    console.log(`✅ Created/updated game: ${game.name}`);
  }

  // Create demo users with hashed passwords
  const users = [
    {
      email: "admin@irfgc.ir",
      name: "Admin User",
      password: await bcrypt.hash("admin123", 12),
      role: "ADMIN" as const,
    },
    {
      email: "moderator@irfgc.ir",
      name: "Moderator User",
      password: await bcrypt.hash("mod123", 12),
      role: "MODERATOR" as const,
    },
    {
      email: "player@irfgc.ir",
      name: "Player User",
      password: await bcrypt.hash("player123", 12),
      role: "PLAYER" as const,
    },
  ];

  const createdUsers = [];
  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
    createdUsers.push(createdUser);
    console.log(`✅ Created/updated user: ${user.name}`);
  }

  // Create sample events
  const events = [
    {
      title: "Weekly Tournament",
      description: "Join our weekly tournament and compete with other players",
      gameSlug: "mk",
      type: "TOURNAMENT" as const,
      status: "UPCOMING" as const,
      startDate: new Date("2024-01-15T18:00:00Z"),
      endDate: new Date("2024-01-15T22:00:00Z"),
      location: "Online",
      maxParticipants: 32,
      currentParticipants: 24,
      createdById: createdUsers[0].id, // Admin user
    },
    {
      title: "Casual Meetup",
      description: "Casual play session for all skill levels",
      gameSlug: "sf",
      type: "CASUAL" as const,
      status: "UPCOMING" as const,
      startDate: new Date("2024-01-20T14:00:00Z"),
      endDate: new Date("2024-01-20T18:00:00Z"),
      location: "Tehran Gaming Center",
      maxParticipants: 20,
      currentParticipants: 12,
      createdById: createdUsers[0].id, // Admin user
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: {
        id: `${event.gameSlug}-${event.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
      update: event,
      create: {
        ...event,
        id: `${event.gameSlug}-${event.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
    });
    console.log(`✅ Created/updated event: ${event.title}`);
  }

  // Create chat rooms
  const chatRooms = [
    {
      name: "General Chat",
      type: "GENERAL" as const,
    },
    {
      name: "Tournament Discussion",
      type: "TOURNAMENT" as const,
    },
    {
      name: "Strategy & Tips",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "mk",
    },
    {
      name: "Matchmaking",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "mk",
    },
    {
      name: "Strategy & Tips",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "sf",
    },
    {
      name: "Matchmaking",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "sf",
    },
    {
      name: "Strategy & Tips",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "tk",
    },
    {
      name: "Matchmaking",
      type: "GAME_SPECIFIC" as const,
      gameSlug: "tk",
    },
  ];

  for (const room of chatRooms) {
    await prisma.chatRoom.upsert({
      where: {
        id: `${room.type}-${room.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: room,
      create: {
        ...room,
        id: `${room.type}-${room.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
    });
    console.log(`✅ Created/updated chat room: ${room.name}`);
  }

  // Get the created rooms to use their actual IDs
  const generalRoom = await prisma.chatRoom.findFirst({
    where: { name: "General Chat" },
  });
  const mkMatchmakingRoom = await prisma.chatRoom.findFirst({
    where: { name: "Matchmaking", gameSlug: "mk" },
  });
  const tournamentRoom = await prisma.chatRoom.findFirst({
    where: { name: "Tournament Discussion" },
  });

  if (generalRoom && mkMatchmakingRoom && tournamentRoom) {
    const messages = [
      {
        content: "Welcome to the IRFGC community! 🎮",
        roomId: generalRoom.id,
        authorId: createdUsers[0].id, // Admin user
        messageType: "SYSTEM" as const,
      },
      {
        content: "Anyone up for some casual matches?",
        roomId: mkMatchmakingRoom.id,
        authorId: createdUsers[2].id, // Player user
        messageType: "TEXT" as const,
      },
      {
        content: "Great tournament last week! Looking forward to the next one.",
        roomId: tournamentRoom.id,
        authorId: createdUsers[1].id, // Moderator user
        messageType: "TEXT" as const,
      },
    ];

    for (const message of messages) {
      await prisma.chatMessage.create({
        data: message,
      });
      console.log(
        `✅ Created chat message: ${message.content.substring(0, 30)}...`
      );
    }
  }

  // Create some initial tags
  const tags = [
    {
      name: "Tournament",
      description: "Tournament related news",
      color: "#FF6B6B",
    },
    {
      name: "Announcement",
      description: "Important announcements",
      color: "#4ECDC4",
    },
    {
      name: "Community",
      description: "Community events and updates",
      color: "#45B7D1",
    },
    {
      name: "Game Update",
      description: "Game updates and patches",
      color: "#96CEB4",
    },
    { name: "Event", description: "Special events", color: "#FFEAA7" },
    {
      name: "Competition",
      description: "Competitive gaming",
      color: "#DDA0DD",
    },
    { name: "News", description: "General news", color: "#98D8C8" },
    { name: "Guide", description: "Gaming guides and tips", color: "#F7DC6F" },
  ];

  for (const tagData of tags) {
    const slug = tagData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name: tagData.name,
        slug,
        description: tagData.description,
        color: tagData.color,
      },
    });
  }

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
