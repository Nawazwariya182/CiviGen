"""
Qwen Image 2.1 Pipeline for Architectural, Interior & Furniture Synthesis
Utilizes Qwen3-VL 8B text-vision encoder and Qwen Image 2.1 DiT transformer.
Features sequential loading and CPU offloading to maintain ~0 MB idle VRAM.
"""

import os
import sys
import random
import logging
from typing import List, Optional, Tuple, Dict, Any

import torch
import numpy as np
from PIL import Image

# Dynamic resolution of ComfyUI core modules without hardcoding user folders
def find_comfyui_path() -> str:
    env_path = os.environ.get("COMFYUI_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    candidates = [
        os.path.join(base_dir, "ComfyUI"),
        os.path.join(base_dir, "ComfyUI_core"),
        os.path.join(base_dir, "engine", "ComfyUI"),
        os.path.expanduser("~/Documents/ComfyUI/ComfyUI_core"),
        os.path.expanduser("~/Documents/ComfyUI"),
        os.path.expanduser("~/ComfyUI"),
        r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\ComfyUI_core",
        r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI",
    ]
    for c in candidates:
        if c and os.path.exists(c) and os.path.exists(os.path.join(c, "comfy")):
            return c
        elif c and os.path.exists(c) and os.path.exists(os.path.join(c, "ComfyUI_core", "comfy")):
            return os.path.join(c, "ComfyUI_core")
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return os.path.join(base_dir, "ComfyUI")

COMFY_PATH = find_comfyui_path()
if COMFY_PATH not in sys.path:
    sys.path.insert(0, COMFY_PATH)

import comfy.sd
import comfy.utils
import comfy.sample
import comfy.model_management
from comfy_extras.nodes_qwen import TextEncodeQwenImage21

try:
    from progress_tracker import progress_tracker
except ImportError:
    try:
        from .progress_tracker import progress_tracker
    except Exception:
        progress_tracker = None

logger = logging.getLogger("QwenPipeline")

# Default model weight locations in AI ARCH\MODELS\Qwen
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QWEN_DIR = os.path.join(BASE_DIR, "MODELS", "Qwen")

QWEN_UNET_PATH = os.path.join(QWEN_DIR, "qwen_image_2.1_int8_convrot.safetensors")
QWEN_CLIP_PATH = os.path.join(QWEN_DIR, "qwen3vl_8b_int8_convrot.safetensors")
QWEN_VAE_PATH = os.path.join(QWEN_DIR, "qwen_image_2.1_vae_bf16.safetensors")

LOW_VRAM_MODE = os.environ.get("CIVIGEN_LOW_VRAM", "0").lower() in ("1", "true", "yes")


