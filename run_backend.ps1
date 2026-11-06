Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  AgriIntel Karnataka - FastAPI Backend Server" -ForegroundColor Cyan
Write-Host "  Listening on http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  API Docs:     http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
python -m uvicorn app.main:app --app-dir backend --reload --port 8000 --host 127.0.0.1

