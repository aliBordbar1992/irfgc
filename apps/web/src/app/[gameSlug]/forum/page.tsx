import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ForumPageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

// Mock forum data - will be replaced with API calls
const MOCK_THREADS = [
  {
    id: "1",
    title: "Best beginner characters for new players?",
    content:
      "I'm new to the game and looking for recommendations on which characters are good for beginners...",
    author: "NewPlayer123",
    replyCount: 15,
    viewCount: 234,
    isPinned: true,
    isLocked: false,
    createdAt: "2024-01-10T10:00:00Z",
    lastReplyAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "2",
    title: "Tournament Discussion: Upcoming Regional",
    content:
      "Let's discuss strategies and predictions for the upcoming regional tournament...",
    author: "TournamentOrganizer",
    replyCount: 42,
    viewCount: 567,
    isPinned: true,
    isLocked: false,
    createdAt: "2024-01-08T15:30:00Z",
    lastReplyAt: "2024-01-12T16:45:00Z",
  },
  {
    id: "3",
    title: "Advanced combo guide for character X",
    content:
      "Here's a comprehensive guide to advanced combos for character X...",
    author: "ComboMaster",
    replyCount: 8,
    viewCount: 123,
    isPinned: false,
    isLocked: false,
    createdAt: "2024-01-09T12:20:00Z",
    lastReplyAt: "2024-01-11T09:15:00Z",
  },
  {
    id: "4",
    title: "Patch 1.2.0 Discussion",
    content: "What do you think about the latest patch changes?",
    author: "PatchWatcher",
    replyCount: 23,
    viewCount: 345,
    isPinned: false,
    isLocked: false,
    createdAt: "2024-01-07T18:45:00Z",
    lastReplyAt: "2024-01-10T11:20:00Z",
  },
  {
    id: "5",
    title: "Weekly casual meetup thread",
    content:
      "Post here if you're interested in joining our weekly casual meetup...",
    author: "CommunityManager",
    replyCount: 12,
    viewCount: 89,
    isPinned: false,
    isLocked: false,
    createdAt: "2024-01-06T20:10:00Z",
    lastReplyAt: "2024-01-09T13:25:00Z",
  },
];

export default async function ForumPage({ params }: ForumPageProps) {
  const { gameSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {gameSlug} Forum
          </h1>
          <p className="text-gray-600 mt-2">
            Discuss strategies, share tips, and connect with the community
          </p>
        </div>
        <Button>Create New Thread</Button>
      </div>

      {/* Forum Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {MOCK_THREADS.length}
              </div>
              <div className="text-sm text-gray-600">Total Threads</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {MOCK_THREADS.reduce(
                  (sum, thread) => sum + thread.replyCount,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Replies</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {MOCK_THREADS.reduce(
                  (sum, thread) => sum + thread.viewCount,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {MOCK_THREADS.filter((t) => t.isPinned).length}
              </div>
              <div className="text-sm text-gray-600">Pinned Threads</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Rules */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-lg text-yellow-800">Forum Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Be respectful and constructive in your discussions</li>
            <li>• No spam, advertising, or off-topic posts</li>
            <li>• Keep discussions focused on the game and community</li>
            <li>• Report inappropriate content to moderators</li>
          </ul>
        </CardContent>
      </Card>

      {/* Threads List */}
      <div className="space-y-2">
        {MOCK_THREADS.map((thread) => (
          <Card key={thread.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                {/* Thread Status Icons */}
                <div className="flex flex-col items-center space-y-1 pt-1">
                  {thread.isPinned && (
                    <div className="text-yellow-500 text-lg">📌</div>
                  )}
                  {thread.isLocked && (
                    <div className="text-red-500 text-lg">🔒</div>
                  )}
                  {!thread.isPinned && !thread.isLocked && (
                    <div className="text-gray-400 text-lg">💬</div>
                  )}
                </div>

                {/* Thread Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {thread.title}
                    </h3>
                    {thread.isPinned && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {thread.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By {thread.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>{thread.replyCount} replies</span>
                      <span>•</span>
                      <span>{thread.viewCount} views</span>
                      <span>•</span>
                      <span>
                        Last reply{" "}
                        {new Date(thread.lastReplyAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2">
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                  {thread.isLocked ? (
                    <Button size="sm" variant="outline" disabled>
                      Locked
                    </Button>
                  ) : (
                    <Button size="sm">Reply</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Threads</Button>
      </div>
    </div>
  );
}
