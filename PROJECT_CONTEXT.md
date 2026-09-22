# PROJECT CONTEXT — Pal' Monte

> Documento de contexto completo para continuar el trabajo con otra IA o
> desarrollador. Actualizado a 2026-09-22.

Proyecto: **Pal' Monte** — app web de ciclistas (Ibagué) y app móvil Android.
Evidencias SENA ADSO: `GA8-220501096-AA1-EV01` (web), `AA2-EV02` (APK) y
`AA2-EV03` (taller/tecnologías emergentes).

---

## 1. Repositorios y rutas

| Artifact | Ruta local | Repo Git |
|---|---|---|
| Proyecto web + `mi-api` (Node/Express) + BD | `C:\Users\braya\Downloads\PalMonte github\Pal-monte` | `https://github.com/Rephgg/Pal-monte.git` (ramas `main`, `Dev`, `BrayanRincon` — sincronizadas) |
| Proyecto móvil Android (Compose) | `D:\Android\AppPedalea` | (código fuente local) |
| Ejecutable APK (Android) | `apk/laboratorio/PalMonte_AppPedalea.apk` (en repo) | — |

> Rutas antiguas (`D:\U\ProgWeb\PalMonte`) quedaron como referencia histórica;
> el workspace activo es el del repositorio local (descarga de GitHub).

---

## 2. Arquitectura web

```
Navegador (frontend estático HTML/JS/CSS)
  --fetch JSON--> http://127.0.0.1:3000/api   (mi-api: Node.js + Express)   <-- backend activo
  --fetch JSON--> http://127.0.0.1:8000/api   (legacy: FastAPI + Uvicorn)
                                |
                                | mysql2 (pool)
                                v
               MySQL (servicio Windows, puerto 3306) — DB: palmonte (24 tablas)
```

- **Backend activo: `mi-api/`** (Node.js + Express + `mysql2` pool). Se trabaja
  "profesionalmente" sobre este: base de datos ampliada de 9 a 24 tablas,
  login con sesiones (`token`), endpoints por módulo.
- **Backend legacy:** Python 3.14 + FastAPI + Uvicorn (port 8000). Sigue
  disponible pero ya no es el foco de desarrollo.
- Frontend: HTML + CSS + JS puro. Se abre directamente (`file://.../...html`).
- **No se usa XAMPP**: MySQL es servicio Windows.

### 2.1 `mi-api` (Node.js + Express)

- `mi-api/index.js` → `src/app.js` → routers y controllers.
- `mi-api/src/db.js` — pool `mysql2` (lee `.env`: `DB_HOST`, `DB_PORT`, `DB_USER`,
  `DB_PASSWORD`, `DB_NAME`, `DB_POOL_LIMIT`). Verifica conexión al arranque.
- `mi-api/.env.example` — plantilla (copiar a `.env`).
- Arranque: `cd mi-api && npm install` → `npm run dev` (nodemon) o
  `node index.js`. Bat disponibles: `dev.bat`, `start-api.bat`.

### 2.2 Estate del backend legacy (FastAPI)

- `backend/main.py` — API REST con `init_database()` (9 tablas originales).
- `backend/models.py`, `backend/database.py`, `.env`, `.env.example`.
- Arranque: `venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000`.

### 2.3 Archivos clave del frontend (EV01)

| Función | Archivo |
|---|---|
| Portada (destacados desde API) | `main/palmonte.html` + `main/palmonte.js` |
| Listado/detalle rutas | `rutas/rutas.html` + `rutas.js`, `rutas/detalleRuta.html` + `detalleRuta.js` |
| Listado/detalle comercios | `comercio/comercio.html` + `comercio.js`, `comercio/comercioDetalle.html` + `comercioDetalle.js` |
| Listado/detalle eventos | `eventos/eventos.html` + `eventos.js`, `eventos/detalleEvento.html` + `detalleEvento.js` |
| Auth + perfil | `sesion/registro.html`+`.js`, `sesion/iniciarSesion.html`+`.js`, `sesion/perfil.html` + `perfil.js` |

