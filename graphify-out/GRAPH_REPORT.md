# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- 37 files · ~37,954 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .bat 3, (none) 2, .css 1)

## Summary
- 340 nodes · 578 edges · 30 communities (15 shown, 15 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63a17c4a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CiviGen — Generative Architectural Design Studio
- argparse
- google
- FluxPipeline
- package.json
- google_genai
- compilerOptions
- mimetypes
- compilerOptions
- subprocess
- tsconfig.json
- urllib_parse
- BlurText.tsx
- pipeline_flux.py
- CustomSlider.tsx
- CustomSwitch.tsx
- Magnet.tsx
- QwenPipeline
- react
- CustomSelect.tsx
- ScrollableCards.tsx
- get
- main.tsx
- requests
- lucide-react
- GenerationProgressTracker
- server.py
- concurrent_futures
- App.tsx

## God Nodes (most connected - your core abstractions)
1. `execute_task()` - 22 edges
2. `react` - 22 edges
3. `compilerOptions` - 16 edges
4. `TaskGenerateRequest` - 15 edges
5. `compilerOptions` - 14 edges
6. `lucide-react` - 13 edges
7. `GenerationProgressTracker` - 11 edges
8. `openai_chat_completions()` - 11 edges
9. `FluxPipeline` - 10 edges
10. `QwenPipeline` - 10 edges

## Surprising Connections (you probably didn't know these)
- `PipelineManager` --uses--> `FluxPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_flux.py
- `PipelineManager` --uses--> `QwenPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_qwen.py
- `execute_task()` --calls--> `enhance_prompt()`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/prompt_enhancer.py
- `execute_task()` --uses--> `TaskGenerateRequest`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `task_arch_aie()` --uses--> `TaskGenerateRequest`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py

## Import Cycles
- None detected.

## Communities (30 total, 15 thin omitted)

### Community 0 - "CiviGen — Generative Architectural Design Studio"
Cohesion: 0.25
Nodes (7): 1. Backend Setup, 2. Frontend Setup, CiviGen — Generative Architectural Design Studio, 🚀 Getting Started, 🌟 Key Features, ⚖️ License, 📂 Repository Structure

### Community 3 - "FluxPipeline"
Cohesion: 0.21
Nodes (5): FluxPipeline, Any, Image, Executes generation / editing with Flux.2 Klein., Offload models and clear GPU cache to ensure ~0 MB idle VRAM

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (27): agentation, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, dependencies (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 14 - "pipeline_flux.py"
Cohesion: 0.11
Nodes (26): comfy_extras_nodes_qwen, comfy_model_management, comfy_sample, comfy_sd, comfy_utils, importlib, logging, Flux.2 Klein (4B) Custom Pipeline Supports fast, high-quality text-to-image and… (+18 more)

### Community 18 - "QwenPipeline"
Cohesion: 0.11
Nodes (11): PipelineManager, Any, Image, Executes image generation or multi-image editing with the chosen model. Thread-…, Returns real-time GPU telemetry and pipeline readiness., 4K Ultra-Sharp Latent Upscaling & Tile Refiner: 1. High-order Lanczos…, Any, Image (+3 more)

### Community 25 - "react"
Cohesion: 0.21
Nodes (9): react, ApiPlaygroundTab(), TaskMeta, ShinyText(), ShinyTextProps, SpotlightCard(), SpotlightCardProps, StyleCardDotMatrix() (+1 more)

### Community 45 - "CustomSelect.tsx"
Cohesion: 0.50
Nodes (3): CustomSelect(), CustomSelectProps, SelectOption

### Community 59 - "ScrollableCards.tsx"
Cohesion: 0.17
Nodes (11): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+3 more)

### Community 72 - "get"
Cohesion: 0.11
Nodes (21): delete, get, delete_saved_output(), get_generation_progress(), get_saved_outputs(), get_telemetry(), list_examples(), list_tasks() (+13 more)

### Community 81 - "main.tsx"
Cohesion: 0.40
Nodes (4): react-dom, App(), parseUrlRoute(), ui_src_index

### Community 90 - "lucide-react"
Cohesion: 0.22
Nodes (12): lucide-react, AssetFeedItemProps, AssetRun, BeforeAfterSlider(), BeforeAfterSliderProps, DotMatrixLoaderCard(), DotMatrixLoaderCardProps, LibraryPageProps (+4 more)

### Community 95 - "server.py"
Cohesion: 0.07
Nodes (65): base64, BaseModel, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, io, json (+57 more)

### Community 99 - "App.tsx"
Cohesion: 0.12
Nodes (18): ParsedRoute, TaskDef, AppsHubPage(), AppsHubPageProps, AssetFeedItem(), LibraryPage(), FluxLogo(), QwenLogo() (+10 more)

## Knowledge Gaps
- **83 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 165 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `App.tsx`, `package.json`, `CustomSelect.tsx`, `BlurText.tsx`, `CustomSlider.tsx`, `CustomSwitch.tsx`, `Magnet.tsx`, `main.tsx`, `lucide-react`, `ScrollableCards.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `PipelineManager` connect `QwenPipeline` to `FluxPipeline`, `pipeline_flux.py`, `server.py`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `FluxPipeline` connect `FluxPipeline` to `QwenPipeline`, `pipeline_flux.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `execute_task()` (e.g. with `TaskGenerateRequest` and `TaskGenerateResponse`) actually correct?**
  _`execute_task()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 12 inferred relationships involving `TaskGenerateRequest` (e.g. with `execute_task()` and `task_arch_aie()`) actually correct?**
  _`TaskGenerateRequest` has 12 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._