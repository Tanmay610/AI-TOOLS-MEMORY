import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ZoomIn, ZoomOut, Maximize2, GitBranch } from "lucide-react";
import { Category, Tool } from "./types";
import { PageHeading } from "./shared";

export function KnowledgeGraph({
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
    const genericPlaceholders = [
      "Alternatives",
      "Integrations",
      "Competitor",
      "Workflow",
      "Related",
      "Related Stack",
      "Learn context",
      "Explore",
    ];
    if (genericPlaceholders.includes(node.text)) {
      return;
    }

    if (node.type === "Category") {
      onNavigateToLibrary(node.text as Category);
    } else if (
      node.type === "Alternative" ||
      node.type === "Competitor" ||
      node.type === "Integration" ||
      node.type === "Related"
    ) {
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
            <label>
              <Search size={15} />
              <span>Find node...</span>
            </label>
            <div>
              <button
                onClick={() => setZoom(Math.min(130, zoom + 10))}
                aria-label="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(Math.max(80, zoom - 10))}
                aria-label="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <button aria-label="Maximize graph">
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
          <div className="graph-canvas" style={{ transform: `scale(${zoom / 100})` }}>
            <svg aria-hidden="true" viewBox="0 0 100 100">
              {graphNodes.map((node) => (
                <line key={node.text} x1="50" y1="48" x2={node.x} y2={node.y} />
              ))}
            </svg>
            <motion.div className="core-node" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <span>{selected?.name?.charAt(0) || "AI"}</span>
              {selected?.name || "No Tool"}
              <small>Selected AI Tool</small>
            </motion.div>
            {graphNodes.map((node) => (
              <motion.button
                className="graph-node"
                key={node.text}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  position: "absolute",
                  cursor: "pointer",
                }}
                whileHover={{ scale: 1.06 }}
                onClick={() => handleNodeClick(node)}
              >
                <strong>{node.text}</strong>
                <small>{node.type}</small>
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
              <button
                className={tool.name === selected?.name ? "chosen" : ""}
                onClick={() => select(tool.name)}
                key={tool.name}
              >
                {tool.name}
              </button>
            ))}
          </div>
          <button className="primary-button wide">
            <GitBranch size={16} /> Expand nodes
          </button>
        </aside>
      </div>
    </section>
  );
}
