"use client";
import { useState } from "react";
import Link from "next/link";
import Mascot from "@/components/Mascot";

// In a real app, fetch APIs from your database via a server component or SWR
const DEMO_APIS:any[] = [];

export default function Dashboard() {
  const [apis, setApis] = useState(DEMO_APIS);

  // Listen for newly created APIs via localStorage or a store in a real app
  const restCount = apis.filter((a) => a.type !== "GraphQL").length;
  const gqlCount  = apis.filter((a) => a.type === "GraphQL").length;

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Top bar */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#534AB7" />
            <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="monospace">Ax</text>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Apix</span>
          <span style={{ color: "#d1d5db", fontSize: 16 }}>/</span>
          <span style={{ fontSize: 14, color: "#9ca3af" }}>Dashboard</span>
        </div>
        <Link href="/" style={{ fontSize: 12, color: "#6b7280", border: "1px solid #e5e7eb", padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>
          ← Home
        </Link>
      </nav>

      <div style={{ padding: "36px 40px 0" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: 24, color: "#111827", marginBottom: 4, letterSpacing: "-0.5px" }}>Your APIs</h2>
            <p style={{ fontSize: 13, color: "#9ca3af" }}>Manage, test, and extend your API endpoints</p>
          </div>
          <Link href="/dashboard/create" style={{ background: "#534AB7", color: "#fff", padding: "11px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            + New API
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, maxWidth: 560, marginBottom: 36 }}>
          {[{ label: "Total APIs", value: apis.length }, { label: "REST", value: restCount }, { label: "GraphQL", value: gqlCount }].map((s) => (
            <div key={s.label} style={{ background: "#f9fafb", borderRadius: 10, padding: "16px 18px", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* API list */}
        {apis.length === 0 ? (
          <div style={{ border: "2px dashed #e5e7eb", borderRadius: 16, padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
            <div style={{ fontWeight: 700, fontSize: 17, color: "#111827", marginBottom: 8 }}>No APIs yet</div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 28 }}>Build your first API in under 2 minutes</div>
            <Link href="/dashboard/create" style={{ background: "#534AB7", color: "#fff", padding: "13px 30px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Create your first API →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {apis.map((api, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ background: api.type === "GraphQL" ? "#E1F5EE" : "#EEEDFE", color: api.type === "GraphQL" ? "#1D9E75" : "#534AB7", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {api.type}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", fontFamily: "monospace" }}>api/{api.name}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{api.auth} · {api.fields?.filter((f:any) => f.name).length || 0} fields · {api.responseType}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D9E75", boxShadow: "0 0 0 3px #E1F5EE" }} />
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>Live</span>
                </div>
              </div>
            ))}
            <Link href="/dashboard/create" style={{ marginTop: 4, display: "block", textAlign: "center", border: "1px dashed #534AB7", color: "#534AB7", padding: "13px", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              + Add another API
            </Link>
          </div>
        )}
      </div>

      <Mascot page="dashboard" />
    </div>
  );
}