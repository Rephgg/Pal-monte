const API_URL = "http://127.0.0.1:8000/api";

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
            <a href="../rutas/rutas.html" class="active">Rutas</a>
            <a href="../comercio/comercio.html">Comercios</a>
            <a href="../eventos/eventos.html">Eventos</a>
            <button class="btn" onclick="location.href='../sesion/iniciarSesion.html'">Iniciar sesión</button>
            <button class="btn btn-verde" onclick="location.href='../sesion/registro.html'">Registrarme</button>
        `;
    }
};

// Función para obtener el color del badge según dificultad
const obtenerColorDificultad = (dificultad) => {
    switch (dificultad) {
        case "baja": return "#2c7a47";
        case "media": return "#ff9800";
        case "alta": return "#ba1a1a";
        default: return "#2c7a47";
    }
};

// Función para obtener el texto de dificultad
const obtenerTextoDificultad = (dificultad) => {
    switch (dificultad) {
        case "baja": return "Baja";
        case "media": return "Media";
        case "alta": return "Alta";
        default: return dificultad;
    }
};

// Mostrar rutas en el grid
const mostrarRutas = (rutas) => {
    const container = document.getElementById("gridRutas");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (rutas.length === 0) {
        container.innerHTML = '<p class="sin-resultados">No hay rutas con esta dificultad</p>';
        return;
    }
    
    rutas.forEach(ruta => {
        const color = obtenerColorDificultad(ruta.dificultad);
        const textoDificultad = obtenerTextoDificultad(ruta.dificultad);
        
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${ruta.imagen || "https://via.placeholder.com/400x200?text=Ruta"}')">
                <div class="card-badge" style="background: ${color}">${textoDificultad}</div>
            </div>
            <div class="card-content">
                <h3>${ruta.nombre}</h3>
                <div class="card-stats">
                    <div class="stat">📍 ${ruta.zona || "No especificada"}</div>
                    <div class="stat">⏰ ${ruta.tiempo_estimado || "?"}h</div>
                    <div class="stat">📏 ${ruta.distancia_km}km</div>
                    <div class="stat">🚲 ${ruta.tipo_bici || "Cualquiera"}</div>
                </div>
                <button class="btn-card" onclick="window.location.href='detalleRuta.html?id=${ruta.id}'">Ver detalle</button>
            </div>
        `;
        container.appendChild(card);
    });
};

// Cargar rutas desde la API
const cargarRutas = async (dificultad = null) => {
    try {
        let url = `${API_URL}/rutas`;
        if (dificultad && dificultad !== "todas") {
            url = `${API_URL}/rutas?dificultad=${dificultad}`;
        }
        
        const response = await fetch(url);
        const rutas = await response.json();
        
        if (!response.ok) {
            throw new Error(rutas.detail || "Error al cargar rutas");
        }
        
        mostrarRutas(rutas);
    } catch (error) {
        console.error("Error:", error);
        const container = document.getElementById("gridRutas");
        if (container) {
            container.innerHTML = '<p class="error">Error al cargar las rutas</p>';
        }
    }
};

// Configurar filtros
const configurarFiltros = () => {
    const filtros = document.querySelectorAll(".filtro");
    filtros.forEach(filtro => {
        filtro.addEventListener("click", () => {
            filtros.forEach(f => f.classList.remove("active"));
            filtro.classList.add("active");
            const dificultad = filtro.getAttribute("data-dificultad");
            cargarRutas(dificultad);
        });
    });
};

// Inicializar
const init = () => {
    actualizarHeader();
    cargarRutas();
    configurarFiltros();
};

document.addEventListener("DOMContentLoaded", init);