---

## 3. Base de datos MySQL `palmonte`

Motor: MySQL (servicio Windows, puerto 3306). Cliente: `mysql -u root palmonte`.

Script único de restauración: **`database/palmonte.sql`** (24 tablas + datos demo).
```cmd
mysql -u root palmonte < database\palmonte.sql
```

### 3.1 Tablas (24) por módulo

- **Núcleo/usuarios:** `usuario`, `perfil`, `sesion`
- **Rutas / geometría:** `ruta`, `punto_ruta`, `parada_ruta`
- **Comercios / horarios:** `comercio`, `horario_comercio`
- **Eventos:** `evento`, `asistencia_evento`, `patrocinador`, `patrocinador_evento`
- **Bicicletas:** `bicicleta`
- **Interacción:** `favorito`, `resena`, `ruta_realizada`, `seguidor`,
  `publicacion`, `comentario`, `me_gusta`, `notificacion`
- **Gamificación / moderación:** `logro`, `logro_usuario`, `reporte`

Convenciones: FK con índices, `ON DELETE CASCADE`/`SET NULL` según relación,
CHECKs (ej. `resena.calificacion` 1–5 y tipo exclusivo ruta/comercio; `evento`
cupos 0→cupo_max; `seguidor` no auto-seguirse), validaciones de integridad a
nivel de BD (`uq_resena_usuario_ruta`, `uq_resena_usuario_comercio`), soft-delete
(`publicacion.activo`, `usuario.activo`).

### 3.2 Usuarios demo (bcrypt)

Todas las contraseñas son **`123456`**:
| email | nombre | rol |
|---|---|---|
| carlos@email.com | Carlos Rodríguez | ciclista |
| mariana@email.com | Mariana López | ciclista |
| andres@email.com | Andrés Ramírez | organizador |
| laura@email.com | Laura Méndez | ciclista |
| pedro@email.com | Pedro Sánchez | administrador |
| juan77@gmail.com | 777pro | ciclista (creado manualmente) |

---

## 4. API REST activa — `mi-api` (`http://127.0.0.1:3000/api`)

| Módulo | Endpoints |
|---|---|
| Auth | `POST /login` (crea `sesion` y devuelve `token`), `POST /registro` (crea usuario + perfil) |
| Usuarios | `GET/PUT/DELETE /usuarios/:id`, `GET /admin/usuarios`, `PUT /admin/usuarios/:id/rol`, `DELETE /admin/usuarios/:id` (activo=0) |
| Perfil | `GET/PUT /perfil/:id`, `PUT /perfil/:id/password` |
| Rutas | `GET /rutas`, `GET /rutas/:id` (con reseñas y promedio), CRUD admin |
| Geometría rutas | `CRUD /rutas/:ruta_id/puntos`, `/rutas/:ruta_id/paradas` |
| Comercios | `GET /comercios?tipo=`, `GET /comercios/:id` (resenas + promedio), CRUD admin |
| Eventos | `GET /eventos`, `GET /eventos/:id`, `POST /eventos`, `inscribir`, `cancelar-inscripcion`, `cancelar`, `confirmar`, `asistio`, CRUD admin |
| Sesiones | `GET /sesiones/usuario/:id`, `DELETE /sesiones/:id`, `DELETE /sesiones/usuario/:id` (logout) |
| Bicicletas | CRUD `/bicicletas/usuario/:id`, `GET /bicicletas/:id` |
| Favoritos | `POST/DELETE /favoritos?usuario_id=&ruta_id=` |
| Reseñas | `POST /resenas`, `PUT/DELETE /resenas/:id` (sincroniza `comercio.calificacion`) |
| Rutas realizadas | `GET /rutas-realizadas?usuario_id=`, `POST /rutas-realizadas` (suma km al perfil) |
| Social | seguidores, publicaciones, comentarios, me gusta |
| Notificaciones | `GET /notificaciones/usuario/:id`, `PUT /notificaciones/:id/leida`, `PUT /notificaciones/leidas` |
| Logros | `GET /logros`, `GET /logros/usuario/:id` |
| Patrocinadores | CRUD `/patrocinadores`, `POST /patrocinadores/:id/eventos` |
| Reportes | `GET /reportes?estado=`, `POST /reportes`, `PUT /reportes/:id/estado` |
| Horarios comercio | `GET /comercios/:id/horarios`, CRUD |

