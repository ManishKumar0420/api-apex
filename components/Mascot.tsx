"use client";
import { useState, useEffect } from "react";

const C = {
  brand:      "#534AB7",
  brandLight: "#EEEDFE",
  teal:       "#1D9E75",
  tealLight:  "#E1F5EE",
  tealMid:    "#9FE1CB",
  brandDark:  "#3C3489",
  brandMid:   "#7F77DD",
};

const PAGE_TIPS: { [key: string]: string[] } = {
  landing: [
    "Hi! I'm Apix — your API building companion!",
    "Supports REST, GraphQL, or both in one spec",
    "Auto-generates auth headers & docs for you",
    "Define typed payload fields with 10+ data types",
  ],
  login: [
    "Your workspace is private & encrypted",
    "We never store your raw API secrets",
    "You can skip to the demo workspace below",
  ],
  dashboard: [
    "Click 'New API' to start building",
    "Export your APIs as OpenAPI 3.0 specs",
    "APIs go live instantly after creation",
    "Version history & rollback coming soon!",
  ],
  create: [
    "API names must be unique in your workspace",
    "Auth params auto-populate request headers",
    "Mix required & optional fields per endpoint",
    "Review the generated schema before saving",
  ],
};

export default function Mascot({ page = "landing" }) {
  const [idx, setIdx] = useState(0);
  const tips = PAGE_TIPS[page] ?? PAGE_TIPS.landing;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % tips.length), 4000);
    return () => clearInterval(t);
  }, [tips]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 10,
        zIndex: 50,
      }}
    >
      {/* Speech bubble */}
      <div
        onClick={() => setIdx((i) => (i + 1) % tips.length)}
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: "10px 14px",
          maxWidth: 200,
          fontSize: 12,
          color: "#4b5563",
          lineHeight: 1.5,
          cursor: "pointer",
          position: "relative",
          boxShadow: "0 4px 16px rgba(83,74,183,0.10)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.brand,
            marginBottom: 5,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}
        >
          ✦ Apix says
        </div>
        {tips[idx]}
        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>tap to cycle →</div>
        {/* Tail */}
        <div
          style={{
            position: "absolute",
            bottom: -6,
            right: 24,
            width: 11,
            height: 11,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderTop: "none",
            borderLeft: "none",
            transform: "rotate(45deg)",
            zIndex: -1,
          }}
        />
      </div>

      {/* Robot SVG */}
      <svg width="64" height="70" viewBox="0 0 64 70">
        <g className="apix-root">
          <line x1="32" y1="6" x2="32" y2="16" stroke={C.brand} strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="4" r="4.5" fill={C.teal} />
          <rect x="6" y="14" width="52" height="36" rx="12" fill={C.brand} />
          <rect x="11" y="19" width="42" height="26" rx="8" fill={C.brandDark} />
          <ellipse className="apix-eye" cx="24" cy="31" rx="6" ry="5" fill={C.tealMid} />
          <ellipse className="apix-eye" cx="40" cy="31" rx="6" ry="5" fill={C.tealMid} />
          <circle cx="24" cy="31" r="3" fill={C.teal} />
          <circle cx="40" cy="31" r="3" fill={C.teal} />
          <circle cx="25.5" cy="29.5" r="1.5" fill="white" opacity="0.85" />
          <circle cx="41.5" cy="29.5" r="1.5" fill="white" opacity="0.85" />
          <path d="M22 40 Q32 47 42 40" stroke={C.tealMid} strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <rect x="14" y="50" width="36" height="18" rx="8" fill={C.brandDark} />
          <circle cx="24" cy="59" r="3.5" fill={C.brandMid} opacity="0.7" />
          <circle cx="32" cy="59" r="3.5" fill={C.teal} opacity="0.7" />
          <circle cx="40" cy="59" r="3.5" fill={C.brandMid} opacity="0.7" />
          <rect x="16" y="66" width="12" height="5" rx="2.5" fill={C.brand} />
          <rect x="36" y="66" width="12" height="5" rx="2.5" fill={C.brand} />
        </g>
      </svg>
    </div>
  );
}