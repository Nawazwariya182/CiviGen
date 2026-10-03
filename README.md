# CiviGen — Generative Architectural Design Studio

CiviGen is a production-grade, state-of-the-art AI architectural design suite powered by **Qwen Image 2.1 (8B DiT)** and **Flux.2 Klein (4B Flow-Matching)**. It enables architects, interior designers, and visualization artists to transform sketches, plans, and prompts into photorealistic architectural renders with end-to-end parametric controls.

---

## 🌟 Key Features

- **Multi-Pipeline Architecture**:
  - `T2A`: Text to Architecture
  - `S2A`: Sketch to Image Architectural Render (50/50 comparison split & slider)
  - `AIE`: Architectural Inpainting & Image Editing
  - `ETDOTR`: High-Frequency Detail Enhancement & 4K Latent Tile Refine
  - `S2ID`: Sketch to Interior Design
  - `GYRNL`: Room Makeover & Material Re-texturing
  - `IDIE`: Interior Inpainting & Image Editing
  - `FRMR`: Fully Redesign My Room (automated spatial & envelope preservation)
  - `S2F`: Sketch to Furniture
  - `FE`: Furniture Design Editing
  - `T2F`: Text to Furniture Visualization
- **Studio Workspace**:
  - Model selector (Qwen 8B DiT / Flux.2 Klein)
  - Aspect ratios (`Auto`, `1:1`, `16:9`, `9:16`, `4:3`, `3:4`, `21:9`, `32:9`, etc.)
  - Resolution selector (`Auto`, `1K`, `1.5K`, `2K`)
  - Curated Style Presets (`Modern Luxury`, `Japandi`, `Brutalist`, `Biophilic`, `Mid-Century`, `Scandinavian`, `Contemporary`, `Parametric`)
  - Environmental Lighting Atmospheres (`Golden Hour`, `Daylight`, `Night`, `Warm Accent`, `High Noon`, `Studio Key`)
  - AI Prompt Enhancer with Hasselblad 35mm optical lens and realistic photography metadata
  - Interactive Before/After comparison slider
  - Real-time in-place AI inpainting popover
- **Project Portal**:
  - Project isolation, deep URL routing (`/prj-1003/tasks/S2A`)
  - State management and bookmarking

---

## 📂 Repository Structure

```
├── MODEL SERVER/               # FastAPI Python backend & model inference server
│   ├── server.py               # Main API endpoints, SPA static routing & outputs
│   ├── pipeline_qwen.py        # Qwen Image 2.1 inference engine
│   ├── pipeline_flux.py        # Flux.2 Klein inference engine
│   ├── prompt_enhancer.py      # Architectural prompt expansion engine
│   ├── task_configs.py         # Pipeline configuration and task metadata
│   ├── schemas.py              # Pydantic models for request/response validation
│   └── progress_tracker.py     # Real-time generation progress tracking
├── ui/                         # React 19 + TypeScript + Vite frontend
│   ├── src/                    # App, studio, and component code
│   ├── public/                 # Static assets, logos, style presets
│   └── package.json            # Node dependencies
├── EXAMPLE/                    # Reference ground-truth sketches and photos
├── run_model_server.bat        # Windows launcher script for model server
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
# Navigate to MODEL SERVER directory
cd "MODEL SERVER"

# Install Python requirements
pip install -r requirements.txt  # (fastapi, uvicorn, torch, diffusers, etc.)

# Start the model server
python server.py
# Server runs on http://localhost:8000
```

### 2. Frontend Setup
```bash
# Navigate to ui directory
cd ui

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Or build production bundle
npm run build
```

---

## ⚖️ License

MIT License. Designed and built for next-generation generative architectural design.
