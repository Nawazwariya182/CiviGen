@echo off
setlocal
cd /d "%~dp0"

:: 1. Auto-discover Python
set PY_EXE=""
if exist "%~dp0.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0.venv\Scripts\python.exe"
) else if exist "%~dp0MODEL SERVER\.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0MODEL SERVER\.venv\Scripts\python.exe"
) else if exist "C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe" (
    set PY_EXE="C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set PY_EXE=python
    ) else (
        echo [ERROR] No Python environment found. Run 'setup_env.bat' first.
        pause
        exit /b 1
    )
)

%PY_EXE% "%~dp0civigen.py" %*
