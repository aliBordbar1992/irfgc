import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/profile/ProfileForm";
import { ProfileStats } from "@/features/profile/ProfileStats";
import { ProfileActivity } from "@/features/profile/ProfileActivity";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // Fetch user data with related information
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      events: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
        },
      },
      newsPosts: {
        take: 5,
        orderBy: { publishedAt: "desc" },
        include: {
          game: true,
        },
      },
      lfgPosts: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
        },
      },
      forumThreads: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          game: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
      eventRegistrations: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          event: {
            include: {
              game: true,
            },
          },
        },
      },
      _count: {
        select: {
          events: true,
          newsPosts: true,
          lfgPosts: true,
          forumThreads: true,
          forumReplies: true,
          eventRegistrations: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and view your activity
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm user={user} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProfileStats stats={user._count} />
          <ProfileActivity
            events={user.events}
            newsPosts={user.newsPosts}
            lfgPosts={user.lfgPosts}
            forumThreads={user.forumThreads}
            registrations={user.eventRegistrations}
          />
        </div>
      </div>
    </div>
  );
}
