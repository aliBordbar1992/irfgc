import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DiscordIntegration } from "@/features/dashboard/DiscordIntegration";

export default async function DiscordPage() {
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
          Discord Integration
        </h1>
        <p className="text-gray-600 mt-2">
          Send notifications and announcements to your Discord server
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DiscordIntegration />

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Discord Webhook Setup
            </h2>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                To enable Discord notifications, you need to configure a webhook
                URL in your environment variables:
              </p>
              <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                DISCORD_WEBHOOK_URL=&quot;https://discord.com/api/webhooks/your-webhook-url&quot;
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">
                  Setup Instructions:
                </h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to your Discord server settings</li>
                  <li>Navigate to Integrations → Webhooks</li>
                  <li>Create a new webhook for the desired channel</li>
                  <li>Copy the webhook URL</li>
                  <li>Add it to your environment variables</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Notification Types
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span>
                  <strong>Event:</strong> Tournament and event announcements
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>
                  <strong>News:</strong> Community news and updates
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span>
                  <strong>Tournament:</strong> Tournament-specific announcements
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span>
                  <strong>General:</strong> General community updates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
