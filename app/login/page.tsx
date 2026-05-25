"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Mascot from "@/components/Mascot";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setLoading(true);
    // Replace with real auth (NextAuth, Supabase, etc.)
    setTimeout(() => { setLoading(false); router.push("/dashboard"); }, 1100);
  };

  const inp = {
    width: "100%", boxSizing: "border-box", padding: "11px 14px",
    fontSize: 14, borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#fafafa", color: "#111827", outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", background: "#f9fafb" }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
        <svg width="40" height="40" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="9" fill="#534AB7" />
          <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="monospace">Ax</text>
        </svg>
        <span style={{ fontWeight: 800, fontSize: 24, color: "#111827", letterSpacing: "-0.5px" }}>Apix</span>
      </div>

      <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 16, padding: "44px 48px", width: "100%", maxWidth: 420, boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontWeight: 800, fontSize: 24, color: "#111827", marginBottom: 4, letterSpacing: "-0.5px" }}>Welcome back</h2>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 32 }}>Sign in to your Apix workspace</p>

        <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 7 }}>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={{ ...inp, marginBottom: 18 }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>Password</label>
          <button type="button" style={{ fontSize: 12, color: "#534AB7", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Forgot?</button>
        </div>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inp, marginBottom: 28 }} />

        <button type="submit" disabled={loading} style={{ width: "100%", background: loading ? "#7F77DD" : "#534AB7", color: "#fff", border: "none", padding: "13px", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "default" : "pointer" }}>
          {loading ? "Signing in…" : "Sign in →"}
        </button>

        <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, color: "#9ca3af" }}>
          No account?{" "}
          <Link href="/dashboard" style={{ color: "#534AB7", fontWeight: 700 }}>Create for free</Link>
        </p>

        <div style={{ marginTop: 20, padding: "14px", background: "#E1F5EE", borderRadius: 8, textAlign: "center" }}>
          <Link href="/dashboard" style={{ fontSize: 12, color: "#1D9E75", fontWeight: 700, textDecoration: "none" }}>
            → Skip to demo workspace
          </Link>
        </div>
      </form>

      <Mascot page="login" />
    </div>
  );
}