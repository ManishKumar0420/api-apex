"use client";

import { useState, JSX } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Mascot from "@/components/Mascot";

// ── Types & Interfaces ────────────────────────────────────────────────────────
interface Field {
  name: string;
  type: string;
  required: boolean;
}

type AuthType = "None" | "API Key" | "Bearer Token" | "Basic Auth" | "OAuth2";
type APIType = "REST" | "GraphQL" | "Both";
type ResponseFmt = "JSON" | "XML" | "CSV" | "YAML";

interface BtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "teal" | "ghost" | "outline";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const C = {
  brand:      "#534AB7",
  brandMid:   "#7F77DD",
  brandLight: "#EEEDFE",
  brandDark:  "#3C3489",
  teal:       "#1D9E75",
  tealLight:  "#E1F5EE",
  tealMid:    "#9FE1CB",
  danger:     "#E24B4A",
  codeBg:     "#0C0F12",
};

const FIELD_TYPES: string[] = ["string","number","boolean","object","array","date","uuid","email","url","enum","integer","float"];
const AUTH_TYPES: AuthType[] = ["None","API Key","Bearer Token","Basic Auth","OAuth2"];
const RESPONSE_FMTS: ResponseFmt[] = ["JSON","XML","CSV","YAML"];
const API_TYPES: APIType[] = ["REST","GraphQL","Both"];
const STEPS: string[] = ["API Identity","Authentication","Payload Fields","Response & Review"];

const AUTH_DESCS: Record<AuthType, string> = {
  "None":         "No authentication required for this endpoint",
  "API Key":      "Clients pass a key via a custom request header",
  "Bearer Token": "Authorization: Bearer <token> in every request",
  "Basic Auth":   "Base64-encoded username:password header",
  "OAuth2":       "Full OAuth 2.0 flow with scoped access tokens",
};

// ── Shared UI primitives ──────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", disabled, type = "button", fullWidth, style: s = {} }: BtnProps) {
  const variants = {
    primary: { background: C.brand, color: "#fff", border: "none" },
    teal:    { background: C.teal, color: "#fff", border: "none" },
    ghost:   { background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb" },
    outline: { background: "transparent", color: C.brand, border: `1px dashed ${C.brand}` },
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 22px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s",
        width: fullWidth ? "100%" : undefined,
        fontFamily: "inherit",
        ...variants[variant],
        ...s,
      }}
    >
      {children}
    </button>
  );
}

interface FieldRowProps {
  field: Field;
  index: number;
  total: number;
  onUpdate: (index: number, key: keyof Field, value: string | boolean) => void;
  onRemove: (index: number) => void;
}

