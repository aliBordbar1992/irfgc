import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DebugSessionPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Session Object:</h2>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mt-4 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Session Analysis:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Session exists: {session ? "Yes" : "No"}</li>
          <li>Session user exists: {session?.user ? "Yes" : "No"}</li>
          <li>Session user ID: {session?.user?.id || "undefined"}</li>
          <li>Session user email: {session?.user?.email || "undefined"}</li>
          <li>Session user name: {session?.user?.name || "undefined"}</li>
          <li>Session user role: {session?.user?.role || "undefined"}</li>
        </ul>
      </div>

      {session?.user?.id && (
        <div className="mt-4 bg-green-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">✅ Session is valid!</h2>
          <p>User ID: {session.user.id}</p>
          <p>User Email: {session.user.email}</p>
          <p>User Name: {session.user.name}</p>
        </div>
      )}

      {!session?.user?.id && (
        <div className="mt-4 bg-red-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">❌ Session is invalid!</h2>
          <p>
            The session user ID is missing. This is causing the profile page
            error.
          </p>
        </div>
      )}
    </div>
  );
}
