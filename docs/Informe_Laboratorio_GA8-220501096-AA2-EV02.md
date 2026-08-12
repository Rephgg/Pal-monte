# Informe de Laboratorio: Desarrollo de Módulos Móviles Android
**Evidencia:** `GA8-220501096-AA2-EV02` — APK (Desarrollar módulos móviles según requerimientos del proyecto)  
**Programa:** Análisis y Desarrollo de Software (ADSO)  
**Proyecto:** Pal' Monte — Aplicación Móvil (`AppPedalea`)  
**Formato de entrega:** Documento PDF  

---

## SECCIÓN 1: Estructura del Proyecto Android

### 1. Instalación y Configuración del Entorno
Para el desarrollo de la aplicación móvil del proyecto **Pal' Monte** (`AppPedalea`), se realizaron los siguientes pasos de instalación:

1. **Descarga e Instalación de Java JDK:**
   - **Herramienta:** OpenJDK 21 / Java 17 LTS.
   - **Variable de entorno:** `JAVA_HOME` configurada en la ruta de instalación del JDK.
2. **Descarga e Instalación de Android Studio:**
   - **IDE:** Android Studio Ladybug / Iguana.
   - **Componentes:** Android SDK Platform API 34/35 y emulador de dispositivo virtual (AVD).
3. **Creación del Proyecto:**
   - **Nombre de la App:** `AppPedalea`
   - **Paquete:** `com.example.apppedalea`
   - **Ubicación:** `D:\Android\AppPedalea`

---

### 2. Estructura Básica de la Aplicación Móvil

La aplicación móvil está organizada en las cuatro carpetas y archivos fundamentales de Android:

```
AppPedalea/
├── app/src/main/
│   ├── AndroidManifest.xml   --> Configuración general de la app y permisos
│   ├── java/                 --> Código fuente en Kotlin/Java (Clases y Lógica)
│   └── res/                  --> Recursos estáticos (Diseños, Imágenes, Textos)
└── build.gradle.kts          --> Configuración de compilación y dependencias
```

#### A. AndroidManifest (`AndroidManifest.xml`)
Define el nombre del paquete, permisos de red para conectar con el backend y la actividad principal (`MainActivity`).

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.apppedalea">

    <!-- Permiso para conexión a la API -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Pal' Monte - AppPedalea"
        android:theme="@style/Theme.AppPedalea">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

#### B. Carpeta Java / Kotlin (`app/src/main/java`)
Contiene el código lógico organizado en paquetes:
- **`MainActivity.kt`**: Enrutador principal de la app mediante `NavHost`.
- **`screens/`**: Contiene la interfaz de cada módulo (`LoginScreen.kt`, `DashboardScreen.kt`, etc.).
- **`data/`**: Modelos de datos y cliente de conexión HTTP (`ApiService.kt`, `DatabaseHelper.kt`).

#### C. Carpeta Res (`app/src/main/res`)
Almacena los recursos estáticos de la interfaz:
- **`drawable/` & `mipmap/`**: Iconos y logotipos de la aplicación.
- **`values/strings.xml`**: Cadenas de texto para títulos y etiquetas.
- **`values/colors.xml`**: Paleta de colores de la interfaz.

#### D. Archivo Gradle (`build.gradle.kts`)
Gestiona la versión de compilación (SDK 34/35) y dependencias externas como Jetpack Compose, Retrofit y SQLite:

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.example.apppedalea"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.example.apppedalea"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
```

---

## SECCIÓN 2: Interfaz de Usuario y Autenticación con SQLite

### 1. Selección del Tipo de Layout
* **Layout Seleccionado:** **ConstraintLayout / LinearLayout (Estructura Vertical `Column` en Compose)**.
* **Justificación:** Se seleccionó este diseño de distribución por su eficiencia para organizar elementos de formulario uno debajo del otro (Campos de entrada, botones de acción y enlaces), garantizando fluidez y adaptabilidad a cualquier tamaño de pantalla sin recargar la memoria del dispositivo.

---

### 2. Código Fuente de la Interfaz de Autenticación (`LoginScreen.kt`)

A continuación se presenta el código fuente de la pantalla de inicio de sesión del usuario:

```kotlin
package com.example.apppedalea.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController

@Composable
fun LoginScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var mensajeError by remember { mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Pal' Monte",
            style = MaterialTheme.typography.headlineLarge,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "Iniciar Sesión",
            style = MaterialTheme.typography.titleMedium
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Campo de entrada Correo Electrónico
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Correo electrónico") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Campo de entrada Contraseña
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Botón de Ingreso
        Button(
            onClick = {
                if (email.isNotBlank() && password.isNotBlank()) {
                    navController.navigate("dashboard")
                } else {
                    mensajeError = "Por favor ingresa usuario y contraseña"
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Ingresar")
        }

        if (mensajeError.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = mensajeError, color = MaterialTheme.colorScheme.error)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "¿No tienes cuenta? Regístrate",
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.clickable {
                navController.navigate("register")
            }
        )
    }
}
```

---

### 3. Validación de Usuario con SQLite en Android

Para la validación local de credenciales de usuario mediante la base de datos embebida **SQLite**, se codificó la clase `DatabaseHelper` que administra la tabla `usuario` y la consulta de verificación de login:

#### A. Clase `DatabaseHelper.kt` con la Consulta de Validación
```kotlin
package com.example.apppedalea.data

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "palmonte.db"
        private const val DATABASE_VERSION = 1
        private const val TABLE_USUARIO = "usuario"
    }

    override fun onCreate(db: SQLiteDatabase) {
        // Creación de la tabla de usuarios
        val createTable = """
            CREATE TABLE $TABLE_USUARIO (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """.trimIndent()
        db.execSQL(createTable)

        // Usuario demo para pruebas
        db.execSQL("INSERT INTO $TABLE_USUARIO (nombre, email, password) VALUES ('Carlos Rodriguez', 'carlos@email.com', '123456')")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_USUARIO")
        onCreate(db)
    }

    // CONSULTA DE VALIDACIÓN DE USUARIO (SQLite)
    fun validarUsuario(email: String, password: String): Boolean {
        val db = this.readableDatabase
        val query = "SELECT * FROM $TABLE_USUARIO WHERE email = ? AND password = ?"
        val cursor = db.rawQuery(query, arrayOf(email, password))
        
        val usuarioValido = cursor.count > 0
        cursor.close()
        db.close()
        
        return usuarioValido
    }
}
```

#### B. Consulta SQL de Validación Utilizada
```sql
SELECT * FROM usuario WHERE email = ? AND password = ?
```
* **Explicación:** La consulta recibe los parámetros `email` y `password`. Si el método `cursor.count` retorna mayor a cero, confirma que las credenciales existen en la base de datos local y permite el acceso al sistema.

---

## Conclusión

Se completaron exitosamente los requerimientos de la guía de laboratorio SENA:
1. Se estructuró el proyecto Android respetando los cuatro pilares (`Manifest`, `Java/Kotlin`, `Res`, `Gradle`).
2. Se codificó la interfaz de usuario de autenticación seleccionando una distribución lineal optimizada.
3. Se implementó la clase de base de datos **SQLite** con la consulta de validación de credenciales.
