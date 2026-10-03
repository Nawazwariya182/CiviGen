@echo off
setlocal enabledelayedexpansion
title CiviGen 1-Click Environment Setup (Qwen Image 2.1 8B DiT)
echo ===================================================================
echo   CiviGen 1-Click Environment Setup
echo   Platform: Windows 10/11 64-bit with NVIDIA GPU
echo ===================================================================
echo.

cd /d "%~dp0"

:: 1. Check Python installation
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in your system PATH.
    echo Please install Python 3.10, 3.11, or 3.12 from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('python --version 2^>^&1') do set PY_VER=%%v
echo [INFO] Detected: %PY_VER%

:: 2. Create Virtual Environment
if not exist ".venv\Scripts\python.exe" (
    echo [INFO] Creating local Python virtual environment (.venv)...
    python -m venv .venv
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created successfully.
) else (
    echo [OK] Existing virtual environment found in .venv
)

set VENV_PY="%~dp0.venv\Scripts\python.exe"
set VENV_PIP="%~dp0.venv\Scripts\pip.exe"

:: 3. Upgrade pip
echo [INFO] Updating pip...
%VENV_PY% -m pip install --upgrade pip >nul 2>&1

:: 4. Install PyTorch with CUDA 12.4
echo [INFO] Checking PyTorch with CUDA acceleration...
%VENV_PY% -c "import torch; assert torch.cuda.is_available()" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Installing PyTorch with CUDA 12.4 support (this may take a few minutes)...
    %VENV_PIP% install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
) else (
    echo [OK] PyTorch with CUDA GPU acceleration is already installed.
)

:: 5. Install CiviGen Dependencies
echo [INFO] Installing CiviGen dependencies from requirements.txt...
%VENV_PIP% install -r requirements.txt

:: 6. Check / Clone ComfyUI Core Engine
if not exist "ComfyUI\comfy\sd.py" (
    if not exist "ComfyUI_core\comfy\sd.py" (
        where git >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            echo [INFO] Cloning ComfyUI modular core engine...
            git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git ComfyUI
            if exist "ComfyUI\requirements.txt" (
                echo [INFO] Installing ComfyUI core requirements...
                %VENV_PIP% install -r ComfyUI\requirements.txt
            )
        ) else (
            echo [WARNING] Git is not installed. If you don't have ComfyUI, please download it from:
            echo https://github.com/comfyanonymous/ComfyUI
        )
    )
)

:: 7. Create MODELS/Qwen directory if missing
if not exist "MODELS\Qwen" (
    mkdir "MODELS\Qwen"
    echo [INFO] Created MODELS\Qwen directory.
)

echo.
echo ===================================================================
echo   [SUCCESS] CiviGen environment setup is complete!
echo ===================================================================
echo   Next steps:
echo   1. Place your 3 Qwen model files in: %~dp0MODELS\Qwen\
echo      - qwen_image_2.1_int8_convrot.safetensors
echo      - qwen3vl_8b_int8_convrot.safetensors
echo      - qwen_image_2.1_vae_bf16.safetensors
echo.
echo   2. Run 'civigen.bat' or 'run_model_server.bat' to launch!
echo ===================================================================
echo.
pause
