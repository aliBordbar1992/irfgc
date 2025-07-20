"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const testDatabase = async () => {
    setLoading(true);
    setError("");
    setDebugData(null);

    try {
      const response = await fetch("/api/debug/users");
      const data = await response.json();

      if (response.ok) {
        setDebugData(data);
      } else {
        setError(data.error || "Failed to fetch debug data");
      }
    } catch (err) {
      setError(
        "Network error: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Database Debug</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Database Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testDatabase} disabled={loading}>
            {loading ? "Testing..." : "Test Database"}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {debugData && (
        <Card>
          <CardHeader>
            <CardTitle>Debug Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <strong>Database Connected:</strong>{" "}
                {debugData.data?.databaseConnected ? "Yes" : "No"}
              </div>
              <div>
                <strong>User Count:</strong> {debugData.data?.userCount || 0}
              </div>
              <div>
                <strong>Users:</strong>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-sm overflow-auto">
                  {JSON.stringify(debugData.data?.users || [], null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
