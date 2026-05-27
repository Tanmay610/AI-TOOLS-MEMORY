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
  Lightbulb,
  Link2,
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
  TrendingUp,
  UserRound,
  Workflow,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react";

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

const weeklyBars = [18, 29, 21, 43, 37, 57, 44];
const activity = [
  { event: "Added n8n to Automation", time: "Today, 10:42 AM", icon: Workflow },
  { event: "Connected Cursor with MCP", time: "Yesterday", icon: Link2 },
  { event: "Saved a Perplexity learning note", time: "May 25", icon: Lightbulb },
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

function subscribeToStoredTools(update: () => void) {
  window.addEventListener("storage", update);
  window.addEventListener(storedToolsEvent, update);
  return () => {
    window.removeEventListener("storage", update);
    window.removeEventListener(storedToolsEvent, update);
  };
}

function noStoredTools() {
  return emptyStoredTools;
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
  const storedTools = useSyncExternalStore(
    subscribeToStoredTools,
    readStoredTools,
    noStoredTools,
  );
  const [selectedName, setSelectedName] = useState("n8n");
  const [captureName, setCaptureName] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("All tools");
  const [sortMode, setSortMode] = useState<SortMode>("Recent");
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [notification, setNotification] = useState("");
  const tools = useMemo(
    () => [
      ...storedTools,
      ...initialTools.filter(
        (initial) =>
          !storedTools.some(
            (stored) => stored.name.toLowerCase() === initial.name.toLowerCase(),
          ),
      ),
    ],
    [storedTools],
  );

  const selected = tools.find((tool) => tool.name === selectedName) ?? tools[0];
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
        `${tool.name} ${tool.description} ${tool.notes} ${tool.tags.join(" ")}`
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
    persistTools(
      tools.map((tool) => (tool.name === name ? { ...tool, ...changes } : tool)),
    );
  }

  function saveTool(event: FormEvent) {
    event.preventDefault();
    if (!captureName.trim()) return;
    const item = createTool(captureName);
    const existing = tools.some(
      (tool) => tool.name.toLowerCase() === item.name.toLowerCase(),
    );
    if (!existing) {
      persistTools([item, ...tools]);
    }
    setSelectedName(existing ? selectedName : item.name);
    setNotification(existing ? `${item.name} is already in your vault` : `${item.name} enriched and saved`);
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
              />
            )}
            {active === "Knowledge Graph" && (
              <KnowledgeGraph tools={tools} selected={selected} select={setSelectedName} onAdd={() => setShowAdd(true)} />
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
            {active === "Insights" && <MemoryInsights tools={tools} onAdd={() => setShowAdd(true)} />}
            {active === "Profile" && <Profile onAdd={() => setShowAdd(true)} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileNav active={active} onNavigate={setActive} onAdd={() => setShowAdd(true)} />
      <AnimatePresence>
        {showAdd && (
          <CaptureModal
            value={captureName}
            setValue={setCaptureName}
            onSave={saveTool}
            onClose={() => setShowAdd(false)}
          />
        )}
        {notification && (
          <motion.div
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
}: {
  tools: Tool[];
  selected: Tool;
  captureName: string;
  setCaptureName: (value: string) => void;
  saveTool: (event: FormEvent) => void;
  distribution: [string, number][];
  onNavigate: (value: Section) => void;
  onTool: (tool: Tool) => void;
}) {
  const metrics = [
    { title: "Total Tools Learned", value: tools.length + 118, change: "+12%", icon: BrainCircuit },
    { title: "Automation Tools", value: tools.filter((t) => t.category === "Automation").length + 22, change: "+3", icon: Workflow },
    { title: "AI Agents", value: tools.filter((t) => t.category === "Agents").length + 16, change: "+5", icon: Bot },
    { title: "Coding Tools", value: tools.filter((t) => t.category === "Coding").length + 29, change: "+8%", icon: Code2 },
    { title: "Research Tools", value: tools.filter((t) => t.category === "Research").length + 15, change: "+2", icon: Globe },
    { title: "Voice AI", value: tools.filter((t) => t.category === "Voice").length + 8, change: "+1", icon: Mic },
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
          <div className="visual-card">
            <div className="visual-heading">
              <span className="tool-logo">{selected.name.charAt(0)}</span>
              <div><strong>{selected.name}</strong><p>{selected.role}</p></div>
              <span className="tag accent">{selected.category}</span>
            </div>
            <p className="visual-description">{selected.description}</p>
            <div className="auto-row"><Sparkles size={15} /><span>AI analyzed</span><span className="success">Complete</span></div>
            <div className="relationship">
              <span>{selected.name}</span><ArrowRight size={13}/><span>{selected.category}</span><ArrowRight size={13}/><span>{selected.alternatives[0]}</span>
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
            {metrics.map(({ title, value, change, icon: Icon }) => (
              <motion.article whileHover={{ y: -3 }} className="metric-card" key={title}>
                <Icon size={19} />
                <span>{title}</span>
                <div><strong>{value}</strong><small>{change}</small></div>
              </motion.article>
            ))}
          </section>
          <section className="charts">
            <ChartCard title="Tool category distribution" action="View all">
              <div className="donut-area">
                <div className="donut"><strong>{tools.length + 118}</strong><span>Total tools</span></div>
                <div className="legend">
                  {distribution.map(([name, value], index) => (
                    <div key={name}><i className={`dot dot-${index}`} />{name}<strong>{value + 12}</strong></div>
                  ))}
                </div>
              </div>
            </ChartCard>
            <ChartCard title="Tools discovered per week" action="Last 7 weeks">
              <div className="bars">
                {weeklyBars.map((height, index) => (
                  <div key={height + index}>
                    <span style={{ height: `${height * 1.42}px` }} className={index === 5 ? "selected-bar" : ""} />
                    <small>W{index + 1}</small>
                  </div>
                ))}
              </div>
            </ChartCard>
          </section>
          <section className="lower-charts">
            <ChartCard title="Learning activity" action="See timeline">
              <div className="timeline">
                {activity.map(({ event, time, icon: Icon }) => (
                  <div key={event}><Icon size={16}/><p>{event}<small>{time}</small></p></div>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Knowledge growth" action="May">
              <KnowledgeHeatmap />
            </ChartCard>
          </section>
        </div>
        <RightSidebar tools={tools} onTool={onTool} />
      </div>
    </>
  );
}

function ChartCard({
  title,
  action,
  children,
}: {
  title: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <article className="panel chart-card">
      <header><h3>{title}</h3><button>{action} <ChevronDown size={13}/></button></header>
      {children}
    </article>
  );
}

function KnowledgeHeatmap() {
  const levels = [0, 1, 0, 2, 1, 3, 1, 2, 4, 2, 0, 1, 3, 2, 1, 2, 4, 3, 2, 1, 0, 2, 3, 4, 2, 3, 1, 2, 4, 3, 1, 2, 3, 1, 0];
  return (
    <div className="heatmap">
      <div className="cells">
        {levels.map((level, index) => <i key={index} className={`level-${level}`} />)}
      </div>
      <div className="heat-caption"><span>Less</span><i/><i className="level-2"/><i className="level-4"/><span>More</span></div>
    </div>
  );
}

function RightSidebar({ tools, onTool }: { tools: Tool[]; onTool: (tool: Tool) => void }) {
  return (
    <aside className="right-sidebar">
      <article className="panel recent">
        <header><h3>Recent discoveries</h3><button>View all</button></header>
        {tools.slice(0, 4).map((tool) => (
          <button className="discovery" key={tool.name} onClick={() => onTool(tool)}>
            <span className="small-logo">{tool.name.charAt(0)}</span>
            <span><strong>{tool.name}</strong><small>{tool.category} - {tool.date}</small></span>
            <ArrowRight size={14}/>
          </button>
        ))}
      </article>
      <article className="panel quick-notes">
        <header><h3>Quick notes</h3><Plus size={16}/></header>
        <p>Compare n8n agent workflows with Zapier&apos;s new AI actions.</p>
        <small>Today - Personal note</small>
      </article>
      <article className="panel pinned">
        <header><h3>Pinned items</h3><Pin size={15}/></header>
        {tools.filter((tool) => tool.pinned).map((tool) => (
          <div key={tool.name}><Bookmark size={14}/>{tool.name}<span>{tool.category}</span></div>
        ))}
      </article>
      <article className="panel trending">
        <header><h3>Trending AI tools</h3><TrendingUp size={15}/></header>
        <div><strong>Lovable</strong><span>Design to app</span></div>
        <div><strong>Granola</strong><span>Meeting notes</span></div>
        <div><strong>Wispr Flow</strong><span>Voice input</span></div>
      </article>
    </aside>
  );
}

function KnowledgeGraph({
  tools,
  selected,
  select,
  onAdd,
}: {
  tools: Tool[];
  selected: Tool;
  select: (value: string) => void;
  onAdd: () => void;
}) {
  const [zoom, setZoom] = useState(100);
  const graphNodes = [
    { text: selected.category, type: "Category", x: 50, y: 16 },
    { text: selected.alternatives[0], type: "Alternative", x: 78, y: 35 },
    { text: selected.alternatives[1] ?? "Integrations", type: "Competitor", x: 78, y: 66 },
    { text: selected.role, type: "Workflow", x: 48, y: 82 },
    { text: selected.related[0], type: "Integration", x: 19, y: 64 },
    { text: selected.related[1], type: "Related", x: 22, y: 29 },
  ];
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
              <span>{selected.name.charAt(0)}</span>{selected.name}<small>Selected AI Tool</small>
            </motion.div>
            {graphNodes.map((node) => (
              <motion.div
                className="graph-node"
                key={node.text}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                whileHover={{ scale: 1.06 }}
              >
                <strong>{node.text}</strong><small>{node.type}</small>
              </motion.div>
            ))}
          </div>
        </article>
        <aside className="panel graph-detail">
          <p className="eyebrow">Selected node</p>
          <h2>{selected.name}</h2>
          <span className="tag accent">{selected.category}</span>
          <p>{selected.description}</p>
          <h3>Workflow role</h3>
          <p>{selected.role}</p>
          <h3>Switch tool</h3>
          <div className="tool-switch">
            {tools.slice(0, 6).map((tool) => (
              <button className={tool.name === selected.name ? "chosen" : ""} onClick={() => select(tool.name)} key={tool.name}>
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
  return (
    <section className="page automation-page">
      <PageHeading title="Automation" subtitle="Every capture becomes structured memory, automatically." onAdd={onAdd} />
      <article className="panel workflow-panel">
        <div className="flow-title">
          <div><h2>AI Tool Capture Workflow</h2><p>n8n compatible - Active</p></div>
          <button className="primary-button"><Plus size={16}/> New workflow</button>
        </div>
        <div className="workflow-chain">
          {automationSteps.map(({ title, detail, icon: Icon }, index) => (
            <div className="workflow-wrap" key={title}>
              <motion.div className="workflow-step" whileHover={{ y: -3 }}>
                <Icon size={21}/>
                <strong>{title}</strong>
                <small>{detail}</small>
              </motion.div>
              {index < automationSteps.length - 1 && <ArrowRight className="flow-arrow" size={18}/>}
            </div>
          ))}
        </div>
      </article>
      <div className="integrations">
        {[
          ["Supabase", "Structured storage", Database],
          ["n8n", "Automation triggers", Workflow],
          ["Notion", "Learning notes sync", Bookmark],
          ["Neo4j", "Knowledge graph ready", Network],
          ["Vector Search", "Semantic recall ready", Sparkles],
        ].map(([name, detail, icon]) => {
          const Icon = icon as LucideIcon;
          return (
            <article className="panel integration-card" key={name as string}>
              <Icon size={21}/><h3>{name as string}</h3><p>{detail as string}</p><span>Ready to connect <ExternalLink size={13}/></span>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MemoryInsights({ tools, onAdd }: { tools: Tool[]; onAdd: () => void }) {
  const cards = [
    { label: "Recently learned tools", value: tools.slice(0, 3).map((t) => t.name).join(", "), icon: Sparkles },
    { label: "Forgotten tools", value: "HeyGen, Pinecone, Otter", icon: BrainCircuit },
    { label: "Most viewed", value: "Cursor - 28 views", icon: TrendingUp },
    { label: "Pinned tools", value: tools.filter((t) => t.pinned).map((t) => t.name).join(", "), icon: Pin },
    { label: "Weekly discoveries", value: "14 new tools this week", icon: CalendarDays },
    { label: "AI learning streak", value: "23 days in a row", icon: Flame },
  ];
  return (
    <section className="page">
      <PageHeading title="Memory View" subtitle="Prompts to revisit what matters before it fades." onAdd={onAdd} />
      <div className="memory-cards">
        {cards.map(({ label, value, icon: Icon }) => (
          <article className="panel memory-card" key={label}><Icon size={20}/><h3>{label}</h3><p>{value}</p><button>Review <ArrowRight size={14}/></button></article>
        ))}
      </div>
    </section>
  );
}

function Profile({ onAdd }: { onAdd: () => void }) {
  return (
    <section className="page profile-page">
      <PageHeading title="Workspace Settings" subtitle="Configure your personal AI memory system." onAdd={onAdd} />
      <article className="panel settings-card">
        <div className="profile-person"><span>TM</span><div><h2>Tanmay&apos;s Vault</h2><p>Personal workspace - Pro plan</p></div></div>
        {["Automatic AI enrichment", "Notion learning notes sync", "Weekly memory recap", "Vector search indexing"].map((setting) => (
          <label className="setting" key={setting}>{setting}<input type="checkbox" defaultChecked/><i /></label>
        ))}
        <button className="secondary-button"><Settings2 size={16}/> Manage integrations</button>
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
}: {
  tool: Tool;
  onClose: () => void;
  onGraph: () => void;
  onPin: () => void;
  onFavorite: () => void;
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
