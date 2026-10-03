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
if exist "%~dp0.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0.venv\Scripts\python.exe"
) else if exist "%~dp0MODEL SERVER\.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0MODEL SERVER\.venv\Scripts\python.exe"
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

cd /d "%~dp0MODEL SERVER"

:: Free port 8000 if already occupied
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [INFO] Port 8000 occupied by process PID %%a. Terminating previous instance...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

%PY_EXE% server.py %*

pause

