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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setLogs((prev) => [
        ...prev.slice(-49),
        {
          timestamp: new Date(),
          level: (["info", "warn", "error", "debug"] as const)[
            Math.floor(Math.random() * 4)
          ],
          message: "API request processed",
          requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
          duration: Math.floor(Math.random() * 500),
        },
      ]);
    }, 2000);
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
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .log-scroll::-webkit-scrollbar { width: 4px; }
        .log-scroll::-webkit-scrollbar-track { background: transparent; }
        .log-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
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
        }
        .log-row:hover { border-color: rgba(255,255,255,0.09); }
        .log-accent {
          width: 3px;
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
        }
        .log-icon {
          font-size: 14px;
          margin-top: 1px;
          flex-shrink: 0;
        }
        .log-content { flex: 1; min-width: 0; }
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
        }
        .log-message {
          font-size: 13px;
          color: #cbd5e1;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .log-context-toggle {
          margin-top: 6px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
          cursor: pointer;
        }
        .log-context-toggle:hover { color: #6366f1; }
        .log-context-pre {
          margin-top: 6px;
          padding: 8px 10px;
          background: #0b0d12;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 6px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #94a3b8;
          overflow: auto;
          max-height: 120px;
          white-space: pre;
        }
        .log-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 3px;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .log-time {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          letter-spacing: 0.02em;
        }
        .log-duration {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
        }
        .log-duration.fast { color: #4ade80; }
        .log-duration.mid  { color: #facc15; }
        .log-duration.slow { color: #f87171; }
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

              return (
                <div key={idx} className="log-row">
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
                      </div>
                      <div className="log-message">{log.message}</div>
                      {log.context && (
                        <details>
                          <summary className="log-context-toggle">View context</summary>
                          <pre className="log-context-pre">
                            {JSON.stringify(log.context, null, 2)}
                          </pre>
                        </details>
                      )}
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}