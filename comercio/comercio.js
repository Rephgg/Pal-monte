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
            <a href="../rutas/rutas.html">Rutas</a>
            <a href="../comercio/comercio.html" class="active">Comercios</a>
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
            <a href="../comercio/comercio.html" class="active">Comercios</a>
            <a href="../eventos/eventos.html">Eventos</a>
            <button class="btn" onclick="location.href='../sesion/iniciarSesion.html'">Iniciar sesión</button>
            <button class="btn btn-verde" onclick="location.href='../sesion/registro.html'">Registrarme</button>
        `;
    }
};

// Función para obtener el color del rating
const obtenerColorRating = (rating) => {
    if (rating >= 4.5) return "#2c7a47";
    if (rating >= 3.5) return "#ff9800";
    return "#ba1a1a";
};

// Mostrar comercios en el grid
const mostrarComercios = (comercios) => {
    const container = document.getElementById("cardsGrid");
    if (!container) return;
    
    container.innerHTML = "";
    
    if (comercios.length === 0) {
        container.innerHTML = '<p class="sin-resultados">No hay comercios en esta categoría</p>';
        return;
    }
    
    comercios.forEach(comercio => {
        const colorRating = obtenerColorRating(comercio.calificacion);
        
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <img src="${comercio.foto || "https://via.placeholder.com/400x200?text=Comercio"}" alt="${comercio.nombre}">
            <div class="card-content">
                <span class="badge">${comercio.tipo}</span>
                <span class="rating" style="color: ${colorRating}">⭐ ${comercio.calificacion || "Nuevo"}</span>
                <h3>${comercio.nombre}</h3>
                <p>📍 ${comercio.direccion || "Dirección no disponible"}</p>
                <p>📞 ${comercio.telefono || "No disponible"}</p>
                <button class="btn-card" onclick="window.location.href='comercioDetalle.html?id=${comercio.id}'">Ver más →</button>
            </div>
        `;
        container.appendChild(card);
    });
};

// Cargar comercios desde la API
const cargarComercios = async (categoria = null) => {
    try {
        let url = `${API_URL}/comercios`;
        if (categoria && categoria !== "todos") {
            url = `${API_URL}/comercios?tipo=${categoria}`;
        }
        
        const response = await fetch(url);
        const comercios = await response.json();
        
        if (!response.ok) {
            throw new Error(comercios.detail || "Error al cargar comercios");
        }
        
        mostrarComercios(comercios);
    } catch (error) {
        console.error("Error:", error);
        const container = document.getElementById("cardsGrid");
        if (container) {
            container.innerHTML = '<p class="error">Error al cargar los comercios</p>';
        }
    }
};

// Configurar pestañas de categorías
const configurarTabs = () => {
    const tabs = document.querySelectorAll(".tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const categoria = tab.getAttribute("data-categoria");
            cargarComercios(categoria);
        });
    });
};

// Inicializar
const init = () => {
    actualizarHeader();
    cargarComercios();
    configurarTabs();
};

document.addEventListener("DOMContentLoaded", init);