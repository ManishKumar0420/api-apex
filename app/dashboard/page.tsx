"use client";
import { useEffect, useState } from "react";
import {APICard} from "@/components/APICard";
import { APIChainingComponent } from "@/components/APIChaining";
import {LoggerComponent} from "@/components/Logger";
import { AuthType, HttpMethod } from "@/lib/types";

interface APIInfo {
  id: string;
  name: string;
  description?: string;
  method: HttpMethod;
  path: string;
  authType: AuthType;
}

export default function DashboardPage() {
  const [apis, setApis] = useState<APIInfo[]>([]);
  const [tab, setTab] = useState<"apis" | "chain" | "logs">("apis");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetadata() {
      setLoading(true);
      try {
        const res = await fetch("/api/metadata", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          setApis(json.data || []);
        } else {
          setApis([]);
        }
      } catch (e) {
        setApis([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMetadata();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="bg-white border-b py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-semibold">🚀 API Apex</h1>
          <div className="text-sm text-gray-600">APIs: {apis.length}</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-6">
          <nav className="flex gap-3">
            <button onClick={() => setTab("apis")} className={`px-4 py-2 rounded ${tab==="apis"?"bg-blue-600 text-white":"bg-white border"}`}>🔌 APIs</button>
            <button onClick={() => setTab("chain")} className={`px-4 py-2 rounded ${tab==="chain"?"bg-blue-600 text-white":"bg-white border"}`}>🔗 Chaining</button>
            <button onClick={() => setTab("logs")} className={`px-4 py-2 rounded ${tab==="logs"?"bg-blue-600 text-white":"bg-white border"}`}>📋 Logs</button>
          </nav>
        </div>

        {tab === "apis" && (
          <section>
            <h2 className="text-lg font-medium mb-4">Available APIs</h2>
            {loading ? (
              <div className="p-6 bg-white border rounded">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apis.map((api) => (
                  <APICard key={api.id} api={api as any} onTest={() => {}} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "chain" && (
          <section>
            <h2 className="text-lg font-medium mb-4">API Chaining</h2>
            <APIChainingComponent availableApis={apis.map(a=>({id:a.id,name:a.name}))} onExecuteChain={async (chain) => { /* noop */ }} />
          </section>
        )}

        {tab === "logs" && (
          <section>
            <h2 className="text-lg font-medium mb-4">Logs</h2>
            <Logger />
          </section>
        )}
      </main>
    </div>
  );
}