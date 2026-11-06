@echo off
title AgriIntel FastAPI Backend (Port 8000)
echo ========================================================
echo   AgriIntel Karnataka - FastAPI Backend Server
echo   Listening on http://127.0.0.1:8000
echo   API Docs:     http://127.0.0.1:8000/docs
echo ========================================================
echo.
python -m uvicorn app.main:app --app-dir backend --reload --port 8000 --host 127.0.0.1
pause
