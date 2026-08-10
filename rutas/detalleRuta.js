const API_URL = "http://127.0.0.1:8000/api";

// Obtener ID de la URL
const obtenerIdDeURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
};

// Obtener usuario de localStorage
const obtenerUsuario = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

// Actualizar header según sesión
const actualizarHeader = () => {
    const navLinks = document.getElementById("navLinks");
    const usuario = obtenerUsuario();
    
    if (usuario) {
        navLinks.innerHTML = `
            <a href="../rutas/rutas.html" class="active">Rutas</a>
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html">Eventos</a>
            <a href="../sesion/perfil.html" class="btn">${usuario.nombre}</a>
            <button class="btn" id="btnLogoutHeader">Cerrar sesión</button>
        `;
        const btnLogout = document.getElementById("btnLogoutHeader");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "../main/palmonte.html";
            });
        }
    } else {
        navLinks.innerHTML = `
            <a href="../rutas/rutas.html" class="active">Rutas</a>
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html">Eventos</a>
            <button class="btn" onclick="location.href='../sesion/iniciarSesion.html'">Iniciar sesión</button>
            <button class="btn btn-verde" onclick="location.href='../sesion/registro.html'">Registrarme</button>
        `;
    }
};

// Función para generar estrellas
const generarEstrellas = (calificacion) => {
    let estrellas = "";
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(calificacion)) {
            estrellas += "⭐";
        } else {
            estrellas += "☆";
        }
    }
    return estrellas;
};

