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
            <a href="../rutas/rutas.html">Rutas</a>
            <a href="../comercio/comercio.html" class="active">Comercios</a>
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
            <a href="../rutas/rutas.html">Rutas</a>
            <a href="../comercio/comercio.html" class="active">Comercios</a>
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

const guardarResena = async (usuarioId, comercioId, calificacion, comentario) => {
    try {
        const response = await fetch(`${API_URL}/resenas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: usuarioId,
                id_comercio: comercioId,
                calificacion: calificacion,
                comentario: comentario
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("✅ Reseña guardada correctamente");
            cerrarModal();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            alert("❌ " + (data.detail || "Error al guardar reseña"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor");
    }
};

// Mostrar modal de reseña
const mostrarModalResena = (comercioId) => {
    const modal = document.getElementById("modalResena");
    if (!modal) return;
    
    modal.style.display = "flex";
    document.getElementById("resenaCalificacion").value = 5;
    document.getElementById("resenaComentario").value = "";
    
    // Guardar referencia al botón para evitar duplicar eventos
    const btnEnviar = document.getElementById("btnEnviarResena");
    const nuevaBtnEnviar = btnEnviar.cloneNode(true);
    btnEnviar.parentNode.replaceChild(nuevaBtnEnviar, btnEnviar);
    
    nuevaBtnEnviar.onclick = () => {
        const usuario = obtenerUsuario();
        
        if (!usuario) {
            alert("⚠️ Debes iniciar sesión para escribir una reseña");
            window.location.href = "../sesion/iniciarSesion.html";
            return;
        }
        
        const calificacion = parseInt(document.getElementById("resenaCalificacion").value);
        const comentario = document.getElementById("resenaComentario").value.trim();
        
        if (!comentario) {
            alert("⚠️ Por favor escribe un comentario");
            return;
        }
        
        guardarResena(usuario.id, comercioId, calificacion, comentario);
    };
};

// Cerrar modal
const cerrarModal = () => {
    const modal = document.getElementById("modalResena");
    if (modal) {
        modal.style.display = "none";
    }
};

// Mostrar detalle del comercio
const mostrarDetalleComercio = async () => {
    const id = obtenerIdDeURL();
    
    if (!id) {
        window.location.href = "comercio.html";
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/comercios/${id}`);
        const comercio = await response.json();
        
        if (!response.ok) {
            throw new Error(comercio.detail || "Comercio no encontrado");
        }
        
        // Título de la página
        document.title = `Pal' Monte - ${comercio.nombre}`;
        
        // Hero
        document.getElementById("comercioNombre").textContent = comercio.nombre;
        const verificadoTexto = comercio.verificado ? "✓ Verificado" : "";
        document.getElementById("comercioRating").innerHTML = `⭐ ${comercio.calificacion || "Nuevo"} | ${comercio.tipo} | ${verificadoTexto}`;
        
        // Información de contacto
        document.getElementById("direccion").innerHTML = `📍 ${comercio.direccion || "Dirección no disponible"}`;
        document.getElementById("telefono").innerHTML = `📞 ${comercio.telefono || "No disponible"}`;
        document.getElementById("horario").innerHTML = `🕐 ${comercio.horario || "No disponible"}`;
        document.getElementById("sitioWeb").innerHTML = `🌐 ${comercio.sitio_web || "No disponible"}`;
        
        // Mapa
        const mapaImg = document.getElementById("mapaImg");
        if (mapaImg) {
            mapaImg.src = comercio.foto || "https://via.placeholder.com/600x300?text=Mapa";
        }
        
        // Reseñas
        const reseñasContainer = document.getElementById("reseñasContainer");
        if (reseñasContainer) {
            if (!comercio.reseñas || comercio.reseñas.length === 0) {
                reseñasContainer.innerHTML = '<p class="sin-resenas">No hay reseñas aún. ¡Sé el primero en calificar!</p>';
            } else {
                reseñasContainer.innerHTML = "";
                comercio.reseñas.forEach(reseña => {
                    const estrellas = generarEstrellas(reseña.calificacion);
                    reseñasContainer.innerHTML += `
                        <div class="reseña">
                            <div class="reseña-header">
                                <div class="avatar">${reseña.usuario.charAt(0)}</div>
                                <div><strong>${reseña.usuario}</strong><div class="fecha">${reseña.fecha}</div></div>
                                <div class="stars">${estrellas}</div>
                            </div>
                            <p>"${reseña.comentario}"</p>
                        </div>
                    `;
                });
            }
        }
        
        // Botones de acción según sesión
        const usuario = obtenerUsuario();
        const btnEscribirReseña = document.getElementById("btnEscribirReseña");
        
        if (btnEscribirReseña) {
            if (usuario) {
                btnEscribirReseña.innerHTML = "✏️ Escribir reseña";
                btnEscribirReseña.style.background = "#006768";
                btnEscribirReseña.style.color = "white";
                btnEscribirReseña.style.cursor = "pointer";
                btnEscribirReseña.onclick = () => mostrarModalResena(id);
            } else {
                btnEscribirReseña.innerHTML = "🔒 Inicia sesión para escribir una reseña";
                btnEscribirReseña.style.background = "#ccc";
                btnEscribirReseña.style.cursor = "not-allowed";
                btnEscribirReseña.onclick = () => {
                    window.location.href = "../sesion/iniciarSesion.html";
                };
            }
        }
        
        // Botón llamar
        const btnLlamar = document.getElementById("btnLlamar");
        if (btnLlamar && comercio.telefono) {
            btnLlamar.onclick = () => {
                window.location.href = `tel:${comercio.telefono.replace(/[^0-9+]/g, '')}`;
            };
        }
        
        // Botón mapa
        const btnMapa = document.getElementById("btnMapa");
        if (btnMapa) {
            btnMapa.onclick = () => {
                alert("Próximamente: Ver ubicación en mapa interactivo");
            };
        }
        
    } catch (error) {
        console.error("Error:", error);
        window.location.href = "comercio.html";
    }
};

// Inicializar
const init = () => {
    actualizarHeader();
    mostrarDetalleComercio();
    
    // Configurar cierre del modal
    const cerrarModalBtn = document.getElementById("cerrarModal");
    if (cerrarModalBtn) {
        cerrarModalBtn.addEventListener("click", cerrarModal);
    }
    
    window.addEventListener("click", (e) => {
        const modal = document.getElementById("modalResena");
        if (e.target === modal) {
            cerrarModal();
        }
    });
};

document.addEventListener("DOMContentLoaded", init);