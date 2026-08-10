const API_URL = "http://127.0.0.1:8000/api";

// Obtener usuario actual de localStorage
const obtenerUsuarioActual = () => {
    const usuario = localStorage.getItem("usuario");
    if (!usuario) {
        window.location.href = "iniciarSesion.html";
        return null;
    }
    return JSON.parse(usuario);
};

// Actualizar header según sesión
const actualizarHeader = () => {
    const navLinks = document.getElementById("navLinks");
    const usuario = obtenerUsuarioActual();
    
    if (!usuario) return;
    
    navLinks.innerHTML = `
        <a href="../rutas/rutas.html">Rutas</a>
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
};

// Cargar datos del perfil desde la API
const cargarPerfil = async () => {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return;
    
    try {
        const response = await fetch(`${API_URL}/perfil/${usuario.id}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || "Error al cargar perfil");
        }
        
        // Datos personales
        document.getElementById("nombreUsuario").textContent = data.nombre;
        document.getElementById("emailUsuario").textContent = data.email;
        document.getElementById("infoEmail").textContent = data.email;
        document.getElementById("infoTelefono").textContent = data.telefono || "No registrado";
        document.getElementById("infoFecha").textContent = data.fecha_registro || "No registrado";
        
        // Nivel
        let nivelTexto = "";
        switch (data.nivel_ciclista) {
            case "principiante": nivelTexto = "Principiante"; break;
            case "intermedio": nivelTexto = "Intermedio"; break;
            case "avanzado": nivelTexto = "Avanzado"; break;
            default: nivelTexto = data.nivel_ciclista;
        }
        document.getElementById("nivelUsuario").textContent = nivelTexto;
        document.getElementById("infoNivel").textContent = nivelTexto;
        
        // Estadísticas (calcular desde historial)
        let kmTotal = 0;
        if (data.historial && data.historial.length > 0) {
            data.historial.forEach(item => {
                kmTotal += parseFloat(item.distancia_km);
            });
        }
        document.getElementById("kmRecorridos").textContent = kmTotal;
        document.getElementById("rutasCompletadas").textContent = data.historial ? data.historial.length : 0;
        document.getElementById("eventosInscritos").textContent = "0"; // Pendiente implementar
        
        // Cargar favoritos
        const listaFavoritos = document.getElementById("listaFavoritos");
        if (!data.favoritos || data.favoritos.length === 0) {
            listaFavoritos.innerHTML = '<p class="sin-datos">No tienes rutas favoritas aún</p>';
        } else {
            listaFavoritos.innerHTML = "";
            data.favoritos.forEach(ruta => {
                listaFavoritos.innerHTML += `
                    <div class="item-card">
                        <div class="item-info">
                            <h4>${ruta.nombre}</h4>
                            <p>📏 ${ruta.distancia_km} km | 📈 ${ruta.dificultad}</p>
                        </div>
                        <button class="btn-ver" onclick="window.location.href='../rutas/detalleRuta.html?id=${ruta.id}'">Ver ruta</button>
                    </div>
                `;
            });
        }
        
        // Cargar historial
        const listaHistorial = document.getElementById("listaHistorial");
        if (!data.historial || data.historial.length === 0) {
            listaHistorial.innerHTML = '<p class="sin-datos">No has completado ninguna ruta aún</p>';
        } else {
            listaHistorial.innerHTML = "";
            data.historial.forEach(item => {
                listaHistorial.innerHTML += `
                    <div class="item-card">
                        <div class="item-info">
                            <h4>${item.nombre}</h4>
                            <p>📏 ${item.distancia_km} km | 📈 ${item.dificultad}</p>
                            <p class="fecha-realizada">📅 Completada: ${item.fecha} | ⏱️ Tiempo: ${item.tiempo_real || "No registrado"} h</p>
                        </div>
                        <button class="btn-ver" onclick="window.location.href='../rutas/detalleRuta.html?id=${item.id}'">Ver ruta</button>
                    </div>
                `;
            });
        }
        
    } catch (error) {
        console.error("Error al cargar perfil:", error);
        document.getElementById("nombreUsuario").textContent = "Error al cargar";
    }
};

// Configurar pestañas
const configurarTabs = () => {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabId = btn.getAttribute("data-tab");
            
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            
            btn.classList.add("active");
            const targetTab = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
            if (targetTab) targetTab.classList.add("active");
        });
    });
};

// Cerrar sesión
const configurarLogout = () => {
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            window.location.href = "../main/palmonte.html";
        });
    }
};

// Inicializar
const init = () => {
    actualizarHeader();
    cargarPerfil();
    configurarTabs();
    configurarLogout();
};

document.addEventListener("DOMContentLoaded", init);