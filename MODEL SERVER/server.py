"""
Production FastAPI Server for Qwen Image 2.1 & Flux.2 Klein
Architecture, Interior Designing & Furniture Rendering Engine

Features:
1. Full 12-Task Pipeline APIs (Architecture, Interior, Furniture)
2. OpenAI / GPT-Style Compatible Endpoints (/v1/chat/completions, /v1/images/generations, /v1/images/edits)
3. 5-Perspective Synchronized Architectural Elevation Generator
4. 4K Latent Tile Refiner
5. Real GPU Telemetry (NVIDIA RTX 5070 VRAM) & Ground-Truth Example Explorer
"""

import os
import sys
import time
import uuid
import json
import base64
import logging
from io import BytesIO
from typing import List, Optional, Dict, Any, Tuple

# Ensure current directory is in sys.path
SERVER_DIR = os.path.dirname(os.path.abspath(__file__))
if SERVER_DIR not in sys.path:
    sys.path.insert(0, SERVER_DIR)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from PIL import Image
import uvicorn

from schemas import (
    TaskGenerateRequest,
    TaskGenerateResponse,
    GenerateJsonRequest,
    GenerateResponse,
    Upscale4kRequest,
    OpenAIChatCompletionRequest,
    OpenAIChatCompletionResponse,
    OpenAIChatCompletionChoice,
    OpenAIImageGenerationRequest,
    OpenAIImageEditRequest,
    SystemTelemetryResponse
)
from task_configs import TASKS, TASK_CATEGORIES, get_task_config, build_task_prompt
from prompt_enhancer import enhance_prompt
from pipeline_manager import PipelineManager

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("ArchModelServer")

OUTPUTS_DIR = os.path.join(SERVER_DIR, "outputs")
os.makedirs(OUTPUTS_DIR, exist_ok=True)

WORKSPACE_ROOT = os.path.dirname(SERVER_DIR)
EXAMPLES_DIR = os.path.join(WORKSPACE_ROOT, "EXAMPLE")

