"""
Domain-Specific Architectural, Interior, and Product Prompt Enhancer
Transforms simple user prompts into museum-grade architectural visual briefs.
"""

import re
from typing import Optional

DEFAULT_NEGATIVE_PROMPT = (
    "blurry, distorted geometry, leaning walls, CGI plastic look, cartoon, anime, "
    "low resolution, bad perspective, deformed architecture, oversaturated, amateur render, watermark, text"
)

STYLE_PRESETS = {
    "Modern Luxury Villa": (
        "ultra-contemporary luxury architecture, cantilevered volumes, floor-to-ceiling glass curtain walls, "
        "board-formed concrete, warm teak vertical louvers, architectural landscape with reflecting infinity pool"
    ),
    "Minimalist Japandi": (
        "Japandi aesthetic blending Scandinavian functionality and Japanese rustic minimalism, light white oak timber, "
        "textured lime-wash plaster, organic linen drapery, bonsai foliage, calm meditative natural ambiance"
    ),
    "Industrial Brutalist": (
        "monolithic brutalist architectural language, raw exposed aggregate concrete, blackened steel structural framing, "
        "double-height expansive volumes, oversized crittall grid windows, moody atmospheric raking light"
    ),
    "Biophilic Contemporary": (
        "biophilic design harmoniously integrating living flora into architecture, vertical green living walls, "
        "natural limestone masonry, cascading rooftop gardens, organic curved wooden forms, soft filtered skylight illumination"
    ),
    "Mid-Century Modern": (
        "authentic mid-century modern design, post-and-beam construction, tongue-and-groove cedar ceiling, "
        "terrazzo flooring, classic Eames-era tailored furnishings, expansive clerestory windows"
    ),
    "Scandinavian Warm": (
        "Scandinavian warmth, bleached ash wood herringbone flooring, soft neutral greige palette, tactile boucle and shearling, "
        "sculptural ceramics, delicate warm cove lighting, crisp morning Nordic daylight"
    )
}

LIGHTING_PRESETS = {
    "Twilight Golden Hour": (
        "captured during cinematic twilight golden hour, warm low-angle raking sun rays, delicate long shadows, "
        "rich cobalt blue sky transitioning into golden amber horizon, warm 2700K interior lights radiating welcoming luminescence"
    ),
    "Overcast Soft Daylight": (
        "soft diffused overcast architectural daylight, perfectly balanced shadowless illumination, "
        "natural color accuracy, subtle ambient occlusion in crevices and facade reveals"
    ),
    "Cinematic Architectural Dusk": (
        "dramatic architectural dusk, deep indigo twilight atmosphere, illuminated exterior facade uplighting, "
        "glowing architectural pools, interior warmly lit like a lantern, high dynamic range reflections"
    ),
    "Warm Interior Accent": (
        "cozy ambient evening atmosphere, hidden recessed LED ceiling coves, soft pendant lamp halos, "
        "warm candle-like 2500K illumination casting gentle specular glints on polished surfaces"
    ),
    "Crisp High Noon": (
        "bright clear high-noon sunlight, sharp dramatic geometric shadows cast across architectural surfaces, "
        "vibrant blue sky, high-contrast crisp architectural lines"
    )
}

CAMERA_AND_OPTICAL_TOKENS = (
    "shot on Hasselblad 35mm optical lens, subtle 10mm wide filter, smooth natural background bokeh, "
    "physically accurate depth of field, balanced cinematic lighting, soft ambient occlusion, "
    "ray-traced global illumination, crisp micro-details, ultra-sharp focus, HDR color grading, photorealistic 8k render"
)


def enhance_prompt(prompt: str, style: str = "", lighting: str = "") -> str:
    """
    Expands user prompt with professional lighting, camera optics (bokeh, 10mm filter),
    and rendering quality WITHOUT altering the user's architectural or structural design.
    """
    cleaned = prompt.strip() if prompt else ""
    lighting_desc = LIGHTING_PRESETS.get(lighting, "")

    tokens = []
    if lighting_desc:
        tokens.append(lighting_desc)
    tokens.append(CAMERA_AND_OPTICAL_TOKENS)

    enhancement_string = ", ".join(tokens)

    if not cleaned:
        return f"Photorealistic 8k render, {enhancement_string}."

    if cleaned.endswith("."):
        return f"{cleaned} {enhancement_string}."
    return f"{cleaned}, {enhancement_string}."
