/**
 * LOGGER PAGE COMPONENT
 * ======================
 *
 * Displays real-time API logs with:
 * - Log levels (info, warn, error, debug)
 * - Request IDs for tracing
 * - Response times
 * - Formatted timestamps
 * - Auto-refresh capability
 * - Detailed request/response information
 */

"use client";

import { useState, useEffect, useRef } from "react";

interface LogEntry {
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  context?: Record<string, any>;
  requestId?: string;
  duration?: number;
  method?: string;
  endpoint?: string;
  authType?: string;
  headers?: Record<string, string>;
  requestBody?: Record<string, any>;
  responseBody?: Record<string, any>;
  statusCode?: number;
  origin?: string;
}

const LEVEL_CONFIG = {
  info: {
    border: "#3b82f6",
    badgeBg: "rgba(59,130,246,0.12)",
    badgeColor: "#93c5fd",
    labelColor: "#60a5fa",
  },
  warn: {
    border: "#f59e0b",
    badgeBg: "rgba(245,158,11,0.12)",
    badgeColor: "#fcd34d",
    labelColor: "#fbbf24",
  },
  error: {
    border: "#ef4444",
    badgeBg: "rgba(239,68,68,0.12)",
    badgeColor: "#fca5a5",
    labelColor: "#f87171",
  },
  debug: {
    border: "#6b7280",
    badgeBg: "rgba(107,114,128,0.12)",
    badgeColor: "#9ca3af",
    labelColor: "#6b7280",
  },
} as const;

const LEVEL_ICON = {
  info:  "ti-info-circle",
  warn:  "ti-alert-triangle",
  error: "ti-circle-x",
  debug: "ti-bug",
} as const;

