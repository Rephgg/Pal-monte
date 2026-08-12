# Manual Técnico — Aplicación Móvil Pal' Monte (`AppPedalea`)

Documento técnico de arquitectura, estructura y componentes de la aplicación móvil nativa Android para la plataforma **Pal' Monte**.

---

## 1. Arquitectura y Entorno de Desarrollo

### 1.1 Entorno Técnico
- **Lenguaje:** Kotlin 2.0.21 / Java JDK 21
- **UI Framework:** Jetpack Compose + Material Design 3
- **Build System:** Gradle 9.2.1 (AGP 9.0.0, Target SDK 35, Min SDK 24)
- **Patrón de Arquitectura:** Unidirectional Data Flow (UDF) + Declarative UI + Repository / ApiService Client.

### 1.2 Estructura del Proyecto
```
AppPedalea/
├── app/src/main/
│   ├── AndroidManifest.xml   --> Permisos de red, actividades y configuración
│   ├── java/com/example/apppedalea/
│   │   ├── MainActivity.kt   --> Enrutador principal (NavHost)
│   │   ├── components/       --> Barras de navegación (TopAppBar, BottomNavigationBar)
│   │   ├── ui/templates/     --> Plantillas de layout (AuthTemplate, MainTemplate, DetailTemplate)
│   │   ├── data/             --> Modelos, ApiService (Retrofit) y DatabaseHelper (SQLite)
│   │   └── screens/          --> Pantallas de módulos (Login, Registro, Dashboard, Rutas, Comercios, Eventos, Perfil)
│   └── res/                  --> Recursos estáticos (colores, cadenas, iconos)
└── build.gradle.kts          --> Configuración de dependencias
```

---

## 2. Componentes de Interfaz y Módulos

### 2.1 Enrutamiento y Navegación (`MainActivity.kt`)
Gestión centralizada de navegación con `NavHost` y `NavController` para las pantallas:
- Autenticación: `login`, `register`, `forgot_password`
- Principal: `dashboard`
- Módulos dinámicos: `routes`, `route_detail/{routeId}`, `commerces`, `commerce_detail/{commerceId}`, `community`, `event_detail/{eventId}`, `profile`, `favorites`, `settings`, `help`.

### 2.2 Pantalla de Autenticación (`LoginScreen.kt`)
Distribución vertical (`Column`) optimizada para formularios de ingreso con campos para correo electrónico, contraseña, validaciones de campo e interacción de navegación hacia el panel principal.

---

## 3. Almacenamiento Local y Base de Datos (SQLite)

La clase `DatabaseHelper.kt` gestiona la base de datos embebida local `palmonte.db` para almacenamiento fuera de línea y verificación de usuario:

```kotlin
package com.example.apppedalea.data

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, "palmonte.db", null, 1) {

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE usuario (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """.trimIndent())

        db.execSQL("INSERT INTO usuario (nombre, email, password) VALUES ('Carlos Rodriguez', 'carlos@email.com', '123456')")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS usuario")
        onCreate(db)
    }

    fun validarUsuario(email: String, password: String): Boolean {
        val db = this.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM usuario WHERE email = ? AND password = ?", arrayOf(email, password))
        val valido = cursor.count > 0
        cursor.close()
        db.close()
        return valido
    }
}
```

---

## 4. Generación de Ejecutables (APK)

El ejecutable oficial de la aplicación móvil se encuentra ubicado en el repositorio dentro de la carpeta:
`apk/laboratorio/PalMonte_AppPedalea.apk`
