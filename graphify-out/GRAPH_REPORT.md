# Graph Report - AI ARCH  (2026-10-03)

## Corpus Check
- 74 files · ~116,242 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 4, .bat 3, .tsbuildinfo 2)

## Summary
- 1157 nodes · 1477 edges · 102 communities (97 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- main
- inspect_video.py
- upload_file
- FluxPipeline
- package.json
- CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE
- compilerOptions
- CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE
- compilerOptions
- Gemini API Development Skill
- tsconfig.json
- Cloud-Pup Aesthetic
- Listening Room — UX Visual Design Skill
- pipeline_flux.py
- How to write each section well
- Appendix B - Canonical Sources (read these before reinventing)
- Appendix B - Canonical Sources (read these before reinventing)
- QwenPipeline
- Prompting Gemini Omni Flash
- How to write each section well
- How to write each section well
- Y2K Dreamcore Aesthetic
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)
- react
- Migration Checklist
- Installation
- Test-Driven Dev
- Gemini Live API Development Skill
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- Gemini Live API Migration & Upgrading Reference
- Gemini API — Fallback Skill
- Quick Start
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- CORE DIRECTIVE: AWWWARDS-LEVEL DESIGN ENGINEERING
- Protocol: Premium Utilitarian Minimalism UI Architect
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- CORE DIRECTIVE: AWWWARDS-LEVEL DESIGN ENGINEERING
- Protocol: Premium Utilitarian Minimalism UI Architect
- Design Doc Skills
- 🌱 Skills Garden
- App.tsx
- 9. AI TELLS (Forbidden Patterns)
- 12. THE COMBINATORIAL VARIATION ENGINE
- 9. AI TELLS (Forbidden Patterns)
- 12. THE COMBINATORIAL VARIATION ENGINE
- PipelineManager
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- Full-Output Enforcement
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- Full-Output Enforcement
- ScrollableCards.tsx
- Live Streaming Transcription (Gemini Live Transcribe)
- 29. ANTI-AI-SLOP RULES
- 29. ANTI-AI-SLOP RULES
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- Documentation Lookup
- server.py
- 33. DEFAULT SECTION PACKS
- 14. HERO MINIMALISM RULES
- 37. EXAMPLE INTERPRETATIONS
- .generate
- 33. DEFAULT SECTION PACKS
- 14. HERO MINIMALISM RULES
- 37. EXAMPLE INTERPRETATIONS
- CustomSelect.tsx
- main.tsx
- ProjectsPortalPage.tsx
- Live Translation (Gemini Live Translate)
- Sending Text
- Sending Video
- Receiving Audio and Text
- generate_video
- typing
- requests
- lucide-react
- GenerationProgressTracker
- 7. DIAL DEFINITIONS (Technical Reference)
- 7. DIAL DEFINITIONS (Technical Reference)
- save_output_image
- schemas.py
- execute_task
- generate_video.py
- openai_chat_completions
- TaskSelectionPage.tsx
- argparse_resolution_type
- CustomSlider.tsx

## God Nodes (most connected - your core abstractions)
1. `CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE` - 39 edges
2. `CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE` - 39 edges
3. `execute_task()` - 22 edges
4. `react` - 21 edges
5. `compilerOptions` - 16 edges
6. `tasteskill: Anti-Slop Frontend Skill` - 16 edges
7. `tasteskill: Anti-Slop Frontend Skill` - 16 edges
8. `TaskGenerateRequest` - 15 edges
9. `Gemini Live API Development Skill` - 15 edges
10. `Appendix B - Canonical Sources (read these before reinventing)` - 15 edges

