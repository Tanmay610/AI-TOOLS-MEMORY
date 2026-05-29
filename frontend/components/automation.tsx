import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Plus,
  X,
  Sparkles,
  Workflow,
  Database,
  Bookmark,
  Network,
  ListFilter,
  RefreshCcw,
} from "lucide-react";
import { PageHeading } from "./shared";

const automationSteps = [
  { title: "Tool Name Input", detail: "Single-field capture", icon: Plus },
  { title: "AI Analysis", detail: "Enrich context", icon: Sparkles },
  { title: "Auto Categorization", detail: "Apply tags + role", icon: ListFilter },
  { title: "Database Save", detail: "Vector ready", icon: Database },
  { title: "Graph Update", detail: "Link relations", icon: Network },
  { title: "Dashboard Refresh", detail: "Insights live", icon: RefreshCcw },
];

export function Automation({ onAdd }: { onAdd: () => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [customWebhookName, setCustomWebhookName] = useState("");
  const [customWebhookUrl] = useState("http://localhost:5678/webhook/ai-vault");
  const [notification, setNotification] = useState("");

  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workspace-integrations");
      return saved
        ? JSON.parse(saved)
        : { Supabase: true, n8n: false, Notion: false, Neo4j: false, "Vector Search": false };
    }
    return { Supabase: true, n8n: false, Notion: false, Neo4j: false, "Vector Search": false };
  });

  const toggleConnection = (name: string) => {
    const nextVal = !connected[name];
    const nextState = { ...connected, [name]: nextVal };
    setConnected(nextState);
    localStorage.setItem("workspace-integrations", JSON.stringify(nextState));

    setNotification(`${name} integration ${nextVal ? "connected and active" : "disconnected"}`);
    setTimeout(() => setNotification(""), 3000);
  };

  const deployCustomWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWebhookName.trim()) return;

    setShowNewWorkflow(false);
    setNotification(`Custom webhook "${customWebhookName.trim()}" deployed successfully!`);
    setCustomWebhookName("");
    setTimeout(() => setNotification(""), 3500);
  };

  const stepDetails = [
    {
      title: "Tool Name Input",
      detail: "Single-field capture trigger.",
      description:
        "Listens to immediate keyboard triggers from the main capture input or top search bars. Fires a REST endpoint or Webhook call to trigger downstream AI categorization flows.",
      payload: `{
  "name": "anti-gravity",
  "source": "Quick capture",
  "date": "Today"
}`,
    },
    {
      title: "AI Analysis",
      detail: "Enrich context via LLM.",
      description:
        "Dispatches the raw tool name to the Gemini API (gemini-2.5-flash) to retrieve professional metadata including use-case descriptions, alternatives, importance rank, and tags.",
      payload: `{
  "description": "An autonomous AI coding agent designed by Google DeepMind for advanced agentic coding...",
  "useCase": "Automate complex codebase refactoring, package migrations, and fullstack debugging.",
  "role": "Autonomous agent",
  "importance": "High"
}`,
    },
    {
      title: "Auto Categorization",
      detail: "Apply tags and workspaces.",
      description:
        "Categorizes the integration into one of 12 predefined category tags (Automation, Coding, Voice, MCP, Productivity, etc.) to ensure immediate stack indexing.",
      payload: `{
  "category": "Coding",
  "tags": ["agent", "coding", "antigravity", "deepmind"],
  "related": ["Gemini 3.5 Flash", "Next.js"]
}`,
    },
    {
      title: "Database Save",
      detail: "Persist to tools database.",
      description:
        "Pushes the structured JSON object payload to the local atomic file-system db (tools.json) via backend server REST interfaces, fallback-writing to LocalStorage.",
      payload: `HTTP/1.1 201 Created
{
  "success": true,
  "data": { "name": "antigravity", "category": "Coding" }
}`,
    },
    {
      title: "Graph Update",
      detail: "Update semantic visual nodes.",
      description:
        "Triggers visual node mapping updates, instantly creating an alternative/competitor link between the new tool and its specified parent nodes.",
      payload: `{
  "linksCreated": 3,
  "graphVersion": "v1.4",
  "status": "Neo4j / SVG Render Sync Complete"
}`,
    },
    {
      title: "Dashboard Refresh",
      detail: "Live insights refresh.",
      description:
        "Recalculates metric distribution values, rebuilds the weekly discover counts scale, and appends a learning log card to the chronological timeline feed.",
      payload: `{
  "totalLearned": 7,
  "weeklyActivityUpdated": true,
  "refreshAestheticTransition": "180ms"
}`,
    },
  ];

  return (
    <section className="page automation-page">
      <PageHeading
        title="Automation"
        subtitle="Every capture becomes structured memory, automatically."
        onAdd={onAdd}
      />

      <article className="panel workflow-panel">
        <div className="flow-title">
          <div>
            <h2>AI Tool Capture Workflow</h2>
            <p>n8n compatible - Active</p>
          </div>
          <button className="primary-button" onClick={() => setShowNewWorkflow(true)}>
            <Plus size={16} /> New workflow
          </button>
        </div>

        <div className="workflow-chain" style={{ cursor: "pointer" }}>
          {automationSteps.map(({ title, detail, icon: Icon }, index) => (
            <div className="workflow-wrap" key={title} onClick={() => setActiveStep(index)}>
              <motion.div
                className={`workflow-step ${activeStep === index ? "active" : ""}`}
                whileHover={{ y: -3 }}
                style={{
                  border:
                    activeStep === index ? "1px solid var(--blue)" : "1px solid var(--border)",
                  background: activeStep === index ? "rgba(26, 115, 232, 0.04)" : "white",
                  padding: "16px",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={21} style={{ color: activeStep === index ? "var(--blue)" : "inherit" }} />
                <strong style={{ color: activeStep === index ? "var(--blue)" : "inherit" }}>
                  {title}
                </strong>
                <small>{detail}</small>
              </motion.div>
              {index < automationSteps.length - 1 && (
                <ArrowRight className="flow-arrow" size={18} />
              )}
            </div>
          ))}
        </div>

        {activeStep !== null && (
          <motion.div
            className="step-inspector panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeStep}
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#fafbff",
              borderRadius: "10px",
              border: "1px solid #eef2ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "15px", color: "var(--blue)", fontWeight: 650 }}>
                Step {activeStep + 1}: {stepDetails[activeStep].title}
              </h3>
              <span className="tag" style={{ fontSize: "11px", background: "var(--border)" }}>
                {stepDetails[activeStep].detail}
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text)",
                margin: "0 0 12px 0",
                lineHeight: "1.5",
              }}
            >
              {stepDetails[activeStep].description}
            </p>
            <strong
              style={{
                fontSize: "12px",
                color: "var(--quiet)",
                display: "block",
                marginBottom: "6px",
              }}
            >
              Integration Payload Sample
            </strong>
            <pre
              style={{
                margin: 0,
                padding: "10px",
                background: "#1e1e1e",
                color: "#39c5bb",
                borderRadius: "6px",
                fontFamily: "monospace",
                fontSize: "12px",
                overflowX: "auto",
                border: "1px solid #2d2d2d",
              }}
            >
              {stepDetails[activeStep].payload}
            </pre>
          </motion.div>
        )}
      </article>

      <div
        className="integrations"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {[
          ["Supabase", "Structured storage", Database],
          ["n8n", "Automation triggers", Workflow],
          ["Notion", "Learning notes sync", Bookmark],
          ["Neo4j", "Knowledge graph ready", Network],
          ["Vector Search", "Semantic recall ready", Sparkles],
        ].map(([name, detail, icon]) => {
          const Icon = icon as React.ComponentType<{ size: number; style: React.CSSProperties }>;
          const isConnected = connected[name as string];
          return (
            <button
              className="integration-card-btn"
              key={name as string}
              onClick={() => toggleConnection(name as string)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "16px",
                borderRadius: "12px",
                background: "white",
                border: isConnected
                  ? "1px solid rgba(76, 175, 80, 0.4)"
                  : "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isConnected ? "0 4px 12px rgba(76, 175, 80, 0.04)" : "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = isConnected
                  ? "rgba(76, 175, 80, 0.6)"
                  : "var(--blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isConnected
                  ? "rgba(76, 175, 80, 0.4)"
                  : "var(--border)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Icon size={21} style={{ color: isConnected ? "#4caf50" : "var(--quiet)" }} />
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isConnected ? "#4caf50" : "#cbd5e1",
                  }}
                />
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0" }}>
                {name as string}
              </h3>
              <p style={{ fontSize: "12px", color: "var(--quiet)", margin: "0 0 12px 0" }}>
                {detail as string}
              </p>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 550,
                  color: isConnected ? "#4caf50" : "var(--blue)",
                }}
              >
                {isConnected ? "Connected (Syncing)" : "Connect Integration"}{" "}
                <ExternalLink size={12} style={{ display: "inline", marginLeft: "2px" }} />
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showNewWorkflow && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              zIndex: 9999,
              display: "grid",
              placeItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <motion.form
              className="capture-modal"
              onSubmit={deployCustomWorkflow}
              initial={{ y: 15, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: 0.98 }}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                width: "380px",
                position: "relative",
              }}
            >
              <button
                className="modal-close"
                type="button"
                aria-label="Close add tool"
                onClick={() => setShowNewWorkflow(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
              <span
                className="brand-mark"
                style={{
                  display: "inline-grid",
                  width: "40px",
                  height: "40px",
                  placeItems: "center",
                  background: "var(--blue-soft)",
                  borderRadius: "50%",
                  color: "var(--blue)",
                  marginBottom: "16px",
                }}
              >
                <Workflow size={20} />
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: 650, margin: "0 0 8px 0" }}>
                New Capture Webflow
              </h2>
              <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                Deploy a new webhook listener triggers system in n8n.
              </p>

              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 550,
                  marginBottom: "12px",
                }}
              >
                Workflow Trigger Name
                <input
                  autoFocus
                  value={customWebhookName}
                  onChange={(e) => setCustomWebhookName(e.target.value)}
                  placeholder="e.g. Slack trigger, WhatsApp Sync"
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 550,
                  marginBottom: "20px",
                }}
              >
                Webhook URL
                <input
                  value={customWebhookUrl}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "var(--quiet)",
                    background: "#f8f9fa",
                    outline: "none",
                  }}
                  readOnly
                />
              </label>

              <button
                type="submit"
                className="primary-button wide"
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={17} /> Deploy in n8n
              </button>
            </motion.form>
          </motion.div>
        )}

        {notification && (
          <motion.div
            className="toast"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              background: "#1e1e1e",
              color: "white",
              padding: "12px 20px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              fontSize: "13px",
              zIndex: 99999,
            }}
          >
            <Sparkles size={16} style={{ color: "#4caf50" }} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
