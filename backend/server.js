import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getTools, saveTools } from "./db.js";
import { classifyTool } from "./classifier.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET /api/tools - Retrieve all tools
app.get("/api/tools", async (req, res) => {
  try {
    const tools = await getTools();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tools from database" });
  }
});

// GET /api/suggest - Real-time AI classification suggestion
app.get("/api/suggest", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tool name query parameter is required" });
    }
    const suggestion = await classifyTool(name.trim());
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate AI suggestion" });
  }
});

// POST /api/tools - Capture and enrich a tool using the hybrid classifier
app.post("/api/tools", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tool name is required" });
    }

    const cleanName = name.trim();
    const tools = await getTools();

    // Check for duplicates
    const duplicate = tools.some(
      (tool) => tool.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (duplicate) {
      return res.status(409).json({ error: "Tool already exists in vault" });
    }

    // Call the dynamic classifier (Gemini / Rules hybrid)
    const newTool = await classifyTool(cleanName);

    const updatedTools = [newTool, ...tools];
    await saveTools(updatedTools);

    res.status(201).json(newTool);
  } catch (err) {
    res.status(500).json({ error: "Failed to capture tool" });
  }
});

// PUT /api/tools/:name - Update a tool's properties
app.put("/api/tools/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const updates = req.body;

    const tools = await getTools();
    const index = tools.findIndex(
      (t) => t.name.toLowerCase() === name.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Merge changes
    tools[index] = {
      ...tools[index],
      ...updates,
    };

    await saveTools(tools);
    res.json(tools[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update tool" });
  }
});

// DELETE /api/tools/:name - Delete a tool from the vault
app.delete("/api/tools/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const tools = await getTools();
    
    const filtered = tools.filter(
      (t) => t.name.toLowerCase() !== name.toLowerCase()
    );

    if (tools.length === filtered.length) {
      return res.status(404).json({ error: "Tool not found" });
    }

    await saveTools(filtered);
    res.json({ success: true, message: `Tool ${name} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete tool" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server active on http://localhost:${PORT}`);
});