// Verificar si una ruta está en favoritos
const verificarFavorito = async (usuarioId, rutaId) => {
    try {
        const response = await fetch(`${API_URL}/perfil/${usuarioId}`);
        const perfil = await response.json();
        return perfil.favoritos?.some(f => f.id == rutaId) || false;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

// Guardar o eliminar favorito
const toggleFavorito = async (usuarioId, rutaId, esFavorito) => {
    try {
        if (esFavorito) {
            await fetch(`${API_URL}/favoritos?usuario_id=${usuarioId}&ruta_id=${rutaId}`, {
                method: "DELETE"
            });
        } else {
            await fetch(`${API_URL}/favoritos?usuario_id=${usuarioId}&ruta_id=${rutaId}`, {
                method: "POST"
            });
        }
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

// Guardar reseña
const guardarResena = async (usuarioId, rutaId, calificacion, comentario) => {
    try {
        const response = await fetch(`${API_URL}/resenas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuarioId,
                id_ruta: rutaId,
                calificacion: calificacion,
                comentario: comentario
            })
        });
        
        if (response.ok) {
            alert("✅ Reseña guardada correctamente");
            window.location.reload();
        } else {
            const errorText = await response.text();
            alert("❌ Error: " + errorText);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor");
    }
};

// Mostrar modal de reseña
const mostrarModalResena = () => {
    const modal = document.getElementById("modalResena");
    if (modal) {
        modal.style.display = "flex";
        document.getElementById("resenaCalificacion").value = 5;
        document.getElementById("resenaComentario").value = "";
    }
};

// Cerrar modal
const cerrarModal = () => {
    const modal = document.getElementById("modalResena");
    if (modal) {
        modal.style.display = "none";
    }
};

// Guardar ruta completada
const guardarRutaCompletada = async (usuarioId, rutaId, rutaNombre, distanciaKm) => {
    const tiempoReal = prompt(`¿Cuánto tiempo te tomó completar "${rutaNombre}"? (en horas)`, "2.5");
    
    if (!tiempoReal) {
        return;
    }
    
    const tiempoRealNum = parseFloat(tiempoReal);
    
    if (isNaN(tiempoRealNum) || tiempoRealNum <= 0) {
        alert("⚠️ Por favor ingresa un tiempo válido");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/rutas-realizadas?usuario_id=${usuarioId}&ruta_id=${rutaId}&tiempo_real=${tiempoRealNum}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`🎉 ¡Felicidades! Completaste la ruta "${rutaNombre}"\n📏 Distancia: ${distanciaKm} km\n⏱️ Tiempo: ${tiempoRealNum} horas`);
            location.reload();
        } else {
            let mensajeError = "Error al guardar";
            if (typeof data.detail === "string") {
                mensajeError = data.detail;
            }
            alert("❌ " + mensajeError);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor");
    }
};

// Mostrar detalle de la ruta
const mostrarDetalleRuta = async () => {
    const id = obtenerIdDeURL();
    
    if (!id) {
        window.location.href = "rutas.html";
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/rutas/${id}`);
        const ruta = await response.json();
        
        if (!response.ok) {
            throw new Error(ruta.detail || "Ruta no encontrada");
        }
        
        // Cambiar título de la página
        document.title = `Pal' Monte - ${ruta.nombre}`;
        
        // Hero
        const hero = document.getElementById("hero");
        if (hero) {
            hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${ruta.imagen || "https://via.placeholder.com/1200x400?text=Ruta"}')`;
            hero.style.backgroundSize = "cover";
            hero.style.backgroundPosition = "center";
            hero.style.height = "300px";
            hero.style.display = "flex";
            hero.style.alignItems = "center";
            hero.style.justifyContent = "center";
        }
        document.getElementById("rutaNombre").textContent = ruta.nombre;
        document.getElementById("rutaDescripcion").textContent = ruta.descripcion?.split(".")[0] + "." || "";
        
        // Stats
        const statsGrid = document.getElementById("statsGrid");
        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="stat-item">📏 ${ruta.distancia_km} km</div>
                <div class="stat-item">📈 ${ruta.dificultad}</div>
                <div class="stat-item">⏰ ${ruta.tiempo_estimado || "?"} h</div>
                <div class="stat-item">📍 ${ruta.zona || "No especificada"}</div>
                <div class="stat-item">🚲 ${ruta.tipo_bici || "Cualquiera"}</div>
                <div class="stat-item">⛰️ ${ruta.elevacion || "?"} m</div>
            `;
        }
        
        // Descripción completa
        document.getElementById("rutaDescripcionCompleta").textContent = ruta.descripcion || "Sin descripción disponible";
        
        // Mapa y coordenadas
        const mapaImg = document.getElementById("mapaImg");
        if (mapaImg) {
            mapaImg.src = ruta.imagen || "https://via.placeholder.com/600x300?text=Mapa";
            mapaImg.alt = `Mapa de ${ruta.nombre}`;
        }
        document.getElementById("coordenadas").textContent = `📍 ${ruta.coordenadas || "No disponible"}`;
        
        // Reseñas
        const reseñasContainer = document.getElementById("reseñasContainer");
        if (reseñasContainer) {
            if (!ruta.reseñas || ruta.reseñas.length === 0) {
                reseñasContainer.innerHTML = '<p class="sin-resenas">No hay reseñas aún. ¡Sé el primero en calificar!</p>';
            } else {
                reseñasContainer.innerHTML = "";
                ruta.reseñas.forEach(reseña => {
                    const estrellas = generarEstrellas(reseña.calificacion);
                    reseñasContainer.innerHTML += `
                        <div class="card-review">
                            <div class="review-header">
                                <strong>${reseña.usuario}</strong>
                                <span>${estrellas}</span>
                                <span class="fecha">${reseña.fecha}</span>
                            </div>
                            <p>"${reseña.comentario}"</p>
                        </div>
                    `;
                });
            }
        }
        
        // Botones de acción según sesión y favorito
        const accionesDiv = document.getElementById("acciones");
        const usuario = obtenerUsuario();
        let esFavorito = false;
        
        if (usuario) {
            esFavorito = await verificarFavorito(usuario.id, id);
        }
        
        if (accionesDiv) {
            if (usuario) {
                accionesDiv.innerHTML = `
                    <button class="btn-accion" id="btnFavorito">${esFavorito ? '❤️ Quitar de favoritos' : '🤍 Guardar favorito'}</button>
                    <button class="btn-accion" id="btnCompletar">✅ Marcar como completada</button>
                    <button class="btn-accion" id="btnReseña">✏️ Escribir reseña</button>
                `;
                
                document.getElementById("btnFavorito")?.addEventListener("click", async () => {
                    const nuevoEstado = await toggleFavorito(usuario.id, id, esFavorito);
                    if (nuevoEstado) {
                        esFavorito = !esFavorito;
                        const btn = document.getElementById("btnFavorito");
                        btn.textContent = esFavorito ? '❤️ Quitar de favoritos' : '🤍 Guardar favorito';
                        alert(esFavorito ? "✅ Ruta guardada en favoritos" : "❌ Ruta eliminada de favoritos");
                    }
                });
                
                document.getElementById("btnCompletar")?.addEventListener("click", () => {
                    guardarRutaCompletada(usuario.id, id, ruta.nombre, ruta.distancia_km);
                });
                
                document.getElementById("btnReseña")?.addEventListener("click", mostrarModalResena);
            } else {
                accionesDiv.innerHTML = `
                    <p style="text-align: center; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                        🔒 <a href="../sesion/iniciarSesion.html">Inicia sesión</a> para guardar favoritos, marcar rutas completadas y escribir reseñas.
                    </p>
                `;
            }
        }
        
    } catch (error) {
        console.error("Error:", error);
        window.location.href = "rutas.html";
    }
};

// Inicializar
const init = () => {
    actualizarHeader();
    mostrarDetalleRuta();
    
    // Configurar modal
    const cerrarModalBtn = document.getElementById("cerrarModal");
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener("click", cerrarModal);
    }
    
    const enviarResenaBtn = document.getElementById("enviarResena");
    if (enviarResenaBtn) {
        enviarResenaBtn.addEventListener("click", () => {
            const usuario = obtenerUsuario();
            const rutaId = obtenerIdDeURL();
            const calificacion = parseInt(document.getElementById("resenaCalificacion").value);
            const comentario = document.getElementById("resenaComentario").value.trim();
            
            if (!comentario) {
                alert("⚠️ Por favor escribe un comentario");
                return;
            }
            
            if (usuario && rutaId) {
                guardarResena(usuario.id, rutaId, calificacion, comentario);
            }
        });
    }
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("modalResena");
        if (e.target === modal) {
            cerrarModal();
        }
    });
};

document.addEventListener("DOMContentLoaded", init);