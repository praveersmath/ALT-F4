Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Publishing AgriIntel to the Public Internet..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
$ip = (Invoke-RestMethod -Uri "https://api.ipify.org" -UseBasicParsing).Trim()
Write-Host "Your Tunnel Password (if requested): $ip" -ForegroundColor Yellow
Write-Host ""
npx --yes localtunnel --port 8000
