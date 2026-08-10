// Obtener elementos del DOM
const formLogin = document.getElementById("formLogin");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMensaje = document.getElementById("errorMensaje");

// URL de la API (backend)
const API_URL = "http://127.0.0.1:8000/api";

// Mostrar mensaje de error
const mostrarError = (mensaje) => {
    errorMensaje.textContent = mensaje;
    errorMensaje.style.display = "block";
    setTimeout(() => {
        errorMensaje.style.display = "none";
    }, 3000);
};

// Limpiar error
const limpiarError = () => {
    errorMensaje.style.display = "none";
    errorMensaje.textContent = "";
};

// Procesar login
const procesarLogin = async (event) => {
    event.preventDefault();
    limpiarError();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!email || !password) {
        mostrarError("⚠️ Completa todos los campos");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Guardar usuario en localStorage
            localStorage.setItem("usuario", JSON.stringify({
                id: data.id,
                nombre: data.nombre,
                email: data.email,
                nivel: data.nivel,
                rol: data.rol
            }));
            
            alert(`✅ ¡Bienvenido ${data.nombre}!`);
            window.location.href = "../main/palmonte.html";
        } else {
            mostrarError(data.detail || "❌ Correo o contraseña incorrectos");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarError("❌ Error de conexión con el servidor");
    }
};

// Configurar eventos
const configurarFormulario = () => {
    if (formLogin) {
        formLogin.addEventListener("submit", procesarLogin);
    }
    
    if (emailInput) emailInput.addEventListener("input", limpiarError);
    if (passwordInput) passwordInput.addEventListener("input", limpiarError);
};

// Inicializar
document.addEventListener("DOMContentLoaded", configurarFormulario);