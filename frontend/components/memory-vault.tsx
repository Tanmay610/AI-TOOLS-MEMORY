"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Bot,
  Boxes,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  Code2,
  Database,
  ExternalLink,
  Filter,
  Flame,
  GitBranch,
  Globe,
  Grid2x2,
  Home,
  ListFilter,
  Maximize2,
  Mic,
  Network,
  PanelRight,
  Pin,
  Plus,
  RefreshCcw,
  Search,
  Settings2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  UserRound,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Section =
  | "Dashboard"
  | "Knowledge Graph"
  | "Library"
  | "Automation"
  | "Insights"
  | "Profile";

type Category =
  | "Automation"
  | "Coding"
  | "Agents"
  | "Research"
  | "Voice"
  | "Video"
  | "Image"
  | "Design"
  | "MCP"
  | "Open Source"
  | "Extensions"
  | "Productivity";

type Tool = {
  name: string;
  category: Category;
  description: string;
  useCase: string;
  role: string;
  alternatives: string[];
  related: string[];
  tags: string[];
  notes: string;
  source: string;
  date: string;
  importance: "High" | "Medium" | "Low";
  viewed: string;
  pinned?: boolean;
  favorite?: boolean;
};

type LibraryFilter = "All tools" | "Pinned" | "Favorites" | "High importance";
type SortMode = "Recent" | "Name" | "Importance";

const sections: { name: Section; icon: LucideIcon }[] = [
  { name: "Dashboard", icon: Grid2x2 },
  { name: "Knowledge Graph", icon: Network },
  { name: "Library", icon: Boxes },
  { name: "Automation", icon: Workflow },
  { name: "Insights", icon: TrendingUp },
  { name: "Profile", icon: UserRound },
];

const initialTools: Tool[] = [
  {
    name: "n8n",
    category: "Automation",
    description: "Visual workflow automation with extensible AI and API nodes.",
    useCase: "Connect AI services into repeatable operational workflows.",
    role: "Orchestration layer",
    alternatives: ["Zapier", "Make"],
    related: ["OpenAI", "Notion", "Supabase"],
    tags: ["workflows", "agents", "no-code"],
    notes: "Explore webhook triggers and agent tool calls next.",
    source: "YouTube / AI Stack",
    date: "May 27",
    importance: "High",
    viewed: "Today",
    pinned: true,
    favorite: true,
  },
  {
    name: "Cursor",
    category: "Coding",
    description: "AI-native code editor with contextual project assistance.",
    useCase: "Navigate, edit and reason about large codebases faster.",
    role: "Development workspace",
    alternatives: ["Windsurf", "GitHub Copilot"],
    related: ["MCP", "Claude", "GitHub"],
    tags: ["ide", "developer", "pairing"],
    notes: "Test custom rules for team coding standards.",
    source: "Product Hunt",
    date: "May 26",
    importance: "High",
    viewed: "Today",
    favorite: true,
  },
  {
    name: "Perplexity",
    category: "Research",
    description: "Citation-first discovery and answer engine.",
    useCase: "Explore unfamiliar topics with traceable sources.",
    role: "Research companion",
    alternatives: ["ChatGPT Search", "Elicit"],
    related: ["Notion", "Readwise", "Browser"],
    tags: ["search", "sources", "discovery"],
    notes: "Store high-value research threads alongside source URLs.",
    source: "Newsletter",
    date: "May 25",
    importance: "Medium",
    viewed: "Yesterday",
  },
  {
    name: "ElevenLabs",
    category: "Voice",
    description: "Natural speech generation and voice agent platform.",
    useCase: "Generate narration and conversational voice experiences.",
    role: "Voice output",
    alternatives: ["PlayHT", "Cartesia"],
    related: ["Descript", "HeyGen", "n8n"],
    tags: ["tts", "voice", "audio"],
    notes: "Compare latency for live assistant workflows.",
    source: "X bookmark",
    date: "May 23",
    importance: "Medium",
    viewed: "3 days ago",
  },
  {
    name: "Manus",
    category: "Agents",
    description: "Autonomous AI agent for multi-step digital tasks.",
    useCase: "Delegate research and deliverable-focused execution.",
    role: "Task agent",
    alternatives: ["Operator", "Genspark"],
    related: ["Browser", "Notion", "Slack"],
    tags: ["agent", "execution", "delegation"],
    notes: "Evaluate task reliability on recurring research briefs.",
    source: "Community",
    date: "May 21",
    importance: "Medium",
    viewed: "Last week",
  },
  {
    name: "Bolt",
    category: "Coding",
    description: "Prompt-to-application web development environment.",
    useCase: "Turn product ideas into working prototypes quickly.",
    role: "Prototype builder",
    alternatives: ["Lovable", "v0"],
    related: ["Supabase", "Vercel", "React"],
    tags: ["builder", "prototype", "web"],
    notes: "Useful for validation before production implementation.",
    source: "Demo day",
    date: "May 19",
    importance: "High",
    viewed: "Last week",
    pinned: true,
  },
];

const catalog: Record<string, Omit<Tool, "name" | "date" | "viewed">> = {
  zapier: {
    category: "Automation",
    description: "No-code automation platform for app-to-app actions.",
    useCase: "Trigger reliable business workflows across common SaaS tools.",
    role: "Workflow connector",
    alternatives: ["n8n", "Make"],
    related: ["Slack", "Gmail", "Notion"],
    tags: ["automation", "integrations", "triggers"],
    notes: "Compare AI action depth and cost against n8n.",
    source: "Quick capture",
    importance: "Medium",
  },
  midjourney: {
    category: "Image",
    description: "Generative image platform for highly styled visuals.",
    useCase: "Produce concept imagery and brand exploration assets.",
    role: "Visual generator",
    alternatives: ["DALL-E", "Flux"],
    related: ["Figma", "Photoshop", "Canva"],
    tags: ["image", "creative", "design"],
    notes: "Build a reference board for consistent visual styles.",
    source: "Quick capture",
    importance: "Medium",
  },
  notion: {
    category: "Productivity",
    description: "Connected workspace for documentation, databases and notes.",
    useCase: "Publish and organize AI learnings into team-readable pages.",
    role: "Knowledge destination",
    alternatives: ["Coda", "Obsidian"],
    related: ["n8n", "Perplexity", "Slack"],
    tags: ["notes", "sync", "database"],
    notes: "Enable Notion sync for curated learning summaries.",
    source: "Quick capture",
    importance: "High",
  },
};

const categories: Category[] = [
  "Automation",
  "Coding",
  "Agents",
  "Research",
  "Voice",
  "Video",
  "Image",
  "Design",
  "MCP",
  "Open Source",
  "Extensions",
  "Productivity",
];

const automationSteps = [
  { title: "Tool Name Input", detail: "Single-field capture", icon: Plus },
  { title: "AI Analysis", detail: "Enrich context", icon: Sparkles },
  { title: "Auto Categorization", detail: "Apply tags + role", icon: ListFilter },
  { title: "Database Save", detail: "Vector ready", icon: Database },
  { title: "Graph Update", detail: "Link relations", icon: Network },
  { title: "Dashboard Refresh", detail: "Insights live", icon: RefreshCcw },
];

const storageKey = "ai-memory-vault-tools";
const storedToolsEvent = "ai-memory-vault-updated";
const emptyStoredTools: Tool[] = [];
let cachedToolsValue = "";
let cachedTools: Tool[] = emptyStoredTools;

