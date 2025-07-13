import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CMSIntegration } from "@/features/dashboard/CMSIntegration";

export default async function CMSPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Content Management System
        </h1>
        <p className="text-gray-600 mt-2">
          Manage events, news, and content through the CMS integration
        </p>
      </div>

      <CMSIntegration />
    </div>
  );
}
