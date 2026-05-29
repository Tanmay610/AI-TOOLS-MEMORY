import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Standard categories available in the system
const categories = [
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

// High-fidelity pre-defined catalog covering 40+ popular and custom AI tools
const localCatalog = {
  "anti-gravity": {
    category: "Coding",
    description: "An autonomous AI coding agent designed by Google DeepMind for advanced agentic coding tasks.",
    useCase: "Automate complex codebase refactoring, package migrations, and fullstack debugging.",
    role: "Autonomous agent",
    alternatives: ["Cursor", "Devin", "Aider"],
    related: ["Gemini 3.5 Flash", "Next.js", "Express"],
    tags: ["agent", "coding", "antigravity", "deepmind"],
    notes: "Created by the Google DeepMind team working on Advanced Agentic Coding.",
    importance: "High"
  },
  antigravity: {
    category: "Coding",
    description: "An autonomous AI coding agent designed by Google DeepMind for advanced agentic coding tasks.",
    useCase: "Automate complex codebase refactoring, package migrations, and fullstack debugging.",
    role: "Autonomous agent",
    alternatives: ["Cursor", "Devin", "Aider"],
    related: ["Gemini 3.5 Flash", "Next.js", "Express"],
    tags: ["agent", "coding", "antigravity", "deepmind"],
    notes: "Created by the Google DeepMind team working on Advanced Agentic Coding.",
    importance: "High"
  },
  n8n: {
    category: "Automation",
    description: "Visual workflow automation with extensible AI and API nodes.",
    useCase: "Connect AI services into repeatable operational workflows.",
    role: "Orchestration layer",
    alternatives: ["Zapier", "Make"],
    related: ["OpenAI", "Notion", "Supabase"],
    tags: ["workflows", "agents", "no-code"],
    notes: "Explore webhook triggers and agent tool calls next.",
    importance: "High",
  },
  cursor: {
    category: "Coding",
    description: "AI-native code editor with contextual project assistance.",
    useCase: "Navigate, edit and reason about large codebases faster.",
    role: "Development workspace",
    alternatives: ["Windsurf", "GitHub Copilot"],
    related: ["MCP", "Claude", "GitHub"],
    tags: ["ide", "developer", "pairing"],
    notes: "Test custom rules for team coding standards.",
    importance: "High",
  },
  perplexity: {
    category: "Research",
    description: "Citation-first discovery and answer engine.",
    useCase: "Explore unfamiliar topics with traceable sources.",
    role: "Research companion",
    alternatives: ["ChatGPT Search", "Elicit"],
    related: ["Notion", "Readwise", "Browser"],
    tags: ["search", "sources", "discovery"],
    notes: "Store high-value research threads alongside source URLs.",
    importance: "Medium",
  },
  elevenlabs: {
    category: "Voice",
    description: "Natural speech generation and voice agent platform.",
    useCase: "Generate narration and conversational voice experiences.",
    role: "Voice output",
    alternatives: ["PlayHT", "Cartesia"],
    related: ["Descript", "HeyGen", "n8n"],
    tags: ["tts", "voice", "audio"],
    notes: "Compare latency for live assistant workflows.",
    importance: "Medium",
  },
  manus: {
    category: "Agents",
    description: "Autonomous AI agent for multi-step digital tasks.",
    useCase: "Delegate research and deliverable-focused execution.",
    role: "Task agent",
    alternatives: ["Operator", "Genspark"],
    related: ["Browser", "Notion", "Slack"],
    tags: ["agent", "execution", "delegation"],
    notes: "Evaluate task reliability on recurring research briefs.",
    importance: "Medium",
  },
  bolt: {
    category: "Coding",
    description: "Prompt-to-application web development environment.",
    useCase: "Turn product ideas into working prototypes quickly.",
    role: "Prototype builder",
    alternatives: ["Lovable", "v0"],
    related: ["Supabase", "Vercel", "React"],
    tags: ["builder", "prototype", "web"],
    notes: "Useful for validation before production implementation.",
    importance: "High",
  },
  zapier: {
    category: "Automation",
    description: "No-code automation platform for app-to-app actions.",
    useCase: "Trigger reliable business workflows across common SaaS tools.",
    role: "Workflow connector",
    alternatives: ["n8n", "Make"],
    related: ["Slack", "Gmail", "Notion"],
    tags: ["automation", "integrations", "triggers"],
    notes: "Compare AI action depth and cost against n8n.",
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
    importance: "High",
  },
  claude: {
    category: "Agents",
    description: "Next-generation AI assistant developed by Anthropic focusing on safety and advanced reasoning.",
    useCase: "Execute complex cognitive workflows and write highly coherent code.",
    role: "Reasoning engine",
    alternatives: ["ChatGPT", "Gemini"],
    related: ["Cursor", "Artifacts", "API"],
    tags: ["llm", "anthropic", "assistant"],
    notes: "Explore Claude Sonnet projects and API limits.",
    importance: "High",
  },
  chatgpt: {
    category: "Research",
    description: "Conversational AI agent capable of zero-shot research, creative generation, and dynamic problem solving.",
    useCase: "Draft initial reports, brainstorm interfaces, or answer technical questions.",
    role: "General helper",
    alternatives: ["Claude", "Perplexity"],
    related: ["OpenAI", "DALL-E", "Custom GPTs"],
    tags: ["chat", "openai", "agent"],
    notes: "Review custom instructions and file search integrations.",
    importance: "High",
  },
  supabase: {
    category: "Open Source",
    description: "An open source Firebase alternative providing SQL databases, instant APIs, auth, and real-time listeners.",
    useCase: "Develop production-ready databases for custom fullstack prototypes.",
    role: "Database system",
    alternatives: ["Firebase", "MongoDB"],
    related: ["PostgreSQL", "Next.js", "Prisma"],
    tags: ["database", "backend", "sql"],
    notes: "Perfect for fast relational data modeling.",
    importance: "High",
  },
  lovable: {
    category: "Coding",
    description: "Advanced GPT-powered software development assistant that builds production-ready web apps.",
    useCase: "Develop fully operational React/Tailwind prototypes in minutes.",
    role: "Prototype builder",
    alternatives: ["Bolt", "v0"],
    related: ["Supabase", "React", "Netlify"],
    tags: ["coder", "frontend", "generator"],
    notes: "Test rapid iterations on complex UI patterns.",
    importance: "High",
  },
  v0: {
    category: "Coding",
    description: "Generative UI system by Vercel that converts text prompts into high-fidelity React and Tailwind layouts.",
    useCase: "Quickly copy-paste modular tailwind components and interfaces.",
    role: "UI developer",
    alternatives: ["Bolt", "Lovable"],
    related: ["Next.js", "Shadcn UI", "Vercel"],
    tags: ["builder", "react", "ui", "tailwind"],
    notes: "Ideal for generating beautifully styled Tailwind structures.",
    importance: "High",
  },
  figma: {
    category: "Design",
    description: "Collaborative interface design tool featuring smart layouts and developer handover features.",
    useCase: "Design mockups, wireframes, and prototypes with team members.",
    role: "Design workspace",
    alternatives: ["Sketch", "Penpot"],
    related: ["Canva", "Photoshop", "Galileo AI"],
    tags: ["ui", "design", "figma", "vector"],
    notes: "Integrate with Figma to Code AI pipelines.",
    importance: "High",
  },
  sora: {
    category: "Video",
    description: "Text-to-video model that generates highly realistic and imaginative scenes based on text instructions.",
    useCase: "Generate immersive cinematic videos or dynamic visual backdrops.",
    role: "Video generator",
    alternatives: ["Runway", "Pika"],
    related: ["Midjourney", "ElevenLabs", "Premier Pro"],
    tags: ["video", "text-to-video", "generative"],
    notes: "Highly valuable for conceptual filmmaking and ads.",
    importance: "Medium",
  },
  runway: {
    category: "Video",
    description: "AI video generation suite featuring high-fidelity text-to-video and video-to-video styles.",
    useCase: "Create stylized visual effects and generate video sequences from text descriptions.",
    role: "Video generator",
    alternatives: ["Sora", "Pika"],
    related: ["After Effects", "Midjourney", "Luma"],
    tags: ["video", "creative", "generative"],
    notes: "Experiment with Gen-3 Alpha model for consistent motion.",
    importance: "High",
  },
  ollama: {
    category: "Open Source",
    description: "Lightweight tool to run large language models locally on your machine.",
    useCase: "Execute local, private AI models (Llama 3, Mistral) securely without API fees.",
    role: "Local LLM runner",
    alternatives: ["LM Studio", "LocalAI"],
    related: ["Llama", "Hugging Face", "LangChain"],
    tags: ["local", "open-source", "llm"],
    notes: "Setup local endpoints for offline pairing configurations.",
    importance: "High",
  }
};

// Heuristics-based classifier used when both the local catalog has no match and Gemini is offline/unconfigured
function classifyToolLocal(name) {
  const cleanName = name.trim();
  const lowerName = cleanName.toLowerCase();

  // 1. Try case-insensitive catalog match
  if (localCatalog[lowerName]) {
    return {
      name: cleanName,
      ...localCatalog[lowerName],
      date: "Today",
      viewed: "Just now",
    };
  }

  // 2. Fall back to rules-based classifier
  let category = "Agents";
  let role = "Autonomous discovery";
  let description = `${cleanName} is an AI tool captured for automatic research and enrichment.`;
  let useCase = "Investigate capabilities and map it into your AI workflow.";
  let alternatives = ["Explore alternatives", "Similar tools"];
  let related = ["AI Tools", "Research"];
  let tags = ["new", "ai", "to-review"];
  let notes = "AI classification parsed. Add first impressions after testing.";
  let importance = "Medium";

  if (lowerName.includes("code") || lowerName.includes("coder") || lowerName.includes("dev") || lowerName.includes("ide") || lowerName.includes("editor") || lowerName.includes("program") || lowerName.includes("compiler")) {
    category = "Coding";
    role = "Developer companion";
    description = `${cleanName} is an intelligent development environment designed to accelerate coding cycles and reason about codebases.`;
    useCase = "Automate unit-testing, code reviews, and rapid prototype scaffolding.";
    alternatives = ["Cursor", "Bolt", "Aider"];
    related = ["AI Coding", "IDE Workspace"];
    tags.push("coding", "dev", "ide");
    importance = "High";
  } else if (lowerName.includes("flow") || lowerName.includes("automate") || lowerName.includes("workflow") || lowerName.includes("trigger") || lowerName.includes("connect") || lowerName.includes("integrate")) {
    category = "Automation";
    role = "Workflow orchestrator";
    description = `${cleanName} connects multi-app triggers and actions into highly reliable automated tasks.`;
    useCase = "Construct complex, multi-step notification and operational sync sequences.";
    alternatives = ["n8n", "Zapier", "Make"];
    related = ["Operational logic", "Sync triggers"];
    tags.push("automation", "integration", "workflows");
    importance = "High";
  } else if (lowerName.includes("mcp") || lowerName.includes("protocol") || lowerName.includes("model context")) {
    category = "MCP";
    role = "Protocol server wrapper";
    description = `${cleanName} exposes local services, filesystems, and databases securely to AI assistants using MCP.`;
    useCase = "Connect your AI agent with real-time system context and tools.";
    alternatives = ["MCP Server sqlite", "Puppeteer MCP"];
    related = ["Model Context Protocol", "Agent Tools"];
    tags.push("mcp", "protocol", "context");
    importance = "High";
  } else if (lowerName.includes("voice") || lowerName.includes("speech") || lowerName.includes("audio") || lowerName.includes("talk") || lowerName.includes("speak") || lowerName.includes("tts")) {
    category = "Voice";
    role = "Voice synthesizer";
    description = `${cleanName} is an advanced AI audio system for natural speech synthesis and narration.`;
    useCase = "Generate realistic voiceovers and conversational audio layers.";
    alternatives = ["ElevenLabs", "Cartesia"];
    related = ["Voice AI", "Audio generation"];
    tags.push("voice", "audio", "tts");
  } else if (lowerName.includes("video") || lowerName.includes("movie") || lowerName.includes("film") || lowerName.includes("sora") || lowerName.includes("avatar")) {
    category = "Video";
    role = "Video synthesizer";
    description = `${cleanName} is an AI-powered video generator capable of rendering stylized or realistic motion assets.`;
    useCase = "Generate marketing visual sequences, b-roll, or character animations from text.";
    alternatives = ["Runway", "Sora", "HeyGen"];
    related = ["Video generation", "Cinematic AI"];
    tags.push("video", "cinematic", "motion");
  } else if (lowerName.includes("image") || lowerName.includes("draw") || lowerName.includes("photo") || /\bart\b/.test(lowerName) || lowerName.includes("paint") || lowerName.includes("canvas") || lowerName.includes("logo")) {
    category = "Image";
    role = "Visual synthesizer";
    description = `${cleanName} is a generative image framework producing high-fidelity styled visual assets.`;
    useCase = "Generate brand imagery, custom graphics, or concept art mockups.";
    alternatives = ["Midjourney", "DALL-E", "Flux"];
    related = ["Creative suite", "Graphic generation"];
    tags.push("image", "art", "generative");
  } else if (lowerName.includes("search") || lowerName.includes("find") || lowerName.includes("query") || lowerName.includes("research") || lowerName.includes("citation") || lowerName.includes("fact")) {
    category = "Research";
    role = "Discovery companion";
    description = `${cleanName} acts as a citation-first assistant that crawls and synthesizes verified publications and data.`;
    useCase = "Gather detailed summaries and traceable facts on niche domains.";
    alternatives = ["Perplexity", "Elicit"];
    related = ["Academic discovery", "Fact finder"];
    tags.push("search", "facts", "research");
  } else if (lowerName.includes("note") || lowerName.includes("task") || lowerName.includes("organize") || lowerName.includes("write") || lowerName.includes("doc") || lowerName.includes("productivity")) {
    category = "Productivity";
    role = "Knowledge workspace";
    description = `${cleanName} is a connected workspace system that helps consolidate notes, records, and team briefs.`;
    useCase = "Structure and coordinate meeting logs and engineering documentation.";
    alternatives = ["Notion", "Coda"];
    related = ["Task board", "Knowledge base"];
    tags.push("productivity", "notes", "workspace");
  } else if (lowerName.includes("design") || lowerName.includes("ui") || lowerName.includes("ux") || lowerName.includes("layout") || lowerName.includes("wireframe")) {
    category = "Design";
    role = "Interface synthesis tool";
    description = `${cleanName} enables designers and developers to generate layouts and structured UI elements with simple prompts.`;
    useCase = "Scaffold interactive wireframes and design systems rapidly.";
    alternatives = ["Figma", "Galileo AI"];
    related = ["UI Design", "Visual styles"];
    tags.push("design", "ui", "wireframing");
  } else if (lowerName.includes("open source") || lowerName.includes("llama") || lowerName.includes("mistral") || lowerName.includes("local llm") || lowerName.includes("hugging")) {
    category = "Open Source";
    role = "Local weight runner";
    description = `${cleanName} allows host systems to download, execute, and fine-tune open weights models locally.`;
    useCase = "Build fully offline and highly confidential operational pipelines.";
    alternatives = ["Ollama", "LM Studio"];
    related = ["Hugging Face", "Open weights"];
    tags.push("open-source", "local", "model");
  }

  return {
    name: cleanName,
    category,
    description,
    useCase,
    role,
    alternatives,
    related,
    tags,
    notes,
    importance,
    date: "Today",
    viewed: "Just now",
  };
}

// Live Gemini AI Classification client, falls back to rule-based local classifier
export async function classifyTool(name) {
  const cleanName = name.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  // If no Gemini key is provided, execute rules-based classification immediately
  if (!apiKey) {
    console.log(`[Classifier] No API key detected. Using smart local fallback for "${cleanName}".`);
    return classifyToolLocal(cleanName);
  }

  try {
    console.log(`[Classifier] Initializing Gemini AI model to enrich "${cleanName}"...`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Formulate a structured prompt focusing on professional classification output
    const prompt = `You are a professional AI stack classifier. Analyze the AI tool named "${cleanName}".
Determine its primary category and generate highly precise, professional, and practical information.

The response must be a single, valid JSON object following this EXACT schema, with no additional formatting, markdown, or text around it:
{
  "category": "Automation" | "Coding" | "Agents" | "Research" | "Voice" | "Video" | "Image" | "Design" | "MCP" | "Open Source" | "Extensions" | "Productivity",
  "description": "A concise, highly professional one-sentence description of the tool.",
  "useCase": "A clear, actionable one-sentence use case for the tool.",
  "role": "The specific role in the AI stack (e.g. Reasoning engine, Visual generator, Task agent, Orchestration layer, Development companion, etc.).",
  "alternatives": ["Alt Tool 1", "Alt Tool 2"],
  "related": ["Related Tech 1", "Related Tech 2"],
  "tags": ["tag1", "tag2", "tag3"],
  "importance": "High" | "Medium" | "Low",
  "notes": "A quick actionable note about how to explore or integrate this tool next."
}

Important guidelines:
- Choose the best fitting "category" from the 12 listed.
- If the tool is well-known, return its true industry classification (e.g., "Cursor" -> "Coding", "n8n" -> "Automation", "anti-gravity" -> "Coding" or "Agents").
- Keep descriptions realistic and professional. Avoid buzzwords.
- Respond with raw JSON only. Do not wrap in \`\`\`json \`\`\` code blocks.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text() ? response.text().trim() : "";
    
    // Clean up potential markdown code fences if LLM accidentally outputs them
    const jsonString = responseText
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const parsed = JSON.parse(jsonString);

    // Validate that category is valid
    let category = parsed.category;
    if (!categories.includes(category)) {
      category = "Agents";
    }

    return {
      name: cleanName,
      category,
      description: parsed.description || `${cleanName} is captured in the AI vault.`,
      useCase: parsed.useCase || "Incorporate this tool inside your workflow processes.",
      role: parsed.role || "AI tool discovery",
      alternatives: parsed.alternatives || ["Similar tool alternatives"],
      related: parsed.related || ["AI stack research"],
      tags: parsed.tags || ["ai", "discovery"],
      notes: parsed.notes || "Add personal observations.",
      importance: parsed.importance || "Medium",
      date: "Today",
      viewed: "Just now",
    };
  } catch (err) {
    console.warn(`[Classifier] Gemini AI query failed: ${err.message}. Falling back to local rules engine.`);
    return classifyToolLocal(cleanName);
  }
}