function readStoredTools(): Tool[] {
  const value = window.localStorage.getItem(storageKey) ?? "[]";
  if (value === cachedToolsValue) return cachedTools;
  try {
    cachedTools = JSON.parse(value) as Tool[];
  } catch {
    cachedTools = emptyStoredTools;
  }
  cachedToolsValue = value;
  return cachedTools;
}


function createTool(rawName: string): Tool {
  const cleanName = rawName.trim();
  const known = catalog[cleanName.toLowerCase()];
  if (known) {
    return { name: cleanName, ...known, date: "Today", viewed: "Just now" };
  }
  return {
    name: cleanName,
    category: "Agents",
    description: `${cleanName} is an AI tool captured for automatic research and enrichment.`,
    useCase: "Investigate capabilities and map it into your AI workflow.",
    role: "New discovery",
    alternatives: ["Explore alternatives"],
    related: ["AI Tools", "Research"],
    tags: ["new", "to-review", "ai"],
    notes: "AI enrichment queued. Add first impressions after exploring.",
    source: "Quick capture",
    date: "Today",
    importance: "Medium",
    viewed: "Just now",
  };
}

export function MemoryVault() {
  const [active, setActive] = useState<Section>("Dashboard");
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [backendActive, setBackendActive] = useState(false);
  const [selectedName, setSelectedName] = useState("n8n");
  const [captureName, setCaptureName] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("All tools");
  const [sortMode, setSortMode] = useState<SortMode>("Recent");
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Load from backend API
    fetch("http://localhost:3001/api/tools")
      .then((res) => {
        if (!res.ok) throw new Error("Backend offline");
        return res.json();
      })
      .then((data: Tool[]) => {
        setTools(data);
        setBackendActive(true);
        window.localStorage.setItem(storageKey, JSON.stringify(data));
      })
      .catch((err) => {
        console.warn("Backend server not reached. Falling back to local offline storage.", err);
        // Fallback to local storage
        const stored = readStoredTools();
        if (stored && stored.length > 0) {
          // Merge stored with initial tools to ensure everything is present
          const merged = [
            ...stored,
            ...initialTools.filter(
              (initial) => !stored.some((s) => s.name.toLowerCase() === initial.name.toLowerCase())
            )
          ];
          setTools(merged);
        }
      });
  }, []);

  const selected = tools.find((tool) => tool.name === selectedName) ?? tools[0] ?? initialTools[0];
  const preview = tools.find((tool) => tool.name === previewName) ?? null;
  const filteredTools = useMemo(() => {
    const importanceRank = { High: 0, Medium: 1, Low: 2 };
    const results = tools.filter(
      (tool) =>
        (category === "All" || tool.category === category) &&
        (libraryFilter === "All tools" ||
          (libraryFilter === "Pinned" && tool.pinned) ||
          (libraryFilter === "Favorites" && tool.favorite) ||
          (libraryFilter === "High importance" && tool.importance === "High")) &&
        `${tool.name || ""} ${tool.description || ""} ${tool.notes || ""} ${(tool.tags || []).join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
    if (sortMode === "Name") {
      return [...results].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortMode === "Importance") {
      return [...results].sort(
        (a, b) => importanceRank[a.importance] - importanceRank[b.importance],
      );
    }
    return results;
  }, [category, libraryFilter, search, sortMode, tools]);

  const distribution = useMemo(() => {
    const counts = tools.reduce<Record<string, number>>((all, tool) => {
      all[tool.category] = (all[tool.category] ?? 0) + 1;
      return all;
    }, {});
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [tools]);

  function persistTools(nextTools: Tool[]) {
    window.localStorage.setItem(storageKey, JSON.stringify(nextTools));
    window.dispatchEvent(new Event(storedToolsEvent));
  }

  function updateTool(name: string, changes: Partial<Tool>) {
    const nextTools = tools.map((tool) => (tool.name === name ? { ...tool, ...changes } : tool));
    setTools(nextTools);
    persistTools(nextTools);

    if (backendActive) {
      fetch(`http://localhost:3001/api/tools/${encodeURIComponent(name)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      }).catch((err) => {
        console.error("Failed to sync tool update with backend:", err);
      });
    }
  }

  function deleteTool(toolToDelete: Tool) {
    if (!window.confirm(`Are you sure you want to delete ${toolToDelete.name} from your vault?`)) {
      return;
    }

    const nextTools = tools.filter((t) => t.name !== toolToDelete.name);
    setTools(nextTools);
    persistTools(nextTools);

    if (backendActive) {
      fetch(`http://localhost:3001/api/tools/${encodeURIComponent(toolToDelete.name)}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete tool on server");
          setNotification(`${toolToDelete.name} deleted successfully`);
          window.setTimeout(() => setNotification(""), 3200);
        })
        .catch((err) => {
          console.error("Failed to delete tool from backend:", err);
        });
    } else {
      setNotification(`${toolToDelete.name} deleted from local storage`);
      window.setTimeout(() => setNotification(""), 3200);
    }

    if (selectedName === toolToDelete.name) {
      const remaining = nextTools[0] ?? initialTools[0];
      setSelectedName(remaining.name);
    }
  }

  function saveTool(event: FormEvent) {
    event.preventDefault();
    const cleanName = captureName.trim();
    if (!cleanName) return;

    const existing = tools.some(
      (tool) => tool.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (existing) {
      setNotification(`${cleanName} is already in your vault`);
      setCaptureName("");
      setShowAdd(false);
      window.setTimeout(() => setNotification(""), 3200);
      return;
    }

    if (backendActive) {
      fetch("http://localhost:3001/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to post tool");
          return res.json();
        })
        .then((newTool: Tool) => {
          const nextTools = [newTool, ...tools];
          setTools(nextTools);
          setSelectedName(newTool.name);
          setNotification(`${newTool.name} enriched and saved`);
          persistTools(nextTools);
        })
        .catch((err) => {
          console.error("Failed to add tool to backend, falling back to local creation:", err);
          const item = createTool(cleanName);
          const nextTools = [item, ...tools];
          setTools(nextTools);
          setSelectedName(item.name);
          setNotification(`${item.name} enriched and saved`);
          persistTools(nextTools);
        });
    } else {
      const item = createTool(cleanName);
      const nextTools = [item, ...tools];
      setTools(nextTools);
      setSelectedName(item.name);
      setNotification(`${item.name} enriched and saved`);
      persistTools(nextTools);
    }

    setCaptureName("");
    setShowAdd(false);
    setActive("Dashboard");
    window.setTimeout(() => setNotification(""), 3200);
  }

  function openTool(tool: Tool) {
    updateTool(tool.name, { viewed: "Just now" });
    setSelectedName(tool.name);
    setActive("Knowledge Graph");
  }

  function handleNavigateToLibrary(cat: Category | "All") {
    setCategory(cat);
    setLibraryFilter("All tools");
    setActive("Library");
  }

  return (
    <div className="app-frame">
      <Header
        active={active}
        onNavigate={setActive}
        onAdd={() => setShowAdd(true)}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          if (value.trim()) setActive("Library");
        }}
      />
      <main className="workspace">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {active === "Dashboard" && (
              <Dashboard
                tools={tools}
                selected={selected}
                captureName={captureName}
                setCaptureName={setCaptureName}
                saveTool={saveTool}
                distribution={distribution}
                onNavigate={setActive}
                onTool={openTool}
                onUpdateTool={updateTool}
                onNavigateToLibrary={handleNavigateToLibrary}
                showNotification={setNotification}
                onPreview={(tool) => setPreviewName(tool.name)}
              />
            )}
            {active === "Knowledge Graph" && (
              <KnowledgeGraph
                tools={tools}
                selected={selected}
                select={setSelectedName}
                onAdd={() => setShowAdd(true)}
                onNavigateToLibrary={handleNavigateToLibrary}
                setCaptureName={setCaptureName}
                setShowAdd={setShowAdd}
              />
            )}
            {active === "Library" && (
              <Library
                tools={filteredTools}
                category={category}
                setCategory={setCategory}
                libraryFilter={libraryFilter}
                setLibraryFilter={setLibraryFilter}
                sortMode={sortMode}
                setSortMode={setSortMode}
                search={search}
                setSearch={setSearch}
                onPreview={(tool) => setPreviewName(tool.name)}
                onPin={(tool) => updateTool(tool.name, { pinned: !tool.pinned })}
                onFavorite={(tool) =>
                  updateTool(tool.name, { favorite: !tool.favorite })
                }
                onAdd={() => setShowAdd(true)}
              />
            )}
            {active === "Automation" && <Automation onAdd={() => setShowAdd(true)} />}
            {active === "Insights" && (
              <MemoryInsights
                tools={tools}
                onAdd={() => setShowAdd(true)}
                onTool={openTool}
                onUpdateTool={updateTool}
                setCaptureName={setCaptureName}
                setShowAdd={setShowAdd}
              />
            )}
            {active === "Profile" && <Profile onAdd={() => setShowAdd(true)} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav active={active} onNavigate={setActive} onAdd={() => setShowAdd(true)} />
      <AnimatePresence>
        {showAdd && (
          <CaptureModal
            key="capture-modal"
            value={captureName}
            setValue={setCaptureName}
            onSave={saveTool}
            onClose={() => setShowAdd(false)}
          />
        )}
        {notification && (
          <motion.div
            key="toast-notification"
            className="toast"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
          >
            <Sparkles size={16} />
            {notification}
          </motion.div>
        )}
        {preview && (
          <ToolPreview
            key="tool-preview"
            tool={preview}
            onClose={() => setPreviewName(null)}
            onGraph={() => {
              setPreviewName(null);
              openTool(preview);
            }}
            onPin={() => updateTool(preview.name, { pinned: !preview.pinned })}
            onFavorite={() =>
              updateTool(preview.name, { favorite: !preview.favorite })
            }
            onDelete={() => {
              setPreviewName(null);
              deleteTool(preview);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Header({
  active,
  onNavigate,
  onAdd,
  search,
  onSearch,
}: {
  active: Section;
  onNavigate: (value: Section) => void;
  onAdd: () => void;
  search: string;
  onSearch: (value: string) => void;
}) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate("Dashboard")}>
        <span className="brand-mark">
          <BrainCircuit size={20} />
        </span>
        <span>AI Memory Vault</span>
      </button>
      <nav className="desktop-navigation">
        {sections.map(({ name }) => (
          <button
            key={name}
            className={active === name ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(name)}
          >
            {name}
          </button>
        ))}
      </nav>
      <div className="topbar-actions">
        <label className="header-search">
          <Search size={16} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search tools"
          />
        </label>
        <button className="icon-action notification">
          <Bell size={18} />
          <span />
        </button>
        <button className="add-compact" onClick={onAdd}>
          <Plus size={16} />
          Add Tool
        </button>
        <button className="avatar">TM</button>
      </div>
    </header>
  );
}

function Dashboard({
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
    { title: "Total Tools Learned", value: tools.length, change: tools.length > 0 ? `+${tools.length}` : "0", icon: BrainCircuit, filterCat: "All" as const },
    { title: "Automation Tools", value: tools.filter((t) => t.category === "Automation").length, change: `+${tools.filter((t) => t.category === "Automation").length}`, icon: Workflow, filterCat: "Automation" as const },
    { title: "AI Agents", value: tools.filter((t) => t.category === "Agents").length, change: `+${tools.filter((t) => t.category === "Agents").length}`, icon: Bot, filterCat: "Agents" as const },
    { title: "Coding Tools", value: tools.filter((t) => t.category === "Coding").length, change: `+${tools.filter((t) => t.category === "Coding").length}`, icon: Code2, filterCat: "Coding" as const },
    { title: "Research Tools", value: tools.filter((t) => t.category === "Research").length, change: `+${tools.filter((t) => t.category === "Research").length}`, icon: Globe, filterCat: "Research" as const },
    { title: "Voice AI", value: tools.filter((t) => t.category === "Voice").length, change: `+${tools.filter((t) => t.category === "Voice").length}`, icon: Mic, filterCat: "Voice" as const },
  ];

  return (
    <>
      <section className="hero">
        <div className="mesh mesh-one" />
        <div className="mesh mesh-two" />
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={14} /> Personal AI Knowledge OS</p>
          <h1>Build Your Personal<br />AI Memory System</h1>
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
            <button className="secondary-button" onClick={() => onNavigate("Knowledge Graph")}>
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
              <span className="tool-logo">{selected?.name?.charAt(0) || "AI"}</span>
              <div><strong>{selected?.name || "No Tool"}</strong><p>{selected?.role || "Learn context"}</p></div>
              <span className="tag accent">{selected?.category || "Explore"}</span>
            </div>
            <p className="visual-description">{selected?.description || "Capture tools to map stack options."}</p>
            <div className="auto-row"><Sparkles size={15} /><span>AI analyzed</span><span className="success">Complete</span></div>
            <div className="relationship">
              <span>{selected?.name || "AI Tool"}</span><ArrowRight size={13}/><span>{selected?.category || "Category"}</span><ArrowRight size={13}/><span>{selected?.alternatives?.[0] || "Alternatives"}</span>
            </div>
          </div>
          <div className="float-pill float-top"><Database size={14} /> Saved to vault</div>
          <div className="float-pill float-bottom"><Network size={14} /> Graph updated</div>
        </div>
      </section>
      <div className="dashboard-grid">
        <div className="dashboard-main">
          <div className="section-title">
            <div><h2>Dashboard</h2><p>Your AI learning workspace at a glance</p></div>
            <button className="date-select"><CalendarDays size={15} /> This month <ChevronDown size={14}/></button>
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
                  outline: "none"
                }}
              >
                <Icon size={19} style={{ color: "var(--blue)", marginBottom: "8px" }} />
                <span style={{ fontSize: "12px", color: "var(--quiet)", fontWeight: 550 }}>{title}</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "4px" }}>
                  <strong style={{ fontSize: "20px", fontWeight: "bold" }}>{value}</strong>
                  <small style={{ fontSize: "12px", color: "#4caf50", fontWeight: 600 }}>{change}</small>
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
                <div className="donut"><strong>{tools.length}</strong><span>Total tools</span></div>
                <div className="legend" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
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
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
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
                showNotification(`Discovered a total of ${tools.length} capabilities across 7 weeks.`);
              }}
            >
              <div className="bars">
                {weeklyBars.map((height, index) => (
                  <div 
                    key={index} 
                    onClick={() => {
                      showNotification(`Week ${index + 1}: Discovered ${height} AI capabilities`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span style={{ height: `${height * 1.42}px` }} className={index === 5 ? "selected-bar" : ""} />
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
                        alignItems: "center"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--border)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      <Icon size={16} style={{ color: "var(--blue)" }}/>
                      <p style={{ margin: 0, fontSize: "13px", display: "flex", flexDirection: "column", gap: "2px" }}>
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

function ChartCard({
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
          {action} <ChevronDown size={13}/>
        </button>
      </header>
      {children}
    </article>
  );
}

function KnowledgeHeatmap({ showNotification }: { showNotification?: (msg: string) => void }) {
  const levels = [0, 1, 0, 2, 1, 3, 1, 2, 4, 2, 0, 1, 3, 2, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 3, 1, 2, 4, 3, 1, 2, 3, 1, 0];
  const handleCellClick = (index: number) => {
    if (!showNotification) return;
    const days = ["May 2", "May 5", "May 8", "May 12", "May 15", "May 19", "May 22", "May 26", "May 29"];
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
      <div className="heat-caption"><span>Less</span><i/><i className="level-2"/><i className="level-4"/><span>More</span></div>
    </div>
  );
}

function RightSidebar({
  tools,
  onTool,
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
          <button className="discovery" key={tool.name} onClick={() => onPreview(tool)}>
            <span className="small-logo">{tool.name.charAt(0)}</span>
            <span><strong>{tool.name}</strong><small>{tool.category} - {tool.date}</small></span>
            <ArrowRight size={14}/>
          </button>
        ))}
      </article>
      <article className="panel quick-notes">
        <header>
          <h3>Personal Notes ({selected?.name || "No Tool"})</h3>
          {selected && (
            isEditing ? (
              <button onClick={handleSaveNote} style={{ color: "var(--blue)", fontWeight: 650, fontSize: "12px" }}>Save</button>
            ) : (
              <button onClick={() => setIsEditing(true)} aria-label="Edit notes"><Plus size={16}/></button>
            )
          )}
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
              background: "white"
            }}
          />
        ) : (
          <p onClick={() => selected && setIsEditing(true)} style={{ cursor: selected ? "pointer" : "default", fontSize: "13px", color: selected ? "var(--text)" : "var(--quiet)", marginTop: "8px" }}>
            {selected ? (selected.notes || "No notes captured yet. Click to add personal learning context.") : "Select a tool to view and edit notes."}
          </p>
        )}
        <small style={{ marginTop: "10px", display: "block" }}>Real-time database persistence</small>
      </article>
      <article className="panel pinned">
        <header><h3>Pinned items</h3><Pin size={15}/></header>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
          {tools.filter((tool) => tool.pinned).map((tool) => (
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
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--border)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Bookmark size={14} style={{ color: "var(--blue)" }} />
              <strong style={{ flex: 1, fontWeight: 550 }}>{tool.name}</strong>
              <span className="tag" style={{ fontSize: "10px", padding: "2px 6px" }}>{tool.category}</span>
            </button>
          ))}
          {tools.filter((tool) => tool.pinned).length === 0 && (
            <p style={{ fontSize: "12px", color: "var(--quiet)", padding: "0 8px" }}>No pinned items yet.</p>
          )}
        </div>
      </article>
      <article className="panel trending">
        <header><h3>Trending AI tools</h3><TrendingUp size={15}/></header>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
          {[
            { name: "Lovable", desc: "Design to app" },
            { name: "Granola", desc: "Meeting notes" },
            { name: "Wispr Flow", desc: "Voice input" }
          ].map(({ name, desc }) => (
            <button
              key={name}
              onClick={() => {
                setCaptureName(name);
                showNotification(`Pre-filled "${name}" in the Add Tool field. Click "Add Tool" to save!`);
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
                transition: "background 0.2s, transform 0.1s"
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
              <strong style={{ fontWeight: 600, color: "var(--text)" }}>{name}</strong>
              <span style={{ fontSize: "12px", color: "var(--quiet)" }}>{desc}</span>
            </button>
          ))}
        </div>
      </article>
    </aside>
  );
}

function KnowledgeGraph({
  tools,
  selected,
  select,
  onAdd,
  onNavigateToLibrary,
  setCaptureName,
  setShowAdd,
}: {
  tools: Tool[];
  selected: Tool;
  select: (value: string) => void;
  onAdd: () => void;
  onNavigateToLibrary: (cat: Category) => void;
  setCaptureName: (name: string) => void;
  setShowAdd: (show: boolean) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const graphNodes = [
    { text: selected?.category || "Explore", type: "Category", x: 50, y: 16 },
    { text: selected?.alternatives?.[0] || "Alternatives", type: "Alternative", x: 78, y: 35 },
    { text: selected?.alternatives?.[1] ?? "Integrations", type: "Competitor", x: 78, y: 66 },
    { text: selected?.role || "Learn context", type: "Workflow", x: 48, y: 82 },
    { text: selected?.related?.[0] || "Related", type: "Integration", x: 19, y: 64 },
    { text: selected?.related?.[1] || "Related Stack", type: "Related", x: 22, y: 29 },
  ];

  const handleNodeClick = (node: { text: string; type: string }) => {
    const genericPlaceholders = ["Alternatives", "Integrations", "Competitor", "Workflow", "Related", "Related Stack", "Learn context", "Explore"];
    if (genericPlaceholders.includes(node.text)) {
      return;
    }

    if (node.type === "Category") {
      onNavigateToLibrary(node.text as Category);
    } else if (node.type === "Alternative" || node.type === "Competitor" || node.type === "Integration" || node.type === "Related") {
      const found = tools.find((t) => t.name.toLowerCase() === node.text.toLowerCase());
      if (found) {
        select(found.name);
      } else {
        setCaptureName(node.text);
        setShowAdd(true);
      }
    }
  };

  return (
    <section className="page">
      <PageHeading
        title="Knowledge Graph"
        subtitle="Explore relationships between tools, categories and workflows."
        onAdd={onAdd}
      />
      <div className="graph-layout">
        <article className="panel graph-panel">
          <div className="graph-toolbar">
            <label><Search size={15}/><span>Find node...</span></label>
            <div>
              <button onClick={() => setZoom(Math.min(130, zoom + 10))}><ZoomIn size={16}/></button>
              <button onClick={() => setZoom(Math.max(80, zoom - 10))}><ZoomOut size={16}/></button>
              <button><Maximize2 size={16}/></button>
            </div>
          </div>
          <div className="graph-canvas" style={{ transform: `scale(${zoom / 100})` }}>
            <svg aria-hidden="true" viewBox="0 0 100 100">
              {graphNodes.map((node) => (
                <line key={node.text} x1="50" y1="48" x2={node.x} y2={node.y} />
              ))}
            </svg>
            <motion.div className="core-node" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <span>{selected?.name?.charAt(0) || "AI"}</span>{selected?.name || "No Tool"}<small>Selected AI Tool</small>
            </motion.div>
            {graphNodes.map((node) => (
              <motion.button
                className="graph-node"
                key={node.text}
                style={{ left: `${node.x}%`, top: `${node.y}%`, position: "absolute", cursor: "pointer" }}
                whileHover={{ scale: 1.06 }}
                onClick={() => handleNodeClick(node)}
              >
                <strong>{node.text}</strong><small>{node.type}</small>
              </motion.button>
            ))}
          </div>
        </article>
        <aside className="panel graph-detail">
          <p className="eyebrow">Selected node</p>
          <h2>{selected?.name || "No Tool"}</h2>
          <span className="tag accent">{selected?.category || "Explore"}</span>
          <p>{selected?.description || "Select a tool to explore relations."}</p>
          <h3>Workflow role</h3>
          <p>{selected?.role || "Learn context"}</p>
          <h3>Switch tool</h3>
          <div className="tool-switch">
            {tools.slice(0, 6).map((tool) => (
              <button className={tool.name === selected?.name ? "chosen" : ""} onClick={() => select(tool.name)} key={tool.name}>
                {tool.name}
              </button>
            ))}
          </div>
          <button className="primary-button wide"><GitBranch size={16}/> Expand nodes</button>
        </aside>
      </div>
    </section>
  );
}

function Library({
  tools,
  category,
  setCategory,
  libraryFilter,
  setLibraryFilter,
  sortMode,
  setSortMode,
  search,
  setSearch,
  onPreview,
  onPin,
  onFavorite,
  onAdd,
}: {
  tools: Tool[];
  category: Category | "All";
  setCategory: (value: Category | "All") => void;
  libraryFilter: LibraryFilter;
  setLibraryFilter: (value: LibraryFilter) => void;
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
  search: string;
  setSearch: (value: string) => void;
  onPreview: (tool: Tool) => void;
  onPin: (tool: Tool) => void;
  onFavorite: (tool: Tool) => void;
  onAdd: () => void;
}) {
  const filters: LibraryFilter[] = ["All tools", "Pinned", "Favorites", "High importance"];
  const sorts: SortMode[] = ["Recent", "Name", "Importance"];

  function nextFilter() {
    const next = (filters.indexOf(libraryFilter) + 1) % filters.length;
    setLibraryFilter(filters[next]);
  }

  function nextSort() {
    const next = (sorts.indexOf(sortMode) + 1) % sorts.length;
    setSortMode(sorts[next]);
  }

  return (
    <section className="page">
      <PageHeading title="Tool Library" subtitle="Your AI stack, documented and ready to recall." onAdd={onAdd} />
      <div className="library-controls panel">
        <label><Search size={16}/><input placeholder="Search purpose, tags or tool" value={search} onChange={(event) => setSearch(event.target.value)}/></label>
        <button className={libraryFilter !== "All tools" ? "control-active" : ""} onClick={nextFilter} aria-label={`Filter: ${libraryFilter}. Click to change.`}><Filter size={16}/> {libraryFilter}</button>
        <button className={sortMode !== "Recent" ? "control-active" : ""} onClick={nextSort} aria-label={`Sort: ${sortMode}. Click to change.`}><ListFilter size={16}/> {sortMode}</button>
      </div>
      <div className="category-pills">
        {(["All", ...categories] as const).map((item) => (
          <button className={item === category ? "chosen" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>
        ))}
      </div>
      <article className="panel library-table">
        <div className="table-header">
          <span>Tool Name</span><span>Purpose</span><span>Category</span><span>Workflow Role</span><span>Notes</span><span>Source</span><span>Date Added</span><span>Importance</span><span>Last Viewed</span><span />
        </div>
        {tools.map((tool) => (
          <motion.div whileHover={{ backgroundColor: "#f8faff" }} className="table-row" key={tool.name}>
            <span className="tool-cell"><i>{tool.name.charAt(0)}</i><button className="tool-link" onClick={() => onPreview(tool)}>{tool.name}</button><button className={tool.favorite ? "favorite active" : "favorite"} aria-label={tool.favorite ? `Remove ${tool.name} from favorites` : `Favorite ${tool.name}`} onClick={() => onFavorite(tool)}><Star size={13}/></button></span>
            <span>{tool.useCase}</span>
            <span><small className="tag">{tool.category}</small></span>
            <span>{tool.role}</span>
            <span className="notes-cell">{tool.notes}</span>
            <span>{tool.source}</span>
            <span>{tool.date}</span>
            <span className={`importance ${tool.importance.toLowerCase()}`}>{tool.importance}</span>
            <span>{tool.viewed}</span>
            <span className="actions">
              <button className={tool.pinned ? "active" : ""} aria-label={tool.pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`} onClick={() => onPin(tool)}><Pin size={14}/></button>
              <button aria-label={`Quick preview ${tool.name}`} onClick={() => onPreview(tool)}><PanelRight size={14}/></button>
            </span>
          </motion.div>
        ))}
        {tools.length === 0 && <p className="empty-state">No tools match your filters.</p>}
      </article>
    </section>
  );
}

