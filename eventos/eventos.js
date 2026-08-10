const API_URL = "http://127.0.0.1:8000/api";

const obtenerUsuario = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

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

const mostrarEventos = (eventos) => {
    const container = document.getElementById("eventosList");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (eventos.length === 0) {
        container.innerHTML = '<p class="sin-eventos">No hay eventos próximos</p>';
        return;
    }
    
    eventos.forEach(evento => {
        const { dia, mes } = obtenerDiaMes(evento.fecha);
        const nombreMes = obtenerNombreMes(mes);
        const cuposRestantes = evento.cupo_max - evento.cupo_actual;
        
        const eventCard = document.createElement("div");
        eventCard.className = "event-card";
        if (evento.cancelado) {
            eventCard.classList.add("cancelado");
        }
        
        eventCard.innerHTML = `
            ${evento.cancelado ? '<div class="cancel-tag">CANCELADO</div>' : ''}
            
            <div class="event-date">
                <div class="event-month">${nombreMes.substring(0, 3)}</div>
                <div class="event-day">${dia}</div>
            </div>
            
            <div class="event-info">
                <h3>${evento.titulo}</h3>
                <p>📍 ${evento.lugar} | 🕐 ${evento.hora_inicio}</p>
                <p>👤 Organiza: ${evento.organizador || "Por definir"}</p>
                <p>📝 ${evento.descripcion ? evento.descripcion.substring(0, 100) + "..." : "Sin descripción"}</p>
            </div>
            
            <div class="event-action">
                <div class="spots">${evento.cupo_actual} / ${evento.cupo_max} cupos</div>
                <div class="cupos-restantes">${cuposRestantes} cupos disponibles</div>
                <button class="btn-detalle" data-id="${evento.id}">Ver detalle</button>
            </div>
        `;
        
        container.appendChild(eventCard);
    });
    
    // Configurar botones de ver detalle
    const btnsDetalle = document.querySelectorAll(".btn-detalle");
    btnsDetalle.forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            const eventoId = this.getAttribute("data-id");
            window.location.replace(`detalleEvento.html?id=${eventoId}`);
        });
    });
};

const cargarEventos = async () => {
    try {
        const response = await fetch(`${API_URL}/eventos`);
        const eventos = await response.json();
        
        if (!response.ok) {
            throw new Error(eventos.detail || "Error al cargar eventos");
        }
        
        mostrarEventos(eventos);
    } catch (error) {
        console.error("Error:", error);
        const container = document.getElementById("eventosList");
        if (container) {
            container.innerHTML = '<p class="error">Error al cargar los eventos</p>';
        }
    }
};

const init = () => {
    actualizarHeader();
    cargarEventos();
};

document.addEventListener("DOMContentLoaded", init);