## Surprising Connections (you probably didn't know these)
- `PipelineManager` --uses--> `FluxPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_flux.py
- `PipelineManager` --uses--> `QwenPipeline`  [INFERRED]
  MODEL SERVER/pipeline_manager.py → MODEL SERVER/pipeline_qwen.py
- `execute_task()` --uses--> `TaskGenerateResponse`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `generate_from_json()` --uses--> `GenerateResponse`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py
- `openai_chat_completions()` --uses--> `OpenAIChatCompletionChoice`  [INFERRED]
  MODEL SERVER/server.py → MODEL SERVER/schemas.py

## Import Cycles
- None detected.

## Communities (102 total, 5 thin omitted)

### Community 0 - "main"
Cohesion: 0.17
Nodes (11): argparse_duration_type(), main(), parse_and_validate_duration(), Converts a text prompt into a safe, descriptive filename slug., Parses and formats a duration integer between 3 and 10 with optional 's' suffix., argparse type converter for validating duration., Runs a single generation job inside a thread pool, catching exceptions., Custom ArgumentParser that ensures any error output is sanitized to prevent… (+3 more)

### Community 1 - "inspect_video.py"
Cohesion: 0.17
Nodes (18): format_size(), inspect_video(), main(), parse_fps(), print_terminal_report(), Prints an aligned terminal report., Parses fractional frame rates like '30/1' or '24000/1001' into floats., Runs ffprobe on the video file and returns parsed metadata dictionary. (+10 more)

### Community 2 - "upload_file"
Cohesion: 0.22
Nodes (14): detect_mime_type(), get_api_key(), main(), Performs an upload using google-genai SDK, with automatic pre-processing for…, Polls the file status until state is ACTIVE or FAILED using exponential backoff…, Strips query parameters from URL for clean logging and security., Custom ArgumentParser that ensures any error output is sanitized to prevent…, Sanitizes error messages by redacting API keys, tokens, query parameters,… (+6 more)

### Community 3 - "FluxPipeline"
Cohesion: 0.19
Nodes (5): FluxPipeline, Any, Image, Executes generation / editing with Flux.2 Klein., Offload models and clear GPU cache to ensure ~0 MB idle VRAM

### Community 4 - "package.json"
Cohesion: 0.07
Nodes (27): agentation, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, dependencies (+19 more)

### Community 5 - "CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE"
Cohesion: 0.06
Nodes (34): 10. IMAGE-FIRST CODEX WEBSITE WORKFLOW, 11. WHEN TO TRIGGER IMAGE GENERATION FIRST, 13. WEBSITE REFERENCE RULE, 15. RESPONSIVE FIRST-VIEW RULE, 16. ANTI-NESTED-BOX RULE, 17. REDUCE MICRO-UI CLUTTER RULE, 18. SECTION IMAGE GENERATION RULE, 19. WEBSITE IMAGE SYSTEM RULE (+26 more)

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+9 more)

### Community 7 - "CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE"
Cohesion: 0.06
Nodes (34): 10. IMAGE-FIRST CODEX WEBSITE WORKFLOW, 11. WHEN TO TRIGGER IMAGE GENERATION FIRST, 13. WEBSITE REFERENCE RULE, 15. RESPONSIVE FIRST-VIEW RULE, 16. ANTI-NESTED-BOX RULE, 17. REDUCE MICRO-UI CLUTTER RULE, 18. SECTION IMAGE GENERATION RULE, 19. WEBSITE IMAGE SYSTEM RULE (+26 more)

### Community 8 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 9 - "Gemini API Development Skill"
Cohesion: 0.06
Nodes (33): Antigravity Agent, Content types (inside `content` array on `model_output` and `user_input` steps), Critical Rules (Always Apply), Current Agents, Current Models (Use These), Current SDKs, Custom Agents, Data Model (+25 more)

### Community 12 - "Cloud-Pup Aesthetic"
Cohesion: 0.06
Nodes (33): Anti-patterns for the puppy, Asymmetric softness, Border-radius scale, Cards / lists, Cloud-Pup Aesthetic, Color system, Component patterns, Forms (+25 more)

### Community 13 - "Listening Room — UX Visual Design Skill"
Cohesion: 0.06
Nodes (29): 1. The Stage, 2. The Host Orb, 3. The Pulse Dot, 4. The Broadcast Chrome Bars, 5. Ambient Motion (one per screen), 6. The Chrome Metadata Strip, 7. The Caption Overlay (optional), Accent (ONE per screen) (+21 more)

### Community 14 - "pipeline_flux.py"
Cohesion: 0.15
Nodes (17): comfy_extras_nodes_qwen, comfy_model_management, comfy_sample, comfy_sd, comfy_utils, importlib, logging, Architectural Sketch-to-5-Multi-View Generator Converts 2D architectural… (+9 more)

### Community 15 - "How to write each section well"
Cohesion: 0.09
Nodes (21): API surface, Architecture, Cost & capacity, Data model, Engineering Design Doc, Goals & non-goals, How to write each section well, Key components (+13 more)

### Community 16 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 17 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 18 - "QwenPipeline"
Cohesion: 0.21
Nodes (5): Any, Image, QwenPipeline, Executes generation / editing with full sequential memory offloading., Offload models and clear GPU cache to ensure ~0 MB idle VRAM

### Community 19 - "Prompting Gemini Omni Flash"
Cohesion: 0.10
Nodes (20): Audio handling in video editing, Available scripts, Core capabilities, Declaring sources and references, Dependencies and Prerequisites, Gemini Omni Flash Skill, Meta prompting, Prompting Gemini Omni Flash (+12 more)

### Community 20 - "How to write each section well"
Cohesion: 0.11
Nodes (17): Example (compact), Handoff, How to write each section well, Length & tone, One-liner, PM Design Doc, Scope (both sections), Success (+9 more)

### Community 21 - "How to write each section well"
Cohesion: 0.11
Nodes (17): Accessibility & inclusion, Component & visual notes, How to write each section well, Length & tone, Optional: mermaid for genuinely branching flows, Screen-by-screen specs, Screen inventory, The defining interaction (+9 more)

### Community 22 - "Y2K Dreamcore Aesthetic"
Cohesion: 0.11
Nodes (17): Color system, Inspiration anchors (mental references), Mode 1 — Web UI / web app, Mode 2 — Image generation prompts, Mode 3 — Static graphic design (posters, slides, social media), Mode 4 — Voice & microcopy, Mode-specific guidance, Self-check before shipping (+9 more)

### Community 23 - "Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)"
Cohesion: 0.11
Nodes (17): 1. Meta Information & Core Directive, 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS), 3. THE CREATIVE VARIANCE ENGINE, 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY), 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS), 6. PERFORMANCE GUARDRAILS, 7. EXECUTION PROTOCOL, 8. PRE-OUTPUT CHECKLIST (+9 more)

### Community 24 - "Agent Skill: Principal UI/UX Architect & Motion Choreographer (Awwwards-Tier)"
Cohesion: 0.11
Nodes (17): 1. Meta Information & Core Directive, 2. THE "ABSOLUTE ZERO" DIRECTIVE (STRICT ANTI-PATTERNS), 3. THE CREATIVE VARIANCE ENGINE, 4. HAPTIC MICRO-AESTHETICS (COMPONENT MASTERY), 5. MOTION CHOREOGRAPHY (FLUID DYNAMICS), 6. PERFORMANCE GUARDRAILS, 7. EXECUTION PROTOCOL, 8. PRE-OUTPUT CHECKLIST (+9 more)

### Community 25 - "react"
Cohesion: 0.16
Nodes (10): react, ApiPlaygroundTab(), TaskMeta, BlurTextProps, Magnet(), MagnetProps, ShinyText(), ShinyTextProps (+2 more)

### Community 26 - "Migration Checklist"
Cohesion: 0.13
Nodes (14): Active Legacy Models (migration recommended), Agent Updates, API Migration: `generateContent` → `Interactions`, API Migration (generateContent → Interactions), Confirm the Migration Scope, Deprecated Models, Managed Agents, Migrate to Gemini 3.8 Flash or Gemini 3.5 Flash-Lite (+6 more)

### Community 27 - "Installation"
Cohesion: 0.14
Nodes (13): About, Antigravity, Claude Code, Cursor, Disclaimer, Gemini API skills, Installation, More info (+5 more)

### Community 28 - "Test-Driven Dev"
Cohesion: 0.15
Nodes (12): Node / React, Other languages, Python, Regression rule, Scope: what counts as a test, Stack-specific defaults, Test-Driven Dev, The auto-fix loop (+4 more)

### Community 29 - "Gemini Live API Development Skill"
Cohesion: 0.17
Nodes (12): Audio Formats, Background Reasoning (Extended Thinking), Best Practices, Current Models (Use These), Gemini Live API Development Skill, Limitations, Models, Overview (+4 more)

### Community 30 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 31 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 32 - "Gemini Live API Migration & Upgrading Reference"
Cohesion: 0.18
Nodes (9): 1. Migrating to Gemini 3.8 Live (`gemini-3.8-live`), 2. Upgrading to Gemini 3.8 Live Extended Thinking (`gemini-3.8-live-extended-thinking`), 3. SDK Implementation Examples (`gemini-3.8-live-extended-thinking`), Gemini Live API Migration & Upgrading Reference, JavaScript / TypeScript, Migration Checklist (`gemini-3.1-flash-live-preview` → `gemini-3.8-live`), Model Replacements, Python (+1 more)

### Community 33 - "Gemini API — Fallback Skill"
Cohesion: 0.18
Nodes (10): Auth pattern (the boring-and-correct way), Common pitfalls (memorize these), Gemini API — Fallback Skill, Image generation (Nano Banana), Model selection, Multimodal input (image / video / audio), Stack defaults, Structured output (+2 more)

### Community 34 - "Quick Start"
Cohesion: 0.20
Nodes (10): Authentication, Connecting to the Live API, JavaScript, JavaScript, JavaScript, Python, Python, Python (+2 more)

### Community 35 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 36 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 37 - "CORE DIRECTIVE: AWWWARDS-LEVEL DESIGN ENGINEERING"
Cohesion: 0.20
Nodes (9): 1. PYTHON-DRIVEN TRUE RANDOMIZATION (BREAKING THE LOOP), 2. AIDA STRUCTURE & SPACING, 3. HERO ARCHITECTURE & THE 2-LINE IRON RULE, 4. THE GAPLESS BENTO GRID, 5. ADVANCED GSAP MOTION & HOVER PHYSICS, 6. COMPONENT ARSENAL & CREATIVITY, 7. CONTENT, ASSETS & STRICT BANS, 8. MANDATORY PRE-FLIGHT <design_plan> (+1 more)

### Community 38 - "Protocol: Premium Utilitarian Minimalism UI Architect"
Cohesion: 0.20
Nodes (9): 1. Protocol Overview, 2. Absolute Negative Constraints (Banned Elements), 3. Typographic Architecture, 4. Color Palette (Warm Monochrome + Spot Pastels), 5. Component Specifications, 6. Iconography & Imagery Directives, 7. Subtle Motion & Micro-Animations, 8. Execution Protocol (+1 more)

### Community 39 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 40 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 41 - "CORE DIRECTIVE: AWWWARDS-LEVEL DESIGN ENGINEERING"
Cohesion: 0.20
Nodes (9): 1. PYTHON-DRIVEN TRUE RANDOMIZATION (BREAKING THE LOOP), 2. AIDA STRUCTURE & SPACING, 3. HERO ARCHITECTURE & THE 2-LINE IRON RULE, 4. THE GAPLESS BENTO GRID, 5. ADVANCED GSAP MOTION & HOVER PHYSICS, 6. COMPONENT ARSENAL & CREATIVITY, 7. CONTENT, ASSETS & STRICT BANS, 8. MANDATORY PRE-FLIGHT <design_plan> (+1 more)

### Community 42 - "Protocol: Premium Utilitarian Minimalism UI Architect"
Cohesion: 0.20
Nodes (9): 1. Protocol Overview, 2. Absolute Negative Constraints (Banned Elements), 3. Typographic Architecture, 4. Color Palette (Warm Monochrome + Spot Pastels), 5. Component Specifications, 6. Iconography & Imagery Directives, 7. Subtle Motion & Micro-Animations, 8. Execution Protocol (+1 more)

### Community 43 - "Design Doc Skills"
Cohesion: 0.22
Nodes (8): Design Doc Skills, Design principles, How they work, Installing in Antigravity / Claude Code, License, Project structure, The three skills, Using them

### Community 44 - "🌱 Skills Garden"
Cohesion: 0.22
Nodes (8): Install globally (across all your Antigravity projects), Install in Antigravity (workspace-scoped), License, Related, 🌱 Skills Garden, The one required skill, Use a single skill from this repo, What's in here

### Community 45 - "App.tsx"
Cohesion: 0.17
Nodes (13): ParsedRoute, TaskDef, AppsHubPage(), AppsHubPageProps, CustomSwitch(), CustomSwitchProps, FluxLogo(), QwenLogo() (+5 more)

### Community 46 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 47 - "12. THE COMBINATORIAL VARIATION ENGINE"
Cohesion: 0.25
Nodes (8): 12. THE COMBINATORIAL VARIATION ENGINE, Background Character, Hero Architecture, Motion-Implied Language, Section System, Signature Component Set, Theme Paradigm, Typography Character

### Community 48 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 49 - "12. THE COMBINATORIAL VARIATION ENGINE"
Cohesion: 0.25
Nodes (8): 12. THE COMBINATORIAL VARIATION ENGINE, Background Character, Hero Architecture, Motion-Implied Language, Section System, Signature Component Set, Theme Paradigm, Typography Character

### Community 50 - "PipelineManager"
Cohesion: 0.31
Nodes (5): ArchitecturalMultiViewGenerator, Any, Image, _record_view_output(), PipelineManager

### Community 51 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 52 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 53 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 54 - "Full-Output Enforcement"
Cohesion: 0.29
Nodes (6): Banned Output Patterns, Baseline, Execution Process, Full-Output Enforcement, Handling Long Outputs, Quick Check

### Community 55 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 56 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 57 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 58 - "Full-Output Enforcement"
Cohesion: 0.29
Nodes (6): Banned Output Patterns, Baseline, Execution Process, Full-Output Enforcement, Handling Long Outputs, Quick Check

### Community 59 - "ScrollableCards.tsx"
Cohesion: 0.14
Nodes (13): ALL_ASPECT_RATIOS, ALL_LIGHTING_OPTIONS, ALL_STYLE_PRESETS, AspectRatioCards(), AspectRatioOption, LightingOption, LightingPresetCards(), RESOLUTION_OPTIONS (+5 more)

### Community 60 - "Live Streaming Transcription (Gemini Live Transcribe)"
Cohesion: 0.33
Nodes (6): JavaScript, Live Streaming Transcription (Gemini Live Transcribe), Model, Modes, Python, Raw WebSockets

### Community 61 - "29. ANTI-AI-SLOP RULES"
Cohesion: 0.33
Nodes (6): 29. ANTI-AI-SLOP RULES, Content slop, Density slop, Layout slop, Typography slop, Visual slop

### Community 62 - "29. ANTI-AI-SLOP RULES"
Cohesion: 0.33
Nodes (6): 29. ANTI-AI-SLOP RULES, Content slop, Density slop, Layout slop, Typography slop, Visual slop

### Community 63 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 64 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 65 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 66 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 67 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 68 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 69 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 70 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 71 - "Documentation Lookup"
Cohesion: 0.50
Nodes (4): Documentation Lookup, Key Documentation Pages, When MCP is Installed (Preferred), When MCP is NOT Installed (Fallback Only)

### Community 72 - "server.py"
Cohesion: 0.10
Nodes (24): base64, fastapi, fastapi_middleware_cors, fastapi_responses, fastapi_staticfiles, get, io, free_port() (+16 more)

### Community 73 - "33. DEFAULT SECTION PACKS"
Cohesion: 0.50
Nodes (4): 12-section pack, 33. DEFAULT SECTION PACKS, 4-section pack, 8-section pack

### Community 74 - "14. HERO MINIMALISM RULES"
Cohesion: 0.50
Nodes (4): 14. HERO MINIMALISM RULES, Absolute Hero Rules, Headline Rule, Hero Cleanliness Rule

### Community 75 - "37. EXAMPLE INTERPRETATIONS"
Cohesion: 0.50
Nodes (4): 37. EXAMPLE INTERPRETATIONS, Example 1, Example 2, Example 3

### Community 76 - ".generate"
Cohesion: 0.29
Nodes (5): Any, Image, Executes image generation or multi-image editing with the chosen model. Thread-…, Returns real-time GPU telemetry and pipeline readiness., 4K Ultra-Sharp Latent Upscaling & Tile Refiner: 1. High-order Lanczos…

### Community 77 - "33. DEFAULT SECTION PACKS"
Cohesion: 0.50
Nodes (4): 12-section pack, 33. DEFAULT SECTION PACKS, 4-section pack, 8-section pack

### Community 78 - "14. HERO MINIMALISM RULES"
Cohesion: 0.50
Nodes (4): 14. HERO MINIMALISM RULES, Absolute Hero Rules, Headline Rule, Hero Cleanliness Rule

### Community 79 - "37. EXAMPLE INTERPRETATIONS"
Cohesion: 0.50
Nodes (4): 37. EXAMPLE INTERPRETATIONS, Example 1, Example 2, Example 3

### Community 80 - "CustomSelect.tsx"
Cohesion: 0.50
Nodes (3): CustomSelect(), CustomSelectProps, SelectOption

### Community 81 - "main.tsx"
Cohesion: 0.40
Nodes (4): react-dom, App(), parseUrlRoute(), ui_src_index

### Community 82 - "ProjectsPortalPage.tsx"
Cohesion: 0.36
Nodes (6): AssetRun, ProjectsDrawer(), ProjectsDrawerProps, ProjectItem, ProjectsPortalPage(), ProjectsPortalPageProps

### Community 83 - "Live Translation (Gemini Live Translate)"
Cohesion: 0.67
Nodes (3): Configuration (`TranslationConfig`), Live Translation (Gemini Live Translate), Model

### Community 84 - "Sending Text"
Cohesion: 0.67
Nodes (3): JavaScript, Python, Sending Text

### Community 85 - "Sending Video"
Cohesion: 0.67
Nodes (3): JavaScript, Python, Sending Video

### Community 86 - "Receiving Audio and Text"
Cohesion: 0.67
Nodes (3): JavaScript, Python, Receiving Audio and Text

### Community 87 - "generate_video"
Cohesion: 0.19
Nodes (16): download_video_file(), generate_video(), get_api_key(), is_file_uri(), normalize_file_uri(), Returns True if the string is a standard Gemini File URI., Normalizes any File API URI/reference to the standard format with query…, If asset_path is a File API URI, returns it directly (normalized). If it is a… (+8 more)

### Community 88 - "typing"
Cohesion: 0.29
Nodes (6): enhance_prompt(), Domain-Specific Architectural, Interior, and Product Prompt Enhancer Transforms…, Expands user prompt with professional lighting, camera optics (bokeh, 10mm…, api_enhance_prompt(), Expands user prompt into a high-end architectural brief., typing

### Community 90 - "lucide-react"
Cohesion: 0.29
Nodes (7): lucide-react, AssetFeedItem(), AssetFeedItemProps, BeforeAfterSlider(), BeforeAfterSliderProps, DotMatrixLoaderCard(), DotMatrixLoaderCardProps

### Community 92 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 93 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 94 - "save_output_image"
Cohesion: 0.14
Nodes (22): delete, GenerateJsonRequest, OpenAIImageEditRequest, Upscale4kRequest, api_upscale_4k(), decode_b64_image(), delete_saved_output(), encode_image_b64() (+14 more)

### Community 95 - "schemas.py"
Cohesion: 0.20
Nodes (17): BaseModel, ExampleItem, GenerateResponse, MultiViewAngleItem, OpenAIChatCompletionChoice, OpenAIChatCompletionResponse, OpenAIChatMessage, OpenAIChatMessageContentItem (+9 more)

### Community 96 - "execute_task"
Cohesion: 0.28
Nodes (17): TaskGenerateRequest, execute_task(), Immediately stops and cancels any active generation on the GPU and resets…, Executes any of the 12 tasks (Architecture, Interior, Furniture) using domain-…, stop_generation(), task_arch_aie(), task_arch_etdotr(), task_arch_s2a() (+9 more)

### Community 97 - "generate_video.py"
Cohesion: 0.23
Nodes (11): Uploads a file to the Gemini Files API and waits for it to become ACTIVE. Uses…, Generates, extends, and edits videos using the Gemini Omni 1.1 Flash model via…, concurrent_futures, google, google_genai, json, mimetypes, re (+3 more)

### Community 98 - "openai_chat_completions"
Cohesion: 0.24
Nodes (9): OpenAIChatCompletionRequest, openai_chat_completions(), OpenAI Chat Completion API Compatibility Endpoint. Accepts text prompts and…, build_task_prompt(), get_task_config(), Any, Task Configurations and Prompt Engineering Engine for Architecture, Interior &…, Retrieve full configuration dictionary for a given task ID. (+1 more)

### Community 99 - "TaskSelectionPage.tsx"
Cohesion: 0.29
Nodes (4): ALL_TASKS, TaskItem, TaskSelectionPage(), TaskSelectionPageProps

### Community 100 - "argparse_resolution_type"
Cohesion: 0.50
Nodes (4): argparse_resolution_type(), parse_and_validate_resolution(), Validates and normalizes video output resolution to '360p', '720p', '1080p', or…, argparse type converter for validating video resolution.

## Knowledge Gaps
- **677 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+672 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 805 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `tasteskill: Anti-Slop Frontend Skill` connect `tasteskill: Anti-Slop Frontend Skill` to `12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)`, `5. CONTEXT-AWARE PROACTIVITY`, `8. DARK MODE PROTOCOL`, `10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)`, `9. AI TELLS (Forbidden Patterns)`, `Appendix B - Canonical Sources (read these before reinventing)`, `11. REDESIGN PROTOCOL`, `3. DEFAULT ARCHITECTURE & CONVENTIONS`, `6. PERFORMANCE & ACCESSIBILITY GUARDRAILS`, `7. DIAL DEFINITIONS (Technical Reference)`, `4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)`, `0. BRIEF INFERENCE (Read the Room Before Anything Else)`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `PipelineManager` connect `PipelineManager` to `FluxPipeline`, `server.py`, `.generate`, `pipeline_flux.py`, `QwenPipeline`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `tasteskill: Anti-Slop Frontend Skill` connect `tasteskill: Anti-Slop Frontend Skill` to `0. BRIEF INFERENCE (Read the Room Before Anything Else)`, `12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)`, `5. CONTEXT-AWARE PROACTIVITY`, `8. DARK MODE PROTOCOL`, `10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)`, `9. AI TELLS (Forbidden Patterns)`, `Appendix B - Canonical Sources (read these before reinventing)`, `11. REDESIGN PROTOCOL`, `3. DEFAULT ARCHITECTURE & CONVENTIONS`, `6. PERFORMANCE & ACCESSIBILITY GUARDRAILS`, `7. DIAL DEFINITIONS (Technical Reference)`, `4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `execute_task()` (e.g. with `TaskGenerateRequest` and `TaskGenerateResponse`) actually correct?**
  _`execute_task()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _677 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `CORE DIRECTIVE: IMAGE-FIRST WEBSITE DESIGN TO CODE` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._