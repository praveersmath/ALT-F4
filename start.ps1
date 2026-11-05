#!/usr/bin/env pwsh
# AgriIntel Karnataka — One-command startup
# Run from the ALT-F4 project root:  .\start.ps1
#
# USAGE:
#   .\start.ps1          # starts backend + frontend in two windows
#   .\start.ps1 -BackendOnly   # only backend
#   .\start.ps1 -FrontendOnly  # only frontend

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$Root = $PSScriptRoot

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  AgriIntel Karnataka — Startup Script" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

if (-not $FrontendOnly) {
    Write-Host "[1/2] Starting FastAPI Backend on port 8000..." -ForegroundColor Green
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$Root\backend'; Write-Host 'AgriIntel Backend starting...' -ForegroundColor Green; python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1"
    ) -WindowStyle Normal
    Start-Sleep -Seconds 2
}

if (-not $BackendOnly) {
    Write-Host "[2/2] Starting Vite Frontend on port 5173..." -ForegroundColor Green
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$Root\frontend'; Write-Host 'AgriIntel Frontend starting...' -ForegroundColor Green; npm run dev"
    ) -WindowStyle Normal
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Services starting in separate windows." -ForegroundColor Yellow
Write-Host "  Backend:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "  API Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

