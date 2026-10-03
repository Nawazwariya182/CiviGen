# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 338 nodes · 565 edges · 19 communities (10 shown, 9 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `64581f28`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- server.py
- pipeline_qwen.py
- package.json
- QwenPipeline
- get
- compilerOptions
- compilerOptions
- ScrollableCards.tsx
- GenerationProgressTracker
- CiviGen — Generative Architectural Design Studio
- tsconfig.json
- concurrent_futures
- google
- google_genai
- mimetypes
- requests
- urllib_parse

## God Nodes (most connected - your core abstractions)
1. `execute_task()` - 22 edges
2. `react` - 22 edges
3. `compilerOptions` - 16 edges
4. `TaskGenerateRequest` - 15 edges
5. `compilerOptions` - 14 edges
6. `lucide-react` - 13 edges
7. `GenerationProgressTracker` - 11 edges
8. `openai_chat_completions()` - 11 edges
9. `QwenPipeline` - 10 edges
10. `save_output_image()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ProjectsPortalPageProps` --references--> `AssetRun`  [EXTRACTED]
  ui/src/components/ProjectsPortalPage.tsx → ui/src/components/AssetFeedItem.tsx
- `ProjectsDrawerProps` --references--> `ProjectItem`  [EXTRACTED]
  ui/src/components/ProjectsDrawer.tsx → ui/src/components/ProjectsPortalPage.tsx
- `generate_from_json()` --uses--> `GenerateJsonRequest`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `generate_from_json()` --uses--> `GenerateResponse`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `openai_chat_completions()` --uses--> `OpenAIChatCompletionChoice`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py

## Import Cycles
- None detected.

## Communities (19 total, 9 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.05
Nodes (50): lucide-react, react, react-dom, App(), ParsedRoute, parseUrlRoute(), TaskDef, ApiPlaygroundTab() (+42 more)

### Community 1 - "server.py"
Cohesion: 0.08
Nodes (61): base64, BaseModel, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, io, json (+53 more)

### Community 2 - "pipeline_qwen.py"
Cohesion: 0.06
Nodes (41): argparse, find_python(), get_local_ip(), main(), open_browser_delayed(), Dynamically locates the best Python interpreter with CUDA/PyTorch installed., CiviGen CLI Launcher Starts the CiviGen FastAPI model server and web studio,…, Detects local network IP for mobile & tablet Wi-Fi connectivity. (+33 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (27): agentation, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, dependencies (+19 more)

### Community 4 - "QwenPipeline"
Cohesion: 0.12
Nodes (10): PipelineManager, Any, Image, Executes image generation or multi-image editing with the chosen model. Thread-…, Returns real-time GPU telemetry and pipeline readiness., 4K Ultra-Sharp Latent Upscaling & Tile Refiner: 1. High-order Lanczos…, Any, Image (+2 more)

### Community 5 - "get"
Cohesion: 0.11
Nodes (21): delete, get, delete_saved_output(), get_generation_progress(), get_saved_outputs(), get_telemetry(), list_examples(), list_tasks() (+13 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 8 - "ScrollableCards.tsx"
Cohesion: 0.14
Nodes (13): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+5 more)

### Community 10 - "CiviGen — Generative Architectural Design Studio"
Cohesion: 0.25
Nodes (7): 1. Backend Setup, 2. Frontend Setup, CiviGen — Generative Architectural Design Studio, 🚀 Getting Started, 🌟 Key Features, ⚖️ License, 📂 Repository Structure

## Knowledge Gaps
- **83 isolated node(s):** `BlurTextProps`, `MagnetProps`, `ShinyTextProps`, `SpotlightCardProps`, `ParsedRoute` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 172 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `ScrollableCards.tsx`, `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `GenerationProgressTracker` connect `GenerationProgressTracker` to `pipeline_qwen.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `PipelineManager` connect `QwenPipeline` to `server.py`, `pipeline_qwen.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `execute_task()` (e.g. with `TaskGenerateRequest` and `TaskGenerateResponse`) actually correct?**
  _`execute_task()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TaskGenerateRequest` (e.g. with `execute_task()` and `task_arch_aie()`) actually correct?**
  _`TaskGenerateRequest` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `BlurTextProps`, `MagnetProps`, `ShinyTextProps` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05297297297297297 - nodes in this community are weakly interconnected._