function Automation({ onAdd }: { onAdd: () => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(0);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [customWebhookName, setCustomWebhookName] = useState("");
  const [customWebhookUrl, setCustomWebhookUrl] = useState("http://localhost:5678/webhook/ai-vault");
  const [notification, setNotification] = useState("");

  const [connected, setConnected] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("workspace-integrations");
      return saved ? JSON.parse(saved) : { Supabase: true, n8n: false, Notion: false, Neo4j: false, "Vector Search": false };
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
      description: "Listens to immediate keyboard triggers from the main capture input or top search bars. Fires a REST endpoint or Webhook call to trigger downstream AI categorization flows.",
      payload: `{
  "name": "anti-gravity",
  "source": "Quick capture",
  "date": "Today"
}`
    },
    {
      title: "AI Analysis",
      detail: "Enrich context via LLM.",
      description: "Dispatches the raw tool name to the Gemini API (gemini-2.5-flash) to retrieve professional metadata including use-case descriptions, alternatives, importance rank, and tags.",
      payload: `{
  "description": "An autonomous AI coding agent designed by Google DeepMind for advanced agentic coding...",
  "useCase": "Automate complex codebase refactoring, package migrations, and fullstack debugging.",
  "role": "Autonomous agent",
  "importance": "High"
}`
    },
    {
      title: "Auto Categorization",
      detail: "Apply tags and workspaces.",
      description: "Categorizes the integration into one of 12 predefined category tags (Automation, Coding, Voice, MCP, Productivity, etc.) to ensure immediate stack indexing.",
      payload: `{
  "category": "Coding",
  "tags": ["agent", "coding", "antigravity", "deepmind"],
  "related": ["Gemini 3.5 Flash", "Next.js"]
}`
    },
    {
      title: "Database Save",
      detail: "Persist to tools database.",
      description: "Pushes the structured JSON object payload to the local atomic file-system db (tools.json) via backend server REST interfaces, fallback-writing to LocalStorage.",
      payload: `HTTP/1.1 201 Created
{
  "success": true,
  "data": { "name": "antigravity", "category": "Coding", ... }
}`
    },
    {
      title: "Graph Update",
      detail: "Update semantic visual nodes.",
      description: "Triggers visual node mapping updates, instantly creating an alternative/competitor link between the new tool and its specified parent nodes.",
      payload: `{
  "linksCreated": 3,
  "graphVersion": "v1.4",
  "status": "Neo4j / SVG Render Sync Complete"
}`
    },
    {
      title: "Dashboard Refresh",
      detail: "Live insights refresh.",
      description: "Recalculates metric distribution values, rebuilds the weekly discover counts scale, and appends a learning log card to the chronological timeline feed.",
      payload: `{
  "totalLearned": 7,
  "weeklyActivityUpdated": true,
  "refreshAestheticTransition": "180ms"
}`
    }
  ];

  return (
    <section className="page automation-page">
      <PageHeading title="Automation" subtitle="Every capture becomes structured memory, automatically." onAdd={onAdd} />
      
      <article className="panel workflow-panel">
        <div className="flow-title">
          <div>
            <h2>AI Tool Capture Workflow</h2>
            <p>n8n compatible - Active</p>
          </div>
          <button className="primary-button" onClick={() => setShowNewWorkflow(true)}>
            <Plus size={16}/> New workflow
          </button>
        </div>
        
        <div className="workflow-chain" style={{ cursor: "pointer" }}>
          {automationSteps.map(({ title, detail, icon: Icon }, index) => (
            <div className="workflow-wrap" key={title} onClick={() => setActiveStep(index)}>
              <motion.div 
                className={`workflow-step ${activeStep === index ? "active" : ""}`} 
                whileHover={{ y: -3 }}
                style={{
                  border: activeStep === index ? "1px solid var(--blue)" : "1px solid var(--border)",
                  background: activeStep === index ? "rgba(26, 115, 232, 0.04)" : "white",
                  padding: "16px",
                  borderRadius: "12px",
                  transition: "all 0.2s ease"
                }}
              >
                <Icon size={21} style={{ color: activeStep === index ? "var(--blue)" : "inherit" }}/>
                <strong style={{ color: activeStep === index ? "var(--blue)" : "inherit" }}>{title}</strong>
                <small>{detail}</small>
              </motion.div>
              {index < automationSteps.length - 1 && <ArrowRight className="flow-arrow" size={18}/>}
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
              border: "1px solid #eef2ff"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", color: "var(--blue)", fontWeight: 650 }}>
                Step {activeStep + 1}: {stepDetails[activeStep].title}
              </h3>
              <span className="tag" style={{ fontSize: "11px", background: "var(--border)" }}>
                {stepDetails[activeStep].detail}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text)", margin: "0 0 12px 0", lineHeight: "1.5" }}>
              {stepDetails[activeStep].description}
            </p>
            <strong style={{ fontSize: "12px", color: "var(--quiet)", display: "block", marginBottom: "6px" }}>
              Integration Payload Sample
            </strong>
            <pre style={{
              margin: 0,
              padding: "10px",
              background: "#1e1e1e",
              color: "#39c5bb",
              borderRadius: "6px",
              fontFamily: "monospace",
              fontSize: "12px",
              overflowX: "auto",
              border: "1px solid #2d2d2d"
            }}>
              {stepDetails[activeStep].payload}
            </pre>
          </motion.div>
        )}
      </article>

      <div className="integrations" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {[
          ["Supabase", "Structured storage", Database],
          ["n8n", "Automation triggers", Workflow],
          ["Notion", "Learning notes sync", Bookmark],
          ["Neo4j", "Knowledge graph ready", Network],
          ["Vector Search", "Semantic recall ready", Sparkles],
        ].map(([name, detail, icon]) => {
          const Icon = icon as LucideIcon;
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
                border: isConnected ? "1px solid rgba(76, 175, 80, 0.4)" : "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s ease",
                boxShadow: isConnected ? "0 4px 12px rgba(76, 175, 80, 0.04)" : "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = isConnected ? "rgba(76, 175, 80, 0.6)" : "var(--blue)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = isConnected ? "rgba(76, 175, 80, 0.4)" : "var(--border)";
              }}
            >
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <Icon size={21} style={{ color: isConnected ? "#4caf50" : "var(--quiet)" }}/>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#4caf50" : "#cbd5e1"
                }}/>
              </div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 4px 0" }}>{name as string}</h3>
              <p style={{ fontSize: "12px", color: "var(--quiet)", margin: "0 0 12px 0" }}>{detail as string}</p>
              <span style={{ fontSize: "12px", fontWeight: 550, color: isConnected ? "#4caf50" : "var(--blue)" }}>
                {isConnected ? "Connected (Syncing)" : "Connect Integration"} <ExternalLink size={12} style={{ display: "inline", marginLeft: "2px" }}/>
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
            style={{ zIndex: 9999, display: "grid", placeItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)" }}
          >
            <motion.form 
              className="capture-modal" 
              onSubmit={deployCustomWorkflow} 
              initial={{ y: 15, scale: 0.98 }} 
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: 0.98 }}
              style={{ background: "white", padding: "24px", borderRadius: "16px", width: "380px", position: "relative" }}
            >
              <button 
                className="modal-close" 
                type="button" 
                aria-label="Close add tool" 
                onClick={() => setShowNewWorkflow(false)}
                style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18}/>
              </button>
              <span className="brand-mark" style={{ display: "inline-grid", width: "40px", height: "40px", placeItems: "center", background: "var(--blue-soft)", borderRadius: "50%", color: "var(--blue)", marginBottom: "16px" }}>
                <Workflow size={20}/>
              </span>
              <h2 style={{ fontSize: "18px", fontWeight: 650, margin: "0 0 8px 0" }}>New Capture Webflow</h2>
              <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>Deploy a new webhook listener triggers system in n8n.</p>
              
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 550, marginBottom: "12px" }}>
                Workflow Trigger Name
                <input 
                  autoFocus 
                  value={customWebhookName} 
                  onChange={(e) => setCustomWebhookName(e.target.value)} 
                  placeholder="e.g. Slack trigger, WhatsApp Sync" 
                  style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 550, marginBottom: "20px" }}>
                Webhook URL
                <input 
                  value={customWebhookUrl} 
                  onChange={(e) => setCustomWebhookUrl(e.target.value)} 
                  style={{ padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "13px", color: "var(--quiet)", background: "#f8f9fa", outline: "none" }}
                  readOnly
                />
              </label>

              <button type="submit" className="primary-button wide" style={{ display: "flex", width: "100%", justifyContent: "center", gap: "8px" }}>
                <Sparkles size={17}/> Deploy in n8n
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
              zIndex: 99999
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

