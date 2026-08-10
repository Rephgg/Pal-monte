@echo off
chcp 65001 >nul
title Pal' Monte - Inicio de la aplicacion

echo ============================================
echo   Pal' Monte - App de Ciclistas
echo   GA8-220501096-AA1-EV01
echo ============================================
echo.

REM [1/3] Iniciar servicio de MySQL si no esta activo
echo [1/3] Verificando el servicio de MySQL...
sc query MySQL >nul 2>&1
if %errorlevel%==0 (
    sc query MySQL | find "RUNNING" >nul 2>&1
    if errorlevel 1 (
        echo       Iniciando servicio MySQL...
        net start MySQL >nul 2>&1
    ) else (
        echo       MySQL ya esta corriendo.
    )
) else (
    echo       [!] Servicio MySQL no encontrado. Asegurate de que MySQL este instalado.
)

REM [2/3] Levantar la API
echo [2/3] Levantando la API en http://127.0.0.1:8000 ...
cd /d "%~dp0backend"

set "PYEXE=venv\Scripts\python.exe"
if not exist "%PYEXE%" set "PYEXE=python"

start "PalMonte API" cmd /k "%PYEXE% -m uvicorn main:app --host 127.0.0.1 --port 8000"

REM [3/3] Abrir la portada
echo [3/3] Abriendo la aplicacion en el navegador...
timeout /t 4 /nobreak >nul
start "" "%~dp0main\palmonte.html"

echo.
echo Aplicacion iniciada. Si la pagina no carga datos, espera unos segundos y recargala.
echo Para detener la API, cierra la ventana "PalMonte API".
echo.
pause
