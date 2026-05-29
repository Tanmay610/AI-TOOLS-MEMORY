import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Workflow,
  Bot,
  Code2,
  Globe,
  Mic,
  Network,
  Sparkles,
  Plus,
  ArrowRight,
  Database,
  CalendarDays,
  ChevronDown,
  Bookmark,
  Pin,
  TrendingUp,
} from "lucide-react";
import { Category, Section, Tool } from "./types";

export function Dashboard({
  tools,
  selected,
  captureName,
  setCaptureName,
  saveTool,
  distribution,
  onNavigate,
  onTool,
  onUpdateTool,
  onNavigateToLibrary,
  showNotification,
  onPreview,
}: {
  tools: Tool[];
  selected: Tool;
  captureName: string;
  setCaptureName: (value: string) => void;
  saveTool: (event: FormEvent) => void;
  distribution: [string, number][];
  onNavigate: (value: Section) => void;
  onTool: (tool: Tool) => void;
  onUpdateTool: (name: string, changes: Partial<Tool>) => void;
  onNavigateToLibrary: (cat: Category | "All") => void;
  showNotification: (msg: string) => void;
  onPreview: (tool: Tool) => void;
}) {
  const activity = useMemo(() => {
    return tools.slice(0, 5).map((tool) => {
      let icon = Sparkles;
      if (tool.category === "Automation") icon = Workflow;
      else if (tool.category === "Coding") icon = Code2;
      else if (tool.category === "Agents") icon = Bot;
      else if (tool.category === "Research") icon = Globe;
      else if (tool.category === "Voice") icon = Mic;
      else if (tool.category === "MCP") icon = Network;

      return {
        event: `Discovered ${tool.name} in ${tool.category}`,
        time: tool.date === "Today" ? "Today, Just now" : `${tool.date}, 2026`,
        icon,
        tool,
      };
    });
  }, [tools]);

  const weeklyBars = useMemo(() => {
    const base = [18, 29, 21, 43, 37, 57, 44];
    const total = tools.length;
    if (total === 0) return [0, 0, 0, 0, 0, 0, 0];
    const scale = Math.max(0.2, total / 6);
    return base.map((b) => Math.round(b * scale));
  }, [tools]);

  const metrics = [
    {
      title: "Total Tools Learned",
      value: tools.length,
      change: tools.length > 0 ? `+${tools.length}` : "0",
      icon: BrainCircuit,
      filterCat: "All" as const,
    },
    {
      title: "Automation Tools",
      value: tools.filter((t) => t.category === "Automation").length,
      change: `+${tools.filter((t) => t.category === "Automation").length}`,
      icon: Workflow,
      filterCat: "Automation" as const,
    },
    {
      title: "AI Agents",
      value: tools.filter((t) => t.category === "Agents").length,
      change: `+${tools.filter((t) => t.category === "Agents").length}`,
      icon: Bot,
      filterCat: "Agents" as const,
    },
    {
      title: "Coding Tools",
      value: tools.filter((t) => t.category === "Coding").length,
      change: `+${tools.filter((t) => t.category === "Coding").length}`,
      icon: Code2,
      filterCat: "Coding" as const,
    },
    {
      title: "Research Tools",
      value: tools.filter((t) => t.category === "Research").length,
      change: `+${tools.filter((t) => t.category === "Research").length}`,
      icon: Globe,
      filterCat: "Research" as const,
    },
    {
      title: "Voice AI",
      value: tools.filter((t) => t.category === "Voice").length,
      change: `+${tools.filter((t) => t.category === "Voice").length}`,
      icon: Mic,
      filterCat: "Voice" as const,
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="mesh mesh-one" />
        <div className="mesh mesh-two" />
        <div className="hero-copy">
          <p className="eyebrow">
            <Sparkles size={14} /> Personal AI Knowledge OS
          </p>
          <h1>
            Build Your Personal
            <br />
            AI Memory System
          </h1>
          <p className="subtitle">
            Never forget an AI tool, automation workflow, or AI discovery again.
          </p>
          <form className="capture" onSubmit={saveTool}>
            <div>
              <Sparkles size={17} />
              <input
                aria-label="AI tool name"
                value={captureName}
                onChange={(event) => setCaptureName(event.target.value)}
                placeholder="Enter an AI tool name, e.g. Midjourney"
              />
            </div>
            <button type="submit" className="primary-button">
              <Plus size={17} /> Add Tool
            </button>
          </form>
          <div className="hero-buttons">
            <button
              className="secondary-button"
              onClick={() => onNavigate("Knowledge Graph")}
            >
              <Network size={17} /> Explore Knowledge Graph
            </button>
            <span className="helper">AI enriches every entry automatically</span>
          </div>
        </div>
        <div className="hero-visual">
          <div
            className="visual-card"
            onClick={() => selected && onPreview(selected)}
            style={{ cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            title="Click to view full tool description and notes"
          >
            <div className="visual-heading">
              <span className="tool-logo">
                {selected?.name?.charAt(0) || "AI"}
              </span>
              <div>
                <strong>{selected?.name || "No Tool"}</strong>
                <p>{selected?.role || "Learn context"}</p>
              </div>
              <span className="tag accent">{selected?.category || "Explore"}</span>
            </div>
            <p className="visual-description">
              {selected?.description || "Capture tools to map stack options."}
            </p>
            <div className="auto-row">
              <Sparkles size={15} />
              <span>AI analyzed</span>
              <span className="success">Complete</span>
            </div>
            <div className="relationship">
              <span>{selected?.name || "AI Tool"}</span>
              <ArrowRight size={13} />
              <span>{selected?.category || "Category"}</span>
              <ArrowRight size={13} />
              <span>{selected?.alternatives?.[0] || "Alternatives"}</span>
            </div>
          </div>
          <div className="float-pill float-top">
            <Database size={14} /> Saved to vault
          </div>
          <div className="float-pill float-bottom">
            <Network size={14} /> Graph updated
          </div>
        </div>
      </section>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-title">
            <div>
              <h2>Dashboard</h2>
              <p>Your AI learning workspace at a glance</p>
            </div>
            <button className="date-select" aria-label="Select date range">
              <CalendarDays size={15} /> This month <ChevronDown size={14} />
            </button>
          </div>
          <section className="metrics">
            {metrics.map(({ title, value, change, icon: Icon, filterCat }) => (
              <motion.button
                whileHover={{ y: -3 }}
                className="metric-card"
                key={title}
                onClick={() => onNavigateToLibrary(filterCat)}
                style={{
                  cursor: "pointer",
                  textAlign: "left",
                  background: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  outline: "none",
                }}
              >
                <Icon size={19} style={{ color: "var(--blue)", marginBottom: "8px" }} />
                <span
                  style={{ fontSize: "12px", color: "var(--quiet)", fontWeight: 550 }}
                >
                  {title}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <strong style={{ fontSize: "20px", fontWeight: "bold" }}>
                    {value}
                  </strong>
                  <small style={{ fontSize: "12px", color: "#4caf50", fontWeight: 600 }}>
                    {change}
                  </small>
                </div>
              </motion.button>
            ))}
          </section>
          <section className="charts">
            <ChartCard
              title="Tool category distribution"
              action="View all"
              onAction={() => onNavigateToLibrary("All")}
            >
              <div className="donut-area">
                <div className="donut">
                  <strong>{tools.length}</strong>
                  <span>Total tools</span>
                </div>
                <div
                  className="legend"
                  style={{ display: "flex", flexDirection: "column", gap: "6px" }}
                >
                  {distribution.map(([name, value], index) => (
                    <button
                      key={name}
                      onClick={() => onNavigateToLibrary(name as Category)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        textAlign: "left",
                        fontSize: "13px",
                        gap: "8px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--border)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <i className={`dot dot-${index}`} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{name}</span>
                      <strong>{value}</strong>
                    </button>
                  ))}
                </div>
              </div>
            </ChartCard>
            <ChartCard
              title="Tools discovered per week"
              action="Last 7 weeks"
              onAction={() => {
                showNotification(
                  `Discovered a total of ${tools.length} capabilities across 7 weeks.`
                );
              }}
            >
              <div className="bars">
                {weeklyBars.map((height, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      showNotification(
                        `Week ${index + 1}: Discovered ${height} AI capabilities`
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      style={{ height: `${height * 1.42}px` }}
                      className={index === 5 ? "selected-bar" : ""}
                    />
                    <small>W{index + 1}</small>
                  </div>
                ))}
              </div>
            </ChartCard>
          </section>
          <section className="lower-charts">
            <ChartCard
              title="Learning activity"
              action="See timeline"
              onAction={() => onNavigateToLibrary("All")}
            >
              <div className="timeline">
                {activity.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.event}
                      onClick={() => onPreview(item.tool)}
                      style={{
                        display: "flex",
                        width: "100%",
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        textAlign: "left",
                        gap: "12px",
                        transition: "background 0.2s",
                        alignItems: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--border)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <Icon size={16} style={{ color: "var(--blue)" }} />
                      <p
                        style={{
                          margin: 0,
                          fontSize: "13px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {item.event}
                        <small style={{ color: "var(--quiet)" }}>{item.time}</small>
                      </p>
                    </button>
                  );
                })}
              </div>
            </ChartCard>
            <ChartCard
              title="Knowledge growth"
              action="May"
              onAction={() => {
                showNotification("May 2026: Knowledge acquisition velocity is optimal!");
              }}
            >
              <KnowledgeHeatmap showNotification={showNotification} />
            </ChartCard>
          </section>
        </div>
        <RightSidebar
          key={selected?.name}
          tools={tools}
          onTool={onTool}
          selected={selected}
          onUpdateTool={onUpdateTool}
          onPreview={onPreview}
          onNavigateToLibrary={onNavigateToLibrary}
          setCaptureName={setCaptureName}
          showNotification={showNotification}
        />
      </div>
    </>
  );
}

export function ChartCard({
  title,
  action,
  children,
  onAction,
}: {
  title: string;
  action: string;
  children: React.ReactNode;
  onAction?: () => void;
}) {
  return (
    <article className="panel chart-card">
      <header>
        <h3>{title}</h3>
        <button
          onClick={onAction}
          style={{ cursor: onAction ? "pointer" : "default" }}
        >
          {action} <ChevronDown size={13} />
        </button>
      </header>
      {children}
    </article>
  );
}

export function KnowledgeHeatmap({
  showNotification,
}: {
  showNotification?: (msg: string) => void;
}) {
  const levels = [
    0, 1, 0, 2, 1, 3, 1, 2, 4, 2, 0, 1, 3, 2, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 3,
    1, 2, 4, 3, 1, 2, 3, 1, 0,
  ];
  const handleCellClick = (index: number) => {
    if (!showNotification) return;
    const days = [
      "May 2",
      "May 5",
      "May 8",
      "May 12",
      "May 15",
      "May 19",
      "May 22",
      "May 26",
      "May 29",
    ];
    const day = days[index % days.length];
    const count = (index % 4) + 1;
    showNotification(`${day}: Captured ${count} AI nodes into the memory vault`);
  };
  return (
    <div className="heatmap">
      <div className="cells">
        {levels.map((level, index) => (
          <i
            key={index}
            className={`level-${level}`}
            onClick={() => handleCellClick(index)}
            style={{ cursor: "pointer" }}
            title="Click to inspect activity logs"
          />
        ))}
      </div>
      <div className="heat-caption">
        <span>Less</span>
        <i />
        <i className="level-2" />
        <i className="level-4" />
        <span>More</span>
      </div>
    </div>
  );
}

export function RightSidebar({
  tools,
  selected,
  onUpdateTool,
  onPreview,
  onNavigateToLibrary,
  setCaptureName,
  showNotification,
}: {
  tools: Tool[];
  onTool: (tool: Tool) => void;
  selected: Tool;
  onUpdateTool: (name: string, changes: Partial<Tool>) => void;
  onPreview: (tool: Tool) => void;
  onNavigateToLibrary: (cat: Category | "All") => void;
  setCaptureName: (value: string) => void;
  showNotification: (msg: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [noteText, setNoteText] = useState(selected?.notes || "");

  function handleSaveNote() {
    setIsEditing(false);
    if (selected && noteText !== selected.notes) {
      onUpdateTool(selected.name, { notes: noteText });
    }
  }

  return (
    <aside className="right-sidebar">
      <article className="panel recent">
        <header>
          <h3>Recent discoveries</h3>
          <button
            onClick={() => onNavigateToLibrary("All")}
            style={{ cursor: "pointer" }}
          >
            View all
          </button>
        </header>
        {tools.slice(0, 4).map((tool) => (
          <button
            className="discovery"
            key={tool.name}
            onClick={() => onPreview(tool)}
          >
            <span className="small-logo">{tool.name.charAt(0)}</span>
            <span>
              <strong>{tool.name}</strong>
              <small>
                {tool.category} - {tool.date}
              </small>
            </span>
            <ArrowRight size={14} />
          </button>
        ))}
      </article>
      <article className="panel quick-notes">
        <header>
          <h3>Personal Notes ({selected?.name || "No Tool"})</h3>
          {selected &&
            (isEditing ? (
              <button
                onClick={handleSaveNote}
                style={{ color: "var(--blue)", fontWeight: 650, fontSize: "12px" }}
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Edit notes"
              >
                <Plus size={16} />
              </button>
            ))}
        </header>
        {isEditing ? (
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onBlur={handleSaveNote}
            autoFocus
            className="notes-textarea"
            style={{
              width: "100%",
              height: "80px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px",
              fontFamily: "inherit",
              fontSize: "13px",
              outline: "none",
              resize: "none",
              marginTop: "8px",
              background: "white",
            }}
          />
        ) : (
          <p
            onClick={() => selected && setIsEditing(true)}
            style={{
              cursor: selected ? "pointer" : "default",
              fontSize: "13px",
              color: selected ? "var(--text)" : "var(--quiet)",
              marginTop: "8px",
            }}
          >
            {selected ? (
              selected.notes ||
              "No notes captured yet. Click to add personal learning context."
            ) : (
              "Select a tool to view and edit notes."
            )}
          </p>
        )}
        <small style={{ marginTop: "10px", display: "block" }}>
          Real-time database persistence
        </small>
      </article>
      <article className="panel pinned">
        <header>
          <h3>Pinned items</h3>
          <Pin size={15} />
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            marginTop: "8px",
          }}
        >
          {tools
            .filter((tool) => tool.pinned)
            .map((tool) => (
              <button
                className="pinned-item-btn"
                key={tool.name}
                onClick={() => onPreview(tool)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  padding: "6px 8px",
                  borderRadius: "6px",
                  textAlign: "left",
                  fontSize: "13px",
                  gap: "8px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Bookmark size={14} style={{ color: "var(--blue)" }} />
                <strong style={{ flex: 1, fontWeight: 550 }}>{tool.name}</strong>
                <span className="tag" style={{ fontSize: "10px", padding: "2px 6px" }}>
                  {tool.category}
                </span>
              </button>
            ))}
          {tools.filter((tool) => tool.pinned).length === 0 && (
            <p style={{ fontSize: "12px", color: "var(--quiet)", padding: "0 8px" }}>
              No pinned items yet.
            </p>
          )}
        </div>
      </article>
      <article className="panel trending">
        <header>
          <h3>Trending AI tools</h3>
          <TrendingUp size={15} />
        </header>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {[
            { name: "Lovable", desc: "Design to app" },
            { name: "Granola", desc: "Meeting notes" },
            { name: "Wispr Flow", desc: "Voice input" },
          ].map(({ name, desc }) => (
            <button
              key={name}
              onClick={() => {
                setCaptureName(name);
                showNotification(
                  `Pre-filled "${name}" in the Add Tool field. Click "Add Tool" to save!`
                );
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: "8px",
                textAlign: "left",
                fontSize: "13px",
                transition: "background 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--border)";
                e.currentTarget.style.transform = "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <strong style={{ fontWeight: 600, color: "var(--text)" }}>
                {name}
              </strong>
              <span style={{ fontSize: "12px", color: "var(--quiet)" }}>
                {desc}
              </span>
            </button>
          ))}
        </div>
      </article>
    </aside>
  );
}
