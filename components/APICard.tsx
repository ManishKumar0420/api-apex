"use client";

import { useState } from "react";
import { AuthType, HttpMethod } from "@/lib/types";

interface APIInfo {
  id: string;
  name: string;
  description: string;
  method: HttpMethod;
  path: string;
  authType: AuthType;
  requestSchema?: Record<string, any>;
  responseSchema?: Record<string, any>;
  chainableWith?: string[];
}

interface APICardProps {
  api: APIInfo;
  onTest: (apiId: string, config: any) => void;
  loading?: boolean;
}

const AuthBadge = {
  [AuthType.NONE]: {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
    label: "No Auth",
  },
  [AuthType.API_KEY]: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    label: "API Key",
  },
  [AuthType.JWT]: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    label: "JWT",
  },
};

const MethodColor = {
  GET: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  POST: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  PUT: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  DELETE: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  PATCH: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
};

export function APICard({ api, onTest, loading = false }: APICardProps) {
  const [authMethod, setAuthMethod] = useState<AuthType>(api.authType);
  const defaultBody = api.method === "POST" || api.method === "PUT" || api.method === "PATCH"
    ? JSON.stringify({
        name: "Example Item",
        description: "This is a test request body",
        email: "test@example.com",
        age: 25
      }, null, 2)
    : "{}";
  const [requestBody, setRequestBody] = useState(defaultBody);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);

  const methodStyle = MethodColor[api.method];
  const authStyle = AuthBadge[authMethod];

  const handleTest = async () => {
    setError("");
    setResponse(null);
    setResponseTime(null);

    try {
      const startTime = performance.now();
      const headers: any = { "Content-Type": "application/json" };

      if (authMethod === AuthType.API_KEY) {
        headers["X-API-Key"] = "test-api-key-12345";
      } else if (authMethod === AuthType.JWT) {
        headers["Authorization"] = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w";
      }

      const response = await fetch(api.path.replace("[id]", "1"), {
        method: api.method,
        headers,
        body:
          api.method !== "GET" && api.method !== "DELETE" ? requestBody : undefined
      });

      const responseTime = performance.now() - startTime;
      setResponseTime(Math.round(responseTime));

      const data = await response.json();
      setResponse(data);
      setShowResponse(true);

      if (!response.ok) {
        setError(data.error || `HTTP ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to test API");
    }
  };

  return (
    <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.75rem" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{api.name}</h3>
            <p style={{ fontSize: 13, color: "#94a3b8", marginTop: "0.5rem" }}>{api.description}</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid rgba(99,102,241,0.3)`,
                background: "rgba(99,102,241,0.15)",
                color: "#a5b4fc",
              }}
            >
              {api.method}
            </span>
            <span
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                border: `1px solid rgba(99,102,241,0.3)`,
                background: "rgba(99,102,241,0.15)",
                color: "#a5b4fc",
              }}
            >
              {authStyle.label}
            </span>
          </div>
        </div>

        {/* Path */}
        <code style={{ fontSize: 12, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", color: "#6ee7b7", padding: "0.5rem 0.75rem", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", display: "block" }}>
          {api.path}
        </code>
      </div>

      {/* Body */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* Auth Method Selector */}
        {api.authType !== AuthType.NONE && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>
              Authentication Method
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[AuthType.NONE, AuthType.API_KEY, AuthType.JWT].map((auth) => (
                <button
                  key={auth}
                  onClick={() => setAuthMethod(auth)}
                  disabled={api.authType !== auth && api.authType !== AuthType.NONE}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: authMethod === auth ? "rgba(99,102,241,0.2)" : "#0b0d12",
                    color: authMethod === auth ? "#a5b4fc" : "#475569",
                    cursor: api.authType !== auth && api.authType !== AuthType.NONE ? "not-allowed" : "pointer",
                    opacity: api.authType !== auth && api.authType !== AuthType.NONE ? 0.5 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  {AuthBadge[auth].label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Request Body Editor */}
        {(api.method === "POST" || api.method === "PUT" || api.method === "PATCH") && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem", display: "block" }}>
              Request Body
            </label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              style={{
                width: "100%",
                height: "8rem",
                padding: "0.75rem",
                background: "#0b0d12",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: "#e2e8f0",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                outline: "none",
                resize: "none",
              }}
              placeholder='{"name": "example"}'
            />
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            background: loading ? "rgba(99,102,241,0.3)" : "#6366f1",
            color: loading ? "#818cf8" : "#ffffff",
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#4f46e5")}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#6366f1")}
        >
          {loading ? "Testing..." : "Test API"}
        </button>

        {/* Response Time */}
        {responseTime && (
          <div style={{ padding: "0.75rem", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: "#86efac" }}>
              ✅ Response received in <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>{responseTime}ms</span>
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "0.75rem", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: "#fca5a5" }}>
              ❌ <span style={{ fontWeight: 600 }}>{error}</span>
            </p>
          </div>
        )}

        {/* Response */}
        {showResponse && response && (
          <details style={{ cursor: "pointer" }}>
            <summary style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", padding: "0.5rem 0", transition: "color 0.15s" }}>
              📋 View Response
            </summary>
            <pre style={{ marginTop: "0.5rem", padding: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", color: "#cbd5e1", borderRadius: 8, fontSize: 12, overflow: "auto", maxHeight: "16rem", fontFamily: "'JetBrains Mono', monospace" }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        )}

        {/* Chainable APIs */}
        {api.chainableWith && api.chainableWith.length > 0 && (
          <div style={{ padding: "0.75rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#a5b4fc", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              🔗 Can chain with:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {api.chainableWith.map((chainId) => (
                <span key={chainId} style={{ padding: "0.25rem 0.5rem", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", color: "#a5b4fc", fontSize: 11, borderRadius: 6 }}>
                  {chainId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}