@echo off
title Agentation MCP Server (Port 4747)
echo ===================================================================
echo   Starting Agentation MCP Server on http://localhost:4747
echo   Provides real-time visual feedback and annotations to AI agents
echo ===================================================================

npx -y agentation-mcp server --port 4747

pause
