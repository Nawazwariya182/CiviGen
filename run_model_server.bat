@echo off
title AI Architecture & Multi-Model Server (Qwen Image 2.1 + Flux.2 Klein)
echo ===================================================================
echo   Starting AI Architecture & Multi-Model Server (FastAPI on Port 8000)
echo   Supports: 12 Architecture, Interior & Furniture Tasks
echo   OpenAI / GPT-Style API Endpoints at http://127.0.0.1:8000
echo ===================================================================

cd /d "%~dp0MODEL SERVER"

:: Free port 8000 if already occupied by an existing background process
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [INFO] Port 8000 is occupied by process PID %%a. Terminating previous instance...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe" server.py

pause