function FieldRow({ field, index, total, onUpdate, onRemove }: FieldRowProps) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 32px", gap: 8, alignItems: "center" }}>
      <input
        value={field.name}
        onChange={(e) => onUpdate(index, "name", e.target.value)}
        placeholder="field_name"
        style={{
          padding: "9px 12px", fontSize: 13, fontFamily: "monospace",
          borderRadius: 8, border: "1px solid #e5e7eb",
          background: "#fafafa", color: "#111827", outline: "none",
          boxSizing: "border-box", width: "100%",
        }}
      />
      <select
        value={field.type}
        onChange={(e) => onUpdate(index, "type", e.target.value)}
        style={{
          padding: "9px 10px", fontSize: 12, borderRadius: 8,
          border: "1px solid #e5e7eb", background: "#fafafa",
          color: "#111827", outline: "none", width: "100%", fontFamily: "inherit",
        }}
      >
        {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          onClick={() => onUpdate(index, "required", !field.required)}
          style={{
            width: 36, height: 20, borderRadius: 10,
            border: "none", background: field.required ? C.brand : "#e5e7eb",
            cursor: "pointer", position: "relative", transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 14, height: 14, borderRadius: "50%", background: "#fff",
              position: "absolute", top: 3,
              left: field.required ? 19 : 3,
              transition: "left 0.2s",
            }}
          />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={total === 1}
        style={{
          width: 28, height: 28, borderRadius: 6,
          border: "1px solid #e5e7eb", background: "#fafafa",
          color: "#9ca3af", cursor: total === 1 ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, opacity: total === 1 ? 0.3 : 1, fontFamily: "inherit",
        }}
      >
        ×
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreateAPIPage(): JSX.Element {
  const router = useRouter();

  // Form state
  const [step,        setStep]        = useState<number>(0);
  const [name,        setName]        = useState<string>("");
  const [apiType,     setApiType]     = useState<APIType>("REST");
  const [description, setDesc]        = useState<string>("");
  const [auth,        setAuth]        = useState<AuthType>("API Key");
  const [authHeader,  setHeader]      = useState<string>("X-API-Key");
  const [fields,      setFields]      = useState<Field[]>([{ name: "", type: "string", required: true }]);
  const [resFmt,      setResFmt]      = useState<ResponseFmt>("JSON");
  const [saving,      setSaving]      = useState<boolean>(false);
  const [saved,       setSaved]       = useState<boolean>(false);

  // Field helpers
  const addField = () => setFields((f) => [...f, { name: "", type: "string", required: false }]);
  const removeField = (i: number) => setFields((f) => f.filter((_, idx) => idx !== i));
  const updateField = (i: number, k: keyof Field, v: string | boolean) => 
    setFields((f) => f.map((x, idx) => idx === i ? { ...x, [k]: v } : x));

  const namedFields = fields.filter((f) => f.name.trim().length > 0);

  // Per-step validation
  const canNext: boolean = [
    name.trim().length >= 2,
    true,
    namedFields.length > 0,
    true,
  ][step];

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    const payload = { name, type: apiType, description, auth, authHeader, fields: namedFields, responseType: resFmt };
    console.log("Creating API:", payload);
    
    await new Promise((r) => setTimeout(r, 900));
    setSaved(true);
    setTimeout(() => router.push("/dashboard"), 700);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "11px 14px",
    fontSize: 14, borderRadius: 8, border: "1px solid #e5e7eb",
    background: "#fafafa", color: "#111827", outline: "none",
    fontFamily: "inherit", transition: "border-color 0.2s",
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", paddingBottom: 120, background: "#f9fafb" }}>
      {/* ── Top bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="24" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="9" fill={C.brand} />
            <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="monospace">Ax</text>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Apix</span>
          <span style={{ color: "#d1d5db", fontSize: 16 }}>/</span>
          <span style={{ fontSize: 14, color: "#9ca3af" }}>New API</span>
        </div>
        <Link href="/dashboard" style={{ fontSize: 12, color: "#6b7280", border: "1px solid #e5e7eb", padding: "7px 14px", borderRadius: 8, textDecoration: "none" }}>
          ✕ Cancel
        </Link>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ padding: "28px 40px 22px", display: "flex", alignItems: "center", background: "#fff", borderBottom: "1px solid #f3f4f6", overflowX: "auto" }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: i < step ? C.teal : i === step ? C.brand : "#f3f4f6",
                border: `2px solid ${i < step ? C.teal : i === step ? C.brand : "#e5e7eb"}`,
                color: i <= step ? "#fff" : "#9ca3af",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, transition: "all 0.3s", flexShrink: 0,
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: i === step ? 700 : 400, color: i === step ? "#111827" : "#9ca3af", whiteSpace: "nowrap" }}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < step ? C.teal : "#e5e7eb", margin: "0 14px", minWidth: 20, transition: "background 0.3s" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{ padding: "32px 40px", maxWidth: 620 }}>
        {/* Step 0: Identity */}
        {step === 0 && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Name your API</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 32px" }}>Choose a unique, lowercase identifier for this endpoint</p>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                API Name <span style={{ color: C.danger }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#9ca3af", fontFamily: "monospace", pointerEvents: "none" }}>
                  api/
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  placeholder="user-profiles"
                  style={{
                    ...inputStyle,
                    paddingLeft: 46, fontFamily: "monospace",
                    borderColor: name.length >= 2 ? C.teal : name.length > 0 ? C.danger : "#e5e7eb",
                  }}
                />
              </div>
              {name.length > 0 && name.length < 2 && (
                <p style={{ fontSize: 11, color: C.danger, margin: "6px 0 0" }}>At least 2 characters required</p>
              )}
              {name.length >= 2 && (
                <p style={{ fontSize: 11, color: C.teal, margin: "6px 0 0", fontWeight: 700 }}>✓ Name available</p>
              )}
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>
                API Type <span style={{ color: C.danger }}>*</span>
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {API_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setApiType(t)}
                    style={{
                      flex: 1, padding: "16px 10px", borderRadius: 10,
                      border: `${apiType === t ? "2px" : "1px"} solid ${apiType === t ? C.brand : "#e5e7eb"}`,
                      background: apiType === t ? C.brandLight : "#fafafa",
                      color: apiType === t ? C.brand : "#6b7280",
                      fontSize: 14, fontWeight: apiType === t ? 700 : 400,
                      cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>
                Description <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What does this API do?"
                rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Authentication */}
        {step === 1 && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Authentication</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 26px" }}>Define how clients authenticate to this API</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {AUTH_TYPES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAuth(a)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "18px 20px", borderRadius: 12,
                    border: `${auth === a ? "2px" : "1px"} solid ${auth === a ? C.brand : "#e5e7eb"}`,
                    background: auth === a ? C.brandLight : "#fff",
                    cursor: "pointer", textAlign: "left", transition: "all 0.2s",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: `2px solid ${auth === a ? C.brand : "#d1d5db"}`,
                    background: auth === a ? C.brand : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    {auth === a && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: auth === a ? C.brand : "#111827" }}>{a}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{AUTH_DESCS[a]}</div>
                  </div>
                </button>
              ))}
            </div>

            {auth === "API Key" && (
              <div style={{ background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 22px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Header configuration</div>
                <label style={{ display: "block", fontSize: 11, color: "#9ca3af", marginBottom: 7 }}>Header name</label>
                <input
                  value={authHeader}
                  onChange={(e) => setHeader(e.target.value)}
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
                />
                <div style={{ marginTop: 12, padding: "10px 14px", background: C.codeBg, borderRadius: 8 }}>
                  <code style={{ fontSize: 12, color: C.tealMid, fontFamily: "monospace" }}>
                    {authHeader || "X-API-Key"}: your-secret-key
                  </code>
                </div>
              </div>
            )}
            {/* ... Other Auth Type Previews ... */}
          </div>
        )}

        {/* Step 2: Payload Fields */}
        {step === 2 && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Payload fields</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 22px" }}>Define the fields your API accepts in the request body</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 70px 32px", gap: 8, padding: "0 4px", marginBottom: 10 }}>
              {["Field name", "Type", "Required", ""].map((h) => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 14 }}>
              {fields.map((f, i) => (
                <FieldRow key={i} field={f} index={i} total={fields.length} onUpdate={updateField} onRemove={removeField} />
              ))}
            </div>

            {namedFields.length === 0 && (
              <div style={{ fontSize: 11, color: C.danger, marginBottom: 10 }}>✕ Add at least one named field to continue</div>
            )}

            <Btn variant="outline" onClick={addField} style={{ padding: "10px 18px", fontSize: 13 }}>+ Add field</Btn>
          </div>
        )}

        {/* Step 3: Response & Review */}
        {step === 3 && (
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 22, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.5px" }}>Response & review</h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 28px" }}>Choose the output format and confirm the full API spec</p>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Response format</label>
              <div style={{ display: "flex", gap: 10 }}>
                {RESPONSE_FMTS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setResFmt(r)}
                    style={{
                      flex: 1, padding: "14px 8px", borderRadius: 8,
                      border: `${resFmt === r ? "2px" : "1px"} solid ${resFmt === r ? C.brand : "#e5e7eb"}`,
                      background: resFmt === r ? C.brandLight : "#fafafa",
                      color: resFmt === r ? C.brand : "#6b7280",
                      fontSize: 13, fontWeight: resFmt === r ? 700 : 400,
                      cursor: "pointer", fontFamily: "monospace", transition: "all 0.2s",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary & JSON Preview - Simplified for length */}
            <div style={{ background: C.codeBg, borderRadius: 12, padding: "20px 22px", fontFamily: "monospace", fontSize: 11, color: "#fff" }}>
               <pre>{JSON.stringify({ name, apiType, auth, fields: namedFields, resFmt }, null, 2)}</pre>
            </div>

            {saved && (
              <div style={{ marginTop: 20, background: C.tealLight, border: `1px solid ${C.teal}`, borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.teal }}>🚀 API created — deploying…</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer navigation ── */}
      <div style={{ padding: "20px 40px", borderTop: "1px solid #f3f4f6", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", bottom: 0 }}>
        <Btn variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : router.push("/dashboard")}>
          {step === 0 ? "← Cancel" : "← Back"}
        </Btn>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Step {step + 1} of {STEPS.length}</span>
          {step < 3 ? (
            <Btn onClick={() => setStep(step + 1)} disabled={!canNext} style={{ padding: "11px 26px" }}>
              Continue →
            </Btn>
          ) : (
            <Btn variant="teal" onClick={handleSave} disabled={saving || saved} style={{ padding: "11px 28px" }}>
              {saving ? "Creating…" : saved ? "✓ Created!" : "✓ Create API"}
            </Btn>
          )}
        </div>
      </div>

      <Mascot page="create" />
    </div>
  );
}