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
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html" class="active">Eventos</a>
            <a href="../sesion/perfil.html" class="btn">${usuario.nombre}</a>
            <button class="btn" id="btnLogout">Cerrar sesión</button>
        `;
        const btnLogout = document.getElementById("btnLogout");
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("usuario");
                window.location.href = "../main/palmonte.html";
            });
        }
    } else {
        navLinks.innerHTML = `
            <a href="../rutas/rutas.html">Rutas</a>
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html" class="active">Eventos</a>
            <button class="btn" onclick="location.href='../sesion/iniciarSesion.html'">Iniciar sesión</button>
            <button class="btn btn-verde" onclick="location.href='../sesion/registro.html'">Registrarme</button>
        `;
    }
};

// Extraer día y mes de la fecha
const obtenerDiaMes = (fecha) => {
    const partes = fecha.split("-");
    if (partes.length === 3) {
        return { dia: parseInt(partes[2]), mes: parseInt(partes[1]) };
    }
    return { dia: "?", mes: "?" };
};

const obtenerNombreMes = (mesNumero) => {
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return meses[mesNumero - 1] || "Mes";
};

const inscribirEvento = async (usuarioId, eventoId) => {
    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}/inscribir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario_id: usuarioId })
        });
        
        if (response.ok) {
            alert("✅ Te has inscrito al evento");
            window.location.reload();
        } else {
            const error = await response.json();
            alert("❌ " + (error.detail || "Error al inscribirse"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor");
    }
};
const cancelarInscripcion = async (usuarioId, eventoId) => {
    try {
        const response = await fetch(`${API_URL}/eventos/${eventoId}/cancelar-inscripcion`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ usuario_id: usuarioId })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert("✅ Has cancelado tu inscripción");
            window.location.reload();
        } else {
            alert("❌ " + (data.detail || "Error al cancelar inscripción"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Error de conexión con el servidor");
    }
};

// Mostrar detalle del evento
const mostrarDetalleEvento = async () => {
    const id = obtenerIdDeURL();
    
    if (!id) {
        window.location.href = "eventos.html";
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/eventos/${id}`);
        const evento = await response.json();
        
        if (!response.ok) {
            throw new Error(evento.detail || "Evento no encontrado");
        }
        
        const { dia, mes } = obtenerDiaMes(evento.fecha);
        const nombreMes = obtenerNombreMes(mes);
        const porcentaje = (evento.cupo_actual / evento.cupo_max) * 100;
        const cuposRestantes = evento.cupo_max - evento.cupo_actual;
        const usuario = obtenerUsuario();
        
        // Verificar si el usuario ya está inscrito
        let yaInscrito = false;
        if (usuario && evento.asistentes) {
            yaInscrito = evento.asistentes.some(a => a.id === usuario.id);
        }
        
        // Título de la página
        document.title = `Pal' Monte - ${evento.titulo}`;
        
        // Hero
        document.getElementById("eventoDia").textContent = dia;
        document.getElementById("eventoMes").textContent = nombreMes;
        document.getElementById("eventoNombre").textContent = evento.titulo;
        document.getElementById("eventoOrganizador").innerHTML = `👤 Organiza: ${evento.organizador || "Por definir"}`;
        
        // Información
        document.getElementById("eventoFechaCompleta").innerHTML = `📅 ${evento.fecha} - ${evento.hora_inicio}`;
        document.getElementById("eventoLugar").innerHTML = `📍 ${evento.lugar}`;
        document.getElementById("eventoCupos").innerHTML = `${evento.cupo_actual} de ${evento.cupo_max} cupos ocupados`;
        document.getElementById("eventoDescripcion").textContent = evento.descripcion || "Sin descripción disponible";
        
        // Barra de progreso
        const progresoBar = document.getElementById("cuposProgreso");
        if (progresoBar) {
            progresoBar.style.width = `${porcentaje}%`;
            progresoBar.style.backgroundColor = porcentaje >= 90 ? "#ba1a1a" : "#006768";
        }
        
        const cuposRestantesSpan = document.getElementById("eventoCuposRestantes");
        if (cuposRestantesSpan) {
            cuposRestantesSpan.innerHTML = cuposRestantes > 0 ? `✅ ${cuposRestantes} cupos disponibles` : "❌ Sin cupos disponibles";
            cuposRestantesSpan.style.color = cuposRestantes > 0 ? "#006768" : "#ba1a1a";
        }
        
        // Botón de inscripción
        const accionesDiv = document.getElementById("eventoAcciones");
        if (accionesDiv) {
            if (evento.cancelado) {
                accionesDiv.innerHTML = `<div class="evento-cancelado-mensaje">⚠️ Evento cancelado</div>`;
            } else if (!usuario) {
                accionesDiv.innerHTML = `<div class="evento-login-required">🔒 <a href="../sesion/iniciarSesion.html">Inicia sesión</a> para inscribirte</div>`;
            } else if (yaInscrito) {
                accionesDiv.innerHTML = `
                    <div class="evento-ya-inscrito">✅ Ya estás inscrito</div>
                    <button class="btn-cancelar" id="btnCancelarInscripcion">Cancelar inscripción</button>
                `;
                document.getElementById("btnCancelarInscripcion")?.addEventListener("click", () => {
                    cancelarInscripcion(usuario.id, id);
                });
            } else if (evento.cupo_actual >= evento.cupo_max) {
                accionesDiv.innerHTML = `<div class="evento-completo">🔴 Evento completo</div>`;
            } else {
                accionesDiv.innerHTML = `<button class="btn-inscribir-detalle" id="btnInscribir">✅ Inscribirme</button>`;
                document.getElementById("btnInscribir")?.addEventListener("click", () => {
                    inscribirEvento(usuario.id, id);
                });
            }
        }
        
        // Lista de asistentes
        const asistentesDiv = document.getElementById("listaAsistentes");
        if (asistentesDiv) {
            if (!evento.asistentes || evento.asistentes.length === 0) {
                asistentesDiv.innerHTML = '<p class="sin-asistentes">Aún no hay asistentes. ¡Sé el primero!</p>';
            } else {
                asistentesDiv.innerHTML = "";
                evento.asistentes.forEach(asistente => {
                    asistentesDiv.innerHTML += `
                        <div class="asistente-item">
                            <div class="asistente-avatar">👤</div>
                            <div class="asistente-nombre">${asistente.nombre}</div>
                        </div>
                    `;
                });
            }
        }
        
    } catch (error) {
        console.error("Error:", error);
        window.location.href = "eventos.html";
    }
};

// Inicializar
const init = () => {
    actualizarHeader();
    mostrarDetalleEvento();
};

document.addEventListener("DOMContentLoaded", init);