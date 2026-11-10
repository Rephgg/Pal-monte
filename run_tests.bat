@echo off
echo ============================================
echo   Pal' Monte - Ejecucion de Pruebas
echo ============================================
echo.

cd /d "%~dp0Backend-Js"

set "PYEXE=venv\Scripts\python.exe"
if not exist "%PYEXE%" set "PYEXE=python"

echo [1] Instalando dependencias de pruebas...
"%PYEXE%" -m pip install -r requirements-testing.txt -q 2>nul

echo [2] Ejecutando pruebas automatizadas...
echo.
"%PYEXE%" -m pytest "..\tests" -v --tb=short 2>&1

echo.
echo ============================================
echo   Pruebas completadas
echo ============================================
pause
