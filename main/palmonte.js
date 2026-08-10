const API_URL = "http://127.0.0.1:8000/api";

// Obtener usuario de localStorage
const obtenerUsuario = () => {
    const usuario = localStorage.getItem("usuario");
    return usuario ? JSON.parse(usuario) : null;
};

// Actualizar el header según sesión
const actualizarHeader = () => {
    const navLinks = document.getElementById("navLinks");
    const usuario = obtenerUsuario();
    
    if (usuario) {
        navLinks.innerHTML = `
            <a href="../rutas/rutas.html">Rutas</a>
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html">Eventos</a>
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
            <a href="../eventos/eventos.html">Eventos</a>
            <button class="btn" id="btnLoginNav">Iniciar sesión</button>
            <button class="btn btn-verde" id="btnRegistroNav">Registrarme</button>
        `;
        const btnLogin = document.getElementById("btnLoginNav");
        const btnRegistro = document.getElementById("btnRegistroNav");
        
        if (btnLogin) {
            btnLogin.addEventListener("click", () => {
                window.location.href = "../sesion/iniciarSesion.html";
            });
        }
        if (btnRegistro) {
            btnRegistro.addEventListener("click", () => {
                window.location.href = "../sesion/registro.html";
            });
        }
    }
};

const obtenerTextoDificultad = (dificultad) => {
    switch (dificultad) {
        case "baja": return "Baja";
        case "media": return "Media";
        case "alta": return "Alta";
        default: return dificultad;
    }
};

// Cargar rutas destacadas desde la API
const cargarRutasDestacadas = async () => {
    const container = document.getElementById("rutasDestacadas");
    if (!container) return;
    
    container.innerHTML = "";
    
    try {
        const response = await fetch(`${API_URL}/rutas`);
        if (!response.ok) throw new Error("Error al cargar rutas");
        const rutas = await response.json();
        
        rutas.slice(0, 3).forEach(ruta => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${ruta.imagen || "https://via.placeholder.com/400x200?text=Ruta"}')">
                    <div class="card-badge">${obtenerTextoDificultad(ruta.dificultad)}</div>
                </div>
                <div class="card-content">
                    <h3>${ruta.nombre}</h3>
                    <p>📏 ${ruta.distancia_km} km | ⛰️ ${ruta.elevacion || "?"}m | Dificultad: ${obtenerTextoDificultad(ruta.dificultad)}</p>
                    <button class="btn" onclick="window.location.href='../rutas/detalleRuta.html?id=${ruta.id}'">Ver más</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<p class="error">Error al cargar las rutas</p>';
    }
};

// Cargar eventos destacados desde la API
const cargarEventosDestacados = async () => {
    const container = document.getElementById("eventosDestacados");
    if (!container) return;
    
    container.innerHTML = "";
    
    try {
        const response = await fetch(`${API_URL}/eventos`);
        if (!response.ok) throw new Error("Error al cargar eventos");
        const eventos = await response.json();
        
        eventos.slice(0, 3).forEach(evento => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-content">
                    <h3>🚴 ${evento.titulo}</h3>
                    <p><strong>📅 ${evento.fecha} | ⏰ ${evento.hora_inicio}</strong></p>
                    <p>${evento.descripcion ? evento.descripcion.substring(0, 100) + "..." : "Sin descripción"}</p>
                    <p>📍 ${evento.lugar}</p>
                    <button class="btn" onclick="window.location.href='../eventos/detalleEvento.html?id=${evento.id}'">Ver más</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<p class="error">Error al cargar los eventos</p>';
    }
};

// Configurar botones principales
const configurarBotones = () => {
    const btnExplorar = document.getElementById("btnExplorar");
    const btnInfo = document.getElementById("btnInfo");
    
    if (btnExplorar) {
        btnExplorar.addEventListener("click", () => {
            window.location.href = "../rutas/rutas.html";
        });
    }
    
    if (btnInfo) {
        btnInfo.addEventListener("click", () => {
            const seccion = document.querySelector(".section");
            if (seccion) {
                seccion.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
};

// Inicializar todo
const init = () => {
    actualizarHeader();
    cargarRutasDestacadas();
    cargarEventosDestacados();
    configurarBotones();
};

// Ejecutar cuando la página cargue
document.addEventListener("DOMContentLoaded", init);
