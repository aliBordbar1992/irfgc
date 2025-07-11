import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NewsPageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

// Mock news data - will be replaced with API calls
const MOCK_NEWS = [
  {
    id: "1",
    title: "New Tournament Announced for Next Month",
    excerpt:
      "The Iranian FGC is excited to announce a major tournament featuring top players from across the country.",
    content: "Full article content would go here...",
    author: "IRFGC Team",
    publishedAt: "2024-01-10T12:00:00Z",
    readTime: "3 min read",
  },
  {
    id: "2",
    title: "Patch Notes: Latest Balance Changes",
    excerpt:
      "The latest patch brings significant balance changes that will shake up the competitive meta.",
    content: "Full article content would go here...",
    author: "GameMaster",
    publishedAt: "2024-01-08T15:30:00Z",
    readTime: "5 min read",
  },
  {
    id: "3",
    title: "Community Spotlight: Player of the Month",
    excerpt:
      "This month we highlight an up-and-coming player who has been making waves in the local scene.",
    content: "Full article content would go here...",
    author: "Community Manager",
    publishedAt: "2024-01-05T09:15:00Z",
    readTime: "4 min read",
  },
  {
    id: "4",
    title: "Strategy Guide: Advanced Combos",
    excerpt:
      "Master these advanced combo techniques to take your gameplay to the next level.",
    content: "Full article content would go here...",
    author: "ProPlayer",
    publishedAt: "2024-01-03T14:20:00Z",
    readTime: "7 min read",
  },
];

export default async function NewsPage({ params }: NewsPageProps) {
  const { gameSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {gameSlug} News
          </h1>
          <p className="text-gray-600 mt-2">
            Latest updates, announcements, and community news
          </p>
        </div>
        <Button>Subscribe to Updates</Button>
      </div>

      {/* Featured Article */}
      {MOCK_NEWS.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                  Featured
                </span>
                <CardTitle className="text-2xl text-gray-900">
                  {MOCK_NEWS[0].title}
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  {MOCK_NEWS[0].excerpt}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>By {MOCK_NEWS[0].author}</span>
                <span>•</span>
                <span>
                  {new Date(MOCK_NEWS[0].publishedAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{MOCK_NEWS[0].readTime}</span>
              </div>
              <Button>Read Full Article</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_NEWS.slice(1).map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">
                {article.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {article.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {article.readTime}
                </span>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Articles</Button>
      </div>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-4">
              Get the latest news and updates delivered to your inbox
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
