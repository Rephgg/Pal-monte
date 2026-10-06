from pydantic import BaseModel
from typing import Optional

class ResenaRequest(BaseModel):
    id_usuario: int
    id_ruta: int
    calificacion: int
    comentario: str

class RutaRealizadaRequest(BaseModel):
    usuario_id: int
    ruta_id: int
    tiempo_real: float
    observaciones: str = ""

class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    password: str
    telefono: str = None
    nivel: str = "principiante"

class UsuarioLogin(BaseModel):
    email: str
    password: str

class Ruta(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    distancia_km: float
    dificultad: str
    tipo_bici: Optional[str] = None
    tiempo_estimado: Optional[float] = None
    coordenadas: Optional[str] = None
    zona: Optional[str] = None
    elevacion: Optional[int] = None
    superficie: Optional[str] = "mixta"

class Comercio(BaseModel):
    nombre: str
    tipo: str
    direccion: Optional[str] = None
    coordenadas: Optional[str] = None
    telefono: Optional[str] = None
    horario: Optional[str] = None

class Evento(BaseModel):
    titulo: str
    descripcion: Optional[str] = None
    fecha: str
    hora_inicio: str
    lugar: str
    cupo_max: int

class Resena(BaseModel):
    id_ruta: Optional[int] = None
    id_comercio: Optional[int] = None
    calificacion: int
    comentario: str