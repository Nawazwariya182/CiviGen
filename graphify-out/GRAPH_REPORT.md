# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 345 nodes · 568 edges · 21 communities (11 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5a70e8b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- server.py
- pipeline_qwen.py
- execute_task
- package.json
- QwenPipeline
- compilerOptions
- compilerOptions
- ScrollableCards.tsx
- GenerationProgressTracker
- ApiPlaygroundTab.tsx
- CiviGen — Generative Architectural Design Studio
- BlurText.tsx
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
4. `compilerOptions` - 14 edges
5. `lucide-react` - 13 edges
6. `GenerationProgressTracker` - 11 edges
7. `openai_chat_completions()` - 11 edges
8. `QwenPipeline` - 10 edges
9. `save_output_image()` - 10 edges
10. `PipelineManager` - 8 edges

## Surprising Connections (you probably didn't know these)
- `ProjectsPortalPageProps` --references--> `AssetRun`  [EXTRACTED]
  ui/src/components/ProjectsPortalPage.tsx → ui/src/components/AssetFeedItem.tsx
- `ProjectsDrawerProps` --references--> `ProjectItem`  [EXTRACTED]
  ui/src/components/ProjectsDrawer.tsx → ui/src/components/ProjectsPortalPage.tsx
- `generate_from_json()` --calls--> `GenerateResponse`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `openai_chat_completions()` --calls--> `OpenAIChatCompletionChoice`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `openai_chat_completions()` --calls--> `OpenAIChatCompletionResponse`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py

## Import Cycles
- None detected.

## Communities (21 total, 10 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.07
Nodes (43): lucide-react, react, react-dom, App(), ParsedRoute, parseUrlRoute(), TaskDef, AppsHubPage() (+35 more)

### Community 1 - "server.py"
Cohesion: 0.06
Nodes (53): base64, BaseModel, delete, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, get (+45 more)

### Community 2 - "pipeline_qwen.py"
Cohesion: 0.06
Nodes (36): argparse, find_python(), get_local_ip(), main(), open_browser_delayed(), Dynamically locates the best Python interpreter with CUDA/PyTorch installed., CiviGen CLI Launcher Starts the CiviGen FastAPI model server and web studio,…, Detects local network IP for mobile & tablet Wi-Fi connectivity. (+28 more)

### Community 3 - "execute_task"
Cohesion: 0.09
Nodes (40): GenerateJsonRequest, api_upscale_4k(), decode_b64_image(), encode_image_b64(), execute_task(), generate_from_json(), openai_chat_completions(), openai_image_edits() (+32 more)

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (27): agentation, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, dependencies (+19 more)

### Community 5 - "QwenPipeline"
Cohesion: 0.11
Nodes (11): PipelineManager, Any, Image, Executes image generation or multi-image editing with the chosen model. Thread-…, Returns real-time GPU telemetry and pipeline readiness., 4K Ultra-Sharp Latent Upscaling & Tile Refiner: 1. High-order Lanczos…, Any, Image (+3 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 8 - "ScrollableCards.tsx"
Cohesion: 0.14
Nodes (13): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+5 more)

### Community 10 - "ApiPlaygroundTab.tsx"
Cohesion: 0.28
Nodes (6): ApiPlaygroundTab(), TaskMeta, ShinyText(), ShinyTextProps, SpotlightCard(), SpotlightCardProps

### Community 11 - "CiviGen — Generative Architectural Design Studio"
Cohesion: 0.25
Nodes (7): 1. Backend Setup, 2. Frontend Setup, CiviGen — Generative Architectural Design Studio, 🚀 Getting Started, 🌟 Key Features, ⚖️ License, 📂 Repository Structure

## Knowledge Gaps
- **83 isolated node(s):** `ParsedRoute`, `TaskDef`, `AppsHubPageProps`, `AssetFeedItemProps`, `BeforeAfterSliderProps` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 176 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.tsx` to `ScrollableCards.tsx`, `ApiPlaygroundTab.tsx`, `package.json`, `BlurText.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `QwenPipeline` connect `QwenPipeline` to `pipeline_qwen.py`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `PipelineManager` connect `QwenPipeline` to `server.py`, `pipeline_qwen.py`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `ParsedRoute`, `TaskDef`, `AppsHubPageProps` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06554019457245264 - nodes in this community are weakly interconnected._
- **Should `server.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06262626262626263 - nodes in this community are weakly interconnected._
- **Should `pipeline_qwen.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06342494714587738 - nodes in this community are weakly interconnected._