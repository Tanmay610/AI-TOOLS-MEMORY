# AI Memory Vault

A beautiful, premium, and fully interactive personal AI Knowledge OS designed to capture, enrich, link, and preserve your stack capabilities and automation workflows. Never forget an AI tool, utility discovery, or workflow relation again.

**Author:** Tanmay Khosla

---

## 🌟 Key Features

1. **Learning Cockpit (Dashboard)**
   * Live learning activity logs feed.
   * Real-time metrics counters for each tool category.
   * Weekly discovery velocity bars and learning streak trackers.
   * Interactive calendar heatmap summarizing day activity logs.
   * Dynamic trending tools panel that pre-fills and smooth-scrolls to the capture form.

2. **Semantic Knowledge Graph**
   * Multi-node relationships maps connecting category hubs, alternative competitors, workflow roles, and related stack technologies.
   * Interactive canvas zoom, scaling, and panning capabilities.
   * Tactile graph sidebar with rapid switch utilities.

3. **Production-Ready Library Catalog**
   * Dense, elegant tabular registry with sorting (Importance, Recent, Alphabetical) and filtering.
   * Instant slider drawer panels for quick metadata viewing, editing notes, or deletion.
   * Real-time favoriting (★) and stack pinning (📌).

4. **Workflow Automation Center**
   * Animated step inspector displaying n8n REST trigger, Gemini LLM analysis, auto-tagging, database persistence, and graph sync payloads.
   * One-click integrations toggles with active status indicators (Supabase, Notion, n8n, Vector Search, and Neo4j).
   * Visual custom trigger modal setups for webhook hooks deployment.

5. **Universal Dark Theme Option**
   * Curated HSL-balanced dark mode, toggleable from both the global header actions and the profile Settings tab.
   * Automatically adapts all SVG graphs, donut charts, glassmorphic panels, and backdrop overlays dynamically with system preferences sync.

6. **Fullstack Architecture & Persistence**
   * **Node.js/Express Backend**: Direct Gemini API AI model enrichment integrations.
   * **LocalStorage Backup Cache**: Complete offline storage fallback layers if network adapters or API endpoints are unreachable.

---

## 📁 Repository Structure

```tree
AI TOOLS/
├── backend/                  # Server-side API Services
│   ├── classifier.js         # Gemini API context enrichment model
│   ├── db.js                 # Low-latency file storage wrapper
│   ├── server.js             # Express application endpoints
│   ├── data/
│   │   └── tools.json        # Stored user tools database
│   └── package.json          # Node dependencies & startup scripts
│
├── frontend/                 # Client-side Next.js Application
│   ├── app/                  # Route layouts, globals, and icons
│   ├── components/           # Reusable modular UI views
│   │   ├── types.ts          # Core type structures
│   │   ├── initial-data.ts   # Default seed databases & catalogs
│   │   ├── shared.tsx        # Common overlays, inputs, and drawers
│   │   ├── dashboard.tsx     # Active cockpit widget blocks
│   │   ├── knowledge-graph.tsx # Relationship node mapping canvas
│   │   ├── library.tsx       # Search filterable table catalog
│   │   ├── automation.tsx    # n8n payload step inspector
│   │   ├── insights.tsx      # Streaks prompts & gamified cards
│   │   └── profile.tsx       # Workspace configurations
│   └── package.json          # Next.js configurations & dependencies
│
├── package.json              # Global monorepo workspace configurations
└── README.md                 # Project documentation
```

---

## ⚙️ Environment Configurations

### Backend Setup
Create a `.env` file inside `/backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

### Frontend Setup
Create a `.env.local` file inside `/frontend` directory or configure under Vercel environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com
```

---

## 🚀 Getting Started

### Local Development
In the root directory, install the required packages and launch the concurrent development servers:
```bash
npm install
npm run dev
```
* **Frontend Cockpit**: `http://localhost:3000`
* **API Service Port**: `http://localhost:3001`

### Production Verification Build
```bash
npm run build
```
Downloads tailwind styling schemas, type-checks all subcomponents, and compiles static Next.js Turbopack output packages inside `frontend/.next/` without any warnings.
