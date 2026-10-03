# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- 38 files · ~39,022 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .bat 3, (none) 2, .css 1)

## Summary
- 354 nodes · 620 edges · 26 communities (15 shown, 11 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b772949`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CiviGen — Generative Architectural Design Studio
- argparse
- google
- PipelineManager
- package.json
- google_genai
- compilerOptions
- mimetypes
- compilerOptions
- subprocess
- tsconfig.json
- urllib_parse
- pipeline_flux.py
- QwenPipeline
- react
- App.tsx
- ScrollableCards.tsx
- get
- main.tsx
- requests
- lucide-react
- GenerationProgressTracker
- server.py
- concurrent_futures
- TaskSelectionPage.tsx

## God Nodes (most connected - your core abstractions)
1. `execute_task()` - 22 edges
2. `react` - 22 edges
3. `compilerOptions` - 16 edges
4. `TaskGenerateRequest` - 15 edges
5. `compilerOptions` - 14 edges
6. `lucide-react` - 13 edges
7. `PipelineManager` - 12 edges
8. `GenerationProgressTracker` - 11 edges
9. `openai_chat_completions()` - 11 edges
10. `FluxPipeline` - 10 edges

## Surprising Connections (you probably didn't know these)
- `PipelineManager` --uses--> `QwenPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_qwen.py
- `ArchitecturalMultiViewGenerator` --uses--> `PipelineManager`  [INFERRED]
  MODEL SERVER/multiview_architectural_generator.py → MODEL SERVER/pipeline_manager.py
- `PipelineManager` --uses--> `FluxPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_flux.py
- `api_enhance_prompt()` --calls--> `enhance_prompt()`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/prompt_enhancer.py
- `execute_task()` --calls--> `enhance_prompt()`  [EXTRACTED]
  MODEL SERVER/server.py → MODEL SERVER/prompt_enhancer.py

## Import Cycles
- None detected.

## Communities (26 total, 11 thin omitted)

### Community 0 - "CiviGen — Generative Architectural Design Studio"
Cohesion: 0.25
Nodes (7): 1. Backend Setup, 2. Frontend Setup, CiviGen — Generative Architectural Design Studio, 🚀 Getting Started, 🌟 Key Features, ⚖️ License, 📂 Repository Structure

### Community 3 - "PipelineManager"
Cohesion: 0.09
Nodes (15): ArchitecturalMultiViewGenerator, Any, Image, _record_view_output(), FluxPipeline, Any, Image, Executes generation / editing with Flux.2 Klein. (+7 more)

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
Cohesion: 0.12
Nodes (26): comfy_extras_nodes_qwen, comfy_model_management, comfy_sample, comfy_sd, comfy_utils, importlib, json, logging (+18 more)

### Community 18 - "QwenPipeline"
Cohesion: 0.21
Nodes (5): Any, Image, QwenPipeline, Executes generation / editing with full sequential memory offloading., Offload models and clear GPU cache to ensure ~0 MB idle VRAM

### Community 25 - "react"
Cohesion: 0.21
Nodes (8): react, ApiPlaygroundTab(), TaskMeta, BlurTextProps, ShinyText(), ShinyTextProps, SpotlightCard(), SpotlightCardProps

### Community 45 - "App.tsx"
Cohesion: 0.11
Nodes (17): ParsedRoute, TaskDef, AssetFeedItem(), CustomSelect(), CustomSelectProps, SelectOption, CustomSlider(), CustomSliderProps (+9 more)

### Community 59 - "ScrollableCards.tsx"
Cohesion: 0.14
Nodes (13): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+5 more)

### Community 72 - "get"
Cohesion: 0.11
Nodes (21): delete, get, delete_saved_output(), get_generation_progress(), get_saved_outputs(), get_telemetry(), list_examples(), list_tasks() (+13 more)

### Community 81 - "main.tsx"
Cohesion: 0.40
Nodes (4): react-dom, App(), parseUrlRoute(), ui_src_index

### Community 90 - "lucide-react"
Cohesion: 0.24
Nodes (11): lucide-react, AssetFeedItemProps, AssetRun, BeforeAfterSlider(), BeforeAfterSliderProps, DotMatrixLoaderCard(), DotMatrixLoaderCardProps, LibraryPageProps (+3 more)

### Community 95 - "server.py"
Cohesion: 0.07
Nodes (71): base64, BaseModel, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, io, ExampleItem (+63 more)

### Community 99 - "TaskSelectionPage.tsx"
Cohesion: 0.16
Nodes (11): AppsHubPage(), AppsHubPageProps, ALL_TASKS, TaskItem, TaskSelectionPage(), TaskSelectionPageProps, SHORT_CODE_TO_TASK_ID, SUITE_TASKS (+3 more)

## Knowledge Gaps
- **83 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+78 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 168 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PipelineManager` connect `PipelineManager` to `QwenPipeline`, `pipeline_flux.py`, `server.py`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `TaskSelectionPage.tsx`, `package.json`, `App.tsx`, `main.tsx`, `lucide-react`, `ScrollableCards.tsx`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `FluxPipeline` connect `PipelineManager` to `pipeline_flux.py`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `execute_task()` (e.g. with `TaskGenerateRequest` and `TaskGenerateResponse`) actually correct?**
  _`execute_task()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _83 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `PipelineManager` be split into smaller, more focused modules?**
  _Cohesion score 0.0896551724137931 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._