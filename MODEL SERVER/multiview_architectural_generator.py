"""
Architectural Sketch-to-5-Multi-View Generator
Converts 2D architectural sketches into 5 visually and structurally coherent 3D perspectives:
1. Front Elevation (Sketch-to-Image primary 3D render)
2. Left Side Elevation (90 deg Left View)
3. Right Side Elevation (90 deg Right View)
4. Back Elevation (180 deg Rear Exterior View)
5. Top / Bird's-Eye View (Rooftop Aerial View)

Enforces architectural and material continuity by passing View 1 as the authoritative visual reference.
"""

import os
import sys
import time
import json
import logging
from typing import List, Dict, Any, Optional
from PIL import Image

try:
    from progress_tracker import progress_tracker
except ImportError:
    progress_tracker = None

logger = logging.getLogger("MultiViewArchitecturalGenerator")

OUTPUTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")
os.makedirs(OUTPUTS_DIR, exist_ok=True)
META_FILE = os.path.join(OUTPUTS_DIR, "outputs_meta.json")

def _record_view_output(meta_item: Dict[str, Any]):
    try:
        items = []
        if os.path.exists(META_FILE):
            with open(META_FILE, "r", encoding="utf-8") as f:
                items = json.load(f)
        # Avoid duplicate entries
        items = [it for it in items if it.get("id") != meta_item.get("id")]
        items.insert(0, meta_item)
        with open(META_FILE, "w", encoding="utf-8") as f:
            json.dump(items[:500], f, indent=2)
    except Exception as e:
        logger.error(f"Failed to record view output: {e}")


