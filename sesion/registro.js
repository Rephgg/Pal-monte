const formRegistro = document.getElementById("formRegistro");
const errorMensaje = document.getElementById("errorMensaje");
const successMensaje = document.getElementById("successMensaje");

const API_URL = "http://127.0.0.1:8000/api";

const mostrarError = (mensaje) => {
    errorMensaje.textContent = mensaje;
    errorMensaje.style.display = "block";
    successMensaje.style.display = "none";
    setTimeout(() => {
        errorMensaje.style.display = "none";
    }, 3000);
};

const mostrarExito = (mensaje) => {
    successMensaje.textContent = mensaje;
    successMensaje.style.display = "block";
    errorMensaje.style.display = "none";
};

const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const procesarRegistro = async (event) => {
    event.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const telefono = document.getElementById("telefono").value.trim();
    const nivel = document.getElementById("nivel").value;
    
    if (!nombre || !email || !password || !confirmPassword) {
        mostrarError("⚠️ Completa todos los campos obligatorios");
        return;
    }
    
    if (!validarEmail(email)) {
        mostrarError("⚠️ Ingresa un correo electrónico válido");
        return;
    }
    
    if (password.length < 6) {
        mostrarError("⚠️ La contraseña debe tener al menos 6 caracteres");
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarError("⚠️ Las contraseñas no coinciden");
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/registro`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre,
                email,
                password,
                telefono: telefono || null,
                nivel
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            mostrarExito(`✅ ¡Bienvenido ${nombre}! Cuenta creada exitosamente`);
            
            // Iniciar sesión automáticamente
            const loginResponse = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            
            if (loginResponse.ok) {
                const userData = await loginResponse.json();
                localStorage.setItem("usuario", JSON.stringify(userData));
            }
            
            setTimeout(() => {
                window.location.href = "../main/palmonte.html";
            }, 2000);
        } else {
            mostrarError(data.detail || "❌ Error al registrar usuario");
        }
    } catch (error) {
        console.error("Error:", error);
        mostrarError("❌ Error de conexión con el servidor");
    }
};

document.getElementById("formRegistro")?.addEventListener("submit", procesarRegistro);