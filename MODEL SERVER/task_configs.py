"""
Task Configurations and Prompt Engineering Engine for Architecture, Interior & Furniture
Contains optimal configurations, dimensions, guidance, and domain prompts for all 12 tasks.
"""

from typing import Dict, Any, List

TASK_CATEGORIES = {
    "architecture": "Architecture",
    "interior": "Interior Designing",
    "furniture": "Furniture Rendering"
}

TASKS: Dict[str, Dict[str, Any]] = {
    # -------------------------------------------------------------------------
    # 1. ARCHITECTURE
    # -------------------------------------------------------------------------
    "arch_text_to_arch": {
        "id": "arch_text_to_arch",
        "category": "architecture",
        "title": "Text to Arch",
        "description": "Generate luxury photorealistic architectural exterior structures from descriptive text prompts.",
        "example_folder": r"EXAMPLE\ARCH\T2A",
        "example_prompt": "",
        "default_model": "qwen",
        "default_width": 1536,
        "default_height": 1024,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 1.0,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": False,
        "system_prompt_template": (
            "Ultra-photorealistic 8k architectural exterior photograph: {user_prompt}. "
            "Designed in {style} style during {lighting}. "
            "Showcases clean architectural lines, realistic facade materials, "
            "and natural lighting. Shot with 35mm architectural lens, perfectly straight vertical lines, "
            "physically accurate optical reflections, atmospheric daylight shadows, high quality."
        ),
        "negative_prompt": (
            "blurry, distorted geometry, leaning walls, CGI plastic look, cartoon, anime, low resolution, watermark, bad proportions, amateur render"
        )
    },

    "arch_sketch_to_arch": {
        "id": "arch_sketch_to_arch",
        "category": "architecture",
        "title": "Sketch to Image Arch Render",
        "description": "Convert 2D pencil, CAD, or digital architectural sketches into high-fidelity 3D exterior renders.",
        "example_folder": r"EXAMPLE\ARCH\S2A",
        "example_input_filename": "Input.jpg",
        "example_prompt": "Photorealistically and professionally render this architectural sketch with high accuracy, preserving the building geometry, facade proportions, and structural massing.",
        "default_model": "qwen",
        "default_width": 1024,
        "default_height": 1344,
        "default_steps": 28,
        "default_cfg": 1.0,
        "default_denoise": 1.0,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is a precise architectural elevation sketch. "
            "Convert all line art and pencil strokes from Picture 1 into a live, physical three-dimensional architectural building in {style} style during {lighting}. "
            "{user_prompt}. "
            "Translate sketch lines into authentic materials without changing the geometry: smooth architectural concrete, structural steel beams, "
            "and pristine transparent glass curtain walls. "
            "Natural lighting, 35mm tilt-shift lens, sharp straight vertical lines, photorealistic specular highlights and depth."
        ),
        "negative_prompt": (
            "sketch lines, pencil strokes, drawing, cartoon, anime, wireframe, low-res, muddy textures, deformed architecture, distorted perspective, watermark"
        )
    },

    "arch_image_edit": {
        "id": "arch_image_edit",
        "category": "architecture",
        "title": "Architecture Image Editing",
        "description": "Perform precise architectural modifications, material substitutions, facade alterations, or lighting shifts on existing renders.",
        "example_folder": r"EXAMPLE\ARCH\AIE",
        "example_input_filename": "input.png",
        "example_prompt": "",
        "default_model": "qwen",
        "default_width": 1088,
        "default_height": 1440,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 0.52,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is an existing architectural photograph. "
            "Modify Picture 1 according to the instruction: {user_prompt}. "
            "Retain the exact camera perspective, structural alignment, building envelope, and horizon line of Picture 1, "
            "seamlessly rendering the new modifications with realistic architectural materials, accurate shadows, reflections, and natural lighting."
        ),
        "negative_prompt": (
            "blurry, artifacts, seam lines, distorted proportions, low quality, mismatched lighting, cartoon, plastic look, warped perspective"
        )
    },

    "arch_enhance_render": {
        "id": "arch_enhance_render",
        "category": "architecture",
        "title": "Enhance the Details of the Render",
        "description": "Ultra-sharp latent detail enhancement and micro-texture refinement for architectural visuals.",
        "example_folder": r"EXAMPLE\ARCH\ETDOTR",
        "example_input_filename": "input.png",
        "example_prompt": "Enhance and sharpen architectural micro-textures, crisp concrete grain, clean glass reflections, ultra-high resolution masonry detailing, and subtle ambient shadows without altering the building geometry.",
        "default_model": "qwen",
        "default_width": 1088,
        "default_height": 1440,
        "default_steps": 20,
        "default_cfg": 1.0,
        "default_denoise": 0.38,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": True,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is a base architectural render. "
            "Perform ultra-high-definition latent detail enhancement: {user_prompt}. "
            "Dramatically enhance micro-textures: tactile concrete pores, wood fiber grain, glass fresnel reflections, "
            "razor-sharp window mullions, crisp foliage definition, subtle ambient occlusion in corners, and pristine optical clarity without altering the architecture."
        ),
        "negative_prompt": (
            "oversharpened halos, noise artifacts, structural distortion, blurred edges, cartoon, plastic sheen, altered geometry"
        )
    },

    # -------------------------------------------------------------------------
    # 2. INTERIOR DESIGNING
    # -------------------------------------------------------------------------
    "interior_sketch_to_design": {
        "id": "interior_sketch_to_design",
        "category": "interior",
        "title": "Sketch to Interior Design",
        "description": "Transform interior perspective sketches and floor plans into magazine-cover quality interior spaces.",
        "example_folder": r"EXAMPLE\INTERIOR DESIGNING\S2ID",
        "example_input_filename": "Input.jpg",
        "example_prompt": "Photorealistically and professionally render this interior sketch, preserving the exact room layout, perspective, and architectural boundaries.",
        "default_model": "qwen",
        "default_width": 1280,
        "default_height": 1216,
        "default_steps": 26,
        "default_cfg": 1.0,
        "default_denoise": 1.0,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is an interior room perspective sketch. "
            "Convert the sketch in Picture 1 into an ultra-photorealistic interior photograph in {style} style during {lighting}. "
            "{user_prompt}. "
            "Render plush tactile fabrics, authentic materials, natural daylight, architectural balance, "
            "preserving room boundaries and perspective from Picture 1."
        ),
        "negative_prompt": (
            "sketch lines, pencil marks, cartoon, unrealistic layout, warped furniture, bad lighting, low resolution, blurry, watermark"
        )
    },

    "interior_room_new_look": {
        "id": "interior_room_new_look",
        "category": "interior",
        "title": "Give Your Room New Look",
        "description": "Restyle existing rooms with modern color palettes, materials, lighting, and decor while retaining wall bounds.",
        "example_folder": r"EXAMPLE\INTERIOR DESIGNING\GYRNL",
        "example_input_filename": "Input.avif",
        "example_prompt": "",
        "default_model": "qwen",
        "default_width": 1120,
        "default_height": 1408,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 0.65,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is a photo of an existing interior room. "
            "Give this room an immaculate new look: {user_prompt}. "
            "Maintain the room's core architectural boundaries, ceiling height, and window placement from Picture 1, "
            "while upgrading all surfaces to high-end finishes, modern furniture, elegant accent lighting, and serene cohesive aesthetic in {style} style."
        ),
        "negative_prompt": (
            "clutter, mess, dated furniture, distorted walls, weird perspective, blurry, dark murky lighting, low-res"
        )
    },

    "interior_image_edit": {
        "id": "interior_image_edit",
        "category": "interior",
        "title": "Interior Design Image Editing",
        "description": "Targeted interior edits: change furniture, alter wall textures, swap rugs, or modify illumination moods.",
        "example_folder": r"EXAMPLE\INTERIOR DESIGNING\IDIE",
        "example_input_filename": "2ef4a26e-36a2-4844-a69f-01b5045ce54e.png",
        "example_prompt": "",
        "default_model": "qwen",
        "default_width": 1568,
        "default_height": 992,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 0.52,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is an interior design photograph. "
            "Modify Picture 1 according to the instruction: {user_prompt}. "
            "Preserve the room layout, structural walls, window positions, ceiling lines, and perspective of Picture 1. "
            "Seamlessly incorporate the specified design changes with photorealistic interior materials, balanced natural daylight, and accurate ambient reflections."
        ),
        "negative_prompt": (
            "jarring contrast, floating objects, mismatched lighting, low quality, warped perspective, blur, artifacts, cartoon"
        )
    },

    "interior_fully_redesign": {
        "id": "interior_fully_redesign",
        "category": "interior",
        "title": "Fully Redesign My Room",
        "description": "Total architectural overhaul of empty, cluttered, or dated spaces into luxury high-end interiors.",
        "example_folder": r"EXAMPLE\INTERIOR DESIGNING\FRMR",
        "example_input_filename": "Input.webp",
        "example_prompt": "Comprehensive high-end interior architectural redesign, preserving the core room dimensions, window openings, and architectural envelope with luxury false ceiling and ambient lighting.",
        "default_model": "qwen",
        "default_width": 1568,
        "default_height": 992,
        "default_steps": 28,
        "default_cfg": 1.0,
        "default_denoise": 0.90,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 shows the current space. "
            "Execute a comprehensive high-end architectural redesign: {user_prompt}. "
            "Completely renovate the space in {style} style under {lighting}. "
            "Introduce architectural false ceiling with indirect cove LED strips, premium Italian furnishings, "
            "bespoke wall paneling, natural stone accents, designer pendant fixtures, and impeccable luxury staging."
        ),
        "negative_prompt": (
            "unfinished, messy, cluttered, amateur renovation, distorted angles, low resolution, CGI fake plastic look, cartoon"
        )
    },

    # -------------------------------------------------------------------------
    # 3. FURNITURE RENDERING
    # -------------------------------------------------------------------------
    "furniture_sketch_to_render": {
        "id": "furniture_sketch_to_render",
        "category": "furniture",
        "title": "Sketch to Furniture",
        "description": "Transform product design sketches of chairs, tables, and cabinets into studio-lit commercial product renders.",
        "example_folder": r"EXAMPLE\FURNITURE\S2F",
        "example_input_filename": "Input.jpg",
        "example_prompt": "Commercial studio product render, photorealistic product photography of the furniture piece, pristine cyclorama background, studio softbox lighting, 8k resolution, crisp textures, ultra-detailed materiality.",
        "default_model": "qwen",
        "default_width": 1024,
        "default_height": 1024,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 1.0,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is an industrial furniture design sketch. "
            "Create a pristine commercial studio product photograph of the exact furniture piece in Picture 1: {user_prompt}. "
            "Render authentic tactile materiality with visible natural grain, suppleness and fine perimeter stitching. "
            "Isolated on clean neutral cyclorama studio backdrop with 3-point softbox diffused lighting, subtle contact shadow, 8k crisp resolution."
        ),
        "negative_prompt": (
            "sketch lines, pencil marks, cartoon, rough edges, distorted proportions, low quality, messy background, watermark"
        )
    },

    "furniture_edit": {
        "id": "furniture_edit",
        "category": "furniture",
        "title": "Furniture Editing",
        "description": "Modify materials, upholstery, wood finishes, metal accents, or structural components of furniture pieces.",
        "example_folder": r"EXAMPLE\FURNITURE\FE",
        "example_input_filename": "input.png",
        "example_prompt": "Commercial studio product render, modify furniture piece with photorealistic materiality, authentic fabric texture and refined studio lighting: ",
        "default_model": "qwen",
        "default_width": 1024,
        "default_height": 1024,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 0.48,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": True,
        "system_prompt_template": (
            "Picture 1 is a furniture studio photograph. "
            "Modify the furniture in Picture 1: {user_prompt}. "
            "Retain the exact silhouette, frame dimensions, angle, and studio lighting of Picture 1, "
            "seamlessly replacing the specified materials with photorealistic sheen, fabric texture, and authentic light response."
        ),
        "negative_prompt": (
            "distorted shape, floating parts, mismatched perspective, blur, low quality, artifacts"
        )
    },

    "furniture_text_to_render": {
        "id": "furniture_text_to_render",
        "category": "furniture",
        "title": "Text-Furniture",
        "description": "Generate bespoke furniture prototypes and cabinetry from detailed textual descriptions.",
        "example_folder": r"EXAMPLE\FURNITURE\T2F",
        "example_prompt": "Commercial studio product render, high-end designer furniture piece, photorealistic studio photography, clean neutral cyclorama backdrop, soft 3-point studio lighting, sharp focus, 8k tactile materials.",
        "default_model": "qwen",
        "default_width": 1536,
        "default_height": 1024,
        "default_steps": 25,
        "default_cfg": 1.0,
        "default_denoise": 1.0,
        "default_sampler": "euler",
        "default_scheduler": "simple",
        "tiled_vae": False,
        "requires_image": False,
        "system_prompt_template": (
            "Ultra-photorealistic commercial studio product photograph: {user_prompt}. "
            "Crafted with high-end designer materials, soft 3-point studio lighting, "
            "isolated on clean neutral cyclorama studio backdrop, physically accurate reflections and shadows, 8k resolution."
        ),
        "negative_prompt": (
            "cheap materials, plastic, blurry, distorted cabinets, uneven shelves, bad lighting, cartoon, low resolution, watermark"
        )
    }
}

def get_task_config(task_id: str) -> Dict[str, Any]:
    """Retrieve full configuration dictionary for a given task ID."""
    if task_id not in TASKS:
        raise KeyError(f"Task '{task_id}' not recognized. Available: {list(TASKS.keys())}")
    return TASKS[task_id]

def build_task_prompt(task_id: str, user_prompt: str, style: str = "", lighting: str = "") -> str:
    """Compose the final system-engineered prompt for the given task."""
    cfg = get_task_config(task_id)
    tmpl = cfg["system_prompt_template"]
    style_str = style.strip() if (style and style.strip().lower() != "auto") else "contemporary architectural"
    lighting_str = lighting.strip() if (lighting and lighting.strip().lower() != "auto") else "natural soft daylight"
    return tmpl.format(
        user_prompt=user_prompt.strip(),
        style=style_str,
        lighting=lighting_str
    )
