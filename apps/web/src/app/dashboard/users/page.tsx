import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserManagement } from "@/features/dashboard/UserManagement";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  // Fetch users with pagination
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          events: true,
          newsPosts: true,
          lfgPosts: true,
          forumThreads: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">
          Manage user accounts, roles, and permissions across the platform.
        </p>
      </div>

      <Suspense fallback={<UserManagementSkeleton />}>
        <UserManagement initialUsers={users} />
      </Suspense>
    </div>
  );
}

function UserManagementSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
