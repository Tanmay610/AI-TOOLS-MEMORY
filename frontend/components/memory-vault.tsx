"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { Category, LibraryFilter, Section, SortMode, Tool } from "./types";
import { initialTools, catalog } from "./initial-data";
import { Header, MobileNav, CaptureModal, ToolPreview } from "./shared";
import { Dashboard } from "./dashboard";
import { KnowledgeGraph } from "./knowledge-graph";
import { Library } from "./library";
import { Automation } from "./automation";
import { MemoryInsights } from "./insights";
import { Profile } from "./profile";

const storageKey = "ai-memory-vault-tools";
const storedToolsEvent = "ai-memory-vault-updated";
const emptyStoredTools: Tool[] = [];
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Load from backend API
    fetch(`${API_BASE}/api/tools`)
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
      fetch(`${API_BASE}/api/tools/${encodeURIComponent(name)}`, {
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
      fetch(`${API_BASE}/api/tools/${encodeURIComponent(toolToDelete.name)}`, {
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
      fetch(`${API_BASE}/api/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Server error saving tool");
          return res.json();
        })
        .then((newTool: Tool) => {
          const nextTools = [newTool, ...tools];
          setTools(nextTools);
          persistTools(nextTools);
          setSelectedName(newTool.name);
          setNotification(`Enriched and saved ${newTool.name}`);
        })
        .catch((err) => {
          console.error("Enrichment API failed, saving with offline fallback:", err);
          const newTool = offlineCreateTool(cleanName);
          const nextTools = [newTool, ...tools];
          setTools(nextTools);
          persistTools(nextTools);
          setSelectedName(newTool.name);
          setNotification(`Saved ${cleanName} (Offline Mode)`);
        });
    } else {
      const newTool = offlineCreateTool(cleanName);
      const nextTools = [newTool, ...tools];
      setTools(nextTools);
      persistTools(nextTools);
      setSelectedName(newTool.name);
      setNotification(`Saved ${cleanName} (Offline Mode)`);
    }

    setCaptureName("");
    setShowAdd(false);
    setActive("Dashboard");
    window.setTimeout(() => setNotification(""), 3200);
  }

  function offlineCreateTool(rawName: string): Tool {
    const cleanName = rawName.trim();
    const known = catalog[cleanName.toLowerCase()];
    if (known) {
      return { name: cleanName, ...known, date: "Today", viewed: "Just now" } as Tool;
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
    } as Tool;
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
        theme={theme}
        toggleTheme={toggleTheme}
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
            {active === "Profile" && (
              <Profile
                onAdd={() => setShowAdd(true)}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            )}
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
