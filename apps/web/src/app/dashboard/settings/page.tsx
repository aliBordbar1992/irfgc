import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure platform-wide settings, integrations, and system preferences
        </p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="IRFGC - Iranian Fighting Game Community"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              defaultValue="A centralized platform for the Iranian Fighting Game Community, providing tournament organization, matchmaking, news, and community features."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="admin@irfgc.ir"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="Asia/Tehran">Asia/Tehran (UTC+3:30)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email-verification"
              className="rounded"
              defaultChecked
            />
            <label
              htmlFor="email-verification"
              className="text-sm text-gray-700"
            >
              Require email verification for new accounts
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="two-factor" className="rounded" />
            <label htmlFor="two-factor" className="text-sm text-gray-700">
              Enable two-factor authentication for admins
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="password-strength"
              className="rounded"
              defaultChecked
            />
            <label
              htmlFor="password-strength"
              className="text-sm text-gray-700"
            >
              Enforce strong password requirements
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue={60}
              min={15}
              max={480}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue={5}
              min={3}
              max={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Host
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="smtp.gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue={587}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Username
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue="noreply@irfgc.ir"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter email password"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="email-ssl"
              className="rounded"
              defaultChecked
            />
            <label htmlFor="email-ssl" className="text-sm text-gray-700">
              Use SSL/TLS encryption
            </label>
          </div>
          <Button variant="outline">Test Email Configuration</Button>
        </CardContent>
      </Card>

      {/* Discord Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Discord Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discord Bot Token
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter Discord bot token"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discord Server ID
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter Discord server ID"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="discord-events"
              className="rounded"
              defaultChecked
            />
            <label htmlFor="discord-events" className="text-sm text-gray-700">
              Auto-post events to Discord
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="discord-news"
              className="rounded"
              defaultChecked
            />
            <label htmlFor="discord-news" className="text-sm text-gray-700">
              Auto-post news to Discord
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="discord-roles" className="rounded" />
            <label htmlFor="discord-roles" className="text-sm text-gray-700">
              Sync user roles with Discord
            </label>
          </div>
          <Button variant="outline">Test Discord Connection</Button>
        </CardContent>
      </Card>

      {/* Content Moderation */}
      <Card>
        <CardHeader>
          <CardTitle>Content Moderation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="auto-moderation"
              className="rounded"
              defaultChecked
            />
            <label htmlFor="auto-moderation" className="text-sm text-gray-700">
              Enable automatic content moderation
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banned Words (one per line)
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Enter banned words, one per line"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Posts per Day
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              defaultValue={10}
              min={1}
              max={50}
            />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="require-approval" className="rounded" />
            <label htmlFor="require-approval" className="text-sm text-gray-700">
              Require approval for new forum threads
            </label>
          </div>
        </CardContent>
      </Card>

      {/* System Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>System Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="maintenance-mode" className="rounded" />
            <label htmlFor="maintenance-mode" className="text-sm text-gray-700">
              Enable maintenance mode
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Message
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Message to display during maintenance"
            />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">Clear Cache</Button>
            <Button variant="outline">Backup Database</Button>
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">Save All Settings</Button>
      </div>
    </div>
  );
}