function MemoryInsights({
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
  const recentlyViewedTool = tools.find((t) => t.viewed === "Just now" || t.viewed === "Today") ?? tools[0];
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
      <PageHeading title="Memory View" subtitle="Prompts to revisit what matters before it fades." onAdd={onAdd} />
      
      <div className="memory-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
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
            <Icon size={20} style={{ color: "var(--blue)", marginBottom: "10px" }}/>
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
                gap: "4px"
              }}
            >
              Review <ArrowRight size={14}/>
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
            style={{ zIndex: 9999, display: "grid", placeItems: "center", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)" }}
          >
            <motion.div
              className="capture-modal"
              initial={{ y: 15, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 15, scale: 0.98 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "white", padding: "24px", borderRadius: "16px", width: "420px", position: "relative" }}
            >
              <button 
                className="modal-close" 
                onClick={() => setReviewCategory(null)}
                style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18}/>
              </button>
              
              <span className="brand-mark" style={{ display: "inline-grid", width: "40px", height: "40px", placeItems: "center", background: "var(--blue-soft)", borderRadius: "50%", color: "var(--blue)", marginBottom: "16px" }}>
                <BrainCircuit size={20}/>
              </span>
              
              <h2 style={{ fontSize: "18px", fontWeight: 650, margin: "0 0 16px 0" }}>{reviewCategory}</h2>

              {reviewCategory === "Recently learned tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>Revise how these tools link to your core operational stack:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {tools.slice(0, 3).map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => { setReviewCategory(null); onTool(tool); }}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          padding: "12px",
                          borderRadius: "10px",
                          border: "1px solid var(--border)",
                          background: "#fafbff",
                          textAlign: "left",
                          cursor: "pointer"
                        }}
                      >
                        <div>
                          <strong style={{ display: "block", fontSize: "13px" }}>{tool.name}</strong>
                          <small style={{ color: "var(--quiet)", fontSize: "11px" }}>{tool.role}</small>
                        </div>
                        <span className="tag" style={{ fontSize: "10px", alignSelf: "center" }}>{tool.category}</span>
                      </button>
                    ))}
                    {tools.length === 0 && <p style={{ fontSize: "13px", color: "var(--quiet)" }}>No tools learned yet.</p>}
                  </div>
                </div>
              )}

              {reviewCategory === "Forgotten tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>Capture and review these popular stack integrations:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {[
                      { name: "HeyGen", detail: "AI Video Synthesizer suite" },
                      { name: "Pinecone", detail: "High scale vector index DB" },
                      { name: "Otter", detail: "Real-time speech transcription" }
                    ].map((item) => (
                      <div 
                        key={item.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: "13px", display: "block" }}>{item.name}</strong>
                          <span style={{ fontSize: "11px", color: "var(--quiet)" }}>{item.detail}</span>
                        </div>
                        <button 
                          className="secondary-button" 
                          onClick={() => handleCaptureForgotten(item.name)}
                          style={{ fontSize: "11px", padding: "4px 8px" }}
                        >
                          <Plus size={12}/> Capture
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
                      <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 12px 0" }}>Update context or toggle workspace pin status:</p>
                      <div style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "12px", background: "#fafbff", marginBottom: "16px" }}>
                        <strong style={{ display: "block", fontSize: "14px", marginBottom: "4px" }}>{recentlyViewedTool.name}</strong>
                        <span className="tag" style={{ fontSize: "10px", marginBottom: "8px", display: "inline-block" }}>{recentlyViewedTool.category}</span>
                        <p style={{ fontSize: "12px", color: "var(--text)", margin: "0 0 10px 0" }}>{recentlyViewedTool.description}</p>
                        
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button 
                            className="secondary-button"
                            onClick={() => onUpdateTool(recentlyViewedTool.name, { pinned: !recentlyViewedTool.pinned })}
                            style={{ fontSize: "11px", padding: "6px 10px", display: "flex", gap: "4px", background: recentlyViewedTool.pinned ? "rgba(26,115,232,0.06)" : "white" }}
                          >
                            <Pin size={12}/> {recentlyViewedTool.pinned ? "Pinned to stack" : "Pin tool"}
                          </button>
                        </div>
                      </div>
                      <button 
                        className="primary-button wide"
                        onClick={() => { setReviewCategory(null); onTool(recentlyViewedTool); }}
                      >
                        Inspect Full Graph Relationships
                      </button>
                    </div>
                  ) : (
                    <p style={{ fontSize: "13px", color: "var(--quiet)" }}>No recently viewed tools found.</p>
                  )}
                </div>
              )}

              {reviewCategory === "Pinned tools" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>Directly access or manage your pinned workspace items:</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "200px", overflowY: "auto" }}>
                    {tools.filter((t) => t.pinned).map((tool) => (
                      <div 
                        key={tool.name}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          alignItems: "center"
                        }}
                      >
                        <button 
                          onClick={() => { setReviewCategory(null); onTool(tool); }}
                          style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
                        >
                          <strong style={{ fontSize: "13px", color: "var(--blue)" }}>{tool.name}</strong>
                          <span style={{ fontSize: "11px", color: "var(--quiet)", display: "block" }}>{tool.category}</span>
                        </button>
                        <button 
                          className="text-btn"
                          onClick={() => onUpdateTool(tool.name, { pinned: false })}
                          style={{ fontSize: "12px", color: "var(--red)", background: "none", border: "none", cursor: "pointer" }}
                        >
                          Unpin
                        </button>
                      </div>
                    ))}
                    {tools.filter((t) => t.pinned).length === 0 && (
                      <p style={{ fontSize: "13px", color: "var(--quiet)" }}>No pinned items in workspace stack yet.</p>
                    )}
                  </div>
                </div>
              )}

              {reviewCategory === "Weekly discoveries" && (
                <div>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>Chronological velocity metrics for May 2026:</p>
                  <div style={{ padding: "16px", borderRadius: "10px", background: "#f8fafc", border: "1px solid var(--border)", marginBottom: "16px", textAlign: "center" }}>
                    <CalendarDays size={32} style={{ color: "var(--blue)", marginBottom: "8px" }}/>
                    <strong style={{ display: "block", fontSize: "20px", color: "var(--text)" }}>{weeklyCount} Discovery Nodes</strong>
                    <span style={{ fontSize: "12px", color: "var(--quiet)" }}>Captured across this month&apos;s learning cycles</span>
                  </div>
                  <button className="primary-button wide" onClick={() => setReviewCategory(null)}>
                    Dismiss Review
                  </button>
                </div>
              )}

              {reviewCategory === "AI learning streak" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "13px", color: "var(--quiet)", margin: "0 0 16px 0" }}>You are in the top 3% of active AI stack architects:</p>
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
                          fontWeight: "bold"
                        }}
                      >
                        {i < 5 ? "★" : i + 1}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--text)", margin: "0 0 20px 0" }}>
                    Learn <strong>1 more AI tool</strong> to advance to the Elite Architect badge tier!
                  </p>
                  <button 
                    className="primary-button wide"
                    onClick={() => { setReviewCategory(null); onAdd(); }}
                  >
                    <Plus size={16}/> Capture New AI Tool
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

