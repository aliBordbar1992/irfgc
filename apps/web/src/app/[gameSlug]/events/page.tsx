import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventsPageProps {
  params: Promise<{
    gameSlug: string;
  }>;
}

// Mock events data - will be replaced with API calls
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Weekly Tournament",
    description: "Join our weekly tournament and compete with other players",
    type: "tournament",
    status: "upcoming",
    startDate: "2024-01-15T18:00:00Z",
    location: "Online",
    maxParticipants: 32,
    currentParticipants: 24,
  },
  {
    id: "2",
    title: "Casual Meetup",
    description: "Casual play session for all skill levels",
    type: "casual",
    status: "upcoming",
    startDate: "2024-01-20T14:00:00Z",
    location: "Tehran Gaming Center",
    maxParticipants: 20,
    currentParticipants: 12,
  },
  {
    id: "3",
    title: "Championship Series",
    description: "Major championship with prize pool",
    type: "tournament",
    status: "upcoming",
    startDate: "2024-02-01T16:00:00Z",
    location: "Online",
    maxParticipants: 64,
    currentParticipants: 45,
  },
];

export default async function EventsPage({ params }: EventsPageProps) {
  const { gameSlug } = await params;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 capitalize">
            {gameSlug} Events
          </h1>
          <p className="text-gray-600 mt-2">
            Find tournaments, casual meetups, and competitive events
          </p>
        </div>
        <Button>Create Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EVENTS.map((event) => (
          <Card key={event.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {event.description}
                  </CardDescription>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.type === "tournament"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {event.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{event.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Participants:</span>
                  <span className="font-medium">
                    {event.currentParticipants}/{event.maxParticipants}
                  </span>
                </div>
                <div className="pt-2">
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-gray-600">
          More events coming soon! Check back regularly for updates.
        </p>
      </div>
    </div>
  );
}
