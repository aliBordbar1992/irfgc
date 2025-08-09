import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PostsList } from "@/features/posts/PostsList";
import { CreatePostDialog } from "@/features/posts/CreatePostDialog";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
            <p className="text-gray-600 mt-2">
              Discover and share content with the community
            </p>
          </div>
          {session && <CreatePostDialog />}
        </div>
      </div>

      <PostsList title="All Posts" />
    </div>
  );
}
