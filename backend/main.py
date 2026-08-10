from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime
import bcrypt
from database import get_db_connection
from models import *
import mysql.connector
from pydantic import BaseModel
from fastapi import Request

app = FastAPI(title="Pal' Monte API", description="API para app de ciclistas", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==============================================
# CREAR BASE DE DATOS Y TABLAS (AUTOMÁTICO)
# ==============================================

def init_database():
    try:
        # Conectar sin seleccionar base de datos
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""
        )
        cursor = conn.cursor()
        
        # Crear base de datos si no existe
        cursor.execute("CREATE DATABASE IF NOT EXISTS palmonte")
        print("[OK] Base de datos 'palmonte' creada/verificada")
        
        # Usar la base de datos
        cursor.execute("USE palmonte")
        
        # ==========================================
        # TABLA: usuario
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuario (
                id INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                fecha_nacimiento DATE NULL,
                telefono VARCHAR(20) NULL,
                fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                activo BOOLEAN NOT NULL DEFAULT TRUE,
                PRIMARY KEY (id),
                UNIQUE INDEX idx_usuario_email (email)
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'usuario' creada/verificada")
        
        # ==========================================
        # TABLA: perfil
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS perfil (
                id_usuario INT NOT NULL,
                foto VARCHAR(255) NULL DEFAULT 'default_avatar.png',
                km_recorridos DECIMAL(10,2) NOT NULL DEFAULT 0,
                nivel_ciclista ENUM('principiante', 'intermedio', 'avanzado') NOT NULL DEFAULT 'principiante',
                rol ENUM('ciclista', 'organizador', 'administrador') NOT NULL DEFAULT 'ciclista',
                PRIMARY KEY (id_usuario),
                CONSTRAINT fk_perfil_usuario
                    FOREIGN KEY (id_usuario)
                    REFERENCES usuario (id)
                    ON DELETE CASCADE
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'perfil' creada/verificada")
        
        # ==========================================
        # TABLA: ruta
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ruta (
                id INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT NULL,
                distancia_km DECIMAL(5,2) NOT NULL,
                dificultad ENUM('baja', 'media', 'alta') NOT NULL,
                tipo_bici VARCHAR(50) NULL,
                tiempo_estimado DECIMAL(4,2) NULL,
                coordenadas VARCHAR(100) NULL,
                zona VARCHAR(100) NULL,
                elevacion INT NULL,
                superficie VARCHAR(50) NULL DEFAULT 'mixta',
                imagen VARCHAR(255) NULL DEFAULT 'default_route.png',
                gpx_url VARCHAR(255) NULL,
                PRIMARY KEY (id),
                INDEX idx_ruta_dificultad (dificultad),
                INDEX idx_ruta_zona (zona)
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'ruta' creada/verificada")
        
        # ==========================================
        # TABLA: evento
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS evento (
                id INT NOT NULL AUTO_INCREMENT,
                titulo VARCHAR(100) NOT NULL,
                descripcion TEXT NULL,
                fecha DATE NOT NULL,
                hora_inicio TIME NOT NULL,
                lugar VARCHAR(200) NOT NULL,
                cupo_max INT NOT NULL,
                cupo_actual INT NOT NULL DEFAULT 0,
                id_organizador INT NULL,
                imagen VARCHAR(255) NULL DEFAULT 'default_event.png',
                cancelado BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY (id),
                INDEX idx_evento_fecha (fecha),
                CONSTRAINT fk_evento_organizador
                    FOREIGN KEY (id_organizador)
                    REFERENCES usuario (id)
                    ON DELETE SET NULL
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'evento' creada/verificada")
        
        # ==========================================
        # TABLA: comercio
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS comercio (
                id INT NOT NULL AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                tipo ENUM('taller', 'tienda', 'cafe', 'restaurante') NOT NULL,
                direccion VARCHAR(255) NULL,
                coordenadas VARCHAR(100) NULL,
                telefono VARCHAR(20) NULL,
                horario VARCHAR(100) NULL,
                foto VARCHAR(255) NULL DEFAULT 'default_commerce.png',
                calificacion DECIMAL(2,1) NOT NULL DEFAULT 0,
                verificado BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY (id),
                INDEX idx_comercio_tipo (tipo)
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'comercio' creada/verificada")
        
        # ==========================================
        # TABLA: favorito
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS favorito (
                id_usuario INT NOT NULL,
                id_ruta INT NOT NULL,
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id_usuario, id_ruta),
                CONSTRAINT fk_favorito_usuario
                    FOREIGN KEY (id_usuario)
                    REFERENCES usuario (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_favorito_ruta
                    FOREIGN KEY (id_ruta)
                    REFERENCES ruta (id)
                    ON DELETE CASCADE
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'favorito' creada/verificada")
        
        # ==========================================
        # TABLA: ruta_realizada
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ruta_realizada (
                id_usuario INT NOT NULL,
                id_ruta INT NOT NULL,
                fecha DATE NOT NULL,
                tiempo_real DECIMAL(4,2) NULL,
                observaciones TEXT NULL,
                PRIMARY KEY (id_usuario, id_ruta, fecha),
                CONSTRAINT fk_realizada_usuario
                    FOREIGN KEY (id_usuario)
                    REFERENCES usuario (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_realizada_ruta
                    FOREIGN KEY (id_ruta)
                    REFERENCES ruta (id)
                    ON DELETE CASCADE
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'ruta_realizada' creada/verificada")
        
        # ==========================================
        # TABLA: resena
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS resena (
                id INT NOT NULL AUTO_INCREMENT,
                id_usuario INT NOT NULL,
                id_ruta INT NULL,
                id_comercio INT NULL,
                comentario TEXT NOT NULL,
                calificacion TINYINT NOT NULL,
                fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id),
                INDEX idx_resena_fecha (fecha),
                CONSTRAINT fk_resena_usuario
                    FOREIGN KEY (id_usuario)
                    REFERENCES usuario (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_resena_ruta
                    FOREIGN KEY (id_ruta)
                    REFERENCES ruta (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_resena_comercio
                    FOREIGN KEY (id_comercio)
                    REFERENCES comercio (id)
                    ON DELETE CASCADE,
                CONSTRAINT chk_resena_tipo CHECK (
                    (id_ruta IS NOT NULL AND id_comercio IS NULL) OR
                    (id_ruta IS NULL AND id_comercio IS NOT NULL)
                ),
                CONSTRAINT chk_resena_calificacion CHECK (calificacion BETWEEN 1 AND 5)
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'resena' creada/verificada")
        
        # ==========================================
        # TABLA: asistencia_evento
        # ==========================================
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS asistencia_evento (
                id_usuario INT NOT NULL,
                id_evento INT NOT NULL,
                fecha_inscripcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                confirmado BOOLEAN NOT NULL DEFAULT FALSE,
                asistio BOOLEAN NOT NULL DEFAULT FALSE,
                PRIMARY KEY (id_usuario, id_evento),
                CONSTRAINT fk_asistencia_usuario
                    FOREIGN KEY (id_usuario)
                    REFERENCES usuario (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_asistencia_evento
                    FOREIGN KEY (id_evento)
                    REFERENCES evento (id)
                    ON DELETE CASCADE
            ) ENGINE = InnoDB
        """)
        print("[OK] Tabla 'asistencia_evento' creada/verificada")
        
        cursor.close()
        conn.close()
        print("\n[OK] BASE DE DATOS COMPLETA CREADA/VERIFICADA!")
        
    except Exception as e:
        print(f"[ERROR] Error al inicializar la base de datos: {e}")

# Ejecutar la inicialización ANTES de los endpoints
init_database()

# ==============================================
# AUTH (Autenticación)
# ==============================================

@app.post("/api/registro")
def registro(usuario: UsuarioRegistro):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT id FROM usuario WHERE email = %s", (usuario.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed = bcrypt.hashpw(usuario.password.encode('utf-8'), bcrypt.gensalt())
    
    cursor.execute("""
    INSERT INTO usuario (nombre, email, password, telefono)
    VALUES (%s, %s, %s, %s)
""", (usuario.nombre, usuario.email, hashed.decode('utf-8'), usuario.telefono))
    user_id = cursor.lastrowid
    
    cursor.execute("""
        INSERT INTO perfil (id_usuario, nivel_ciclista)
        VALUES (%s, %s)
    """, (user_id, usuario.nivel))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Usuario registrado exitosamente", "id": user_id}

@app.post("/api/login")
def login(credenciales: UsuarioLogin):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.nombre, u.email, u.password, p.nivel_ciclista as nivel, p.rol
        FROM usuario u
        JOIN perfil p ON u.id = p.id_usuario
        WHERE u.email = %s AND u.activo = 1
    """, (credenciales.email,))
    
    usuario = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    if not bcrypt.checkpw(credenciales.password.encode('utf-8'), usuario["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
    return {
        "id": usuario["id"],
        "nombre": usuario["nombre"],
        "email": usuario["email"],
        "nivel": usuario["nivel"],
        "rol": usuario["rol"]
    }

# ==============================================
# PERFIL (COMPLETO)
# ==============================================

@app.get("/api/perfil/{usuario_id}")
def get_perfil(usuario_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro,
               p.km_recorridos, p.nivel_ciclista, p.rol
        FROM usuario u
        JOIN perfil p ON u.id = p.id_usuario
        WHERE u.id = %s
    """, (usuario_id,))
    
    perfil = cursor.fetchone()
    
    if not perfil:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    cursor.execute("""
        SELECT r.id, r.nombre, r.distancia_km, r.dificultad
        FROM favorito f
        JOIN ruta r ON f.id_ruta = r.id
        WHERE f.id_usuario = %s
    """, (usuario_id,))
    perfil["favoritos"] = cursor.fetchall()
    
    cursor.execute("""
        SELECT r.id, r.nombre, r.distancia_km, rr.fecha, rr.tiempo_real
        FROM ruta_realizada rr
        JOIN ruta r ON rr.id_ruta = r.id
        WHERE rr.id_usuario = %s
        ORDER BY rr.fecha DESC
    """, (usuario_id,))
    perfil["historial"] = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return perfil

@app.put("/api/perfil/{usuario_id}")
def update_perfil(usuario_id: int, nombre: str, telefono: Optional[str] = None, nivel: Optional[str] = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    
    cursor.execute("UPDATE usuario SET nombre = %s, telefono = %s WHERE id = %s", 
                   (nombre, telefono, usuario_id))
    
    if nivel:
        cursor.execute("UPDATE perfil SET nivel_ciclista = %s WHERE id_usuario = %s", 
                       (nivel, usuario_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Perfil actualizado correctamente"}

@app.put("/api/perfil/{usuario_id}/password")
def update_password(usuario_id: int, password_actual: str, password_nueva: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password FROM usuario WHERE id = %s", (usuario_id,))
    usuario = cursor.fetchone()
    
    if not bcrypt.checkpw(password_actual.encode('utf-8'), usuario["password"].encode('utf-8')):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")
    
    hashed = bcrypt.hashpw(password_nueva.encode('utf-8'), bcrypt.gensalt())
    cursor.execute("UPDATE usuario SET password = %s WHERE id = %s", (hashed.decode('utf-8'), usuario_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Contraseña actualizada correctamente"}

# ==============================================
# RUTAS (COMPLETO)
# ==============================================

@app.get("/api/rutas")
def get_rutas(dificultad: Optional[str] = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    
    if dificultad and dificultad != "todas":
        cursor.execute("""
            SELECT id, nombre, descripcion, distancia_km, dificultad, tipo_bici,
                   tiempo_estimado, coordenadas, zona, elevacion, superficie, imagen
            FROM ruta WHERE dificultad = %s ORDER BY distancia_km
        """, (dificultad,))
    else:
        cursor.execute("""
            SELECT id, nombre, descripcion, distancia_km, dificultad, tipo_bici,
                   tiempo_estimado, coordenadas, zona, elevacion, superficie, imagen
            FROM ruta ORDER BY distancia_km
        """)
    
    rutas = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return rutas

@app.get("/api/rutas/{ruta_id}")
def get_ruta(ruta_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, nombre, descripcion, distancia_km, dificultad, tipo_bici,
               tiempo_estimado, coordenadas, zona, elevacion, superficie, imagen
        FROM ruta WHERE id = %s
    """, (ruta_id,))
    
    ruta = cursor.fetchone()
    
    if not ruta:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Ruta no encontrada")
    
    cursor.execute("""
        SELECT r.calificacion, r.comentario, r.fecha, u.nombre as usuario
        FROM resena r
        JOIN usuario u ON r.id_usuario = u.id
        WHERE r.id_ruta = %s
        ORDER BY r.fecha DESC
    """, (ruta_id,))
    ruta["reseñas"] = cursor.fetchall()
    
    cursor.execute("SELECT AVG(calificacion) as promedio FROM resena WHERE id_ruta = %s", (ruta_id,))
    promedio = cursor.fetchone()
    ruta["promedio_calificacion"] = float(promedio["promedio"]) if promedio["promedio"] else 0
    
    cursor.close()
    conn.close()
    
    return ruta

# ==============================================
# ADMIN - RUTAS (CRUD completo)
# ==============================================

@app.post("/api/admin/rutas")
def create_ruta(ruta: Ruta):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO ruta (nombre, descripcion, distancia_km, dificultad, tipo_bici,
                         tiempo_estimado, coordenadas, zona, elevacion, superficie)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (ruta.nombre, ruta.descripcion, ruta.distancia_km, ruta.dificultad,
          ruta.tipo_bici, ruta.tiempo_estimado, ruta.coordenadas, ruta.zona,
          ruta.elevacion, ruta.superficie))
    
    ruta_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Ruta creada exitosamente", "id": ruta_id}

@app.put("/api/admin/rutas/{ruta_id}")
def update_ruta(ruta_id: int, ruta: Ruta):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE ruta SET 
            nombre = %s, descripcion = %s, distancia_km = %s, dificultad = %s,
            tipo_bici = %s, tiempo_estimado = %s, coordenadas = %s, zona = %s,
            elevacion = %s, superficie = %s
        WHERE id = %s
    """, (ruta.nombre, ruta.descripcion, ruta.distancia_km, ruta.dificultad,
          ruta.tipo_bici, ruta.tiempo_estimado, ruta.coordenadas, ruta.zona,
          ruta.elevacion, ruta.superficie, ruta_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Ruta actualizada exitosamente"}

@app.delete("/api/admin/rutas/{ruta_id}")
def delete_ruta(ruta_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM ruta WHERE id = %s", (ruta_id,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Ruta eliminada exitosamente"}

# ==============================================
# COMERCIOS
# ==============================================

@app.get("/api/comercios")
def get_comercios(tipo: Optional[str] = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    
    if tipo and tipo != "todos":
        cursor.execute("""
            SELECT id, nombre, tipo, direccion, coordenadas, telefono, horario, foto, calificacion
            FROM comercio WHERE tipo = %s ORDER BY nombre
        """, (tipo,))
    else:
        cursor.execute("""
            SELECT id, nombre, tipo, direccion, coordenadas, telefono, horario, foto, calificacion
            FROM comercio ORDER BY nombre
        """)
    
    comercios = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return comercios

@app.get("/api/comercios/{comercio_id}")
def get_comercio(comercio_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, nombre, tipo, direccion, coordenadas, telefono, horario, foto, calificacion, verificado
        FROM comercio WHERE id = %s
    """, (comercio_id,))
    
    comercio = cursor.fetchone()
    
    if not comercio:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Comercio no encontrado")
    
    cursor.execute("""
        SELECT r.calificacion, r.comentario, r.fecha, u.nombre as usuario
        FROM resena r
        JOIN usuario u ON r.id_usuario = u.id
        WHERE r.id_comercio = %s
        ORDER BY r.fecha DESC
    """, (comercio_id,))
    comercio["reseñas"] = cursor.fetchall()
    
    cursor.execute("SELECT AVG(calificacion) as promedio FROM resena WHERE id_comercio = %s", (comercio_id,))
    promedio = cursor.fetchone()
    comercio["promedio_calificacion"] = float(promedio["promedio"]) if promedio["promedio"] else 0
    
    cursor.close()
    conn.close()
    
    return comercio

# ==============================================
# ADMIN - COMERCIOS (CRUD completo)
# ==============================================

@app.post("/api/admin/comercios")
def create_comercio(comercio: Comercio):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO comercio (nombre, tipo, direccion, coordenadas, telefono, horario)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (comercio.nombre, comercio.tipo, comercio.direccion,
          comercio.coordenadas, comercio.telefono, comercio.horario))
    
    comercio_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Comercio creado exitosamente", "id": comercio_id}

@app.put("/api/admin/comercios/{comercio_id}")
def update_comercio(comercio_id: int, comercio: Comercio):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE comercio SET 
            nombre = %s, tipo = %s, direccion = %s, coordenadas = %s,
            telefono = %s, horario = %s
        WHERE id = %s
    """, (comercio.nombre, comercio.tipo, comercio.direccion,
          comercio.coordenadas, comercio.telefono, comercio.horario, comercio_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Comercio actualizado exitosamente"}

@app.delete("/api/admin/comercios/{comercio_id}")
def delete_comercio(comercio_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM comercio WHERE id = %s", (comercio_id,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Comercio eliminado exitosamente"}

# ==============================================
# EVENTOS (COMPLETO)
# ==============================================

@app.get("/api/eventos")
def get_eventos():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT id, titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, cupo_actual, cancelado
        FROM evento WHERE fecha >= CURDATE() AND cancelado = 0 ORDER BY fecha ASC
    """)
    
    eventos = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return eventos

@app.get("/api/eventos/{evento_id}")
def get_evento(evento_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT e.id, e.titulo, e.descripcion, e.fecha, e.hora_inicio, e.lugar,
               e.cupo_max, e.cupo_actual, e.cancelado, u.nombre as organizador
        FROM evento e
        LEFT JOIN usuario u ON e.id_organizador = u.id
        WHERE e.id = %s
    """, (evento_id,))
    
    evento = cursor.fetchone()
    
    if not evento:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    cursor.execute("""
        SELECT u.id, u.nombre
        FROM asistencia_evento a
        JOIN usuario u ON a.id_usuario = u.id
        WHERE a.id_evento = %s
    """, (evento_id,))
    evento["asistentes"] = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return evento

@app.post("/api/eventos")
def create_evento(evento: Evento, organizador_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO evento (titulo, descripcion, fecha, hora_inicio, lugar, cupo_max, id_organizador)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (evento.titulo, evento.descripcion, evento.fecha, evento.hora_inicio,
          evento.lugar, evento.cupo_max, organizador_id))
    
    evento_id = cursor.lastrowid
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Evento creado exitosamente", "id": evento_id}

@app.post("/api/eventos/{evento_id}/inscribir")
async def inscribir_evento(evento_id: int, request: Request):
    try:
        data = await request.json()
        usuario_id = data.get("usuario_id")
        
        if not usuario_id:
            raise HTTPException(status_code=400, detail="usuario_id es requerido")
        
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de conexión")
        
        cursor = conn.cursor(dictionary=True)
        
        # Verificar si el evento existe y tiene cupo
        cursor.execute("SELECT cupo_actual, cupo_max, cancelado FROM evento WHERE id = %s", (evento_id,))
        evento = cursor.fetchone()
        
        if not evento:
            raise HTTPException(status_code=404, detail="Evento no encontrado")
        
        if evento["cancelado"]:
            raise HTTPException(status_code=400, detail="Evento cancelado")
        
        if evento["cupo_actual"] >= evento["cupo_max"]:
            raise HTTPException(status_code=400, detail="No hay cupos disponibles")
        
        # Verificar si ya está inscrito
        cursor.execute("SELECT * FROM asistencia_evento WHERE id_usuario = %s AND id_evento = %s", (usuario_id, evento_id))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Ya estás inscrito")
        
        # Insertar inscripción
        cursor.execute("INSERT INTO asistencia_evento (id_usuario, id_evento) VALUES (%s, %s)", (usuario_id, evento_id))
        
        # Actualizar cupo
        cursor.execute("UPDATE evento SET cupo_actual = cupo_actual + 1 WHERE id = %s", (evento_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"message": "Inscripción exitosa"}
        
    except HTTPException:
        raise
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/eventos/{evento_id}/cancelar-inscripcion")
async def cancelar_inscripcion(evento_id: int, request: Request):
    try:
        data = await request.json()
        usuario_id = data.get("usuario_id")
        
        if not usuario_id:
            raise HTTPException(status_code=400, detail="usuario_id es requerido")
        
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de conexión")
        
        cursor = conn.cursor(dictionary=True)
        
        # Verificar si está inscrito
        cursor.execute("SELECT * FROM asistencia_evento WHERE id_usuario = %s AND id_evento = %s", (usuario_id, evento_id))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            raise HTTPException(status_code=400, detail="No estás inscrito a este evento")
        
        # Eliminar inscripción
        cursor.execute("DELETE FROM asistencia_evento WHERE id_usuario = %s AND id_evento = %s", (usuario_id, evento_id))
        
        # Actualizar cupo
        cursor.execute("UPDATE evento SET cupo_actual = cupo_actual - 1 WHERE id = %s", (evento_id,))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"message": "Inscripción cancelada exitosamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/eventos/{evento_id}/cancelar")
def cancelar_evento(evento_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("UPDATE evento SET cancelado = 1 WHERE id = %s", (evento_id,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Evento cancelado"}

# ==============================================
# FAVORITOS
# ==============================================

@app.post("/api/favoritos")
def add_favorito(usuario_id: int, ruta_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    
    try:
        cursor.execute("""
            INSERT INTO favorito (id_usuario, id_ruta) VALUES (%s, %s)
        """, (usuario_id, ruta_id))
        conn.commit()
    except:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Ya está en favoritos")
    
    cursor.close()
    conn.close()
    
    return {"message": "Agregado a favoritos"}

@app.delete("/api/favoritos")
def remove_favorito(usuario_id: int, ruta_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("""
        DELETE FROM favorito WHERE id_usuario = %s AND id_ruta = %s
    """, (usuario_id, ruta_id))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Eliminado de favoritos"}

# ==============================================
# RESEÑAS
# ==============================================

@app.post("/api/resenas")
async def add_resena(request: Request):
    try:
        data = await request.json()
        
        id_usuario = data.get("id_usuario")
        id_ruta = data.get("id_ruta")
        id_comercio = data.get("id_comercio")
        calificacion = data.get("calificacion")
        comentario = data.get("comentario")
        
        if not id_usuario:
            raise HTTPException(status_code=400, detail="id_usuario es requerido")
        
        if not calificacion:
            raise HTTPException(status_code=400, detail="calificacion es requerida")
        
        if not comentario:
            raise HTTPException(status_code=400, detail="comentario es requerido")
        
        conn = get_db_connection()
        if not conn:
            raise HTTPException(status_code=500, detail="Error de conexión")
        
        cursor = conn.cursor()
        
        if id_ruta:
            cursor.execute("SELECT * FROM resena WHERE id_usuario = %s AND id_ruta = %s", (id_usuario, id_ruta))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                raise HTTPException(status_code=400, detail="Ya calificaste esta ruta")
            
            cursor.execute("""
                INSERT INTO resena (id_usuario, id_ruta, calificacion, comentario)
                VALUES (%s, %s, %s, %s)
            """, (id_usuario, id_ruta, calificacion, comentario))
        
        elif id_comercio:
            cursor.execute("SELECT * FROM resena WHERE id_usuario = %s AND id_comercio = %s", (id_usuario, id_comercio))
            if cursor.fetchone():
                cursor.close()
                conn.close()
                raise HTTPException(status_code=400, detail="Ya calificaste este comercio")
            
            cursor.execute("""
                INSERT INTO resena (id_usuario, id_comercio, calificacion, comentario)
                VALUES (%s, %s, %s, %s)
            """, (id_usuario, id_comercio, calificacion, comentario))
        
        else:
            raise HTTPException(status_code=400, detail="Debes especificar una ruta o un comercio")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {"message": "Reseña guardada exitosamente"}
        
    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# ==============================================
# ADMIN - USUARIOS
# ==============================================

@app.get("/api/admin/usuarios")
def get_usuarios():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT u.id, u.nombre, u.email, u.telefono, u.fecha_registro, u.activo,
               p.nivel_ciclista, p.rol
        FROM usuario u
        JOIN perfil p ON u.id = p.id_usuario
    """)
    
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return usuarios

@app.put("/api/admin/usuarios/{usuario_id}/rol")
def update_rol(usuario_id: int, rol: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("UPDATE perfil SET rol = %s WHERE id_usuario = %s", (rol, usuario_id))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Rol actualizado"}

@app.delete("/api/admin/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    cursor.execute("UPDATE usuario SET activo = 0 WHERE id = %s", (usuario_id,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return {"message": "Usuario desactivado"}

# ==============================================
# RUTAS REALIZADAS (Historial)
# ==============================================

@app.post("/api/rutas-realizadas")
def add_ruta_realizada(usuario_id: int, ruta_id: int, tiempo_real: float, observaciones: Optional[str] = None):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Error de conexión")
    
    cursor = conn.cursor()
    
    # Verificar si ya fue registrada hoy
    cursor.execute("""
        SELECT * FROM ruta_realizada 
        WHERE id_usuario = %s AND id_ruta = %s AND fecha = CURDATE()
    """, (usuario_id, ruta_id))
    
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Ya registraste esta ruta hoy")
    
    # Insertar ruta realizada
    cursor.execute("""
        INSERT INTO ruta_realizada (id_usuario, id_ruta, fecha, tiempo_real, observaciones)
        VALUES (%s, %s, CURDATE(), %s, %s)
    """, (usuario_id, ruta_id, tiempo_real, observaciones))
    
    # Obtener distancia de la ruta
    cursor.execute("SELECT distancia_km FROM ruta WHERE id = %s", (ruta_id,))
    ruta = cursor.fetchone()
    distancia_km = ruta[0] if ruta else 0
    
    # Actualizar kilómetros recorridos en perfil
    cursor.execute("""
        UPDATE perfil SET km_recorridos = km_recorridos + %s
        WHERE id_usuario = %s
    """, (distancia_km, usuario_id))
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {"message": "Ruta registrada como completada", "km_agregados": distancia_km}

# ==============================================
# EJECUCIÓN
# ==============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)