class QwenPipeline:
    def __init__(self,
                 unet_path: str = QWEN_UNET_PATH,
                 clip_path: str = QWEN_CLIP_PATH,
                 vae_path: str = QWEN_VAE_PATH):
        self.unet_path = unet_path
        self.clip_path = clip_path
        self.vae_path = vae_path
        
        self.model = None
        self.clip = None
        self.vae = None
        logger.info(f"QwenPipeline initialized with weights in {QWEN_DIR}")

    def _load_clip(self):
        if self.clip is None:
            logger.info("Loading Qwen3-VL 8B text/vision encoder...")
            self.clip = comfy.sd.load_clip(
                ckpt_paths=[self.clip_path],
                clip_type=comfy.sd.CLIPType.QWEN_IMAGE
            )
        return self.clip

    def _load_unet(self):
        if self.model is None:
            logger.info("Loading Qwen Image 2.1 DiT transformer...")
            self.model = comfy.sd.load_diffusion_model(self.unet_path)
        return self.model

    def _load_vae(self):
        if self.vae is None:
            logger.info("Loading Qwen Image 2.1 VAE...")
            sd, meta = comfy.utils.load_torch_file(self.vae_path, return_metadata=True)
            self.vae = comfy.sd.VAE(sd=sd, metadata=meta)
            self.vae.throw_exception_if_invalid()
        return self.vae

    def unload_all(self):
        """Offload models and clear GPU cache to ensure ~0 MB idle VRAM"""
        logger.info("Unloading Qwen models and clearing VRAM cache...")
        self.model = None
        self.clip = None
        self.vae = None
        comfy.model_management.unload_all_models()
        comfy.model_management.soft_empty_cache()
        import gc
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()

    def generate(self,
                 prompt: str,
                 negative_prompt: str = "",
                 images: Optional[List[Image.Image]] = None,
                 width: int = 1024,
                 height: int = 1024,
                 steps: int = 25,
                 cfg: float = 1.0,
                 denoise: float = 1.0,
                 seed: int = -1,
                 sampler_name: str = "euler",
                 scheduler: str = "simple",
                 tiled_vae: bool = False,
                 is_subtask: bool = False) -> Tuple[Image.Image, int, Dict[str, Any]]:
        """
        Executes generation / editing with full sequential memory offloading.
        """
        if seed is None or seed < 0:
            seed = random.randint(1, 2**32 - 1)

        width = max(256, (width // 32) * 32)
        height = max(256, (height // 32) * 32)
        images = images or []

        # Step 1: Text & Image Conditioning using Qwen3-VL
        clip = self._load_clip()
        vae = self._load_vae()

        image_dict = {}
        for idx, img in enumerate(images[:10], start=1):
            img_rgb = img.convert("RGB")
            if max(img_rgb.size) > 1024:
                img_rgb = img_rgb.copy()
                img_rgb.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
            np_img = np.array(img_rgb).astype(np.float32) / 255.0
            tensor_img = torch.from_numpy(np_img).unsqueeze(0)
            image_dict[f"image_{idx}"] = tensor_img

        logger.info(f"Encoding prompt with {len(images)} reference images: '{prompt[:60]}...'")
        
        with torch.inference_mode():
            res = TextEncodeQwenImage21.execute(
                clip=clip,
                prompt=prompt,
                negative_prompt=negative_prompt or "",
                vae=vae,
                resolution=max(width, height) if images else 1024,
                images=image_dict
            )
        positive = res[0]
        negative = res[1]
        out_latent = res[2]["samples"]

        if len(images) == 0:
            latent_channels = 64
            latent_h = height // 16
            latent_w = width // 16
            latent = torch.zeros([1, latent_channels, latent_h, latent_w], device=comfy.model_management.intermediate_device())
        else:
            # Check if reference latents were generated during conditioning
            ref_latents = []
            try:
                if len(positive) > 0 and len(positive[0]) > 1:
                    ref_latents = positive[0][1].get("reference_latents", [])
            except Exception:
                ref_latents = []

            # If partial denoise (< 1.0) is requested and input latent exists, start from the real image latent!
            if denoise < 1.0 and len(ref_latents) > 0 and ref_latents[0] is not None:
                latent = ref_latents[0]
                logger.info(f"Using reference latent from input image for img2img edit at denoise={denoise}")
            else:
                latent = out_latent

        # Free Text Encoder from GPU before sampling to conserve VRAM
        comfy.model_management.soft_empty_cache()
        if LOW_VRAM_MODE or os.environ.get("CIVIGEN_LOW_VRAM", "0").lower() in ("1", "true", "yes"):
            logger.info("[LOW-VRAM] Aggressive CPU offload: purging text-vision encoder from VRAM...")
            self.clip = None
            try:
                comfy.model_management.unload_all_models()
                comfy.model_management.soft_empty_cache()
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
                    torch.cuda.ipc_collect()
            except Exception as e:
                logger.warning(f"Low-VRAM offload notice: {e}")

        # Step 2: Sampling with Qwen DiT
        model = self._load_unet()
        logger.info(f"Sampling {steps} steps (CFG: {cfg}, Denoise: {denoise}, Seed: {seed})...")

        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)

        noise = comfy.sample.prepare_noise(latent, seed)

        def step_callback(step, x0, x, total_steps):
            if progress_tracker is not None:
                progress_tracker.update_step(step, total_steps)

        if progress_tracker is not None and not progress_tracker.is_generating and not is_subtask:
            progress_tracker.start(task_id="qwen", total_steps=steps)

        samples = comfy.sample.sample(
            model=model,
            noise=noise,
            steps=steps,
            cfg=cfg,
            sampler_name=sampler_name,
            scheduler=scheduler,
            positive=positive,
            negative=negative,
            latent_image=latent,
            denoise=denoise,
            disable_pbar=False,
            callback=step_callback,
            seed=seed
        )

        # Offload DiT to CPU so VAE has full GPU VRAM
        try:
            comfy.model_management.unload_all_models()
            comfy.model_management.soft_empty_cache()
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
                torch.cuda.ipc_collect()
        except Exception as e:
            logger.warning(f"Memory cleanup notice: {e}")

        # Step 3: VAE Decode (Tiled decode prevents 12GB VRAM exhaustion on 1024x1024)
        vae = self._load_vae()
        logger.info("Decoding latents to RGB image via tiled VAE...")
        try:
            decoded = vae.decode_tiled(samples)
        except Exception as e:
            logger.warning(f"Tiled VAE decode fallback: {e}")
            decoded = vae.decode(samples)

        if not is_subtask and progress_tracker is not None:
            try:
                progress_tracker.set_finalizing()
            except Exception:
                pass

        decoded = decoded.detach().cpu().numpy()
        # Always slice first 3 channels (:3) to guarantee pure RGB mode
        img_array = (decoded[0, :, :, :3] * 255.0).clip(0, 255).astype(np.uint8)
        output_image = Image.fromarray(img_array, mode="RGB")

        if not is_subtask and progress_tracker is not None:
            try:
                progress_tracker.finish()
            except Exception:
                pass

        meta = {
            "model": "qwen_image_2.1",
            "seed": seed,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "width": output_image.width,
            "height": output_image.height,
            "steps": steps,
            "cfg": cfg,
            "denoise": denoise,
            "sampler": sampler_name,
            "scheduler": scheduler,
            "tiled_vae": tiled_vae
        }

        return output_image, seed, meta
