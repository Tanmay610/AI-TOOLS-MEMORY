import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  BrainCircuit,
  TrendingUp,
  Pin,
  CalendarDays,
  Flame,
  ArrowRight,
  X,
  Plus,
} from "lucide-react";
import { Tool } from "./types";
import { PageHeading } from "./shared";

export function MemoryInsights({
  tools,
  onAdd,
  onTool,
  onUpdateTool,
  setCaptureName,
  setShowAdd,
}: {
  tools: Tool[];
  onAdd: () => void;
  onTool: (tool: Tool) => void;
  onUpdateTool: (name: string, changes: Partial<Tool>) => void;
  setCaptureName: (name: string) => void;
  setShowAdd: (show: boolean) => void;
}) {
  const [reviewCategory, setReviewCategory] = useState<string | null>(null);

  const recentlyLearned = tools.slice(0, 3).map((t) => t.name).join(", ") || "None added yet";
  const pinnedList = tools.filter((t) => t.pinned).map((t) => t.name).join(", ") || "No pinned tools";
  const recentlyViewedTool =
    tools.find((t) => t.viewed === "Just now" || t.viewed === "Today") ?? tools[0];
  const recentlyViewed = recentlyViewedTool?.name || "Cursor";
  const weeklyCount = tools.filter((t) => t.date === "Today" || t.date.includes("May")).length;

  const cards = [
    { label: "Recently learned tools", value: recentlyLearned, icon: Sparkles },
    { label: "Forgotten tools", value: "HeyGen, Pinecone, Otter", icon: BrainCircuit },
    { label: "Recently viewed", value: `${recentlyViewed} - Visited recently`, icon: TrendingUp },
    { label: "Pinned tools", value: pinnedList, icon: Pin },
    { label: "Weekly discoveries", value: `${weeklyCount} tools recorded in May`, icon: CalendarDays },
    { label: "AI learning streak", value: `${Math.max(1, tools.length * 3)} days active`, icon: Flame },
  ];

  const handleCaptureForgotten = (name: string) => {
    setReviewCategory(null);
    setCaptureName(name);
    setShowAdd(true);
  };

  return (
    <section className="page">
      <PageHeading
        title="Memory View"
        subtitle="Prompts to revisit what matters before it fades."
        onAdd={onAdd}
      />

      <div
        className="memory-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {cards.map(({ label, value, icon: Icon }) => (
          <article
            className="panel memory-card"
            key={label}
            onClick={() => setReviewCategory(label)}
            style={{ cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.borderColor = "var(--blue)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <Icon size={20} style={{ color: "var(--blue)", marginBottom: "10px" }} />
            <h3 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 650 }}>{label}</h3>
            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--text)" }}>{value}</p>
            <button
              className="text-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "none",
                border: "none",
                color: "var(--blue)",
                cursor: "pointer",
                padding: 0,
                fontSize: "13px",
                fontWeight: 550,
                gap: "4px",
              }}
            >
              Review <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {reviewCategory && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewCategory(null)}
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
            <motion.div
              className="capture-modal"
              initial={{ y: 15, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                width: "420px",
                position: "relative",
              }}
            >
              <button
                className="modal-close"
                onClick={() => setReviewCategory(null)}
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
                <BrainCircuit size={20} />
              </span>

              <h2 style={{ fontSize: "18px", fontWeight: 650, margin: "0 0 16px 0" }}>
                {reviewCategory}
              </h2>

              {reviewCategory === "Recently learned tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                    Revise how these tools link to your core operational stack:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {tools.slice(0, 3).map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => {
                          setReviewCategory(null);
                          onTool(tool);
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid var(--border)",
                          background: "#fafbff",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <div>
                          <strong style={{ display: "block", fontSize: "13px" }}>
                            {tool.name}
                          </strong>
                          <small style={{ color: "var(--quiet)", fontSize: "11px" }}>
                            {tool.role}
                          </small>
                        </div>
                        <span className="tag" style={{ fontSize: "10px", alignSelf: "center" }}>
                          {tool.category}
                        </span>
                      </button>
                    ))}
                    {tools.length === 0 && (
                      <p style={{ fontSize: "13px", color: "var(--quiet)" }}>
                        No tools learned yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {reviewCategory === "Forgotten tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                    Capture and review these popular stack integrations:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { name: "HeyGen", detail: "AI Video Synthesizer suite" },
                      { name: "Pinecone", detail: "High scale vector index DB" },
                      { name: "Otter", detail: "Real-time speech transcription" },
                    ].map((item) => (
                      <div
                        key={item.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "13px", display: "block" }}>
                            {item.name}
                          </strong>
                          <span style={{ fontSize: "11px", color: "var(--quiet)" }}>
                            {item.detail}
                          </span>
                        </div>
                        <button
                          className="secondary-button"
                          onClick={() => handleCaptureForgotten(item.name)}
                          style={{ fontSize: "11px", padding: "4px 8px" }}
                        >
                          <Plus size={12} /> Capture
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviewCategory === "Recently viewed" && (
                <div>
                  {recentlyViewedTool ? (
                    <div>
                      <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 12px 0" }}>
                        Update context or toggle workspace pin status:
                      </p>
                      <div
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: "10px",
                          padding: "12px",
                          background: "#fafbff",
                          marginBottom: "16px",
                        }}
                      >
                        <strong style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>
                          {recentlyViewedTool.name}
                        </strong>
                        <span
                          className="tag"
                          style={{ fontSize: "10px", marginBottom: "8px", display: "inline-block" }}
                        >
                          {recentlyViewedTool.category}
                        </span>
                        <p style={{ fontSize: "12px", color: "var(--text)", margin: "0 0 10px 0" }}>
                          {recentlyViewedTool.description}
                        </p>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button
                            className="secondary-button"
                            onClick={() =>
                              onUpdateTool(recentlyViewedTool.name, {
                                pinned: !recentlyViewedTool.pinned,
                              })
                            }
                            style={{
                              fontSize: "11px",
                              padding: "6px 10px",
                              display: "flex",
                              gap: "4px",
                              background: recentlyViewedTool.pinned
                                ? "rgba(26,115,232,0.06)"
                                : "white",
                            }}
                          >
                            <Pin size={12} />{" "}
                            {recentlyViewedTool.pinned ? "Pinned to stack" : "Pin tool"}
                          </button>
                        </div>
                      </div>
                      <button
                        className="primary-button wide"
                        onClick={() => {
                          setReviewCategory(null);
                          onTool(recentlyViewedTool);
                        }}
                      >
                        Inspect Full Graph Relationships
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "var(--quiet)" }}>
                      No recently viewed tools found.
                    </p>
                  )}
                </div>
              )}

              {reviewCategory === "Pinned tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                    Directly access or manage your pinned workspace items:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    {tools
                      .filter((t) => t.pinned)
                      .map((tool) => (
                        <div
                          key={tool.name}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            alignItems: "center",
                          }}
                        >
                          <button
                            onClick={() => {
                              setReviewCategory(null);
                              onTool(tool);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              padding: 0,
                            }}
                          >
                            <strong style={{ fontSize: "13px", color: "var(--blue)" }}>
                              {tool.name}
                            </strong>
                            <span
                              style={{
                                fontSize: "11px",
                                color: "var(--quiet)",
                                display: "block",
                              }}
                            >
                              {tool.category}
                            </span>
                          </button>
                          <button
                            className="text-btn"
                            onClick={() => onUpdateTool(tool.name, { pinned: false })}
                            style={{
                              fontSize: "12px",
                              color: "var(--red)",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            Unpin
                          </button>
                        </div>
                      ))}
                    {tools.filter((t) => t.pinned).length === 0 && (
                      <p style={{ fontSize: "13px", color: "var(--quiet)" }}>
                        No pinned items in workspace stack yet.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {reviewCategory === "Weekly discoveries" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                    Chronological velocity metrics for May 2026:
                  </p>
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                      border: "1px solid var(--border)",
                      marginBottom: "16px",
                      textAlign: "center",
                    }}
                  >
                    <CalendarDays size={32} style={{ color: "var(--blue)", marginBottom: "8px" }} />
                    <strong style={{ display: "block", fontSize: "20px", color: "var(--text)" }}>
                      {weeklyCount} Discovery Nodes
                    </strong>
                    <span style={{ fontSize: "12px", color: "var(--quiet)" }}>
                      Captured across this month&apos;s learning cycles
                    </span>
                  </div>
                  <button className="primary-button wide" onClick={() => setReviewCategory(null)}>
                    Dismiss Review
                  </button>
                </div>
              )}

              {reviewCategory === "AI learning streak" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>
                    You are in the top 3% of active AI stack architects:
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "8px", margin: "16px 0" }}>
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: i < 5 ? "rgba(76, 175, 80, 0.15)" : "#cbd5e1",
                          color: i < 5 ? "#4caf50" : "#64748b",
                          display: "grid",
                          placeItems: "center",
                          fontSize: "13px",
                          fontWeight: "bold",
                        }}
                      >
                        {i < 5 ? "★" : i + 1}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text)", margin: "0 0 20px 0" }}>
                    Learn <strong>1 more AI tool</strong> to advance to the Elite Architect badge
                    tier!
                  </p>
                  <button
                    className="primary-button wide"
                    onClick={() => {
                      setReviewCategory(null);
                      onAdd();
                    }}
                  >
                    <Plus size={16} /> Capture New AI Tool
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