function Profile({ onAdd }: { onAdd: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<Record<string, boolean>>({
    enrichment: true,
    notion: true,
    recap: true,
    vector: true,
  });

  useEffect(() => {
    const savedEnrichment = localStorage.getItem("setting-enrichment");
    const savedNotion = localStorage.getItem("setting-notion");
    const savedRecap = localStorage.getItem("setting-recap");
    const savedVector = localStorage.getItem("setting-vector");

    const timer = setTimeout(() => {
      setSettings({
        enrichment: savedEnrichment === null ? true : savedEnrichment === "true",
        notion: savedNotion === null ? true : savedNotion === "true",
        recap: savedRecap === null ? true : savedRecap === "true",
        vector: savedVector === null ? true : savedVector === "true",
      });
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleToggle = (key: string) => {
    const nextVal = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: nextVal }));
    localStorage.setItem(`setting-${key}`, String(nextVal));
  };

  return (
    <section className="page profile-page">
      <PageHeading title="Workspace Settings" subtitle="Configure your personal AI memory system." onAdd={onAdd} />
      <article className="panel settings-card">
        <div className="profile-person">
          <span>TM</span>
          <div>
            <h2>Tanmay&apos;s Vault</h2>
            <p>Personal workspace - Pro plan</p>
          </div>
        </div>
        {[
          { label: "Automatic AI enrichment", key: "enrichment" },
          { label: "Notion learning notes sync", key: "notion" },
          { label: "Weekly memory recap", key: "recap" },
          { label: "Vector search indexing", key: "vector" },
        ].map(({ label, key }) => (
          <label className="setting" key={label}>
            {label}
            <input
              type="checkbox"
              checked={mounted ? settings[key] : true}
              onChange={() => mounted && handleToggle(key)}
            />
            <i />
          </label>
        ))}
        <button className="secondary-button">
          <Settings2 size={16} /> Manage integrations
        </button>
      </article>
    </section>
  );
}

function PageHeading({ title, subtitle, onAdd }: { title: string; subtitle: string; onAdd: () => void }) {
  return <header className="page-heading"><div><h1>{title}</h1><p>{subtitle}</p></div><button className="secondary-button" onClick={onAdd}><Plus size={16}/> Add Tool</button></header>;
}

function ToolPreview({
  tool,
  onClose,
  onGraph,
  onPin,
  onFavorite,
  onDelete,
}: {
  tool: Tool;
  onClose: () => void;
  onGraph: () => void;
  onPin: () => void;
  onFavorite: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      className="preview-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        className="tool-preview"
        initial={{ x: 26 }}
        animate={{ x: 0 }}
        exit={{ x: 26 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="preview-header">
          <span className="tool-logo">{tool.name.charAt(0)}</span>
          <div>
            <h2>{tool.name}</h2>
            <span className="tag accent">{tool.category}</span>
          </div>
          <button className="modal-close" aria-label="Close quick preview" onClick={onClose}>
            <X size={18}/>
          </button>
        </header>
        <p className="preview-description">{tool.description}</p>
        <dl className="preview-facts">
          <div><dt>Primary use case</dt><dd>{tool.useCase}</dd></div>
          <div><dt>Workflow role</dt><dd>{tool.role}</dd></div>
          <div><dt>Learning notes</dt><dd>{tool.notes}</dd></div>
          <div><dt>Source discovered from</dt><dd>{tool.source}</dd></div>
          <div><dt>Date added</dt><dd>{tool.date}</dd></div>
          <div><dt>Importance</dt><dd className={`importance ${tool.importance.toLowerCase()}`}>{tool.importance}</dd></div>
        </dl>
        <section className="preview-tags">
          <h3>Alternatives</h3>
          <div>{tool.alternatives.map((alternative) => <span className="tag" key={alternative}>{alternative}</span>)}</div>
          <h3>Tags and related tools</h3>
          <div>{[...tool.tags, ...tool.related].map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
        </section>
        <footer className="preview-actions">
          <button className={tool.pinned ? "secondary-button selected" : "secondary-button"} onClick={onPin}><Pin size={16}/>{tool.pinned ? "Pinned" : "Pin"}</button>
          <button className={tool.favorite ? "secondary-button selected" : "secondary-button"} onClick={onFavorite}><Star size={16}/>{tool.favorite ? "Saved" : "Favorite"}</button>
          <button className="secondary-button destructive" onClick={onDelete} style={{ color: "var(--red)", borderColor: "var(--red-soft)", background: "rgba(239, 68, 68, 0.05)" }}><Trash2 size={16}/>Delete</button>
          <button className="primary-button" onClick={onGraph}><Network size={16}/> View graph</button>
        </footer>
      </motion.aside>
    </motion.div>
  );
}

function CaptureModal({
  value,
  setValue,
  onSave,
  onClose,
}: {
  value: string;
  setValue: (value: string) => void;
  onSave: (event: FormEvent) => void;
  onClose: () => void;
}) {
  const [suggestion, setSuggestion] = useState<{
    category: string;
    role: string;
    description: string;
    name?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const trimmed = value.trim();

  useEffect(() => {
    if (trimmed.length < 2) {
      Promise.resolve().then(() => {
        setSuggestion(null);
        setLoading(false);
      });
      return;
    }

    Promise.resolve().then(() => {
      setLoading(true);
    });
    const handler = setTimeout(() => {
      fetch(`http://localhost:3001/api/suggest?name=${encodeURIComponent(trimmed)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Offline");
          return res.json();
        })
        .then((data) => {
          setSuggestion(data);
          setLoading(false);
        })
        .catch(() => {
          // Client-side quick preview fallbacks for offline mode
          let category = "Agents";
          let role = "Autonomous discovery";
          let description = `${trimmed} is an AI tool captured for automatic research and enrichment.`;
          
          const lower = trimmed.toLowerCase();
          if (lower.includes("voice") || lower.includes("speech") || lower.includes("audio") || lower.includes("tts")) {
            category = "Voice";
            role = "Voice synthesizer";
            description = `Dynamic offline synthesized audio generator for ${trimmed}.`;
          } else if (lower.includes("video") || lower.includes("movie") || lower.includes("sora")) {
            category = "Video";
            role = "Video synthesizer";
            description = `Dynamic offline video synthesis suite for ${trimmed}.`;
          } else if (lower.includes("image") || lower.includes("draw") || lower.includes("midjourney") || lower.includes("art")) {
            category = "Image";
            role = "Visual synthesizer";
            description = `High fidelity offline styled image synthesizer for ${trimmed}.`;
          } else if (lower.includes("code") || lower.includes("dev") || lower.includes("ide") || lower.includes("editor") || lower.includes("antigravity") || lower.includes("anti-gravity")) {
            category = "Coding";
            role = "Developer companion";
            description = `Autonomous local AI developer paired coding workspace for ${trimmed}.`;
          } else if (lower.includes("automate") || lower.includes("flow") || lower.includes("workflow")) {
            category = "Automation";
            role = "Workflow orchestrator";
            description = `Reliable multi-app workflow sync connector for ${trimmed}.`;
          }
          
          setSuggestion({ category, role, description });
          setLoading(false);
        });
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [trimmed]);

  return (
    <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.form className="capture-modal" onSubmit={onSave} initial={{ y: 15, scale: 0.98 }} animate={{ y: 0, scale: 1 }}>
        <button className="modal-close" type="button" aria-label="Close add tool" onClick={onClose}><X size={18}/></button>
        <span className="brand-mark"><Sparkles size={20}/></span>
        <h2>Add an AI tool</h2>
        <p>Just enter a name. AI Memory Vault fills in everything else.</p>
        <label>
          Tool name
          <input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="e.g. Zapier, Midjourney, Notion" />
        </label>

        {loading && (
          <div className="suggestion-loading">
            <Sparkles size={14} className="spin-icon" />
            <span>AI analyzing stack placement...</span>
          </div>
        )}

        {!loading && suggestion && (
          <motion.div 
            className="suggestion-preview-card"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="suggestion-preview-header">
              <span className="suggestion-icon-mark">{trimmed.charAt(0)}</span>
              <div>
                <strong>{value}</strong>
                <p>{suggestion.role}</p>
              </div>
              <span className="tag accent">{suggestion.category}</span>
            </div>
            <p className="suggestion-preview-desc">{suggestion.description}</p>
          </motion.div>
        )}

        <button type="submit" className="primary-button wide"><Sparkles size={17}/> Analyze and save</button>
      </motion.form>
    </motion.div>
  );
}

function MobileNav({
  active,
  onNavigate,
  onAdd,
}: {
  active: Section;
  onNavigate: (value: Section) => void;
  onAdd: () => void;
}) {
  const nav = [
    ["Dashboard", Home],
    ["Library", Boxes],
    ["Add", Plus],
    ["Knowledge Graph", Network],
    ["Profile", UserRound],
  ] as const;
  return (
    <nav className="mobile-nav">
      {nav.map(([name, Icon]) =>
        name === "Add" ? (
          <button className="mobile-add" key={name} onClick={onAdd}><Icon size={22}/></button>
        ) : (
          <button key={name} className={active === name ? "active" : ""} onClick={() => onNavigate(name)}><Icon size={20}/><span>{name === "Dashboard" ? "Home" : name === "Knowledge Graph" ? "Graph" : name}</span></button>
        ),
      )}
    </nav>
  );
}
