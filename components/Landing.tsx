import Link from "next/link";
import Mascot from "@/components/Mascot";

const FEATURES = [
  { icon: "⚡", title: "REST & GraphQL", desc: "Build any API type with a guided setup wizard" },
  { icon: "🔐", title: "Auth in seconds", desc: "API Key, Bearer, OAuth2, Basic — all supported" },
  { icon: "📦", title: "Typed payloads", desc: "String, number, boolean, object, uuid, enum & more" },
  { icon: "🚀", title: "Instant deploy", desc: "Live endpoint + documentation in one click" },
  { icon: "📄", title: "OpenAPI export", desc: "Download your spec as OpenAPI 3.0 JSON or YAML" },
  { icon: "🔍", title: "Live test console", desc: "Run requests against your APIs right in the dashboard" },
];

export default function LandingPage() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: 120 }}>
      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Inline Logo SVG */}
          <svg width="28" height="28" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill="#534AB7" />
            <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="monospace">Ax</text>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111827", letterSpacing: "-0.3px" }}>Apix</span>
        </div>
        <Link href="/login" style={{ background: "#534AB7", color: "#fff", padding: "10px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Sign in →
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 40px 56px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EEEDFE", color: "#534AB7", padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", border: "1px solid #7F77DD", marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
          REST + GRAPHQL API BUILDER
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#111827", letterSpacing: "-2px", lineHeight: 1.06, marginBottom: 20 }}>
          Build APIs in minutes,<br />
          <span style={{ color: "#534AB7" }}>not days.</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 460, margin: "0 auto 44px", lineHeight: 1.65 }}>
          Define structure, authentication, and response format. Apix generates,
          documents, and deploys your API — instantly.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/login" style={{ background: "#534AB7", color: "#fff", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
            Start building free →
          </Link>
          <Link href="/dashboard" style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", padding: "14px 32px", borderRadius: 8, fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            View demo
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 40px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 860, margin: "0 auto" }}>
        {FEATURES.map((f) => (
          <div key={f.title} style={{ background: "#fff", border: "1px solid #f3f4f6", borderRadius: 14, padding: "24px 22px" }}>
            <div style={{ fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 7 }}>{f.title}</div>
            <div style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.55 }}>{f.desc}</div>
          </div>
        ))}
      </section>

      <Mascot page="landing" />
    </div>
  );
}