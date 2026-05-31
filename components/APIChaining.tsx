/**
 * API CHAINING COMPONENT
 * =======================
 * Allows users to create chains of API calls where the output
 * of one API becomes the input for the next
 */

"use client";

import { useState } from "react";

interface ChainStep {
  apiId: string;
  extractPath?: string;
}

interface APIChainingProps {
  availableApis: { id: string; name: string }[];
  onExecuteChain: (chain: ChainStep[]) => void;
  loading?: boolean;
}

export function APIChainingComponent({ availableApis, onExecuteChain, loading = false }: APIChainingProps) {
  const [chain, setChain] = useState<ChainStep[]>([
    { apiId: "", extractPath: "" },
    { apiId: "", extractPath: "" },
  ]);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [executing, setExecuting] = useState(false);

  const handleAddStep = () => {
    setChain([...chain, { apiId: "", extractPath: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    setChain(chain.filter((_, i) => i !== index));
  };

  const handleUpdateStep = (index: number, field: string, value: string) => {
    const newChain = [...chain];
    newChain[index] = { ...newChain[index], [field]: value };
    setChain(newChain);
  };

  const handleExecuteChain = async () => {
    const validChain = chain.filter((step) => step.apiId);
    if (validChain.length === 0) return;
    setExecuting(true);
    try {
      const response = await fetch("/api/chain/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjUwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.wJZxlJpXqJbIqKRLX-WGqDrAr2cz5yGqL7K0E8j0P0w",
        },
        body: JSON.stringify({ chains: validChain }),
      });
      const data = await response.json();
      setResult(data);
      setShowResult(true);
    } catch (error) {
      console.error("Error executing chain:", error);
    } finally {
      setExecuting(false);
    }
  };

  const validStepCount = chain.filter((s) => s.apiId).length;
  const canExecute = !loading && !executing && validStepCount > 0;

  return (
    <>
      <style>{`
        .chain-root {
          background: #111318;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          overflow: hidden;
          font-family: 'Syne', sans-serif;
        }

        /* ── header ── */
        .chain-header {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .chain-header-icon {
          font-size: 16px;
          color: #6366f1;
        }
        .chain-header-text { flex: 1; }
        .chain-header-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          letter-spacing: 0.02em;
        }
        .chain-header-sub {
          font-size: 11px;
          color: #475569;
          font-family: 'JetBrains Mono', monospace;
          margin-top: 2px;
        }
        .chain-step-count {
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          background: rgba(99,102,241,0.12);
          color: #818cf8;
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          padding: 2px 10px;
        }

        /* ── steps ── */
        .chain-steps-list {
          padding: 14px 14px 0;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* connector line between steps */
        .chain-connector {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 24px;
          position: relative;
        }
        .chain-connector::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(99,102,241,0.2);
          transform: translateX(-50%);
        }
        .chain-connector-dot {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0b0d12;
          border: 1px solid rgba(99,102,241,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          font-size: 11px;
          color: #6366f1;
        }

        .chain-step-card {
          background: #0e1016;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color 0.15s;
        }
        .chain-step-card:hover { border-color: rgba(255,255,255,0.09); }

        .chain-step-top {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.02);
        }
        .chain-step-num {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          color: #818cf8;
          font-family: 'JetBrains Mono', monospace;
          flex-shrink: 0;
        }
        .chain-step-label {
          flex: 1;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #475569;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .chain-remove-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1px solid rgba(239,68,68,0.15);
          background: rgba(239,68,68,0.06);
          color: #f87171;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.15s;
          padding: 0;
        }
        .chain-remove-btn:hover { background: rgba(239,68,68,0.14); }

        .chain-step-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.03);
        }
        .chain-field {
          background: #0e1016;
          padding: 10px 12px;
        }
        .chain-field-label {
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          color: #334155;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }
        .chain-select,
        .chain-input {
          width: 100%;
          background: #0b0d12;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 7px;
          color: #e2e8f0;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          padding: 7px 10px;
          outline: none;
          transition: border-color 0.15s;
        }
        .chain-select:focus,
        .chain-input:focus { border-color: #6366f1; }
        .chain-select option { background: #111318; }
        .chain-input::placeholder { color: #334155; }

        /* ── action row ── */
        .chain-actions {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .chain-add-btn {
          width: 100%;
          padding: 9px;
          background: transparent;
          border: 1px dashed rgba(99,102,241,0.2);
          border-radius: 8px;
          color: #475569;
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: border-color 0.15s, color 0.15s;
        }
        .chain-add-btn:hover {
          border-color: rgba(99,102,241,0.4);
          color: #818cf8;
        }
        .chain-add-btn i { font-size: 14px; }

        .chain-exec-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.15s, background 0.15s;
          letter-spacing: 0.02em;
        }
        .chain-exec-btn.ready {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .chain-exec-btn.ready:hover { opacity: 0.88; }
        .chain-exec-btn.disabled {
          background: rgba(255,255,255,0.05);
          color: #334155;
          cursor: not-allowed;
        }
        .chain-exec-btn i { font-size: 15px; }

        /* spinner inside exec btn */
        .exec-spinner {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── result ── */
        .chain-result {
          margin: 0 14px 14px;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          overflow: hidden;
        }
        .chain-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 9px 14px;
          background: rgba(99,102,241,0.06);
          border-bottom: 1px solid rgba(99,102,241,0.12);
          cursor: pointer;
        }
        .chain-result-title {
          font-size: 12px;
          font-family: 'JetBrains Mono', monospace;
          color: #a5b4fc;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .chain-result-title i { font-size: 14px; }
        .chain-result-toggle {
          font-size: 13px;
          color: #475569;
        }
        .chain-result-pre {
          padding: 12px 14px;
          background: #0b0d12;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          color: #94a3b8;
          overflow: auto;
          max-height: 320px;
          white-space: pre;
          margin: 0;
        }

        @media (max-width: 600px) {
          .chain-step-fields { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="chain-root">
        {/* Header */}
        <div className="chain-header">
          <i className="ti ti-link chain-header-icon" aria-hidden="true" />
          <div className="chain-header-text">
            <div className="chain-header-title">API Chaining</div>
            <div className="chain-header-sub">Output of one API becomes input for the next</div>
          </div>
          <span className="chain-step-count">{chain.length} steps</span>
        </div>

        {/* Steps */}
        <div className="chain-steps-list">
          {chain.map((step, index) => (
            <div key={index}>
              {index > 0 && (
                <div className="chain-connector">
                  <div className="chain-connector-dot">
                    <i className="ti ti-arrow-down" aria-hidden="true" />
                  </div>
                </div>
              )}

              <div className="chain-step-card">
                <div className="chain-step-top">
                  <div className="chain-step-num">{index + 1}</div>
                  <span className="chain-step-label">Step {index + 1}</span>
                  {chain.length > 2 && (
                    <button
                      className="chain-remove-btn"
                      onClick={() => handleRemoveStep(index)}
                      aria-label="Remove step"
                    >
                      <i className="ti ti-x" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="chain-step-fields">
                  <div className="chain-field">
                    <div className="chain-field-label">API Endpoint</div>
                    <select
                      className="chain-select"
                      value={step.apiId}
                      onChange={(e) => handleUpdateStep(index, "apiId", e.target.value)}
                    >
                      <option value="">Select API…</option>
                      {availableApis.map((api) => (
                        <option key={api.id} value={api.id}>
                          {api.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="chain-field">
                    <div className="chain-field-label">Extract Path <span style={{ opacity: 0.5 }}>(optional)</span></div>
                    <input
                      type="text"
                      className="chain-input"
                      value={step.extractPath || ""}
                      onChange={(e) => handleUpdateStep(index, "extractPath", e.target.value)}
                      placeholder="e.g. 0.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="chain-actions">
          <button className="chain-add-btn" onClick={handleAddStep}>
            <i className="ti ti-plus" aria-hidden="true" />
            Add step
          </button>

          <button
            className={`chain-exec-btn ${canExecute ? "ready" : "disabled"}`}
            onClick={handleExecuteChain}
            disabled={!canExecute}
          >
            {executing ? (
              <>
                <div className="exec-spinner" />
                Executing chain…
              </>
            ) : (
              <>
                <i className="ti ti-player-play" aria-hidden="true" />
                Execute chain
                {validStepCount > 0 && ` · ${validStepCount} step${validStepCount > 1 ? "s" : ""}`}
              </>
            )}
          </button>
        </div>

        {/* Result */}
        {showResult && result && (
          <div className="chain-result">
            <details open>
              <summary className="chain-result-header" style={{ listStyle: "none" }}>
                <span className="chain-result-title">
                  <i className="ti ti-chart-bar" aria-hidden="true" />
                  Chain result
                </span>
                <i className="ti ti-chevron-down chain-result-toggle" aria-hidden="true" />
              </summary>
              <pre className="chain-result-pre">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </>
  );
}