class ArchitecturalMultiViewGenerator:
    def __init__(self, pipeline_manager=None):
        self.pm = pipeline_manager

    def _ensure_pipeline(self):
        if self.pm is None:
            from pipeline_manager import PipelineManager
            self.pm = PipelineManager()

    def generate_all_views(
        self,
        sketch_img: Optional[Image.Image] = None,
        prompt: str = "Modern luxury villa with 3 floors",
        style: str = "Modern Luxury Villa",
        lighting: str = "Twilight Golden Hour",
        steps: int = 28,
        seed: int = -1,
        project_id: str = "PRJ-1001"
    ) -> List[Dict[str, Any]]:
        self._ensure_pipeline()
        base_seed = seed if seed > 0 else int(time.time()) % 100000000

        if progress_tracker:
            progress_tracker.start(task_id="arch_sketch_to_multiview", total_steps=100, project_id=project_id)
            progress_tracker.set_percentage(4)

        w, h = 1024, 1024
        if sketch_img is not None:
            sw, sh = sketch_img.size
            aspect = sw / sh
            if aspect < 0.8:
                w, h = 896, 1280
            elif aspect > 1.25:
                w, h = 1280, 896

        views_output: List[Dict[str, Any]] = []

        # =========================================================================
        # VIEW 1: Front Elevation (Made using TEXT)
        # =========================================================================
        logger.info("Generating View 1: Front Elevation (using pure text prompt)...")
        effective_prompt = prompt.strip() if prompt and prompt.strip() else "Modern luxury architectural villa with 3 floors"
        v1_prompt = (
            f"Front elevation architectural realization: {effective_prompt}. "
            f"Architectural style: {style}. Lighting: {lighting}. "
            "Ultra-photorealistic front exterior facade perspective, sharp rectilinear geometry, crisp glass curtain walls, "
            "warm teak timber vertical slats, textured architectural concrete, Hasselblad 35mm architectural tilt-shift lens, "
            "straight vertical lines, physically accurate global illumination, masterpiece quality."
        )
        v1_neg = "cartoon, anime, low resolution, blurry, distorted geometry, deformed architecture, sketch lines"

        v1_img, seed_v1, _ = self.pm.generate(
            model="qwen",
            prompt=v1_prompt,
            negative_prompt=v1_neg,
            images=[],  # Made strictly using TEXT
            width=w,
            height=h,
            steps=steps,
            cfg=1.0,
            denoise=1.0,
            seed=base_seed
        )

        v1_filename = f"arch_view1_front_{int(time.time())}_{seed_v1}.png"
        v1_path = os.path.join(OUTPUTS_DIR, v1_filename)
        v1_img.save(v1_path, format="PNG")

        _record_view_output({
            "id": v1_filename,
            "filename": v1_filename,
            "file_url": f"/outputs/{v1_filename}",
            "project_id": project_id,
            "task_id": "arch_sketch_to_multiview",
            "task_title": "Sketch to Multi View (Front Elevation)",
            "category": "architecture",
            "prompt": effective_prompt,
            "model": "qwen",
            "seed": seed_v1,
            "width": v1_img.width,
            "height": v1_img.height,
            "timestamp": int(time.time())
        })

        views_output.append({
            "view_id": "front",
            "name": "Front Elevation",
            "description": "Primary architectural realization generated from text prompt",
            "image": v1_img,
            "filepath": v1_path,
            "file_url": f"/outputs/{v1_filename}",
            "seed": seed_v1
        })

        if progress_tracker:
            progress_tracker.set_percentage(20)

        # =========================================================================
        # VIEW 2: Left Side Elevation (Given Sketch and Front)
        # =========================================================================
        logger.info("Generating View 2: Left Side Elevation (given sketch and front render)...")
        v2_prompt = (
            f"Left side elevation (90 degree left exterior profile view). "
            f"Picture 1 is the reference sketch and Picture 2 is the Front Elevation of the exact same building. "
            "Generate the Left Side Elevation of this exact same building. "
            "Strictly preserve identical floor heights, structural volumes, cantilevers, and materials from the Front Elevation in Picture 2 and sketch in Picture 1. "
            f"Captured in {lighting} with consistent atmospheric illumination and landscape integration."
        )
        v2_images = [img for img in [sketch_img, v1_img] if img is not None]

        v2_img, seed_v2, _ = self.pm.generate(
            model="qwen",
            prompt=v2_prompt,
            negative_prompt=v1_neg,
            images=v2_images,  # Given sketch and front
            width=w,
            height=h,
            steps=steps,
            cfg=1.0,
            denoise=1.0,
            seed=base_seed + 1
        )
        v2_filename = f"arch_view2_left_{int(time.time())}_{seed_v2}.png"
        v2_path = os.path.join(OUTPUTS_DIR, v2_filename)
        v2_img.save(v2_path, format="PNG")

        _record_view_output({
            "id": v2_filename,
            "filename": v2_filename,
            "file_url": f"/outputs/{v2_filename}",
            "project_id": project_id,
            "task_id": "arch_sketch_to_multiview",
            "task_title": "Sketch to Multi View (Left Side Elevation)",
            "category": "architecture",
            "prompt": v2_prompt,
            "model": "qwen",
            "seed": seed_v2,
            "width": v2_img.width,
            "height": v2_img.height,
            "timestamp": int(time.time())
        })

        views_output.append({
            "view_id": "left",
            "name": "Left Side Elevation",
            "description": "90 degree left flank perspective conditioned on sketch and front",
            "image": v2_img,
            "filepath": v2_path,
            "file_url": f"/outputs/{v2_filename}",
            "seed": seed_v2
        })

        if progress_tracker:
            progress_tracker.set_percentage(40)

        # =========================================================================
        # VIEW 3: Right Side Elevation (Given Sketch, Front, and Right/Side Context)
        # =========================================================================
        logger.info("Generating View 3: Right Side Elevation (given sketch, front, and side context)...")
        v3_prompt = (
            f"Right side elevation (90 degree right exterior profile view). "
            f"Picture 1 is the sketch, Picture 2 is the Front Elevation, and Picture 3 is the Left Elevation. "
            "Generate the Right Side Elevation of this exact same building. "
            "Strictly maintain matching architectural language, exterior cladding, floor boundaries, and window mullions from Picture 2 and 3."
        )
        v3_images = [img for img in [sketch_img, v1_img, v2_img] if img is not None]

        v3_img, seed_v3, _ = self.pm.generate(
            model="qwen",
            prompt=v3_prompt,
            negative_prompt=v1_neg,
            images=v3_images,  # Given sketch, front, and side context
            width=w,
            height=h,
            steps=steps,
            cfg=1.0,
            denoise=1.0,
            seed=base_seed + 2
        )
        v3_filename = f"arch_view3_right_{int(time.time())}_{seed_v3}.png"
        v3_path = os.path.join(OUTPUTS_DIR, v3_filename)
        v3_img.save(v3_path, format="PNG")

        _record_view_output({
            "id": v3_filename,
            "filename": v3_filename,
            "file_url": f"/outputs/{v3_filename}",
            "project_id": project_id,
            "task_id": "arch_sketch_to_multiview",
            "task_title": "Sketch to Multi View (Right Side Elevation)",
            "category": "architecture",
            "prompt": v3_prompt,
            "model": "qwen",
            "seed": seed_v3,
            "width": v3_img.width,
            "height": v3_img.height,
            "timestamp": int(time.time())
        })

        views_output.append({
            "view_id": "right",
            "name": "Right Side Elevation",
            "description": "90 degree right flank perspective conditioned on sketch, front, and side",
            "image": v3_img,
            "filepath": v3_path,
            "file_url": f"/outputs/{v3_filename}",
            "seed": seed_v3
        })

        if progress_tracker:
            progress_tracker.set_percentage(60)

        # =========================================================================
        # VIEW 4: Back Elevation (180 deg Rear)
        # =========================================================================
        logger.info("Generating View 4: Back Elevation (conditioned on front, sketch, and side elevations)...")
        v4_prompt = (
            f"Rear back elevation (180 degree rear garden/patio view). "
            f"Picture 1 is the Front Elevation of a {style} building. "
            "Generate the Rear Back Elevation of this exact same building. "
            "Depict the rear facade with private outdoor terrace, seamless continuation of materials, floor bands, and glass curtain walls, "
            f"illuminated in {lighting} with reflecting pool and landscaping."
        )
        v4_images = [img for img in [v1_img, sketch_img] if img is not None]

        v4_img, seed_v4, _ = self.pm.generate(
            model="qwen",
            prompt=v4_prompt,
            negative_prompt=v1_neg,
            images=v4_images,
            width=w,
            height=h,
            steps=steps,
            cfg=1.0,
            denoise=1.0,
            seed=base_seed + 3
        )
        v4_filename = f"arch_view4_back_{int(time.time())}_{seed_v4}.png"
        v4_path = os.path.join(OUTPUTS_DIR, v4_filename)
        v4_img.save(v4_path, format="PNG")

        _record_view_output({
            "id": v4_filename,
            "filename": v4_filename,
            "file_url": f"/outputs/{v4_filename}",
            "project_id": project_id,
            "task_id": "arch_sketch_to_multiview",
            "task_title": "Sketch to Multi View (Back Elevation)",
            "category": "architecture",
            "prompt": v4_prompt,
            "model": "qwen",
            "seed": seed_v4,
            "width": v4_img.width,
            "height": v4_img.height,
            "timestamp": int(time.time())
        })

        views_output.append({
            "view_id": "back",
            "name": "Back Elevation",
            "description": "180 degree rear facade overlooking private courtyard/pool",
            "image": v4_img,
            "filepath": v4_path,
            "file_url": f"/outputs/{v4_filename}",
            "seed": seed_v4
        })

        if progress_tracker:
            progress_tracker.set_percentage(80)

        # =========================================================================
        # VIEW 5: Top / Bird's-Eye View
        # =========================================================================
        logger.info("Generating View 5: Top / Bird's-Eye View...")
        v5_prompt = (
            f"Top / Bird's-Eye Drone Aerial Perspective looking directly down at this exact building. "
            f"Picture 1 is the authoritative Front Elevation of the {style} building. "
            "Reveal the rooftop architectural geometry: green roof gardens, recessed skylights, swimming pool deck, "
            "and site plan layout with strict volumetric alignment to Picture 1."
        )
        v5_images = [v1_img]

        v5_img, seed_v5, _ = self.pm.generate(
            model="qwen",
            prompt=v5_prompt,
            negative_prompt=v1_neg,
            images=v5_images,
            width=w,
            height=h,
            steps=steps,
            cfg=1.0,
            denoise=1.0,
            seed=base_seed + 4
        )
        v5_filename = f"arch_view5_top_{int(time.time())}_{seed_v5}.png"
        v5_path = os.path.join(OUTPUTS_DIR, v5_filename)
        v5_img.save(v5_path, format="PNG")

        _record_view_output({
            "id": v5_filename,
            "filename": v5_filename,
            "file_url": f"/outputs/{v5_filename}",
            "project_id": project_id,
            "task_id": "arch_sketch_to_multiview",
            "task_title": "Sketch to Multi View (Top View)",
            "category": "architecture",
            "prompt": v5_prompt,
            "model": "qwen",
            "seed": seed_v5,
            "width": v5_img.width,
            "height": v5_img.height,
            "timestamp": int(time.time())
        })

        views_output.append({
            "view_id": "top",
            "name": "Top / Bird's-Eye View",
            "description": "Aerial rooftop orthographic perspective showing site and roof terraces",
            "image": v5_img,
            "filepath": v5_path,
            "file_url": f"/outputs/{v5_filename}",
            "seed": seed_v5
        })

        if progress_tracker:
            progress_tracker.finish()

        return views_output
