import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BrainCircuit,
  Plus,
  Search,
  X,
  Sparkles,
  Pin,
  Star,
  Trash2,
  Network,
  Home,
  Boxes,
  UserRound,
  Grid2x2,
  Workflow,
  TrendingUp,
  Sun,
  Moon,
} from "lucide-react";
import { Category, Section, Tool } from "./types";

export const sections = [
  { name: "Dashboard", icon: Grid2x2 },
  { name: "Knowledge Graph", icon: Network },
  { name: "Library", icon: Boxes },
  { name: "Automation", icon: Workflow },
  { name: "Insights", icon: TrendingUp },
  { name: "Profile", icon: UserRound },
] as const;

export function PageHeading({
  title,
  subtitle,
  onAdd,
}: {
  title: string;
  subtitle: string;
  onAdd: () => void;
}) {
  return (
    <header className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <button className="secondary-button" onClick={onAdd}>
        <Plus size={16} /> Add Tool
      </button>
    </header>
  );
}

export function Header({
  active,
  onNavigate,
  onAdd,
  search,
  onSearch,
  theme,
  toggleTheme,
}: {
  active: Section;
  onNavigate: (value: Section) => void;
  onAdd: () => void;
  search: string;
  onSearch: (value: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
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
        <button 
          className="icon-action theme-toggle" 
          onClick={toggleTheme} 
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          style={{ cursor: "pointer" }}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-action notification" aria-label="Notifications">
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

export function ToolPreview({
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
            <X size={18} />
          </button>
        </header>
        <p className="preview-description">{tool.description}</p>
        <dl className="preview-facts">
          <div>
            <dt>Primary use case</dt>
            <dd>{tool.useCase}</dd>
          </div>
          <div>
            <dt>Workflow role</dt>
            <dd>{tool.role}</dd>
          </div>
          <div>
            <dt>Learning notes</dt>
            <dd>{tool.notes}</dd>
          </div>
          <div>
            <dt>Source discovered from</dt>
            <dd>{tool.source}</dd>
          </div>
          <div>
            <dt>Date added</dt>
            <dd>{tool.date}</dd>
          </div>
          <div>
            <dt>Importance</dt>
            <dd className={`importance ${tool.importance.toLowerCase()}`}>
              {tool.importance}
            </dd>
          </div>
        </dl>
        <section className="preview-tags">
          <h3>Alternatives</h3>
          <div>
            {tool.alternatives.map((alternative) => (
              <span className="tag" key={alternative}>
                {alternative}
              </span>
            ))}
          </div>
          <h3>Tags and related tools</h3>
          <div>
            {[...tool.tags, ...tool.related].map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </section>
        <footer className="preview-actions">
          <button
            className={tool.pinned ? "secondary-button selected" : "secondary-button"}
            onClick={onPin}
          >
            <Pin size={16} />
            {tool.pinned ? "Pinned" : "Pin"}
          </button>
          <button
            className={tool.favorite ? "secondary-button selected" : "secondary-button"}
            onClick={onFavorite}
          >
            <Star size={16} />
            {tool.favorite ? "Saved" : "Favorite"}
          </button>
          <button
            className="secondary-button destructive"
            onClick={onDelete}
            style={{
              color: "var(--red)",
              borderColor: "var(--red-soft)",
              background: "rgba(239, 68, 68, 0.05)",
            }}
          >
            <Trash2 size={16} />
            Delete
          </button>
          <button className="primary-button" onClick={onGraph}>
            <Network size={16} /> View graph
          </button>
        </footer>
      </motion.aside>
    </motion.div>
  );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function CaptureModal({
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
      setSuggestion(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(() => {
      fetch(`${API_BASE}/api/suggest?name=${encodeURIComponent(trimmed)}`)
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
          let category: Category = "Agents";
          let role = "Autonomous discovery";
          let description = `${trimmed} is an AI tool captured for automatic research and enrichment.`;

          const lower = trimmed.toLowerCase();
          if (
            lower.includes("voice") ||
            lower.includes("speech") ||
            lower.includes("audio") ||
            lower.includes("tts")
          ) {
            category = "Voice";
            role = "Voice synthesizer";
            description = `Dynamic offline synthesized audio generator for ${trimmed}.`;
          } else if (
            lower.includes("video") ||
            lower.includes("movie") ||
            lower.includes("sora")
          ) {
            category = "Video";
            role = "Video synthesizer";
            description = `Dynamic offline video synthesis suite for ${trimmed}.`;
          } else if (
            lower.includes("image") ||
            lower.includes("draw") ||
            lower.includes("midjourney") ||
            lower.includes("art")
          ) {
            category = "Image";
            role = "Visual synthesizer";
            description = `High fidelity offline styled image synthesizer for ${trimmed}.`;
          } else if (
            lower.includes("code") ||
            lower.includes("dev") ||
            lower.includes("ide") ||
            lower.includes("editor") ||
            lower.includes("antigravity") ||
            lower.includes("anti-gravity")
          ) {
            category = "Coding";
            role = "Developer companion";
            description = `Autonomous local AI developer paired coding workspace for ${trimmed}.`;
          } else if (
            lower.includes("automate") ||
            lower.includes("flow") ||
            lower.includes("workflow")
          ) {
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
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        className="capture-modal"
        onSubmit={onSave}
        initial={{ y: 15, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
      >
        <button
          className="modal-close"
          type="button"
          aria-label="Close add tool"
          onClick={onClose}
        >
          <X size={18} />
        </button>
        <span className="brand-mark">
          <Sparkles size={20} />
        </span>
        <h2>Add an AI tool</h2>
        <p>Just enter a name. AI Memory Vault fills in everything else.</p>
        <label>
          Tool name
          <input
            autoFocus
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="e.g. Zapier, Midjourney, Notion"
          />
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

        <button type="submit" className="primary-button wide">
          <Sparkles size={17} /> Analyze and save
        </button>
      </motion.form>
    </motion.div>
  );
}

export function MobileNav({
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
          <button
            className="mobile-add"
            key={name}
            onClick={onAdd}
            aria-label="Add new tool"
          >
            <Icon size={22} />
          </button>
        ) : (
          <button
            key={name}
            className={active === name ? "active" : ""}
            onClick={() => onNavigate(name)}
          >
            <Icon size={20} />
            <span>
              {name === "Dashboard"
                ? "Home"
                : name === "Knowledge Graph"
                ? "Graph"
                : name}
            </span>
          </button>
        ),
      )}
    </nav>
  );
}
