"""
Pydantic Schemas for Multi-Model Architecture Server
Covers:
1. Native Task API (Architecture, Interior, Furniture)
2. OpenAI / GPT-Compatible APIs (/v1/chat/completions, /v1/images/generations, /v1/images/edits)
3. Direct JSON & MultiView Endpoints
4. System Telemetry & Examples
"""

from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field


# =============================================================================
# 1. Native Task API Schemas
# =============================================================================

class TaskGenerateRequest(BaseModel):
    task_id: str = Field(..., description="ID of the task (e.g. arch_sketch_to_arch, interior_room_new_look)")
    prompt: Optional[str] = Field("", description="Custom prompt or modification instruction")
    style: Optional[str] = Field("Modern Luxury Villa", description="Architectural style preset")
    lighting: Optional[str] = Field("Twilight Golden Hour", description="Atmosphere and lighting preset")
    images_base64: Optional[List[str]] = Field(default=[], description="List of base64 input images (sketch, room photo, etc.)")
    image_urls: Optional[List[str]] = Field(default=[], description="List of file paths or output URLs (/outputs/...)")
    width: Optional[int] = Field(None, description="Output width (overrides task default if specified)")
    height: Optional[int] = Field(None, description="Output height (overrides task default if specified)")
    steps: Optional[int] = Field(None, description="Inference steps")
    cfg: Optional[float] = Field(None, description="Classifier Free Guidance / Flow scale")
    denoise: Optional[float] = Field(None, description="Denoise strength for image-to-image/editing tasks")
    seed: Optional[int] = Field(-1, description="Random seed (-1 for randomized)")
    model: Optional[str] = Field("qwen", description="Model to use: 'qwen' or 'flux'")
    enhance_prompt: Optional[bool] = Field(False, description="Apply architectural prompt enhancement")
    upscale_4k: Optional[bool] = Field(False, description="Run secondary 4K latent tile refiner")
    project_id: Optional[str] = Field("PRJ-1001", description="Project ID for grouping assets")


class TaskGenerateResponse(BaseModel):
    success: bool
    task_id: str
    task_title: str
    model: str
    seed: int
    prompt_used: str
    width: int
    height: int
    generation_time_ms: float
    image_base64: str
    file_url: Optional[str] = None
    metadata: Dict[str, Any] = {}


# =============================================================================
# 2. MultiView Elevation Schemas
# =============================================================================

class MultiViewAngleItem(BaseModel):
    view_id: str
    name: str
    description: str
    file_url: str
    image_base64: str
    seed: int


class SketchMultiViewRequest(BaseModel):
    sketch_base64: Optional[str] = Field("", description="Optional base64 encoded architectural sketch")
    prompt: Optional[str] = Field("Modern luxury villa with 3 floors", description="Architectural text prompt for Front Elevation")
    style: Optional[str] = Field("Modern Luxury Villa", description="Architectural style")
    lighting: Optional[str] = Field("Twilight Golden Hour", description="Lighting conditions")
    steps: Optional[int] = Field(28, description="Inference steps per perspective")
    seed: Optional[int] = Field(-1, description="Base seed for structural locking")
    project_id: Optional[str] = Field("PRJ-1001", description="Project ID for grouping assets")


class SketchMultiViewResponse(BaseModel):
    success: bool
    views: List[MultiViewAngleItem]
    execution_time_ms: float
    metadata: Dict[str, Any] = {}


# =============================================================================
# 3. Direct JSON & 4K Upscale Schemas
# =============================================================================

class GenerateJsonRequest(BaseModel):
    model: str = Field("qwen", description="'qwen' or 'flux'")
    prompt: str = Field(..., description="Generation prompt")
    negative_prompt: Optional[str] = Field("", description="Negative prompt")
    enhance_prompt: Optional[bool] = Field(False, description="Enhance prompt automatically")
    images_base64: Optional[List[str]] = Field(default=[], description="Input reference images in base64")
    width: int = Field(1024, ge=256, le=3840)
    height: int = Field(1024, ge=256, le=3840)
    steps: int = Field(20, ge=1, le=100)
    cfg: float = Field(1.0, ge=0.5, le=15.0)
    denoise: float = Field(1.0, ge=0.0, le=1.0)
    seed: int = Field(-1)
    sampler_name: str = Field("euler")
    scheduler: str = Field("simple")
    tiled_vae: bool = Field(False)
    upscale_4k: bool = Field(False)


class GenerateResponse(BaseModel):
    success: bool
    model: str
    seed: int
    prompt_used: str
    width: int
    height: int
    generation_time_ms: float
    image_base64: str
    metadata: Dict[str, Any] = {}


class Upscale4kRequest(BaseModel):
    image_base64: str = Field(..., description="Input image in base64 to upscale to 4K UHD")
    target_width: Optional[int] = None
    target_height: Optional[int] = None


# =============================================================================
# 4. OpenAI / GPT-Style API Compatibility Schemas
# =============================================================================

class OpenAIChatMessageContentItem(BaseModel):
    type: str = Field(..., description="'text' or 'image_url'")
    text: Optional[str] = None
    image_url: Optional[Dict[str, str]] = None


class OpenAIChatMessage(BaseModel):
    role: str = Field(..., description="'user', 'assistant', or 'system'")
    content: Union[str, List[OpenAIChatMessageContentItem]]


class OpenAIChatCompletionRequest(BaseModel):
    model: str = Field("qwen-image-2.1", description="Model identifier: 'qwen-image-2.1', 'flux-2-klein'")
    messages: List[OpenAIChatMessage]
    temperature: Optional[float] = Field(1.0)
    n: Optional[int] = Field(1)
    max_tokens: Optional[int] = Field(1024)
    task: Optional[str] = Field(None, description="Optional explicit task_id (e.g. arch_sketch_to_arch)")
    width: Optional[int] = Field(None)
    height: Optional[int] = Field(None)
    steps: Optional[int] = Field(None)
    cfg: Optional[float] = Field(None)
    seed: Optional[int] = Field(None)


class OpenAIChatCompletionChoice(BaseModel):
    index: int = 0
    message: Dict[str, Any]
    finish_reason: str = "stop"


class OpenAIChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[OpenAIChatCompletionChoice]
    usage: Dict[str, int] = {"prompt_tokens": 128, "completion_tokens": 256, "total_tokens": 384}


class OpenAIImageGenerationRequest(BaseModel):
    prompt: str
    model: Optional[str] = Field("qwen-image-2.1")
    n: Optional[int] = Field(1)
    size: Optional[str] = Field("1024x1024", description="e.g. 1024x1024, 1536x1024, 1024x1536")
    quality: Optional[str] = Field("standard")
    response_format: Optional[str] = Field("b64_json", description="'b64_json' or 'url'")


class OpenAIImageEditRequest(BaseModel):
    prompt: str
    image: str = Field(..., description="Base64 encoded input image or image URL")
    model: Optional[str] = Field("qwen-image-2.1")
    n: Optional[int] = Field(1)
    size: Optional[str] = Field("1024x1024")
    response_format: Optional[str] = Field("b64_json")


# =============================================================================
# 5. System Telemetry & Examples Schemas
# =============================================================================

class ExampleItem(BaseModel):
    task_id: str
    category: str
    title: str
    prompt: str
    input_file_url: Optional[str] = None
    output_files_urls: List[str] = []
    has_input: bool


class SystemTelemetryResponse(BaseModel):
    status: str
    cuda_available: bool
    gpu_name: str
    vram_total_gb: float
    vram_allocated_gb: float
    vram_reserved_gb: float
    vram_free_gb: float
    models_ready: List[str]
    tasks_count: int
