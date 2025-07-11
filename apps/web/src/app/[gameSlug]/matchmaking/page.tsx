import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MatchmakingPageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

// Mock LFG data - will be replaced with API calls
const MOCK_LFG_POSTS = [
  {
    id: "1",
    title: "Looking for casual matches",
    description:
      "New player looking for casual matches to improve. Any skill level welcome!",
    platform: "PC",
    region: "Tehran",
    rank: "Beginner",
    author: "Player123",
    createdAt: "2024-01-10T10:00:00Z",
    isActive: true,
  },
  {
    id: "2",
    title: "Tournament practice partner needed",
    description:
      "Looking for a strong player to practice with before upcoming tournament.",
    platform: "PS5",
    region: "Online",
    rank: "Advanced",
    author: "Fighter456",
    createdAt: "2024-01-09T15:30:00Z",
    isActive: true,
  },
  {
    id: "3",
    title: "Weekend gaming session",
    description:
      "Planning a long gaming session this weekend. Looking for 2-3 players.",
    platform: "PC",
    region: "Isfahan",
    rank: "Intermediate",
    author: "WeekendWarrior",
    createdAt: "2024-01-08T20:15:00Z",
    isActive: true,
  },
];

export default async function MatchmakingPage({
  params,
}: MatchmakingPageProps) {
  const { gameSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {gameSlug} Looking for Game
          </h1>
          <p className="text-gray-600 mt-2">
            Find players to play with or post your own LFG request
          </p>
        </div>
        <Button>Post LFG</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">All Platforms</option>
              <option value="pc">PC</option>
              <option value="ps5">PS5</option>
              <option value="ps4">PS4</option>
              <option value="xbox">Xbox</option>
              <option value="switch">Switch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">All Regions</option>
              <option value="tehran">Tehran</option>
              <option value="isfahan">Isfahan</option>
              <option value="shiraz">Shiraz</option>
              <option value="tabriz">Tabriz</option>
              <option value="mashhad">Mashhad</option>
              <option value="online">Online</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill Level
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Any Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {/* LFG Posts */}
      <div className="space-y-4">
        {MOCK_LFG_POSTS.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {post.description}
                  </CardDescription>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex space-x-4 text-sm text-gray-600">
                  <span>Platform: {post.platform}</span>
                  <span>Region: {post.region}</span>
                  <span>Rank: {post.rank}</span>
                  <span>By: {post.author}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Contact
                  </Button>
                  <Button size="sm">Join</Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Posted {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {MOCK_LFG_POSTS.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No LFG posts found
          </h3>
          <p className="text-gray-600 mb-4">
            Be the first to post a Looking for Game request!
          </p>
          <Button>Create First Post</Button>
        </div>
      )}
    </div>
  );
}
