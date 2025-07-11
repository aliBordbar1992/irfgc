import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
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
      createdById: "1", // Admin user
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
      createdById: "1", // Admin user
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