---

## 5. Cómo iniciar el proyecto web

1. Servicio MySQL arriba (Running). Si no: `net start MySQL` (admin).
2. Importar BD (una sola vez): `mysql -u root palmonte < database\palmonte.sql`.
3. Backend activo (`mi-api`):
   ```cmd
   cd mi-api
   npm install
   npm run dev        :: o: node index.js  (o doble clic en dev.bat / start-api.bat)
   ```
   Response en `http://127.0.0.1:3000/api`.
4. Frontend: abrir `main/palmonte.html` en el navegador (usa el puerto 3000).

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

### 6.1 Integración con la API

- `data/ApiService.kt` → `ApiClient.BASE_URL = "http://10.0.2.2:8000/api/"`
  (10.0.2.2 = loopback del host desde el emulador; apunta al backend legacy).
- `data/SessionManager.kt` → guarda/recupera usuario en `SharedPreferences`
  (`sesion_palmonte`).

---

## 7. Evidencias

### EV01 (web) — GA8-220501096-AA1-EV01
- Software integrado (backend API + frontend + BD). ✅
- Base de datos: `database/palmonte.sql` (24 tablas, restaurada/verificada). ✅
- Manual técnico: `README.md`. ✅
- Guía de capturas: `docs/guia_evidencia.md` (15 pasos). ✅
- Script de arranque: `start.bat`. ✅
- Repo Git: ramas `main`, `Dev`, `BrayanRincon` sincronizadas en `de7f2c5`. ✅

### EV02 (APK) — GA8-220501096-AA2-EV02
- App Android con módulos conectados al backend Pal' Monte. En construcción
  (ver §6).

### EV03 (taller) — GA8-220501096-AA2-EV03
- Investigación corta sobre desarrollo Android + tecnologías emergentes/
  disruptivas. Documento a generar:
  `docs/Taller_Android_GA8-220501096-AA2-EV03.docx`.

---

## 8. Estado actual del trabajo (checklist)

Web + API (EV01):
- [x] Base de datos ampliada a 24 tablas (módulos: sesiones, bicicletas,
      geometría de rutas, social, notificaciones, logros, patrocinadores,
      reportes, horarios) con FKs, índices, CHECKs y datos demo
- [x] `mi-api` (Express): 16 módulos de endpoints cableados en `app.js`
- [x] Login con sesión (`sesion`) y devolución de `token`
- [x] Revisión lógica de BD: duplicados de reseña protegidos (UNIQUE),
      cupos de evento validados (CHECK), promedio de comercio sincronizado
      desde reseñas, mojibake corregido en seed
- [x] Frontend conectado (puerto 3000 / legacy 8000)
- [x] README (manual técnico), PROJECT_CONTEXT, PLAN_DIVISION
- [x] Repo Git sincronizado + push a GitHub (`main = Dev = BrayanRincon = de7f2c5`)
- [ ] Validar import del SQL en el MySQL de destino (no hay cliente local)

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
:: Importar BD
mysql -u root palmonte < database\palmonte.sql

:: Backend activo (mi-api)
cd mi-api && npm install && npm run dev
:: (alternativa: doble clic en mi-api\dev.bat o mi-api\start-api.bat)

:: Backend legacy (FastAPI)
D:\U\ProgWeb\PalMonte\backend> venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000

:: Android: compilar APK debug
D:\Android\AppPedalea> gradlew.bat :app:assembleDebug
:: el APK queda en app\build\outputs\apk\debug\app-debug.apk
```