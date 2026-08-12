# PROJECT CONTEXT — Pal' Monte

> Documento de contexto completo para continuar el trabajo con otra IA o
> desarrollador. Actualizado a 2026-08-12.

Proyecto: **Pal' Monte** — app web de ciclistas (Ibagué) y app móvil Android.
Evidencias SENA ADSO: `GA8-220501096-AA1-EV01` (web), `AA2-EV02` (APK) y
`AA2-EV03` (taller/tecnologías emergentes).

---

## 1. Repositorios y rutas

| Artifact | Ruta local | Repo Git |
|---|---|---|
| Proyecto web (backend + frontend + BD) | `D:\U\ProgWeb\PalMonte` | `https://github.com/Rephgg/Pal-monte.git` (rama `main`) |
| Proyecto móvil Android (Compose) | `D:\Android\AppPedalea` | (código fuente local) |
| Ejecutable APK (Android) | `D:\U\ProgWeb\PalMonte\apk\laboratorio\PalMonte_AppPedalea.apk` | En repo: `apk/laboratorio/PalMonte_AppPedalea.apk` |
| Entrega comprimida (web) | `D:\U\ProgWeb\PalMonte_Entrega.zip` | — |

---

## 2. Arquitectura web

```
Navegador (frontend estático HTML/JS/CSS)
  --fetch JSON--> http://127.0.0.1:8000/api  (FastAPI + Uvicorn)
                                |
                                | mysql-connector
                                v
               MySQL 9.7.2 (servicio Windows, puerto 3306) — DB: palmonte
```

- Frontend: HTML + CSS + JS puro. Se abre directamente (`file://.../...html`).
- Backend: Python 3.14 + FastAPI + Uvicorn (port 8000). `init_database()`
  crea/verifica DB y tablas al arranque.
- **No se usa XAMPP**: MySQL es servicio Windows; el "Apache" lo reemplaza
  Uvicorn (backend) y el browser sirve el frontend estático.

### 2.1 Dependencias del backend

`D:\U\ProgWeb\PalMonte\backend\requirements.txt`:
```
fastapi==0.141.1
uvicorn==0.52.1
mysql-connector-python==26.7.0
pydantic==2.13.4
python-dotenv==1.2.2
bcrypt==5.0.0
```
( Las versiones son para Python 3.14 — los pins originales fallaban con Rust. )

Entorno virtual: `D:\U\ProgWeb\PalMonte\backend\venv`.

### 2.2 Archivos clave del backend

- `backend/main.py` — API REST completa (`init_database()` + todos los endpoints).
- `backend/models.py` — modelos Pydantic (`UsuarioRegistro`, `UsuarioLogin`, `Ruta`, `Comercio`, `Evento`, `ResenaRequest`, `RutaRealizadaRequest`).
- `backend/database.py` — `get_db_connection()` con dotenv.
- `backend/.env` — creds MySQL (no versionar).
- `backend/.env.example` — plantilla.

### 2.3 Archivos clave del frontend

| Función | Archivo |
|---|---|
| Portada (destacados desde API) | `main/palmonte.html` + `main/palmonte.js` |
| Listado/detalle rutas | `rutas/rutas.html` + `rutas.js`, `rutas/detalleRuta.html` + `detalleRuta.js` |
| Listado/detalle comercios | `comercio/comercio.html` + `comercio.js`, `comercio/comercioDetalle.html` + `comercioDetalle.js` |
| Listado/detalle eventos | `eventos/eventos.html` + `eventos.js`, `eventos/detalleEvento.html` + `detalleEvento.js` |
| Auth + perfil | `sesion/registro.html`+`.js`, `sesion/iniciarSesion.html`+`.js`, `sesion/perfil.html` + `perfil.js` |

Todas las páginas consumen `http://127.0.0.1:8000/api` (CORS `*`).

---

## 3. Base de datos MySQL `palmonte`

Motor: MySQL 9.7.2 en `C:\tools\mysql\mysql-9.7.2-winx64` (cliente `mysql.exe`,
root **sin contraseña**). Acceso: `mysql -u root palmonte`.

### 3.1 Tablas (9)

