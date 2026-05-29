import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "tools.json");

const initialTools = [
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

async function ensureDB() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // File does not exist, write the initial list
      await fs.writeFile(DB_FILE, JSON.stringify(initialTools, null, 2), "utf8");
    }
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
}

export async function getTools() {
  await ensureDB();
  try {
    const data = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading tools from database file:", err);
    return initialTools;
  }
}

export async function saveTools(tools) {
  await ensureDB();
  try {
    await fs.writeFile(DB_FILE, JSON.stringify(tools, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing tools to database file:", err);
    return false;
  }
}
