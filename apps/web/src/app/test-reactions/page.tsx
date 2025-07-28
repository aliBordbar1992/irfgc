"use client";

import { Reactions } from "@/components/Reactions";
import { ContentType } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestReactionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Reactions System Test
        </h1>

        <div className="grid gap-6">
          {/* News Article */}
          <Card>
            <CardHeader>
              <CardTitle>News Article</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is a sample news article. You can react to it with any
                emoji you want!
              </p>
              <Reactions
                contentId="test-news-123"
                contentType={ContentType.NEWS}
              />
            </CardContent>
          </Card>

          {/* Event */}
          <Card>
            <CardHeader>
              <CardTitle>Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is a sample event. Show your excitement with reactions!
              </p>
              <Reactions
                contentId="test-event-456"
                contentType={ContentType.EVENT}
              />
            </CardContent>
          </Card>

          {/* Forum Thread */}
          <Card>
            <CardHeader>
              <CardTitle>Forum Thread</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                This is a sample forum thread. React to show your thoughts!
              </p>
              <Reactions
                contentId="test-forum-789"
                contentType={ContentType.FORUM_THREAD}
              />
            </CardContent>
          </Card>

          {/* LFG Post */}
          <Card>
            <CardHeader>
              <CardTitle>LFG Post</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Looking for group! React if you&apos;re interested in joining.
              </p>
              <Reactions
                contentId="test-lfg-101"
                contentType={ContentType.LFG_POST}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            How to use Reactions:
          </h2>
          <ul className="text-blue-800 space-y-1">
            <li>• Click the emoji picker button (😊) to add a reaction</li>
            <li>• Click on existing reactions to toggle them</li>
            <li>• Your reactions will be highlighted in red</li>
            <li>• You can only have one reaction per content</li>
            <li>• Anonymous users will be prompted to login</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
