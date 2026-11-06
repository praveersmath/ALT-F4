@echo off
title AgriIntel Live Public Tunnel (HTTPS)
echo ========================================================
echo   Publishing AgriIntel to the Public Internet...
echo   Direct Secure SSH Reverse Tunnel (No password needed)
echo ========================================================
echo.
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:127.0.0.1:8000 nokey@localhost.run
pause
