export type Section =
  | "Dashboard"
  | "Knowledge Graph"
  | "Library"
  | "Automation"
  | "Insights"
  | "Profile";

export type Category =
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

export type Tool = {
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

export type LibraryFilter = "All tools" | "Pinned" | "Favorites" | "High importance";
export type SortMode = "Recent" | "Name" | "Importance";
