import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ContentModeration } from "@/features/dashboard/ContentModeration";

export default async function ModerationPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "admin" && session.user.role !== "moderator") {
    notFound();
  }

  // Fetch reported content
  const reportedContent = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      reporter: {
        select: {
          id: true,
          name: true,
        },
      },
      reportedUser: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Fetch recent forum posts for moderation
  const recentForumPosts = await prisma.forumThread.findMany({
    where: {
      OR: [{ isLocked: false }, { isPinned: false }],
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      game: true,
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Fetch recent LFG posts for moderation
  const recentLFGPosts = await prisma.lFGPost.findMany({
    where: { isActive: true },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      game: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const moderationData = {
    reportedContent,
    recentForumPosts,
    recentLFGPosts,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">
          Review and moderate community content, handle reports, and manage user
          behavior.
        </p>
      </div>

      <Suspense fallback={<ModerationSkeleton />}>
        <ContentModeration data={moderationData} userRole={session.user.role} />
      </Suspense>
    </div>
  );
}

function ModerationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
