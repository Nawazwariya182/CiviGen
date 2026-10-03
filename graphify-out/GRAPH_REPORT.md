# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 350 nodes · 579 edges · 23 communities (12 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2e3d43b2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- server.py
- pipeline_qwen.py
- package.json
- schemas.py
- QwenPipeline
- compilerOptions
- compilerOptions
- ScrollableCards.tsx
- get
- GenerationProgressTracker
- ApiPlaygroundTab.tsx
- CiviGen — Generative Architectural Design Studio
- BlurText.tsx
- tsconfig.json
- concurrent_futures
- google
- google_genai
- mimetypes
- Image
- requests
- urllib_parse

## God Nodes (most connected - your core abstractions)
1. `execute_task()` - 22 edges
2. `react` - 22 edges
3. `compilerOptions` - 16 edges
4. `compilerOptions` - 14 edges
5. `lucide-react` - 13 edges
6. `GenerationProgressTracker` - 11 edges
7. `openai_chat_completions()` - 11 edges
8. `QwenPipeline` - 10 edges
9. `save_output_image()` - 10 edges
10. `PipelineManager` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ProjectsDrawerProps` --references--> `ProjectItem`  [EXTRACTED]
  ui/src/components/ProjectsDrawer.tsx → ui/src/components/ProjectsPortalPage.tsx
- `ProjectsPortalPageProps` --references--> `AssetRun`  [EXTRACTED]
  ui/src/components/ProjectsPortalPage.tsx → ui/src/components/AssetFeedItem.tsx
- `execute_task()` --calls--> `TaskGenerateResponse`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `PipelineManager` --uses--> `QwenPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_qwen.py
- `execute_task()` --calls--> `build_task_prompt()`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/task_configs.py

## Import Cycles
- None detected.

## Communities (23 total, 11 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.06
Nodes (45): lucide-react, react, App(), ParsedRoute, parseUrlRoute(), TaskDef, AppsHubPage(), AppsHubPageProps (+37 more)

### Community 1 - "server.py"
Cohesion: 0.07
Nodes (61): base64, delete, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, GenerateJsonRequest, io (+53 more)

### Community 2 - "pipeline_qwen.py"
Cohesion: 0.07
Nodes (32): argparse, find_python(), get_local_ip(), main(), open_browser_delayed(), Dynamically locates the best Python interpreter with CUDA/PyTorch installed., CiviGen CLI Launcher Starts the CiviGen FastAPI model server and web studio,…, Detects local network IP for mobile & tablet Wi-Fi connectivity. (+24 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (28): agentation, react-dom, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+20 more)

### Community 4 - "schemas.py"
Cohesion: 0.13
Nodes (24): BaseModel, ExampleItem, GenerateJsonRequest, OpenAIChatCompletionChoice, OpenAIChatCompletionRequest, OpenAIChatCompletionResponse, OpenAIChatMessage, OpenAIChatMessageContentItem (+16 more)

### Community 5 - "QwenPipeline"
Cohesion: 0.11
Nodes (11): Image, PipelineManager, Any, Image, Executes image generation or multi-image editing with the chosen model. Thread-…, Returns real-time GPU telemetry and pipeline readiness., 4K Ultra-Sharp Latent Upscaling & Tile Refiner: 1. High-order Lanczos…, Any (+3 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 8 - "ScrollableCards.tsx"
Cohesion: 0.14
Nodes (13): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+5 more)

### Community 9 - "get"
Cohesion: 0.17
Nodes (12): get, get_generation_progress(), get_telemetry(), list_examples(), list_tasks(), openai_list_models(), Returns GPU telemetry, VRAM status, and ready models., Returns real diffusion step percentage directly from ComfyUI sampler callback. (+4 more)

### Community 11 - "ApiPlaygroundTab.tsx"
Cohesion: 0.28
Nodes (6): ApiPlaygroundTab(), TaskMeta, ShinyText(), ShinyTextProps, SpotlightCard(), SpotlightCardProps

### Community 12 - "CiviGen — Generative Architectural Design Studio"
Cohesion: 0.25
Nodes (7): 1. Backend Setup, 2. Frontend Setup, CiviGen — Generative Architectural Design Studio, 🚀 Getting Started, 🌟 Key Features, ⚖️ License, 📂 Repository Structure

## Knowledge Gaps
- **84 isolated node(s):** `AppsHubPageProps`, `BeforeAfterSliderProps`, `CustomSelectProps`, `CustomSliderProps`, `CustomSwitchProps` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 178 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `ApiPlaygroundTab.tsx`, `ScrollableCards.tsx`, `package.json`, `BlurText.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `QwenPipeline` connect `QwenPipeline` to `pipeline_qwen.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `PipelineManager` connect `QwenPipeline` to `server.py`, `pipeline_qwen.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `AppsHubPageProps`, `BeforeAfterSliderProps`, `CustomSelectProps` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06433566433566433 - nodes in this community are weakly interconnected._
- **Should `server.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06768905341089371 - nodes in this community are weakly interconnected._
- **Should `pipeline_qwen.py` be split into smaller, more focused modules?**
  _Cohesion score 0.07051282051282051 - nodes in this community are weakly interconnected._