export function LoggerComponent() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<"all" | "info" | "warn" | "error" | "debug">("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [expandedLogId, setExpandedLogId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const endpoints = [
    { method: "GET", path: "/api/users", authType: "JWT" },
    { method: "POST", path: "/api/users/create", authType: "JWT" },
    { method: "GET", path: "/api/products", authType: "API_KEY" },
    { method: "PUT", path: "/api/products/[id]", authType: "JWT" },
    { method: "DELETE", path: "/api/users/[id]", authType: "JWT" },
  ];

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const duration = Math.floor(Math.random() * 500) + 50;
      const statusCode = Math.random() > 0.1 ? 200 : Math.random() > 0.5 ? 400 : 500;
      const level = statusCode === 200 ? (Math.random() > 0.7 ? "debug" : "info") : "error";

      const newLog: LogEntry = {
        timestamp: new Date(),
        level,
        message: `${endpoint.method} ${endpoint.path} - ${statusCode}`,
        requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
        duration,
        method: endpoint.method,
        endpoint: endpoint.path,
        authType: endpoint.authType,
        statusCode,
        origin: ["localhost:3000", "127.0.0.1:8080", "api.example.com"][Math.floor(Math.random() * 3)],
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${endpoint.authType === "JWT" ? "eyJhbGc..." : "key-abc123"}`,
          "User-Agent": "Mozilla/5.0",
          "X-Request-ID": `req_${Math.random().toString(36).substr(2, 9)}`,
        },
        requestBody: endpoint.method !== "GET" && endpoint.method !== "DELETE" ? {
          name: "Sample Item",
          email: "user@example.com",
          age: 25,
        } : undefined,
        responseBody: {
          success: statusCode === 200,
          data: statusCode === 200 ? {
            id: Math.random().toString(36).substr(2, 9),
            message: "Operation completed successfully",
          } : null,
          error: statusCode !== 200 ? "Request failed" : null,
        },
      };

      setLogs((prev) => [...prev.slice(-49), newLog]);
    }, 2500);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs =
    filter === "all" ? logs : logs.filter((log) => log.level === filter);

  const counts = {
    all:   logs.length,
    info:  logs.filter((l) => l.level === "info").length,
    warn:  logs.filter((l) => l.level === "warn").length,
    error: logs.filter((l) => l.level === "error").length,
    debug: logs.filter((l) => l.level === "debug").length,
  };

  return (
    <>
      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css');

        .log-root {
          background: #111318;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }

        /* ── toolbar ── */
        .log-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 12px;
          flex-wrap: wrap;
        }
        .log-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .log-title i { font-size: 16px; color: #6366f1; }
        .log-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px #22c55e;
          animation: blink 1.6s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }
        .log-live-dot.paused {
          background: #475569;
          box-shadow: none;
          animation: none;
        }
        .log-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .log-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.08);
          background: transparent;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .log-btn i { font-size: 14px; }
        .log-btn.live {
          color: #86efac;
          border-color: rgba(34,197,94,0.25);
          background: rgba(34,197,94,0.08);
        }
        .log-btn.live:hover { background: rgba(34,197,94,0.14); }
        .log-btn.paused-btn {
          color: #94a3b8;
          border-color: rgba(255,255,255,0.08);
        }
        .log-btn.paused-btn:hover { background: rgba(255,255,255,0.05); }
        .log-btn.clear {
          color: #fca5a5;
          border-color: rgba(239,68,68,0.2);
          background: rgba(239,68,68,0.06);
        }
        .log-btn.clear:hover { background: rgba(239,68,68,0.12); }

        /* ── filter bar ── */
        .log-filters {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .log-filters::-webkit-scrollbar {
          height: 3px;
        }
        .log-filters::-webkit-scrollbar-track {
          background: transparent;
        }
        .log-filters::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .log-filter-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.06);
          background: transparent;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #64748b;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .log-filter-btn:hover { color: #94a3b8; border-color: rgba(255,255,255,0.12); }
        .log-filter-btn.active-all {
          background: rgba(99,102,241,0.15);
          border-color: rgba(99,102,241,0.3);
          color: #a5b4fc;
        }
        .log-filter-btn.active-info {
          background: rgba(59,130,246,0.12);
          border-color: rgba(59,130,246,0.3);
          color: #93c5fd;
        }
        .log-filter-btn.active-warn {
          background: rgba(245,158,11,0.12);
          border-color: rgba(245,158,11,0.3);
          color: #fcd34d;
        }
        .log-filter-btn.active-error {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.3);
          color: #fca5a5;
        }
        .log-filter-btn.active-debug {
          background: rgba(107,114,128,0.12);
          border-color: rgba(107,114,128,0.3);
          color: #9ca3af;
        }
        .filter-count {
          font-size: 10px;
          opacity: 0.7;
        }

        /* ── scroll area ── */
        .log-scroll {
          max-height: 560px;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .log-scroll::-webkit-scrollbar { width: 6px; }
        .log-scroll::-webkit-scrollbar-track { background: transparent; }
        .log-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 3px;
        }
        .log-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.12);
        }

        /* ── empty state ── */
        .log-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 3rem 1rem;
          color: #334155;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
        }
        .log-empty i { font-size: 28px; }

        /* ── log row ── */
        .log-row {
          display: flex;
          align-items: flex-start;
          gap: 0;
          border-radius: 8px;
          background: #0e1016;
          border: 1px solid rgba(255,255,255,0.04);
          overflow: hidden;
          transition: border-color 0.15s;
          flex-direction: column;
        }
        .log-row:hover { border-color: rgba(255,255,255,0.09); }
        .log-accent {
          width: 100%;
          height: 3px;
          flex-shrink: 0;
          align-self: stretch;
        }
        .log-body {
          flex: 1;
          padding: 9px 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: 0;
          width: 100%;
          flex-wrap: wrap;
        }
        .log-icon {
          font-size: 14px;
          margin-top: 1px;
          flex-shrink: 0;
        }
        .log-content { 
          flex: 1; 
          min-width: 200px;
          overflow: hidden;
        }
        .log-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          flex-wrap: wrap;
          margin-bottom: 4px;
        }
        .log-badge {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 2px 7px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .log-reqid {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 1px 7px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .log-message {
          font-size: 13px;
          color: #cbd5e1;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.01em;
          word-break: break-word;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .log-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
          padding-top: 2px;
          min-width: 60px;
        }
        .log-time {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .log-duration {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
        }
        .log-duration.fast { color: #4ade80; }
        .log-duration.mid  { color: #facc15; }
        .log-duration.slow { color: #f87171; }

        /* ── expanded details ── */
        .log-details {
          padding: 12px 10px;
          background: #0b0d12;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-radius: 0 0 8px 8px;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          color: #cbd5e1;
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .log-details-section {
          margin-bottom: 12px;
        }
        .log-details-section:last-child {
          margin-bottom: 0;
        }
        .log-details-title {
          font-weight: 600;
          color: #a5b4fc;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .log-details-content {
          background: #000000;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 4px;
          padding: 8px 10px;
          overflow-x: auto;
          overflow-y: auto;
          max-height: 140px;
          -webkit-overflow-scrolling: touch;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: 11px;
        }
        .log-details-content::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .log-details-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .log-details-content::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
        .log-details-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 8px 12px;
        }
        .log-details-key {
          color: #6ee7b7;
          font-weight: 500;
          white-space: nowrap;
        }
        .log-details-value {
          color: #cbd5e1;
          word-break: break-all;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .log-row.expanded {
          border-color: rgba(99,102,241,0.3);
          background: #111318;
        }
        .log-row-clickable {
          cursor: pointer;
        }
        .log-row-clickable:hover {
          background: #151a20;
        }

        /* ── Mobile Responsive ── */
        @media (max-width: 768px) {
          .log-root {
            border-radius: 8px;
          }
          .log-toolbar {
            padding: 12px 12px;
            gap: 8px;
          }
          .log-title {
            font-size: 13px;
          }
          .log-btn {
            padding: 5px 10px;
            font-size: 11px;
          }
          .log-filters {
            padding: 8px 12px;
            gap: 4px;
          }
          .log-filter-btn {
            padding: 3px 10px;
            font-size: 10px;
          }
          .log-scroll {
            max-height: 400px;
            padding: 8px;
            gap: 3px;
          }
          .log-body {
            padding: 8px 10px;
            gap: 8px;
          }
          .log-content {
            min-width: 150px;
          }
          .log-message {
            font-size: 12px;
          }
          .log-right {
            min-width: 50px;
            gap: 2px;
          }
          .log-time {
            font-size: 10px;
          }
          .log-duration {
            font-size: 10px;
          }
          .log-details {
            padding: 10px 8px;
            font-size: 11px;
          }
          .log-details-title {
            font-size: 10px;
          }
          .log-details-content {
            padding: 6px 8px;
            max-height: 120px;
            font-size: 10px;
          }
          .log-details-grid {
            grid-template-columns: auto 1fr;
            gap: 6px 10px;
          }
          .log-details-key {
            font-size: 10px;
          }
          .log-details-value {
            font-size: 10px;
          }
        }

        @media (max-width: 480px) {
          .log-root {
            border-radius: 6px;
          }
          .log-toolbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 10px;
            gap: 6px;
          }
          .log-title {
            font-size: 12px;
            width: 100%;
          }
          .log-actions {
            width: 100%;
            gap: 4px;
          }
          .log-btn {
            flex: 1;
            padding: 4px 8px;
            font-size: 10px;
            min-width: fit-content;
          }
          .log-filters {
            padding: 6px 10px;
            gap: 3px;
            overflow-x: auto;
          }
          .log-filter-btn {
            padding: 2px 8px;
            font-size: 9px;
          }
          .log-scroll {
            max-height: 350px;
            padding: 6px;
            gap: 2px;
          }
          .log-row {
            border-radius: 6px;
          }
          .log-body {
            padding: 6px 8px;
            gap: 6px;
            flex-direction: column;
          }
          .log-content {
            width: 100%;
            min-width: auto;
          }
          .log-icon {
            font-size: 12px;
          }
          .log-meta {
            gap: 4px;
            margin-bottom: 3px;
          }
          .log-badge {
            font-size: 9px;
            padding: 1px 5px;
          }
          .log-reqid {
            font-size: 9px;
            padding: 0px 4px;
          }
          .log-message {
            font-size: 11px;
          }
          .log-right {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            min-width: auto;
          }
          .log-time {
            font-size: 9px;
          }
          .log-duration {
            font-size: 9px;
          }
          .log-details {
            padding: 8px 6px;
            font-size: 10px;
          }
          .log-details-section {
            margin-bottom: 8px;
          }
          .log-details-title {
            font-size: 9px;
            margin-bottom: 4px;
          }
          .log-details-content {
            padding: 4px 6px;
            max-height: 100px;
            font-size: 9px;
          }
          .log-details-grid {
            grid-template-columns: 1fr;
            gap: 4px 0;
          }
          .log-details-key {
            font-size: 9px;
          }
          .log-details-value {
            font-size: 9px;
            word-break: break-all;
          }
        }
      `}</style>

      <div className="log-root">
        {/* Toolbar */}
        <div className="log-toolbar">
          <div className="log-title">
            <i className="ti ti-terminal-2" aria-hidden="true" />
            API Logger
            <div className={`log-live-dot${autoRefresh ? "" : " paused"}`} />
          </div>
          <div className="log-actions">
            <button
              className={`log-btn ${autoRefresh ? "live" : "paused-btn"}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <i className={`ti ${autoRefresh ? "ti-player-pause" : "ti-player-play"}`} aria-hidden="true" />
              {autoRefresh ? "Live" : "Paused"}
            </button>
            <button className="log-btn clear" onClick={() => setLogs([])}>
              <i className="ti ti-trash" aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="log-filters">
          {(["all", "info", "warn", "error", "debug"] as const).map((level) => (
            <button
              key={level}
              className={`log-filter-btn${filter === level ? ` active-${level}` : ""}`}
              onClick={() => setFilter(level)}
            >
              {level}
              <span className="filter-count">{counts[level]}</span>
            </button>
          ))}
        </div>

        {/* Log list */}
        <div className="log-scroll" ref={scrollRef}>
          {filteredLogs.length === 0 ? (
            <div className="log-empty">
              <i className="ti ti-file-off" aria-hidden="true" />
              No logs to display
            </div>
          ) : (
            filteredLogs.map((log, idx) => {
              const cfg = LEVEL_CONFIG[log.level];
              const durationClass =
                !log.duration ? "" :
                log.duration < 100 ? " fast" :
                log.duration < 300 ? " mid" : " slow";
              const isExpanded = expandedLogId === idx;

              return (
                <div 
                  key={idx}
                  className={`log-row${isExpanded ? " expanded" : ""} log-row-clickable`}
                  onClick={() => setExpandedLogId(isExpanded ? null : idx)}
                >
                  <div className="log-accent" style={{ background: cfg.border }} />
                  <div className="log-body">
                    <i
                      className={`ti ${LEVEL_ICON[log.level]} log-icon`}
                      aria-hidden="true"
                      style={{ color: cfg.labelColor }}
                    />
                    <div className="log-content">
                      <div className="log-meta">
                        <span
                          className="log-badge"
                          style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
                        >
                          {log.level.toUpperCase()}
                        </span>
                        {log.requestId && (
                          <code className="log-reqid">{log.requestId}</code>
                        )}
                        {log.statusCode && (
                          <span
                            className="log-badge"
                            style={{
                              background: log.statusCode < 300 ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                              color: log.statusCode < 300 ? "#86efac" : "#fca5a5",
                            }}
                          >
                            {log.statusCode}
                          </span>
                        )}
                      </div>
                      <div className="log-message">{log.message}</div>
                    </div>
                    <div className="log-right">
                      <time className="log-time">
                        {log.timestamp.toLocaleTimeString()}
                      </time>
                      {log.duration !== undefined && (
                        <span className={`log-duration${durationClass}`}>
                          {log.duration}ms
                        </span>
                      )}
                    </div>
                  </div>
                  {isExpanded && (
                    <div style={{ width: "100%", gridColumn: "1/-1" }}>
                      <div className="log-details">
                        {/* Method & Endpoint */}
                        <div className="log-details-section">
                          <div className="log-details-title">📍 Request</div>
                          <div className="log-details-grid">
                            {log.method && (
                              <>
                                <span className="log-details-key">Method:</span>
                                <span className="log-details-value">{log.method}</span>
                              </>
                            )}
                            {log.endpoint && (
                              <>
                                <span className="log-details-key">Endpoint:</span>
                                <span className="log-details-value">{log.endpoint}</span>
                              </>
                            )}
                            {log.origin && (
                              <>
                                <span className="log-details-key">Origin:</span>
                                <span className="log-details-value">{log.origin}</span>
                              </>
                            )}
                            {log.authType && (
                              <>
                                <span className="log-details-key">Auth:</span>
                                <span className="log-details-value">{log.authType}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Headers */}
                        {log.headers && (
                          <div className="log-details-section">
                            <div className="log-details-title">🔗 Headers</div>
                            <div className="log-details-content">
                              {Object.entries(log.headers)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join("\n")}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {log.requestBody && (
                          <div className="log-details-section">
                            <div className="log-details-title">📤 Request Body</div>
                            <div className="log-details-content">
                              {JSON.stringify(log.requestBody, null, 2)}
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        {log.responseBody && (
                          <div className="log-details-section">
                            <div className="log-details-title">📥 Response</div>
                            <div className="log-details-content">
                              {JSON.stringify(log.responseBody, null, 2)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}