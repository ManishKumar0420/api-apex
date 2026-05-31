"use client";

import { useState, useEffect } from "react";
import { APICard } from "@/components/APICard";
import { APIChainingComponent } from "@/components/APIChaining";
import { LoggerComponent } from "@/components/Logger";
import { HttpMethod, AuthType } from "@/lib/types";

interface APIEndpoint {
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

export default function TestingDashboard() {
  const [apis, setApis] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"apis" | "chaining" | "logs">("apis");
  const [responseDelay, setResponseDelay] = useState(0);
  const [selectedAuth, setSelectedAuth] = useState<AuthType>(AuthType.JWT);

  useEffect(() => {
    const fetchAPIs = async () => {
      try {
        const response = await fetch("/api/metadata");
        const data = await response.json();
        setApis(data.data.apis || []);
      } catch (error) {
        console.error("Failed to fetch API metadata:", error);
      } finally {
        setLoading(false);
      }
    };  
    fetchAPIs();
  }, []);

  const handleTestAPI = async (apiId: string, config: any) => {
    console.log("Testing API:", apiId, config);
  };

  const handleExecuteChain = async (chain: any) => {
    console.log("Executing chain:", chain);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <div className="spinner-ring" />
          <p className="loading-text">Fetching endpoints…</p>
        </div>
        <style>{`
          .loading-screen {
            min-height: 100vh;
            background: #0b0d12;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
          }
          .spinner-ring {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: 3px solid rgba(99,102,241,0.2);
            border-top-color: #6366f1;
            animation: spin 0.8s linear infinite;
          }
          .loading-text {
            color: #64748b;
            font-size: 14px;
            letter-spacing: 0.04em;
            font-family: 'JetBrains Mono', monospace;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const tabs = [
    { id: "apis" as const, label: "Endpoints", count: apis.length },
    { id: "chaining" as const, label: "Chain" },
    { id: "logs" as const, label: "Logs" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .dash {
          min-height: 100vh;
          background: #0b0d12;
          color: #e2e8f0;
          font-family: 'Syne', sans-serif;
        }

        /* ── Header ── */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(11,13,18,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 0 2rem;
        }
        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .brand-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .brand-name {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.02em;
        }
        .brand-sub {
          font-size: 11px;
          color: #475569;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: 'JetBrains Mono', monospace;
        }
        .header-stat {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
        }
        .header-stat-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 6px #6366f1;
          animation: pulse 2s ease-in-out infinite;
        }
        .header-stat-text {
          font-size: 13px;
          color: #a5b4fc;
          font-family: 'JetBrains Mono', monospace;
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        /* ── Main ── */
        .main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 2rem 4rem;
        }

        /* ── Controls strip ── */
        .controls {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        .ctrl-cell {
          background: #111318;
          padding: 1.25rem 1.5rem;
        }
        .ctrl-cell:last-child {
          border-radius: 0 12px 12px 0;
        }
        .ctrl-cell:first-child {
          border-radius: 12px 0 0 12px;
        }
        .ctrl-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          margin-bottom: 10px;
        }
        .ctrl-select {
          width: 100%;
          background: #0b0d12;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          color: #e2e8f0;
          font-size: 13px;
          font-family: 'JetBrains Mono', monospace;
          padding: 8px 12px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }
        .ctrl-select:focus { border-color: #6366f1; }
        .ctrl-select option { background: #111318; }

        .delay-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .delay-slider {
          flex: 1;
          -webkit-appearance: none;
          height: 3px;
          background: rgba(99,102,241,0.2);
          border-radius: 2px;
          outline: none;
        }
        .delay-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
          transition: box-shadow 0.15s;
        }
        .delay-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(99,102,241,0.3);
        }
        .delay-badge {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #a5b4fc;
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 6px;
          padding: 4px 10px;
          min-width: 60px;
          text-align: center;
        }

        .ctrl-hint {
          font-size: 12px;
          color: #475569;
          line-height: 1.6;
          font-family: 'JetBrains Mono', monospace;
        }
        .ctrl-hint strong {
          color: #6366f1;
          font-weight: 500;
        }

        /* ── Tabs ── */
        .tabs {
          display: flex;
          gap: 2px;
          margin-bottom: 1.75rem;
          background: #111318;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 4px;
          width: fit-content;
        }
        .tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 18px;
          border: none;
          background: transparent;
          border-radius: 7px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.01em;
        }
        .tab-btn:hover { color: #94a3b8; }
        .tab-btn.active {
          background: rgba(99,102,241,0.15);
          color: #a5b4fc;
        }
        .tab-count {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(99,102,241,0.2);
          color: #818cf8;
          border-radius: 10px;
          padding: 1px 7px;
        }

        /* ── Tip banner ── */
        .tip-banner {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 16px;
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.15);
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
          font-family: 'JetBrains Mono', monospace;
        }
        .tip-banner span { color: #a5b4fc; }

        /* ── API grid ── */
        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1rem;
        }

        /* ── Chaining section ── */
        .chain-wrap { display: flex; flex-direction: column; gap: 1.5rem; }
        .chain-guide {
          padding: 1.5rem;
          background: #111318;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
        .chain-guide-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }
        .chain-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .chain-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 13px;
          color: #64748b;
          font-family: 'JetBrains Mono', monospace;
          line-height: 1.5;
        }
        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: #818cf8;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem 2rem;
          text-align: center;
          font-size: 12px;
          color: #334155;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.03em;
        }

        @media (max-width: 900px) {
          .controls { grid-template-columns: 1fr; }
          .ctrl-cell:first-child { border-radius: 12px 12px 0 0; }
          .ctrl-cell:last-child { border-radius: 0 0 12px 12px; }
          .api-grid { grid-template-columns: 1fr; }
          .main { padding: 1.25rem 1rem 3rem; }
          .header { padding: 0 1rem; }
        }
      `}</style>

      <div className="dash">
        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="brand">
              <div className="brand-icon">⚡</div>
              <div>
                <div className="brand-name">API Apex</div>
                <div className="brand-sub">Testing Platform</div>
              </div>
            </div>
            <div className="header-stat">
              <div className="header-stat-dot" />
              <span className="header-stat-text">{apis.length} endpoints live</span>
            </div>
          </div>
        </header>

        <main className="main">
          {/* Controls */}
          <div className="controls">
            <div className="ctrl-cell">
              <div className="ctrl-label">Auth method</div>
              <select
                className="ctrl-select"
                value={selectedAuth}
                onChange={(e) => setSelectedAuth(e.target.value as AuthType)}
              >
                <option value={AuthType.NONE}>None</option>
                <option value={AuthType.API_KEY}>API Key</option>
                <option value={AuthType.JWT}>JWT Token</option>
              </select>
            </div>

            <div className="ctrl-cell">
              <div className="ctrl-label">Response delay</div>
              <div className="delay-row">
                <input
                  type="range"
                  className="delay-slider"
                  min="0"
                  max="5000"
                  step="100"
                  value={responseDelay}
                  onChange={(e) => setResponseDelay(parseInt(e.target.value))}
                />
                <span className="delay-badge">{responseDelay}ms</span>
              </div>
            </div>

            <div className="ctrl-cell">
              <div className="ctrl-label">Status</div>
              <div className="ctrl-hint">
                <strong>Auth</strong> · {selectedAuth.toLowerCase().replace("_", " ")}<br />
                <strong>Delay</strong> · {responseDelay}ms simulated
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.id === "apis" && "Endpoints"}
                {tab.id === "chaining" && "Chaining"}
                {tab.id === "logs" && "Logs"}
                {tab.count !== undefined && (
                  <span className="tab-count">{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: APIs */}
          {activeTab === "apis" && (
            <div>
              <div className="tip-banner">
                <span>ℹ</span>
                Each card shows method, path, auth requirement, and response time. Test individually or chain via the Chaining tab.
              </div>
              <div className="api-grid">
                {apis.map((api) => (
                  <APICard
                    key={api.id}
                    api={api}
                    onTest={handleTestAPI}
                    loading={loading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab: Chaining */}
          {activeTab === "chaining" && (
            <div className="chain-wrap">
              <APIChainingComponent
                availableApis={apis.map((a) => ({ id: a.id, name: a.name }))}
                onExecuteChain={handleExecuteChain}
                loading={loading}
              />
              <div className="chain-guide">
                <div className="chain-guide-title">How chaining works</div>
                <div className="chain-steps">
                  {[
                    "Select the first API endpoint to execute",
                    'Specify a JSON path to extract data from the response — e.g. "0.id" for the first item\'s ID',
                    "Select the next API and inject the extracted value as a parameter",
                    "Add more steps as needed, then run the entire chain in sequence",
                  ].map((text, i) => (
                    <div key={i} className="chain-step">
                      <div className="step-num">{i + 1}</div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Logs */}
          {activeTab === "logs" && <LoggerComponent />}
        </main>

        <footer className="footer">
          API Apex © 2025 · Advanced API Testing Platform · Built with Next.js &amp; TypeScript
        </footer>
      </div>
    </>
  );
}