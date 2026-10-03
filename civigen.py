#!/usr/bin/env python3
"""
CiviGen CLI Launcher
Starts the CiviGen FastAPI model server and web studio, and launches the browser.
Supports multi-device LAN access and aggressive 6GB-8GB Low-VRAM offloading.
"""

import os
import sys
import time
import socket
import argparse
import subprocess
import webbrowser
import threading


def find_python() -> str:
    """Dynamically locates the best Python interpreter with CUDA/PyTorch installed."""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidates = [
        os.path.join(base_dir, ".venv", "Scripts", "python.exe"),
        os.path.join(base_dir, ".venv", "bin", "python"),
        os.path.join(base_dir, "MODEL SERVER", ".venv", "Scripts", "python.exe"),
        r"C:\Users\Shahnawaz Wariya\Documents\ComfyUI\.venv\Scripts\python.exe",
        os.path.expanduser("~/Documents/ComfyUI/.venv/Scripts/python.exe"),
        os.path.expanduser("~/ComfyUI/.venv/bin/python"),
        sys.executable
    ]
    for c in candidates:
        if c and os.path.exists(c):
            return c
    return sys.executable


def get_local_ip() -> str:
    """Detects local network IP for mobile & tablet Wi-Fi connectivity."""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def open_browser_delayed(url: str, delay: float = 2.0):
    """Opens browser after server has started up."""
    def _open():
        time.sleep(delay)
        webbrowser.open(url)
    t = threading.Thread(target=_open, daemon=True)
    t.start()


def main():
    parser = argparse.ArgumentParser(
        description="CiviGen — Generative Architectural Design Studio (Qwen Image 2.1 8B DiT)"
    )
    parser.add_argument("--host", default="0.0.0.0", help="Host IP to bind (default: 0.0.0.0 for LAN access)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--low-vram", action="store_true", help="Enable aggressive memory offloading for 6GB-8GB GPUs")
    parser.add_argument("--no-browser", action="store_true", help="Do not automatically open the browser")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    server_script = os.path.join(base_dir, "MODEL SERVER", "server.py")
    python_exe = find_python()

    env = os.environ.copy()
    if args.low_vram:
        env["CIVIGEN_LOW_VRAM"] = "1"

    local_ip = get_local_ip()
    local_url = f"http://localhost:{args.port}"
    lan_url = f"http://{local_ip}:{args.port}"

    print("=" * 72)
    print("  CIVIGEN — Generative Architectural Design Studio (Qwen 8B DiT)")
    print("=" * 72)
    print(f"  • Desktop Browser:   {local_url}")
    if args.host == "0.0.0.0":
        print(f"  • Mobile & Tablet:   {lan_url}")
        print("    (Open on any phone or tablet connected to your Wi-Fi!)")
    print(f"  • VRAM Mode:         {'Aggressive 6GB-8GB Offloading' if args.low_vram else 'Standard Mode'}")
    print(f"  • Python Engine:     {python_exe}")
    print("=" * 72 + "\n")

    if not args.no_browser:
        open_browser_delayed(local_url, delay=2.0)

    # Launch server
    cmd = [python_exe, server_script, "--host", args.host, "--port", str(args.port)]
    if args.low_vram:
        cmd.append("--low-vram")

    try:
        subprocess.run(cmd, env=env, cwd=os.path.join(base_dir, "MODEL SERVER"))
    except KeyboardInterrupt:
        print("\n[INFO] CiviGen studio stopped by user.")


if __name__ == "__main__":
    main()
