# División del trabajo en equipo (3 miembros)

Repositorio: `mi-api/`. Cada miembro trabaja sobre sus propios archivos (`controller` + `routes`)
y los sube a git por separado. El proyecto se conecta a la base de datos **MySQL `palmonte`**
existente (misma que usa el backend FastAPI).

## Requisitos previos (todos)
```bash
cd mi-api
npm init -y
npm install express dotenv mysql2
npm install -D nodemon
```

Configurar `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=palmonte
PORT=3000
```

Correr: `npm run dev` (o `npm start`).

---

## MIEMBRO 1 — Usuarios, Perfil y Autenticación (9 endpoints)
Archivos que debe crear/editar:
- `src/controllers/usuarios.controller.js`
- `src/routes/usuarios.routes.js`

| Endpoint | Método |
|----------|--------|
| `/api/registro` | POST |
| `/api/login` | POST |
| `/api/perfil/:usuario_id` | GET |
| `/api/perfil/:usuario_id` | PUT |
| `/api/perfil/:usuario_id/password` | PUT |
| `/api/admin/usuarios` | GET |
| `/api/admin/usuarios/:usuario_id/rol` | PUT |
| `/api/admin/usuarios/:usuario_id` | PUT |
| `/api/admin/usuarios/:usuario_id` | DELETE |

---

## MIEMBRO 2 — Rutas, Comercios y Eventos (21 endpoints)
Archivos:
- `src/controllers/rutas.controller.js` + `src/routes/rutas.routes.js`
- `src/controllers/comercios.controller.js` + `src/routes/comercios.routes.js`
- `src/controllers/eventos.controller.js` + `src/routes/eventos.routes.js`

| Endpoint | Método |
|----------|--------|
| `/api/rutas` | GET |
| `/api/rutas/:ruta_id` | GET |
| `/api/admin/rutas` | POST |
| `/api/admin/rutas/:ruta_id` | PUT |
| `/api/admin/rutas/:ruta_id` | DELETE |
| `/api/comercios` | GET |
| `/api/comercios/:comercio_id` | GET |
| `/api/admin/comercios` | POST |
| `/api/admin/comercios/:comercio_id` | PUT |
| `/api/admin/comercios/:comercio_id` | DELETE |
| `/api/eventos` | GET |
| `/api/eventos/:evento_id` | GET |
| `/api/eventos` | POST |
| `/api/eventos/:evento_id/inscribir` | POST |
| `/api/eventos/:evento_id/cancelar-inscripcion` | DELETE |
| `/api/eventos/:evento_id/cancelar` | PUT |
| `/api/eventos/:evento_id/confirmar` | PUT |
| `/api/eventos/:evento_id/asistio` | PUT |
| `/api/admin/eventos` | GET |
| `/api/admin/eventos/:evento_id` | PUT |
| `/api/admin/eventos/:evento_id` | DELETE |

---

## MIEMBRO 3 — Favoritos, Reseñas y Rutas realizadas (8 endpoints)
Archivos:
- `src/controllers/favoritos.controller.js` + `src/routes/favoritos.routes.js`
- `src/controllers/resenas.controller.js` + `src/routes/resenas.routes.js`
- `src/controllers/rutasRealizadas.controller.js` + `src/routes/rutasRealizadas.routes.js`

| Endpoint | Método |
|----------|--------|
| `/api/favoritos?usuario_id=` | GET |
| `/api/favoritos?usuario_id=&ruta_id=` | POST |
| `/api/favoritos?usuario_id=&ruta_id=` | DELETE |
| `/api/resenas` | POST |
| `/api/resenas/:resena_id` | PUT |
| `/api/resenas/:resena_id` | DELETE |
| `/api/rutas-realizadas?usuario_id=` | GET |
| `/api/rutas-realizadas` | POST |

---

## Cómo subir cada parte a git

Cada miembro hace su commit y push de sus propios archivos:

```bash
git add src/controllers/mi_archivo.controller.js src/routes/mi_archivo.routes.js
git commit -m "feat(mi-api): endpoints de <sección>"
git push origin <rama>
```

> **IMPORTANTE:** NO subir `.env` ni `node_modules/` (están en `.gitignore`).
> Asegúrate de que exista un `.gitignore` con estas líneas:
> ```
> node_modules/
> .env
> ```

## Cableado central (`src/app.js`)

`src/app.js` registra los 7 routers. Si un miembro crea un archivo con otro nombre,
debe actualizar la línea correspondiente en `app.js`, pero lo ideal es mantener los nombres
de arriba para que cada quien solo suba sus archivos sin tocar los de los demás.
