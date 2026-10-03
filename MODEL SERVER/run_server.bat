@echo off
setlocal enabledelayedexpansion
title CiviGen Architectural Studio Server (Qwen Image 2.1 8B DiT)
echo ===================================================================
echo   Starting CiviGen Generative Architectural Server (Port 8000)
echo   Powered by: Qwen Image 2.1 (8B DiT) Architecture and Design Engine
echo   Multi-Device LAN Access + OpenAI / GPT-Style API Endpoints
echo ===================================================================

cd /d "%~dp0"

:: Auto-discover best Python interpreter
set PY_EXE=""
if exist "%~dp0..\.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0..\.venv\Scripts\python.exe"
) else if exist "%~dp0.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0.venv\Scripts\python.exe"
) else if exist "C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe" (
    set PY_EXE="C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set PY_EXE=python
    ) else (
        echo [ERROR] No Python environment detected. Run 'setup_env.bat' first.
        pause
        exit /b 1
    )
)

%PY_EXE% server.py %*

pause

