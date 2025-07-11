import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock games data - will be replaced with API calls
const MOCK_GAMES = [
  {
    id: "1",
    name: "Mortal Kombat",
    slug: "mk",
    status: "active",
    description: "The latest installment in the Mortal Kombat series",
    releaseDate: "2023-09-19",
    platform: "PC, PS5, Xbox Series X/S",
    playerCount: 1247,
    eventCount: 45,
    isFeatured: true,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Street Fighter 6",
    slug: "sf",
    status: "active",
    description: "The newest entry in the legendary Street Fighter series",
    releaseDate: "2023-06-02",
    platform: "PC, PS4, PS5, Xbox Series X/S",
    playerCount: 892,
    eventCount: 38,
    isFeatured: true,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "3",
    name: "Tekken 8",
    slug: "tk",
    status: "active",
    description: "The latest chapter in the King of Iron Fist Tournament",
    releaseDate: "2024-01-26",
    platform: "PC, PS5, Xbox Series X/S",
    playerCount: 567,
    eventCount: 23,
    isFeatured: false,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "4",
    name: "Guilty Gear Strive",
    slug: "gg",
    status: "active",
    description: "The latest entry in the Guilty Gear series",
    releaseDate: "2021-06-11",
    platform: "PC, PS4, PS5",
    playerCount: 445,
    eventCount: 19,
    isFeatured: false,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "5",
    name: "BlazBlue: Central Fiction",
    slug: "bb",
    status: "active",
    description: "The final chapter in the Azure Saga",
    releaseDate: "2016-10-06",
    platform: "PC, PS4, Switch",
    playerCount: 234,
    eventCount: 8,
    isFeatured: false,
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "6",
    name: "Under Night In-Birth II",
    slug: "uni",
    status: "upcoming",
    description: "The sequel to Under Night In-Birth",
    releaseDate: "2024-01-25",
    platform: "PC, PS4, PS5, Switch",
    playerCount: 0,
    eventCount: 0,
    isFeatured: false,
    createdAt: "2023-12-01T10:00:00Z",
  },
];

export default function GamesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games Management</h1>
          <p className="text-gray-600 mt-2">
            Manage supported fighting games and their community settings
          </p>
        </div>
        <Button>Add New Game</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <p className="text-sm text-gray-600">Active Games</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1</div>
              <p className="text-sm text-gray-600">Upcoming Games</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <p className="text-sm text-gray-600">Featured Games</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">133</div>
              <p className="text-sm text-gray-600">Total Events</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Games Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Game</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Release Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Platform</th>
                  <th className="text-left py-3 px-4 font-medium">Community</th>
                  <th className="text-left py-3 px-4 font-medium">Events</th>
                  <th className="text-left py-3 px-4 font-medium">Featured</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_GAMES.map((game) => (
                  <tr key={game.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{game.name}</div>
                        <div className="text-sm text-gray-600">
                          {game.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.status === "active"
                            ? "bg-green-100 text-green-800"
                            : game.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {game.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {new Date(game.releaseDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {game.platform}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        <div>{game.playerCount.toLocaleString()} players</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{game.eventCount} events</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          game.isFeatured
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {game.isFeatured ? "Featured" : "Regular"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {game.isFeatured ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Unfeature
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Feature
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Game Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Community Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Game for New Users
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="mk">Mortal Kombat</option>
                <option value="sf">Street Fighter 6</option>
                <option value="tk">Tekken 8</option>
                <option value="gg">Guilty Gear Strive</option>
                <option value="bb">BlazBlue</option>
                <option value="uni">Under Night In-Birth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Games Display Limit
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                defaultValue={3}
                min={1}
                max={6}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="auto-feature" className="rounded" />
              <label htmlFor="auto-feature" className="text-sm text-gray-700">
                Automatically feature new games
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discord Bot Integration
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="discord-bot"
                  className="rounded"
                  defaultChecked
                />
                <label htmlFor="discord-bot" className="text-sm text-gray-700">
                  Enable Discord bot for game communities
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Integration
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tournament-integration"
                  className="rounded"
                  defaultChecked
                />
                <label
                  htmlFor="tournament-integration"
                  className="text-sm text-gray-700"
                >
                  Enable automatic tournament creation
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Auto-Posting
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="news-auto-post"
                  className="rounded"
                />
                <label
                  htmlFor="news-auto-post"
                  className="text-sm text-gray-700"
                >
                  Auto-post game updates to news
                </label>
              </div>
            </div>
            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
