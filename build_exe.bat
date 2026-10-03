@echo off
setlocal enabledelayedexpansion
title CiviGen Standalone Executable Builder (civigen.exe)
echo ===================================================================
echo   CiviGen Standalone .EXE Builder
echo   Compiles civigen.py into a single standalone civigen.exe launcher
echo ===================================================================

cd /d "%~dp0"

:: Auto-discover Python
set PY_EXE=""
if exist "%~dp0.venv\Scripts\python.exe" (
    set PY_EXE="%~dp0.venv\Scripts\python.exe"
) else if exist "C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe" (
    set PY_EXE="C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe"
) else (
    where python >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set PY_EXE=python
    ) else (
        echo [ERROR] Python not found. Run setup_env.bat first.
        pause
        exit /b 1
    )
)

echo [INFO] Installing PyInstaller...
%PY_EXE% -m pip install pyinstaller >nul 2>&1

echo [INFO] Building standalone civigen.exe...
%PY_EXE% -m PyInstaller --noconfirm --onedir --windowed --name "civigen" "%~dp0civigen.py"

if exist "dist\civigen\civigen.exe" (
    echo [OK] Built dist\civigen\civigen.exe
)

echo ===================================================================
echo   [SUCCESS] civigen.exe compiled successfully!
echo ===================================================================
pause
