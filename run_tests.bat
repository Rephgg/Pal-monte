@echo off
echo ============================================
echo   Pal' Monte - Ejecucion de Pruebas
echo ============================================
echo.

cd /d "%~dp0backend"

echo [1] Instalando dependencias de pruebas...
pip install -r requirements-testing.txt -q 2>nul

echo [2] Ejecutando pruebas automatizadas...
echo.
python -m pytest "..\tests" -v --tb=short 2>&1

echo.
echo ============================================
echo   Pruebas completadas
echo ============================================
pause