`usuario, perfil, ruta, evento, comercio, favorito, ruta_realizada, resena, asistencia_evento`.

Script de restauración incluido:
**Nota de importancia:** el script SQL que contiene los datos fue
**regenerado y reemplazado** para reflejar el estado actual de la base de datos
(en el archivo original `database/palmonte.sql` del repositorio). Para
restaurar:
```cmd
mysql -u root palmonte < database\palmonte.sql
```

### 3.2 Usuarios demo (bcrypt)

Todas las contraseñas son **`123456`** (hash bcrypt):
| email | nombre | rol |
|---|---|---|
| carlos@email.com | Carlos Rodríguez | ciclista |
| mariana@email.com | Mariana López | ciclista |
| andres@email.com | Andrés Ramírez | ciclista |
| laura@email.com | Laura Méndez | ciclista |
| pedro@email.com | Pedro Sánchez | ciclista |
| juan77@gmail.com | 777pro | ciclista (creado manualmente) |

---

## 4. API REST — endpoints (`http://127.0.0.1:8000/api`)

| Método | Ruta | Parámetros | Descripción |
|---|---|---|---|
| POST | `/registro` | body{nombre,email,password,telefono?,niveld?} | Registra usuario + perfil |
| POST | `/login` | body{email,password} | Devuelve id,nombre,email,nivel,rol |
| GET | `/perfil/{id}` | — | Perfil con favoritos e historial |
| PUT | `/perfil/{id}` | query: nombre,telefono,niveld? | Actualiza usuario (+rol) |
| PUT | `/perfil/{id}/password` | body{password_actual,password_nueva} | Cambia password |
| GET | `/rutas` | query: dificultad? | Lista rutas (filtra por dificultad) |
| GET | `/rutas/{id}` | — | Detalle: ruta + reseñas + promedio |
| POST | `/admin/rutas` | body{Ruta} | Crear ruta |
| PUT | `/admin/rutas/{id}` | body{Ruta} | Actualizar ruta |
| DELETE | `/admin/rutas/{id}` | — | Borrar ruta |
| GET | `/comercios` | query: tipo? | Lista comercios |
| GET | `/comercios/{id}` | — | Detalle + reseñas |
| POST/PUT/DELETE | `/admin/comercios[/{id}]` | body{Comercio} | CRUD comercios |
| GET | `/eventos` | — | Eventos próximos (fecha >= hoy, no cancelados) |
| GET | `/eventos/{id}` | — | Detalle + asistentes |
| POST | `/eventos` | body{Evento,organizador_id} | Crear evento |
| POST | `/eventos/{id}/inscribir` | body{usuario_id} | Inscripción (incrementa cupo) |
| DELETE | `/eventos/{id}/cancelar-inscripcion` | body{usuario_id} | Cancelar inscripción (decrementa cupo) |
| PUT | `/eventos/{id}/cancelar` | — | Cancelar evento |
| POST | `/favoritos` | query: usuario_id,ruta_id | Agregar favorito |
| DELETE | `/favoritos` | query: usuario_id,ruta_id | Quitar favorito |
| POST | `/resenas` | body{id_usuario,id_ruta?|id_comercio?,calificacion,comentario} | Guarda reseña (evita duplicado) |
| POST | `/rutas-realizadas` | query: usuario_id,ruta_id,tiempo_real,observaciones? | Registra ruta; suma km al perfil |
| GET | `/admin/usuarios` | — | Lista usuarios |
| PUT | `/admin/usuarios/{id}/rol` | body{rol} | Cambiar rol |
| DELETE | `/admin/usuarios/{id}` | — | Desactivar usuario (activo=0) |

Swagger UI: `http://127.0.0.1:8000/docs`.

---

## 5. Cómo iniciar el proyecto web

1. Servicio MySQL arriba (Running). Si no: `net start MySQL` (admin).
2. Backend:
   ```cmd
   cd D:\U\ProgWeb\PalMonte\backend
   venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
   ```
   (auto crea/verifica DB/tabla). Alternativa: doble clic en `D:\U\ProgWeb\PalMonte\start.bat`.
