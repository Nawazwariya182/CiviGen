@echo off
title AI Architecture & Multi-Model Server (Qwen Image 2.1 + Flux.2 Klein)
echo ===================================================================
echo   Starting AI Architecture & Multi-Model Server (FastAPI on Port 8000)
echo   Supports: 12 Architecture, Interior & Furniture Tasks
echo   OpenAI / GPT-Style API Endpoints at http://127.0.0.1:8000
echo ===================================================================

cd /d "%~dp0"
"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe" server.py

pause
