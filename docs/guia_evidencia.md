# Guía de Evidencia Visual - Pal' Monte

Guion sugerido para demostrar que **los módulos están integrados** (comparten la misma
base de datos y se comunican con la API). Cada punto indica qué captura tomar
(prt sc / Win + Shift + S) y qué se debe ver en pantalla.

> Antes de empezar: verifica que MySQL esté corriendo y que la API responda
> en `http://127.0.0.1:8000`. Abre `http://127.0.0.1:8000/docs` para comprobar la API.

---

## Captura 1 - Backend en funcionamiento

**Qué mostrar:** la consola del servidor corriendo (Uvicorn) con los mensajes de
inicialización de la base de datos y el log `Application startup complete`.

**Por qué cuenta:** evidencia que la API (capa de servidor) está activa.

## Captura 2 - Documentación de la API (Swagger)

**Qué mostrar:** `http://127.0.0.1:8000/docs` con la lista de endpoints de la API
(registro, login, rutas, eventos, comercios, reseñas, etc.).

**Por qué cuenta:** muestra los contratos de integración entre los módulos.

## Captura 3 - Registro de usuario

**Qué mostrar:** el formulario de `sesion/registro.html` llenado y el mensaje de éxito.

**Por qué cuenta:** el módulo de sesión crea datos en la BD.

## Captura 4 - Inicio de sesión

**Qué mostrar:** iniciar sesión con `carlos@email.com` / `123456` y ver la portada con
el nombre del usuario en el menú superior (botón "Cerrar sesión" visible).

**Por qué cuenta:** el estado de sesión se propaga a los demás módulos.

## Captura 5 - Portada con datos reales

**Qué mostrar:** `main/palmonte.html` con las tarjetas de **rutas y eventos destacados**
cargadas desde la API (deben coincidir con los registros de la BD).

**Por qué cuenta:** la portada consume datos reales, no datos estáticos.

## Captura 6 - Listado de rutas con filtro

**Qué mostrar:** `rutas/rutas.html` y aplicar el filtro de dificultad (ej. "Alta"),
mostrando solo las rutas correspondientes.

**Por qué cuenta:** el módulo de rutas consulta la API con parámetros de filtrado.

## Captura 7 - Detalle de ruta con reseñas

**Qué mostrar:** `rutas/detalleRuta.html?id=X` con la información de la ruta, el
promedio de calificación y las reseñas de otros usuarios.

**Por qué cuenta:** integración ruta ↔ reseñas ↔ usuarios.

## Captura 8 - Dejar una reseña en una ruta

**Qué mostrar:** el formulario de calificación/comentario y el mensaje "Reseña guardada".
Luego mostrar que el detalle de la ruta actualiza el promedio.

**Por qué cuenta:** el módulo de reseñas modifica datos visibles en rutas.

## Captura 9 - Favoritos y rutas realizadas

**Qué mostrar:** en `sesion/perfil.html`, la sección de **favoritos** y el **historial**
con los kilómetros recorridos acumulados.

**Por qué cuenta:** integración usuario ↔ rutas ↔ historial ↔ perfil.

## Captura 10 - Listado de eventos próximos

**Qué mostrar:** `eventos/eventos.html` con los eventos con fecha futura, cupos
disponibles y organizador.

**Por qué cuenta:** el módulo de eventos filtra por fecha (integración con BD).

## Captura 11 - Inscripción a un evento

**Qué mostrar:** en el detalle del evento, inscribirse (mensaje "Inscripción exitosa") y
ver el cupo actualizado (ej. 24/50 → 25/50).

**Por qué cuenta:** integración usuario ↔ evento ↔ cupos.

## Captura 12 - Cancelar inscripción

**Qué mostrar:** cancelar la inscripción y ver el cupo decrecer.

**Por qué cuenta:** cierre del ciclo de inscripción.

## Captura 13 - Listado y detalle de comercios

**Qué mostrar:** `comercio/comercio.html` con filtro por tipo y el detalle de un comercio
con sus reseñas.

**Por qué cuenta:** módulo de comercios integrado con reseñas y usuarios.

## Captura 14 - Perfil con edición

**Qué mostrar:** `sesion/perfil.html` con los datos del usuario, favoritos e historial, y
la edición de datos/cambio de contraseña.

**Por qué cuenta:** CRUD del módulo de sesión sobre la BD.

## Captura 15 - Base de datos con los datos

**Qué mostrar:** una consulta a la BD (cliente `mysql` o phpMyAdmin si lo tienes) con las
9 tablas y algunos registros, p. ej.:

```sql
SHOW TABLES;
SELECT id, nombre, email FROM usuario;
SELECT id, nombre, distancia_km, dificultad FROM ruta;
SELECT id, titulo, fecha, cupo_actual, cupo_max FROM evento;
```

**Por qué cuenta:** confirma que todos los módulos escriben/leen la misma base de datos.

---

## Entrega

1. Ordena las capturas en un **documento PDF** o **PowerPoint** titulado
   "Evidencia GA8-220501096-AA1-EV01 - Integración de módulos".
2. Acompaña con el **proyecto comprimido** (código fuente + `palmonte.sql` + este
   manual). Puedes usar el `PalMonte_entrega.zip` generado o el repositorio Git.
3. Opcional: un **video corto** (2-3 min) recorriendo la demo de las capturas 1 a 14.