app = FastAPI(
    title="AI Architecture & Interior Design Multi-Model Server",
    description="High-performance Qwen Image 2.1 & Flux.2 Klein local model server with GPT-style API calling",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount outputs and examples
app.mount("/outputs", StaticFiles(directory=OUTPUTS_DIR), name="outputs")
if os.path.exists(EXAMPLES_DIR):
    app.mount("/examples", StaticFiles(directory=EXAMPLES_DIR), name="examples")

# Lazy pipeline managers
manager = PipelineManager()


# =============================================================================
# Helper Utilities
# =============================================================================

def decode_b64_image(b64_str: str) -> Image.Image:
    if "," in b64_str:
        b64_str = b64_str.split(",", 1)[1]
    raw = base64.b64decode(b64_str)
    return Image.open(BytesIO(raw)).convert("RGB")


def encode_image_b64(img: Image.Image) -> str:
    buf = BytesIO()
    img.save(buf, format="PNG")
    return f"data:image/png;base64,{base64.b64encode(buf.getvalue()).decode('utf-8')}"


META_FILE = os.path.join(OUTPUTS_DIR, "outputs_meta.json")

def load_outputs_metadata() -> List[Dict[str, Any]]:
    if not os.path.exists(META_FILE):
        return []
    try:
        with open(META_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_outputs_metadata(items: List[Dict[str, Any]]):
    try:
        with open(META_FILE, "w", encoding="utf-8") as f:
            json.dump(items, f, indent=2)
    except Exception as e:
        logger.error(f"Failed to save outputs metadata: {e}")

def record_output(meta_item: Dict[str, Any]):
    items = load_outputs_metadata()
    items.insert(0, meta_item)
    save_outputs_metadata(items[:500])


def save_output_image(img: Image.Image, prefix: str = "gen", extra_meta: Optional[Dict[str, Any]] = None, record: bool = True) -> Tuple[str, str]:
    filename = f"{prefix}_{int(time.time())}_{uuid.uuid4().hex[:6]}.png"
    filepath = os.path.join(OUTPUTS_DIR, filename)
    img.save(filepath, format="PNG")
    file_url = f"/outputs/{filename}"
    meta = {
        "id": filename,
        "filename": filename,
        "file_url": file_url,
        "width": img.width,
        "height": img.height,
        "timestamp": int(time.time())
    }
    if extra_meta:
        meta.update(extra_meta)
    if record:
        record_output(meta)
    return filepath, file_url


@app.get("/api/v1/outputs")
def get_saved_outputs():
    """Returns saved generated outputs with full metadata."""
    items = load_outputs_metadata()
    valid_items = []
    for it in items:
        fn = it.get("filename")
        if fn and os.path.exists(os.path.join(OUTPUTS_DIR, fn)):
            valid_items.append(it)
    return {"outputs": valid_items}


@app.delete("/api/v1/outputs/{filename}")
def delete_saved_output(filename: str):
    """Deletes a generated output image from disk and metadata."""
    filepath = os.path.join(OUTPUTS_DIR, filename)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to delete file: {e}")
    items = load_outputs_metadata()
    items = [it for it in items if it.get("filename") != filename]
    save_outputs_metadata(items)
    return {"success": True, "deleted": filename}


# =============================================================================
# System Telemetry & Examples Endpoints
# =============================================================================

@app.get("/health")
@app.get("/api/v1/telemetry", response_model=SystemTelemetryResponse)
def get_telemetry():
    """Returns GPU telemetry, VRAM status, and ready models."""
    return manager.get_system_telemetry()


@app.get("/api/v1/generation-progress")
def get_generation_progress():
    """Returns real diffusion step percentage directly from ComfyUI sampler callback."""
    try:
        from progress_tracker import progress_tracker
        return progress_tracker.get_status()
    except Exception as e:
        return {
            "is_generating": False,
            "percentage": 0,
            "current_step": 0,
            "total_steps": 25,
            "task_id": "",
            "error": str(e)
        }


@app.post("/api/v1/generation/stop")
@app.post("/api/v1/tasks/cancel")
def stop_generation():
    """Immediately stops and cancels any active generation on the GPU and resets progress tracker."""
    logger.info("STOP GENERATION requested by user.")
    interrupted = False
    try:
        import comfy.model_management
        comfy.model_management.interrupt_current_processing(True)
        interrupted = True
    except Exception as e:
        logger.warning(f"Comfy interrupt call notice: {e}")

    try:
        from progress_tracker import progress_tracker
        progress_tracker.cancel()
    except Exception as e:
        logger.warning(f"Progress tracker cancel notice: {e}")

    return {
        "success": True,
        "message": "Generation stopped successfully",
        "interrupted": interrupted
    }


@app.get("/api/v1/tasks")
def list_tasks():
    """Returns all 12 tasks with configurations, prompt templates, and default parameters."""
    return {
        "categories": TASK_CATEGORIES,
        "tasks": TASKS
    }


@app.get("/api/v1/examples")
def list_examples():
    """Scans and returns the ground-truth example files and prompts from EXAMPLE directory."""
    results = []
    for task_id, cfg in TASKS.items():
        ex_folder = os.path.join(WORKSPACE_ROOT, cfg.get("example_folder", ""))
        input_url = None
        output_urls = []
        has_input = False

        if os.path.exists(ex_folder):
            for fname in os.listdir(ex_folder):
                fpath = os.path.join(ex_folder, fname)
                if not os.path.isfile(fpath):
                    continue
                rel_url = f"/examples/{os.path.relpath(fpath, EXAMPLES_DIR).replace(os.sep, '/')}"
                lname = fname.lower()
                if "input" in lname:
                    input_url = rel_url
                    has_input = True
                elif lname.endswith((".png", ".jpg", ".jpeg", ".webp", ".avif")):
                    output_urls.append(rel_url)

        results.append({
            "task_id": task_id,
            "category": cfg["category"],
            "title": cfg["title"],
            "description": cfg["description"],
            "prompt": cfg.get("example_prompt", ""),
            "input_file_url": input_url,
            "output_files_urls": output_urls,
            "has_input": has_input
        })

    return {"examples": results}


# =============================================================================
# Native 12-Task Execution Endpoints
# =============================================================================

@app.post("/api/v1/tasks/generate", response_model=TaskGenerateResponse)
def execute_task(req: TaskGenerateRequest):
    """
    Executes any of the 12 tasks (Architecture, Interior, Furniture)
    using domain-tuned configurations and prompt templates.
    """
    try:
        t0 = time.time()
        cfg = get_task_config(req.task_id)

        # Immediately register task with progress tracker so client polling sees active status and 3% instead of idle/stale 100%
        try:
            from progress_tracker import progress_tracker
            progress_tracker.start(task_id=req.task_id, total_steps=req.steps or cfg.get("default_steps", 25), project_id=req.project_id or "PRJ-1001")
        except Exception:
            pass

        # Decode or load reference images
        input_images: List[Image.Image] = []
        raw_b64_list = list(req.images_base64 or [])
        for img_item in (getattr(req, "images", None) or []):
            if img_item and isinstance(img_item, str):
                if img_item.startswith("data:image") or len(img_item) > 200:
                    raw_b64_list.append(img_item)
                elif "/outputs/" in img_item or "/examples/" in img_item or os.path.exists(img_item):
                    if not req.image_urls:
                        req.image_urls = []
                    req.image_urls.append(img_item)

        for b64 in raw_b64_list:
            if b64 and b64.strip():
                try:
                    input_images.append(decode_b64_image(b64))
                except Exception as e:
                    logger.warning(f"Error decoding b64 input image: {e}")

        # Support image_urls directly from server outputs, examples, or local disk
        for u in (getattr(req, "image_urls", None) or []):
            if u and isinstance(u, str) and u.strip():
                u_clean = u.strip()
                try:
                    if "/outputs/" in u_clean:
                        fn = u_clean.split("/outputs/")[-1].split("?")[0]
                        local_p = os.path.join(OUTPUTS_DIR, fn)
                        if os.path.exists(local_p):
                            input_images.append(Image.open(local_p).convert("RGB"))
                            continue
                    if "/examples/" in u_clean:
                        rel = u_clean.split("/examples/")[-1].split("?")[0]
                        local_p = os.path.join(EXAMPLES_DIR, rel.replace("/", os.sep))
                        if os.path.exists(local_p):
                            input_images.append(Image.open(local_p).convert("RGB"))
                            continue
                    if u_clean.startswith("data:image"):
                        input_images.append(decode_b64_image(u_clean))
                        continue
                    if os.path.exists(u_clean):
                        input_images.append(Image.open(u_clean).convert("RGB"))
                        continue
                except Exception as e:
                    logger.warning(f"Error loading image from URL/path {u_clean}: {e}")

        # Check required image constraint
        if cfg.get("requires_image", False) and len(input_images) == 0:
            # Fall back to example input image if available
            ex_folder = os.path.join(WORKSPACE_ROOT, cfg.get("example_folder", ""))
            ex_input = cfg.get("example_input_filename")
            if ex_input and os.path.exists(os.path.join(ex_folder, ex_input)):
                logger.info(f"Using default example image for task {req.task_id}")
                img = Image.open(os.path.join(ex_folder, ex_input)).convert("RGB")
                input_images.append(img)
            else:
                raise HTTPException(status_code=400, detail=f"Task '{req.task_id}' requires at least 1 input image.")

        # Determine effective parameters
        user_prompt = (req.prompt or "").strip()
        if not user_prompt:
            if req.task_id == "interior_room_new_look":
                user_prompt = "Redesign and restyle this interior room with pristine contemporary aesthetics, premium architectural materials, elegant furniture layout, soft balanced daylight, photorealistic 8k render, preserving the exact room layout and structural envelope."
            elif req.task_id == "interior_fully_redesign":
                user_prompt = "Comprehensive high-end interior architectural redesign, preserving the exact room layout, structural walls, window openings, and space boundaries. Upgraded luxury ceiling details with indirect cove lighting, balanced environment daylight and ambient illumination, photorealistic textures, Hasselblad 35mm optical lens, subtle 10mm wide filter, smooth natural background bokeh, ray-traced global illumination, 8k render."
            elif req.task_id == "arch_text_to_arch":
                user_prompt = "Ultra-photorealistic contemporary luxury architectural residence with clean facade geometry, floor-to-ceiling glass curtain walls, balanced daylight, Hasselblad 35mm optical lens, subtle 10mm wide filter, smooth natural background bokeh, 8k resolution."
            elif req.task_id in ("arch_image_edit", "interior_image_edit"):
                user_prompt = "Refine and enhance existing render with photorealistic materiality, authentic optical reflections, and balanced lighting."
            else:
                user_prompt = cfg.get("example_prompt", "")

        style_arg = req.style if (req.style and req.style.strip().lower() != "auto") else ""
        lighting_arg = req.lighting if (req.lighting and req.lighting.strip().lower() != "auto") else ""

        if req.enhance_prompt:
            final_prompt = enhance_prompt(
                user_prompt,
                style=style_arg or "contemporary architectural",
                lighting=lighting_arg or "natural soft daylight"
            )
        else:
            final_prompt = build_task_prompt(
                task_id=req.task_id,
                user_prompt=user_prompt,
                style=style_arg,
                lighting=lighting_arg
            )

        model_name = req.model or cfg.get("default_model", "qwen")
        if req.width and req.height:
            width = req.width
            height = req.height
        elif len(input_images) > 0 and req.task_id in ("arch_image_edit", "interior_image_edit", "furniture_edit", "arch_enhance_render"):
            # Preserve input image natural aspect ratio and resolution
            src_w, src_h = input_images[0].size
            max_dim = 1536
            if max(src_w, src_h) > max_dim:
                scale = max_dim / max(src_w, src_h)
                src_w = int(src_w * scale)
                src_h = int(src_h * scale)
            width = max(256, (src_w // 32) * 32)
            height = max(256, (src_h // 32) * 32)
        else:
            width = req.width or cfg.get("default_width", 1024)
            height = req.height or cfg.get("default_height", 1024)

        steps = req.steps or cfg.get("default_steps", 25)
        cfg_scale = req.cfg or cfg.get("default_cfg", 1.0)
        denoise = req.denoise if req.denoise is not None else cfg.get("default_denoise", 1.0)

        out_img, seed_used, meta = manager.generate(
            model=model_name,
            prompt=final_prompt,
            negative_prompt=cfg.get("negative_prompt", ""),
            enhance=False,
            images=input_images,
            width=width,
            height=height,
            steps=steps,
            cfg=cfg_scale,
            denoise=denoise,
            seed=req.seed if req.seed is not None else -1,
            sampler_name=cfg.get("default_sampler", "euler"),
            scheduler=cfg.get("default_scheduler", "simple"),
            tiled_vae=cfg.get("tiled_vae", False),
            upscale_4k=req.upscale_4k or False
        )

        # Save or resolve input image for the comparison slider (only when an input image is available)
        input_file_url = None
        if len(input_images) > 0:
            try:
                _, input_file_url = save_output_image(input_images[0], prefix=f"{req.task_id}_input", record=False)
            except Exception as e:
                logger.warning(f"Failed to save input reference image: {e}")

        extra_meta = {
            "project_id": req.project_id or "PRJ-1001",
            "task_id": req.task_id,
            "task_title": cfg["title"],
            "category": cfg.get("category", "architecture"),
            "prompt": user_prompt,
            "final_prompt": final_prompt,
            "model": model_name,
            "seed": seed_used,
            "resolution": f"{out_img.width}x{out_img.height}",
            "input_image_url": input_file_url
        }
        _, file_url = save_output_image(out_img, prefix=req.task_id, extra_meta=extra_meta)
        out_b64 = encode_image_b64(out_img)
        dur_ms = round((time.time() - t0) * 1000.0, 1)

        meta["input_image_url"] = input_file_url

        return TaskGenerateResponse(
            success=True,
            task_id=req.task_id,
            task_title=cfg["title"],
            model=model_name,
            seed=seed_used,
            prompt_used=final_prompt,
            width=out_img.width,
            height=out_img.height,
            generation_time_ms=dur_ms,
            image_base64=out_b64,
            file_url=file_url,
            metadata=meta
        )

    except HTTPException:
        raise
    except Exception as e:
        err_msg = str(e)
        if "interrupt" in err_msg.lower() or type(e).__name__ == "InterruptProcessingException":
            logger.info(f"Task {req.task_id} was successfully stopped by user.")
            try:
                import comfy.model_management
                comfy.model_management.interrupt_current_processing(False)
            except Exception:
                pass
            return TaskGenerateResponse(
                success=False,
                task_id=req.task_id,
                task_title=cfg.get("title", ""),
                model=model_name if 'model_name' in locals() else "qwen",
                seed=-1,
                prompt_used=user_prompt if 'user_prompt' in locals() else "",
                width=0,
                height=0,
                generation_time_ms=0,
                image_base64="",
                file_url="",
                metadata={"cancelled": True}
            )
        logger.exception(f"Error executing task {req.task_id}:")
        raise HTTPException(status_code=500, detail=str(e))


# Dedicated REST endpoints for individual tasks
@app.post("/api/v1/tasks/arch/text-to-arch")
def task_arch_t2a(req: TaskGenerateRequest):
    req.task_id = "arch_text_to_arch"
    return execute_task(req)

@app.post("/api/v1/tasks/arch/sketch-to-arch")
def task_arch_s2a(req: TaskGenerateRequest):
    req.task_id = "arch_sketch_to_arch"
    return execute_task(req)

@app.post("/api/v1/tasks/arch/image-edit")
def task_arch_aie(req: TaskGenerateRequest):
    req.task_id = "arch_image_edit"
    return execute_task(req)

@app.post("/api/v1/tasks/arch/enhance-render")
def task_arch_etdotr(req: TaskGenerateRequest):
    req.task_id = "arch_enhance_render"
    return execute_task(req)

@app.post("/api/v1/tasks/interior/sketch-to-interior")
def task_interior_s2id(req: TaskGenerateRequest):
    req.task_id = "interior_sketch_to_design"
    return execute_task(req)

@app.post("/api/v1/tasks/interior/room-new-look")
def task_interior_gyrnl(req: TaskGenerateRequest):
    req.task_id = "interior_room_new_look"
    return execute_task(req)

@app.post("/api/v1/tasks/interior/image-edit")
def task_interior_idie(req: TaskGenerateRequest):
    req.task_id = "interior_image_edit"
    return execute_task(req)

@app.post("/api/v1/tasks/interior/fully-redesign")
def task_interior_frmr(req: TaskGenerateRequest):
    req.task_id = "interior_fully_redesign"
    return execute_task(req)

@app.post("/api/v1/tasks/furniture/sketch-to-furniture")
def task_furniture_s2f(req: TaskGenerateRequest):
    req.task_id = "furniture_sketch_to_render"
    return execute_task(req)

@app.post("/api/v1/tasks/furniture/furniture-edit")
def task_furniture_fe(req: TaskGenerateRequest):
    req.task_id = "furniture_edit"
    return execute_task(req)

@app.post("/api/v1/tasks/furniture/text-to-furniture")
def task_furniture_t2f(req: TaskGenerateRequest):
    req.task_id = "furniture_text_to_render"
    return execute_task(req)


# =============================================================================
# OpenAI / GPT-Style API Endpoints
# =============================================================================

@app.get("/v1/models")
def openai_list_models():
    """OpenAI standard models list endpoint."""
    return {
        "object": "list",
        "data": [
            {
                "id": "qwen-image-2.1",
                "object": "model",
                "created": int(time.time()),
                "owned_by": "antigravity-local",
                "description": "Qwen Image 2.1 DiT 8B (Supports vision multi-reference conditioning & text-to-image)"
            },
            {
                "id": "flux-2-klein",
                "object": "model",
                "created": int(time.time()),
                "owned_by": "antigravity-local",
                "description": "Flux.2 Klein 4B Flow-Matching Generator"
            },
            {
                "id": "gpt-image-2.5-sunburst",
                "object": "model",
                "created": int(time.time()),
                "owned_by": "antigravity-local",
                "description": "Unified Architecture & Interior Synthesis Model"
            }
        ]
    }


@app.post("/v1/chat/completions", response_model=OpenAIChatCompletionResponse)
def openai_chat_completions(req: OpenAIChatCompletionRequest):
    """
    OpenAI Chat Completion API Compatibility Endpoint.
    Accepts text prompts and image_url payloads, determines task context, and executes pipeline.
    """
    try:
        t0 = time.time()
        user_text = ""
        input_images: List[Image.Image] = []

        # Parse messages
        for msg in req.messages:
            if msg.role in ["user", "system"]:
                if isinstance(msg.content, str):
                    user_text += f"{msg.content}\n"
                elif isinstance(msg.content, list):
                    for item in msg.content:
                        if item.type == "text" and item.text:
                            user_text += f"{item.text}\n"
                        elif item.type == "image_url" and item.image_url:
                            url = item.image_url.get("url", "")
                            if url.startswith("data:image"):
                                input_images.append(decode_b64_image(url))

        # Detect or assign task
        task_id = req.task
        if not task_id:
            # Auto-detect from text
            lower = user_text.lower()
            if "sketch" in lower and "interior" in lower:
                task_id = "interior_sketch_to_design"
            elif "sketch" in lower and "furniture" in lower:
                task_id = "furniture_sketch_to_render"
            elif "sketch" in lower:
                task_id = "arch_sketch_to_arch"
            elif "redesign" in lower or "re-design" in lower:
                task_id = "interior_fully_redesign"
            elif "room" in lower and "look" in lower:
                task_id = "interior_room_new_look"
            elif "enhance" in lower or "detail" in lower:
                task_id = "arch_enhance_render"
            elif "furniture" in lower and len(input_images) == 0:
                task_id = "furniture_text_to_render"
            elif "furniture" in lower and len(input_images) > 0:
                task_id = "furniture_edit"
            elif "interior" in lower and len(input_images) > 0:
                task_id = "interior_image_edit"
            elif "edit" in lower and len(input_images) > 0:
                task_id = "arch_image_edit"
            else:
                task_id = "arch_text_to_arch"

        cfg = get_task_config(task_id)
        model_name = "flux" if "flux" in req.model.lower() else "qwen"
        final_prompt = build_task_prompt(task_id, user_prompt=user_text.strip() or cfg["example_prompt"])

        w = req.width or cfg["default_width"]
        h = req.height or cfg["default_height"]
        steps = req.steps or cfg["default_steps"]
        cfg_val = req.cfg or cfg["default_cfg"]

        out_img, seed_used, meta = manager.generate(
            model=model_name,
            prompt=final_prompt,
            negative_prompt=cfg["negative_prompt"],
            images=input_images,
            width=w,
            height=h,
            steps=steps,
            cfg=cfg_val,
            denoise=cfg["default_denoise"],
            seed=req.seed if req.seed is not None else -1
        )

        _, file_url = save_output_image(out_img, prefix=f"gpt_{task_id}")
        out_b64 = encode_image_b64(out_img)
        dur_s = round(time.time() - t0, 2)

        content_markdown = (
            f"Successfully generated architectural render for **{cfg['title']}** in {dur_s}s.\n\n"
            f"![Generated Render]({file_url})\n\n"
            f"**Parameters**: Model: `{model_name}` | Resolution: `{out_img.width}x{out_img.height}` | Seed: `{seed_used}` | Steps: `{steps}`"
        )

        choice = OpenAIChatCompletionChoice(
            index=0,
            message={
                "role": "assistant",
                "content": content_markdown,
                "image_url": file_url,
                "image_base64": out_b64,
                "metadata": meta
            },
            finish_reason="stop"
        )

        return OpenAIChatCompletionResponse(
            id=f"chatcmpl-{uuid.uuid4().hex[:12]}",
            created=int(time.time()),
            model=req.model,
            choices=[choice]
        )

    except Exception as e:
        logger.exception("Error during OpenAI chat completion:")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/images/generations")
def openai_image_generation(req: OpenAIImageGenerationRequest):
    """OpenAI standard Image Generation API."""
    try:
        model_name = "flux" if "flux" in (req.model or "").lower() else "qwen"
        w, h = 1024, 1024
        if req.size:
            parts = req.size.lower().split("x")
            if len(parts) == 2:
                w, h = int(parts[0]), int(parts[1])

        out_img, seed_used, _ = manager.generate(
            model=model_name,
            prompt=req.prompt,
            width=w,
            height=h,
            steps=25,
            cfg=1.0,
            denoise=1.0
        )
        _, file_url = save_output_image(out_img, prefix="openai_gen")
        b64_str = encode_image_b64(out_img)

        data_item = {}
        if req.response_format == "b64_json":
            data_item["b64_json"] = b64_str.split(",", 1)[1] if "," in b64_str else b64_str
        else:
            data_item["url"] = file_url

        return {
            "created": int(time.time()),
            "data": [data_item]
        }
    except Exception as e:
        logger.exception("Error in OpenAI image generation:")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/v1/images/edits")
def openai_image_edits(req: OpenAIImageEditRequest):
    """OpenAI standard Image Edit API."""
    try:
        model_name = "flux" if "flux" in (req.model or "").lower() else "qwen"
        ref_img = decode_b64_image(req.image)

        w, h = 1024, 1024
        if req.size:
            parts = req.size.lower().split("x")
            if len(parts) == 2:
                w, h = int(parts[0]), int(parts[1])

        out_img, seed_used, _ = manager.generate(
            model=model_name,
            prompt=f"Picture 1 is an existing image. Modify Picture 1 according to: {req.prompt}",
            images=[ref_img],
            width=w,
            height=h,
            steps=24,
            cfg=1.0,
            denoise=0.80
        )
        _, file_url = save_output_image(out_img, prefix="openai_edit")
        b64_str = encode_image_b64(out_img)

        data_item = {}
        if req.response_format == "b64_json":
            data_item["b64_json"] = b64_str.split(",", 1)[1] if "," in b64_str else b64_str
        else:
            data_item["url"] = file_url

        return {
            "created": int(time.time()),
            "data": [data_item]
        }
    except Exception as e:
        logger.exception("Error in OpenAI image edit:")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Direct Utilities (Prompt Enhancement, 4K Upscale, Raw JSON)
# =============================================================================

@app.post("/api/v1/enhance-prompt")
def api_enhance_prompt(prompt: str, style: str = "Modern Luxury Villa", lighting: str = "Twilight Golden Hour"):
    """Expands user prompt into a high-end architectural brief."""
    enhanced = enhance_prompt(prompt, style=style, lighting=lighting)
    return {"original_prompt": prompt, "enhanced_prompt": enhanced}


@app.post("/api/v1/upscale-4k")
def api_upscale_4k(req: Upscale4kRequest):
    """Runs high-order 4K latent tile refinement on input image."""
    try:
        t0 = time.time()
        in_img = decode_b64_image(req.image_base64)
        refined = manager.tile_refine_4k(in_img, target_w=req.target_width, target_h=req.target_height)
        _, file_url = save_output_image(refined, prefix="upscale_4k")
        dur_ms = round((time.time() - t0) * 1000.0, 1)

        return {
            "success": True,
            "width": refined.width,
            "height": refined.height,
            "refinement_time_ms": dur_ms,
            "file_url": file_url,
            "image_base64": encode_image_b64(refined)
        }
    except Exception as e:
        logger.exception("Error in 4K upscale:")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/v1/generate-json", response_model=GenerateResponse)
def generate_from_json(req: GenerateJsonRequest):
    """Raw low-level JSON generation endpoint."""
    try:
        input_images: List[Image.Image] = []
        for b64 in (req.images_base64 or []):
            if b64 and b64.strip():
                input_images.append(decode_b64_image(b64))

        out_img, seed_used, meta = manager.generate(
            model=req.model,
            prompt=req.prompt,
            negative_prompt=req.negative_prompt or "",
            enhance=req.enhance_prompt,
            images=input_images,
            width=req.width,
            height=req.height,
            steps=req.steps,
            cfg=req.cfg,
            denoise=req.denoise,
            seed=req.seed,
            sampler_name=req.sampler_name,
            scheduler=req.scheduler,
            tiled_vae=req.tiled_vae,
            upscale_4k=req.upscale_4k
        )

        _, file_url = save_output_image(out_img, prefix=f"raw_{req.model}")
        meta["file_url"] = file_url

        return GenerateResponse(
            success=True,
            model=req.model,
            seed=seed_used,
            prompt_used=meta.get("prompt", req.prompt),
            width=out_img.width,
            height=out_img.height,
            generation_time_ms=meta.get("execution_time_ms", 0.0),
            image_base64=encode_image_b64(out_img),
            metadata=meta
        )
    except Exception as e:
        logger.exception("Error in generate-json:")
        raise HTTPException(status_code=500, detail=str(e))


# =============================================================================
# Serve Frontend SPA (Single Page Application Fallback for Client-Side Routing)
# =============================================================================
DIST_DIR = os.path.join(WORKSPACE_ROOT, "ui", "dist")
INDEX_HTML = os.path.join(DIST_DIR, "index.html")

if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa_frontend(full_path: str):
        target = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.isfile(target):
            return FileResponse(target)
        if os.path.exists(INDEX_HTML):
            return FileResponse(INDEX_HTML)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")


def free_port(port: int = 8000):
    """Automatically frees the port on Windows if lingering processes are holding it."""
    import subprocess
    try:
        cmd = f'netstat -ano | findstr :{port}'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        my_pid = str(os.getpid())
        for line in res.stdout.strip().splitlines():
            if "LISTENING" in line:
                parts = line.strip().split()
                pid = parts[-1]
                if pid and pid != my_pid and pid != "0":
                    logger.info(f"Port {port} occupied by PID {pid}. Terminating lingering process...")
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
                    time.sleep(1.0)
    except Exception as e:
        logger.warning(f"Port conflict auto-check notice: {e}")


if __name__ == "__main__":
    free_port(8000)
    logger.info("Starting AI Architecture & Multi-Model Server on http://0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