3. Frontend: abrir `D:\U\ProgWeb\PalMonte\main\palmonte.html` en el navegador.

---

## 6. Proyecto Android (`D:\Android\AppPedalea`)

- Tecnología: **Jetpack Compose + Material 3**, Kotlin 2.0.21, AGP 9.0.0,
  Gradle wrapper 9.2.1, SDK en `D:\SDK`.
- Package: `com.example.apppedalea`.
- Convención de paquetes:
  - `com.example.apppedalea.screens` — pantallas (Login, Dashboard, Routes, Commerces, Community, Profile, Register, …).
  - `com.example.apppedalea.components` — BottomNavigationBar, TopAppBar.
  - `com.example.apppedalea.ui.templates` — layouts Scaffold (MainTemplate, AuthTemplate, DetailTemplate, ListTemplate).
  - `com.example.apppedalea.ui.theme` — colores (verde aventura, azul navegación, naranja alerta).
  - `com.example.apppedalea.data` — modelos, cliente Retrofit, SessionManager.

### 6.1 Integración con la API (backend)

- `data/ApiService.kt` → `ApiClient.BASE_URL = "http://10.0.2.2:8000/api/"`
  (10.0.2.2 = loopback del host desde el emulador).
- `data/SessionManager.kt` → guarda/recupera usuario en `SharedPreferences`
  (`sesion_palmonte`).
- Login (`LoginScreen`) → POST `/login` → guarda sesión → navega a `dashboard`.
- Rutas/comercios/eventos → GET respectivos → listados y detalles dinámicos.

### 6.2 Navegación (`MainActivity.kt` — NavHost)

Destinos: `login, register, forgot_password, dashboard, routes,
route_detail/{routeId}, commerces, commerce_detail/{commerceId}, community,
event_detail/{eventId}, profile, favorites, settings, help`.

---

## 7. Evidencias

### EV01 (web) — GA8-220501096-AA1-EV01
- Software integrado (backend API + frontend + BD). ✅
- Base de datos: `database/palmonte.sql` (restaurada/verificada). ✅
- Manual técnico: `README.md`. ✅
- Guía de capturas: `docs/guia_evidencia.md` (15 pasos). ✅
- Script de arranque: `start.bat`. ✅
- Repo Git: commits `f179c54` y `61014be` en GitHub. ✅

### EV02 (APK) — GA8-220501096-AA2-EV02
- App Android que desarrolle módulos según requerimientos del proyecto
  (conexión al backend Pal' Monte). En construcción (ver §6).

### EV03 (taller) — GA8-220501096-AA2-EV03
- Investigación corta sobre desarrollo Android + tecnologías emergentes/
  disruptivas. Documento a generar:
  `docs/Taller_Android_GA8-220501096-AA2-EV03.docx`.

---

## 8. Estado actual del trabajo (checklist)

Web (EV01):
- [x] Backend FastAPI con todos los endpoints
- [x] BD palmonte restaurada y exportada
- [x] Frontend conectado a la API
- [x] README (manual técnico), guía de evidencia, start.bat
- [x] Repo Git + push a GitHub

Android (EV02/EV03):
- [x] Proyecto Android creado (Compose, Material 3)
- [x] Dependencias (Retrofit, Gson, ViewModel) + permiso INTERNET
- [x] Paquete `data` (models, ApiService, SessionManager)
- [x] Navegación corregida (destinos completos, IDs numéricos)
- [ ] Crear pantallas nuevas (Register, ForgotPassword, Favorites, Settings, Help, CommerceDetail, EventDetail)
- [ ] Conectar Login + listas a la API
- [ ] Limpiar código muerto, compilar `assembleDebug`
- [ ] Documento EV03 (investigación)

---

## 9. Comandos útiles

```cmd
:: Web: levantar backend
D:\U\ProgWeb\PalMonte\backend> venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

:: Web: importar BD
mysql -u root palmonte < D:\U\ProgWeb\PalMonte\database\palmonte.sql

:: Android: compilar APK debug
D:\Android\AppPedalea> gradlew.bat :app:assembleDebug
:: el APK queda en app\build\outputs\apk\debug\app-debug.apk
```
