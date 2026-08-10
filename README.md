# Pal' Monte - App Web de Ciclistas

Aplicación web para la comunidad ciclista de Ibagué: permite explorar rutas, comercios y
eventos, inscribirse a salidas, registrar rutas realizadas, dejar reseñas y gestionar el
perfil de cada usuario.

**Evidencia:** GA8-220501096-AA1-EV01 - Desarrollo de software a partir de la integración de módulos

---

## 1. Arquitectura del software

La aplicación es una arquitectura de **3 capas**, donde todos los módulos se integran a
través de una **API REST** y una **base de datos única**:

```
┌─────────────────────────┐
│   FRONTEND (cliente)     │   HTML + CSS + JavaScript
│   main, rutas, eventos,  │   (se abre en el navegador)
│   comercio, sesion        │
└────────────┬────────────┘
             │  fetch() / JSON  (http://127.0.0.1:8000/api)
             ▼
┌─────────────────────────┐
│   BACKEND (API REST)     │   Python + FastAPI + Uvicorn
│   módulo de autenticación│   (servidor en el puerto 8000)
│   y módulos de negocio   │
└────────────┬────────────┘
             │  mysql-connector (puerto 3306)
             ▼
┌─────────────────────────┐
│   BASE DE DATOS          │   MySQL (9 tablas)
│   palmonte               │
└─────────────────────────┘
```

Los módulos integrados son:

| Módulo | Funcionalidad | Endpoints principales |
|---|---|---|
| **Sesión / Usuario** | Registro, inicio de sesión, perfil, cambio de contraseña | `POST /api/registro`, `POST /api/login`, `GET/PUT /api/perfil/{id}` |
| **Rutas** | Listado con filtro por dificultad, detalle con reseñas, favoritos, historial de rutas realizadas | `GET /api/rutas`, `GET /api/rutas/{id}`, `POST /api/favoritos`, `POST /api/rutas-realizadas` |
| **Eventos** | Listado de próximos eventos, detalle, inscripción y cancelación de inscripción | `GET /api/eventos`, `POST /api/eventos/{id}/inscribir`, `DELETE /api/eventos/{id}/cancelar-inscripcion` |
| **Comercios** | Listado por tipo, detalle con reseñas | `GET /api/comercios`, `GET /api/comercios/{id}` |
| **Reseñas** | Calificación y comentarios de rutas y comercios (1-5) | `POST /api/resenas` |
| **Administración** | CRUD de rutas y comercios, gestión de usuarios | `/api/admin/...` |

Todas las tablas comparten datos entre módulos: las reseñas alimentan los promedios de
rutas y comercios, los favoritos y el historial alimentan el perfil, y las inscripciones
actualizan los cupos de los eventos.

## 2. ¿Por qué no se necesita XAMPP?

XAMPP agrupa Apache + PHP + MySQL. Esta aplicación **no usa Apache ni PHP**:

- El **backend** es un servidor web propio en **Python (Uvicorn/FastAPI)** que responde en
  el puerto 8000 con la API REST.
- El **frontend** es estático (HTML/JS/CSS) y el navegador lo abre directamente desde el
  disco; las páginas hacen peticiones `fetch` a la API.
- Solo se necesita un **servidor MySQL** (cualquiera, no el que trae XAMPP). En este
  proyecto MySQL está instalado por separado y corre como **servicio de Windows**.

Por lo tanto, para ejecutar la aplicación solo hay que tener dos procesos activos:
**MySQL** (puerto 3306) y **Uvicorn** (puerto 8000).

## 3. Requisitos previos

- **MySQL** 8 o superior (instalado como servicio o servidor propio).
- **Python** 3.10 o superior.
- Navegador web (Chrome, Edge, Firefox).

## 4. Estructura del proyecto

```
PalMonte/
├── backend/
│   ├── main.py              # API REST completa (FastAPI)
│   ├── models.py            # Modelos de datos (Pydantic)
│   ├── database.py          # Conexión a MySQL
│   ├── requirements.txt     # Dependencias de Python
│   ├── .env                 # Credenciales de la BD (no se comparte)
│   └── .env.example         # Plantilla del .env
├── database/
│   └── palmonte.sql         # Script de la base de datos (restauración)
├── main/                    # Portada (palmonte.html, js, css)
├── rutas/                   # Módulo de rutas (listado + detalle)
├── eventos/                 # Módulo de eventos (listado + detalle)
├── comercio/                # Módulo de comercios (listado + detalle)
├── sesion/                  # Registro, inicio de sesión y perfil
├── docs/                    # Guías y documentación de la evidencia
└── start.bat                # Script para levantar la aplicación
```

## 5. Puesta en marcha (paso a paso)

### 5.1. Restaurar la base de datos

1. Inicia el servicio de MySQL (Panel de servicios de Windows o `net start MySQL`).
2. Importa el script de la base de datos:

   ```cmd
   mysql -u root -p palmonte < database\palmonte.sql
   ```

   (Si el usuario de MySQL tiene contraseña, indícala con `-p`.)

### 5.2. Configurar el backend

1. Ve a la carpeta `backend`:

   ```cmd
   cd backend
   ```

2. Copia el archivo `.env.example` como `.env` y ajusta las credenciales de tu MySQL
   si no coinciden:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=palmonte
   ```

3. Crea el entorno virtual e instala las dependencias (opcional si no tienes un venv):

   ```cmd
   python -m venv venv
   venv\Scripts\pip install -r requirements.txt
   ```

### 5.3. Levantar la API

```cmd
venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

Verás los mensajes de inicialización de la base de datos. La API queda disponible en:

- API: `http://127.0.0.1:8000`
- Documentación interactiva (Swagger): `http://127.0.0.1:8000/docs`

> El backend crea automáticamente las tablas si la base de datos existe.

### 5.4. Abrir la aplicación

Abre el archivo `main\palmonte.html` en el navegador (doble clic) o arrástralo a una
pestaña. Todas las páginas se comunican con la API en `http://127.0.0.1:8000/api`.

### 5.5. (Alternativa) Script automático

Ejecuta `start.bat` desde la raíz del proyecto: inicia el servicio de MySQL (si no está
activo), levanta la API y abre la página principal en el navegador.

## 6. Usuarios de prueba

| Usuario | Correo | Contraseña | Rol |
|---|---|---|---|
| Carlos | `carlos@email.com` | `123456` | ciclista |
| Mariana | `mariana@email.com` | `123456` | ciclista |
| Andrés | `andres@email.com` | `123456` | ciclista |
| Laura | `laura@email.com` | `123456` | ciclista |
| Pedro | `pedro@email.com` | `123456` | ciclista |

También puedes crear una cuenta nueva desde el botón **"Registrarme"**.

## 7. Evidencia de funcionamiento sugerida

Consulta `docs/guia_evidencia.md` para la lista de capturas y el guion de demostración de
los módulos integrados.
