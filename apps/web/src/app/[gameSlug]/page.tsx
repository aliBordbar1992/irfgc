import Link from "next/link";
import { GameSlug } from "@/types";

interface GamePageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

const GAME_INFO: Record<
  GameSlug,
  {
    name: string;
    fullName: string;
    description: string;
    color: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
      href: string;
    }>;
  }
> = {
  mk: {
    name: "MK",
    fullName: "Mortal Kombat",
    description:
      "Join the Iranian Mortal Kombat community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-red-600",
    features: [
      {
        title: "Tournaments",
        description: "Join MK tournaments and compete",
        icon: "🏆",
        href: "/mk/events",
      },
      {
        title: "Matchmaking",
        description: "Find MK players to play with",
        icon: "👥",
        href: "/mk/matchmaking",
      },
      {
        title: "News",
        description: "Latest MK news and updates",
        icon: "📰",
        href: "/mk/news",
      },
      {
        title: "Forum",
        description: "Discuss MK strategies and tips",
        icon: "💬",
        href: "/mk/forum",
      },
    ],
  },
  sf: {
    name: "SF",
    fullName: "Street Fighter",
    description:
      "Join the Iranian Street Fighter community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-blue-600",
    features: [
      {
        title: "Tournaments",
        description: "Join SF tournaments and compete",
        icon: "🏆",
        href: "/sf/events",
      },
      {
        title: "Matchmaking",
        description: "Find SF players to play with",
        icon: "👥",
        href: "/sf/matchmaking",
      },
      {
        title: "News",
        description: "Latest SF news and updates",
        icon: "📰",
        href: "/sf/news",
      },
      {
        title: "Forum",
        description: "Discuss SF strategies and tips",
        icon: "💬",
        href: "/sf/forum",
      },
    ],
  },
  tk: {
    name: "TK",
    fullName: "Tekken",
    description:
      "Join the Iranian Tekken community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-purple-600",
    features: [
      {
        title: "Tournaments",
        description: "Join TK tournaments and compete",
        icon: "🏆",
        href: "/tk/events",
      },
      {
        title: "Matchmaking",
        description: "Find TK players to play with",
        icon: "👥",
        href: "/tk/matchmaking",
      },
      {
        title: "News",
        description: "Latest TK news and updates",
        icon: "📰",
        href: "/tk/news",
      },
      {
        title: "Forum",
        description: "Discuss TK strategies and tips",
        icon: "💬",
        href: "/tk/forum",
      },
    ],
  },
  gg: {
    name: "GG",
    fullName: "Guilty Gear",
    description:
      "Join the Iranian Guilty Gear community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-green-600",
    features: [
      {
        title: "Tournaments",
        description: "Join GG tournaments and compete",
        icon: "🏆",
        href: "/gg/events",
      },
      {
        title: "Matchmaking",
        description: "Find GG players to play with",
        icon: "👥",
        href: "/gg/matchmaking",
      },
      {
        title: "News",
        description: "Latest GG news and updates",
        icon: "📰",
        href: "/gg/news",
      },
      {
        title: "Forum",
        description: "Discuss GG strategies and tips",
        icon: "💬",
        href: "/gg/forum",
      },
    ],
  },
  bb: {
    name: "BB",
    fullName: "BlazBlue",
    description:
      "Join the Iranian BlazBlue community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-indigo-600",
    features: [
      {
        title: "Tournaments",
        description: "Join BB tournaments and compete",
        icon: "🏆",
        href: "/bb/events",
      },
      {
        title: "Matchmaking",
        description: "Find BB players to play with",
        icon: "👥",
        href: "/bb/matchmaking",
      },
      {
        title: "News",
        description: "Latest BB news and updates",
        icon: "📰",
        href: "/bb/news",
      },
      {
        title: "Forum",
        description: "Discuss BB strategies and tips",
        icon: "💬",
        href: "/bb/forum",
      },
    ],
  },
  uni: {
    name: "UNI",
    fullName: "Under Night In-Birth",
    description:
      "Join the Iranian Under Night In-Birth community. Compete in tournaments, find matches, and discuss strategies.",
    color: "bg-pink-600",
    features: [
      {
        title: "Tournaments",
        description: "Join UNI tournaments and compete",
        icon: "🏆",
        href: "/uni/events",
      },
      {
        title: "Matchmaking",
        description: "Find UNI players to play with",
        icon: "👥",
        href: "/uni/matchmaking",
      },
      {
        title: "News",
        description: "Latest UNI news and updates",
        icon: "📰",
        href: "/uni/news",
      },
      {
        title: "Forum",
        description: "Discuss UNI strategies and tips",
        icon: "💬",
        href: "/uni/forum",
      },
    ],
  },
};

export default async function GamePage({ params }: GamePageProps) {
  const { gameSlug } = (await params) as { gameSlug: GameSlug };
  const gameInfo = GAME_INFO[gameSlug];

  if (!gameInfo) {
    return <div>Game not found</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className={`${gameInfo.color} text-white rounded-lg p-8 text-center`}
      >
        <h1 className="text-4xl font-bold mb-4">{gameInfo.fullName}</h1>
        <p className="text-xl opacity-90 max-w-2xl mx-auto">
          {gameInfo.description}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {gameInfo.features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>New tournament announced for next month</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>5 new LFG posts in the last hour</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            <span>New strategy guide posted in forum</span>
          </div>
        </div>
      </div>

      {/* Discord Integration */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Join Our Discord
        </h2>
        <p className="text-gray-600 mb-4">
          Connect with other {gameInfo.name} players on Discord for real-time
          discussions, matchmaking, and tournament updates.
        </p>
        <a
          href="#"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Join Discord Server
        </a>
      </div>
    </div>
  );
}
