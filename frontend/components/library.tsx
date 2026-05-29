import { motion } from "framer-motion";
import { Filter, ListFilter, Search, PanelRight, Pin, Star } from "lucide-react";
import { Category, LibraryFilter, SortMode, Tool } from "./types";
import { categories } from "./initial-data";
import { PageHeading } from "./shared";

export function Library({
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
      <PageHeading
        title="Tool Library"
        subtitle="Your AI stack, documented and ready to recall."
        onAdd={onAdd}
      />
      <div className="library-controls panel">
        <label>
          <Search size={16} />
          <input
            placeholder="Search purpose, tags or tool"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button
          className={libraryFilter !== "All tools" ? "control-active" : ""}
          onClick={nextFilter}
          aria-label={`Filter: ${libraryFilter}. Click to change.`}
        >
          <Filter size={16} /> {libraryFilter}
        </button>
        <button
          className={sortMode !== "Recent" ? "control-active" : ""}
          onClick={nextSort}
          aria-label={`Sort: ${sortMode}. Click to change.`}
        >
          <ListFilter size={16} /> {sortMode}
        </button>
      </div>
      <div className="category-pills">
        {(["All", ...categories] as const).map((item) => (
          <button
            className={item === category ? "chosen" : ""}
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <article className="panel library-table">
        <div className="table-header">
          <span>Tool Name</span>
          <span>Purpose</span>
          <span>Category</span>
          <span>Workflow Role</span>
          <span>Notes</span>
          <span>Source</span>
          <span>Date Added</span>
          <span>Importance</span>
          <span>Last Viewed</span>
          <span />
        </div>
        {tools.map((tool) => (
          <motion.div
            whileHover={{ backgroundColor: "#f8faff" }}
            className="table-row"
            key={tool.name}
          >
            <span className="tool-cell">
              <i>{tool.name.charAt(0)}</i>
              <button className="tool-link" onClick={() => onPreview(tool)}>
                {tool.name}
              </button>
              <button
                className={tool.favorite ? "favorite active" : "favorite"}
                aria-label={
                  tool.favorite
                    ? `Remove ${tool.name} from favorites`
                    : `Favorite ${tool.name}`
                }
                onClick={() => onFavorite(tool)}
              >
                <Star size={13} />
              </button>
            </span>
            <span>{tool.useCase}</span>
            <span>
              <small className="tag">{tool.category}</small>
            </span>
            <span>{tool.role}</span>
            <span className="notes-cell">{tool.notes}</span>
            <span>{tool.source}</span>
            <span>{tool.date}</span>
            <span className={`importance ${tool.importance.toLowerCase()}`}>
              {tool.importance}
            </span>
            <span>{tool.viewed}</span>
            <span className="actions">
              <button
                className={tool.pinned ? "active" : ""}
                aria-label={tool.pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
                onClick={() => onPin(tool)}
              >
                <Pin size={14} />
              </button>
              <button
                aria-label={`Quick preview ${tool.name}`}
                onClick={() => onPreview(tool)}
              >
                <PanelRight size={14} />
              </button>
            </span>
          </motion.div>
        ))}
        {tools.length === 0 && <p className="empty-state">No tools match your filters.</p>}
      </article>
    </section>
  );
}
