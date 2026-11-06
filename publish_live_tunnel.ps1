Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Publishing AgriIntel to the Public Internet (HTTPS)..." -ForegroundColor Cyan
Write-Host "  Direct Secure SSH Reverse Tunnel (No password needed)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:127.0.0.1:8000 nokey@localhost.run
