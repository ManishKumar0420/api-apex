"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ApiType = "REST" | "GraphQL";

type Field = {
  name: string;
  type: string;
};

export default function CreateApiPage() {
  const [apiType, setApiType] = useState<ApiType>("REST");

  const [form, setForm] = useState({
    name: "",
    route: "",
    method: "GET",
    auth: "None",
    responseType: "JSON",
    gqlOperation: "query",
  });

  const [fields, setFields] = useState<Field[]>([
    { name: "", type: "string" },
  ]);

  const [errors, setErrors] = useState<any>({});

  const isValid = useMemo(() => {
    return (
      form.name.trim().length >= 3 &&
      form.route.trim().length >= 2 &&
      fields.some((f) => f.name.trim())
    );
  }, [form, fields]);

  const updateField = (
    index: number,
    key: keyof Field,
    value: string
  ) => {
    const cloned = [...fields];
    cloned[index][key] = value;
    setFields(cloned);
  };

  const addField = () => {
    setFields([...fields, { name: "", type: "string" }]);
  };

  const validate = () => {
    const newErrors: any = {};

    if (form.name.trim().length < 3) {
      newErrors.name = "API name must be at least 3 characters";
    }

    if (!form.route.trim()) {
      newErrors.route = "Route is required";
    }

    if (!fields.some((f) => f.name.trim())) {
      newErrors.fields = "At least one field is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      ...form,
      type: apiType,
      fields,
    };

    console.log("POST API:", payload);

    localStorage.setItem(
      "apis",
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem("apis") || "[]")),
        payload,
      ])
    );

    alert("API Created Successfully 🚀");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      {/* NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
          borderBottom: "1px solid #f3f4f6",
          background: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "#534AB7",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
            }}
          >
            Ax
          </div>

          <div>
            <div
              style={{
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Apix
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              Create API
            </div>
          </div>
        </div>

        <Link
          href="/dashboard"
          style={{
            border: "1px solid #e5e7eb",
            padding: "8px 16px",
            borderRadius: 10,
            textDecoration: "none",
            color: "#6b7280",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ← Dashboard
        </Link>
      </nav>

      {/* MAIN */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "50px 24px",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 800,
              color: "#111827",
              marginBottom: 10,
              letterSpacing: "-1px",
            }}
          >
            Create New API
          </h1>

          <p
            style={{
              color: "#9ca3af",
              fontSize: 14,
            }}
          >
            Design REST or GraphQL endpoints visually
          </p>
        </div>

        {/* TYPE SWITCH */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 30,
          }}
        >
          {["REST", "GraphQL"].map((type) => (
            <button
              key={type}
              onClick={() => setApiType(type as ApiType)}
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                border:
                  apiType === type
                    ? "2px solid #534AB7"
                    : "1px solid #e5e7eb",
                background:
                  apiType === type ? "#EEEDFE" : "#fff",
                color:
                  apiType === type ? "#534AB7" : "#6b7280",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* FORM CARD */}
        <div
          style={{
            border: "1px solid #f3f4f6",
            borderRadius: 20,
            padding: 30,
            background: "#fff",
          }}
        >
          {/* API NAME */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>API Name</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="users-api"
              style={inputStyle}
            />

            {errors.name && (
              <div style={errorStyle}>{errors.name}</div>
            )}
          </div>

          {/* ROUTE */}
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>
              {apiType === "REST"
                ? "Route"
                : "Schema Endpoint"}
            </label>

            <input
              value={form.route}
              onChange={(e) =>
                setForm({ ...form, route: e.target.value })
              }
              placeholder="/api/users"
              style={inputStyle}
            />

            {errors.route && (
              <div style={errorStyle}>{errors.route}</div>
            )}
          </div>

          {/* REST ONLY */}
          {apiType === "REST" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
                marginBottom: 24,
              }}
            >
              <div>
                <label style={labelStyle}>Method</label>

                <select
                  value={form.method}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      method: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Authentication</label>

                <select
                  value={form.auth}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      auth: e.target.value,
                    })
                  }
                  style={inputStyle}
                >
                  <option>None</option>
                  <option>JWT</option>
                  <option>OAuth</option>
                  <option>API Key</option>
                </select>
              </div>
            </div>
          )}

          {/* GRAPHQL ONLY */}
          {apiType === "GraphQL" && (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                GraphQL Operation
              </label>

              <select
                value={form.gqlOperation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gqlOperation: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="query">Query</option>
                <option value="mutation">Mutation</option>
              </select>
            </div>
          )}

          {/* FIELDS */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <label style={labelStyle}>
                {apiType === "REST"
                  ? "Request Fields"
                  : "Arguments"}
              </label>

              <button
                onClick={addField}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#534AB7",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add Field
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {fields.map((field, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: 12,
                  }}
                >
                  <input
                    placeholder="field name"
                    value={field.name}
                    onChange={(e) =>
                      updateField(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  />

                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(
                        index,
                        "type",
                        e.target.value
                      )
                    }
                    style={inputStyle}
                  >
                    <option>string</option>
                    <option>number</option>
                    <option>boolean</option>
                    <option>array</option>
                    <option>object</option>
                  </select>
                </div>
              ))}
            </div>

            {errors.fields && (
              <div style={errorStyle}>{errors.fields}</div>
            )}
          </div>

          {/* SUBMIT */}
          <button
            disabled={!isValid}
            onClick={handleSubmit}
            style={{
              width: "100%",
              background: isValid
                ? "#534AB7"
                : "#c7c3f3",
              color: "#fff",
              border: "none",
              padding: "15px",
              borderRadius: 14,
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            Create {apiType} API 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 700,
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14,
  background: "#fff",
};

const errorStyle = {
  marginTop: 8,
  color: "#dc2626",
  fontSize: 12,
};