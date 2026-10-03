# CiviGen Dockerfile - Multi-Device AI Architecture & Design Studio
# Requires NVIDIA Container Toolkit on Host (nvidia-docker2)

FROM nvidia/cuda:12.4.1-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1
ENV COMFYUI_PATH=/app/ComfyUI

WORKDIR /app

# Install system dependencies & Python 3.10
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-dev \
    git \
    curl \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN python3 -m pip install --no-cache-dir --upgrade pip

# Install PyTorch with CUDA 12.4 support
RUN python3 -m pip install --no-cache-dir \
    torch torchvision torchaudio \
    --index-url https://download.pytorch.org/whl/cu124

# Clone ComfyUI core modular backend
RUN git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git /app/ComfyUI \
    && python3 -m pip install --no-cache-dir -r /app/ComfyUI/requirements.txt

# Copy CiviGen dependencies and install
COPY requirements.txt /app/requirements.txt
RUN python3 -m pip install --no-cache-dir -r /app/requirements.txt

# Copy CiviGen application code & prebuilt frontend
COPY "MODEL SERVER" /app/"MODEL SERVER"
COPY ui/dist /app/ui/dist

# Expose HTTP port for Web Studio & API
EXPOSE 8000

# Default working directory for the server
WORKDIR /app/"MODEL SERVER"

# Start CiviGen Server bound to 0.0.0.0 (LAN & Docker accessible)
CMD ["python3", "server.py", "--host", "0.0.0.0", "--port", "8000"]
