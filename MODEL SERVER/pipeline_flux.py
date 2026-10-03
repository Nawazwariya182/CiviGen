"""
Flux.2 Klein (4B) Custom Pipeline
Supports fast, high-quality text-to-image and reference-conditioned generation.
Employs sequential GPU loading and CPU offloading to maintain ~0 MB idle VRAM.
"""

import os
import sys
import random
import logging
import importlib
from typing import List, Optional, Tuple, Dict, Any

import torch
import numpy as np
from PIL import Image

# Ensure ComfyUI core modules can be resolved
COMFY_PATH = r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\ComfyUI_core"
if COMFY_PATH not in sys.path:
    sys.path.insert(0, COMFY_PATH)

import comfy.sd
import comfy.utils
import comfy.sample
import comfy.model_management
import node_helpers

logger = logging.getLogger("FluxPipeline")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FLUX_DIR = os.path.join(BASE_DIR, "MODELS", "Flux")

FLUX_GGUF_PATH = os.path.join(FLUX_DIR, "flux-2-klein-4b-Q5_K_S.gguf")
FLUX_FP8_PATH = r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\models\diffusion_models\flux-2-klein-base-4b-fp8.safetensors"
FLUX_VAE_PATH = os.path.join(FLUX_DIR, "flux2_vae.safetensors")
FLUX_CLIP_PATH = r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\models\text_encoders\qwen_3_4b.safetensors"


class FluxPipeline:
    def __init__(self,
                 unet_path: Optional[str] = None,
                 clip_path: str = FLUX_CLIP_PATH,
                 vae_path: str = FLUX_VAE_PATH):
        if unet_path:
            self.unet_path = unet_path
        elif os.path.exists(FLUX_FP8_PATH):
            self.unet_path = FLUX_FP8_PATH
        else:
            self.unet_path = FLUX_GGUF_PATH

        self.clip_path = clip_path
        self.vae_path = vae_path
        
        self.model = None
        self.clip = None
        self.vae = None
        logger.info(f"FluxPipeline initialized with unet: {self.unet_path}")

    def _load_clip(self):
        if self.clip is None:
            logger.info("Loading Flux2 text encoder...")
            self.clip = comfy.sd.load_clip(
                ckpt_paths=[self.clip_path],
                clip_type=comfy.sd.CLIPType.FLUX2
            )
        return self.clip

    def _load_unet(self):
        if self.model is None:
            if self.unet_path.endswith(".gguf"):
                logger.info(f"Loading Flux2 Klein GGUF model: {self.unet_path}...")
                gguf_module = importlib.import_module("custom_nodes.ComfyUI-GGUF.nodes")
                loader = gguf_module.UnetLoaderGGUF()
                self.model = loader.load_unet(self.unet_path)[0]
            else:
                logger.info(f"Loading Flux2 Klein diffusion model: {self.unet_path}...")
                self.model = comfy.sd.load_diffusion_model(self.unet_path)
        return self.model

    def _load_vae(self):
        if self.vae is None:
            logger.info("Loading Flux2 VAE...")
            sd, meta = comfy.utils.load_torch_file(self.vae_path, return_metadata=True)
            self.vae = comfy.sd.VAE(sd=sd, metadata=meta)
            self.vae.throw_exception_if_invalid()
        return self.vae

    def unload_all(self):
        """Offload models and clear GPU cache to ensure ~0 MB idle VRAM"""
        logger.info("Unloading Flux models and purging GPU VRAM...")
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
                 steps: int = 20,
                 cfg: float = 1.0,
                 denoise: float = 1.0,
                 seed: int = -1,
                 sampler_name: str = "euler",
                 scheduler: str = "simple",
                 tiled_vae: bool = False) -> Tuple[Image.Image, int, Dict[str, Any]]:
        """
        Executes generation / editing with Flux.2 Klein.
        """
        if seed is None or seed < 0:
            seed = random.randint(1, 2**32 - 1)

        width = max(256, (width // 32) * 32)
        height = max(256, (height // 32) * 32)
        images = images or []

        # Step 1: Text Conditioning
        clip = self._load_clip()
        tokens = clip.tokenize(prompt)
        positive = clip.encode_from_tokens_scheduled(tokens)
        negative = []

        # Step 2: Latent preparation
        vae = self._load_vae()
        if len(images) > 0 and denoise < 1.0:
            ref_img = images[0].convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
            np_img = np.array(ref_img).astype(np.float32) / 255.0
            tensor_img = torch.from_numpy(np_img).unsqueeze(0)
            latent = vae.encode(tensor_img[:, :, :, :3])
        else:
            latent_channels = getattr(vae, "latent_channels", 128)
            latent = torch.zeros([1, latent_channels, height // 16, width // 16], device=comfy.model_management.intermediate_device())

        comfy.model_management.soft_empty_cache()

        # Step 3: Sampling with Flux DiT
        model = self._load_unet()
        logger.info(f"Flux Sampling {steps} steps (CFG: {cfg}, Denoise: {denoise}, Seed: {seed})...")

        torch.manual_seed(seed)
        if torch.cuda.is_available():
            torch.cuda.manual_seed_all(seed)

        noise = comfy.sample.prepare_noise(latent, seed)

        try:
            from progress_tracker import progress_tracker
            progress_tracker.start(task_id="flux", total_steps=steps)
            def step_callback(step, x0, x, total_steps):
                progress_tracker.update_step(step, total_steps)
        except Exception:
            step_callback = None

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

        # Step 4: VAE Decode (Tiled decode prevents 12GB VRAM exhaustion on 1024x1024)
        vae = self._load_vae()
        logger.info("Decoding latents to RGB image via tiled VAE...")
        try:
            decoded = vae.decode_tiled(samples)
        except Exception as e:
            logger.warning(f"Tiled VAE decode fallback: {e}")
            decoded = vae.decode(samples)

        try:
            progress_tracker.set_finalizing()
        except Exception:
            pass

        decoded = decoded.detach().cpu().numpy()
        # Always slice first 3 channels (:3) to guarantee pure RGB mode
        img_array = (decoded[0, :, :, :3] * 255.0).clip(0, 255).astype(np.uint8)
        output_image = Image.fromarray(img_array, mode="RGB")

        try:
            progress_tracker.finish()
        except Exception:
            pass

        meta = {
            "model": "flux_2_klein",
            "seed": seed,
            "prompt": prompt,
            "width": output_image.width,
            "height": output_image.height,
            "steps": steps,
            "cfg": cfg,
            "denoise": denoise,
            "sampler": sampler_name,
            "scheduler": scheduler
        }

        return output_image, seed, meta
