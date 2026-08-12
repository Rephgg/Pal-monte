# Taller: Desarrollo Móvil en Android y Tecnologías Emergentes
**Evidencia SENA:** `GA8-220501096-AA2-EV03`  
**Programa:** Análisis y Desarrollo de Software (ADSO)  
**Proyecto:** Pal' Monte — Aplicación móvil para la comunidad de ciclistas (`AppPedalea`)  
**Fecha:** 2026-08-12  

---

## 1. Introducción y Requerimientos de la Actividad

El presente documento constituye la evidencia de conocimiento **GA8-220501096-AA2-EV03**, enmarcada en el taller de creación de la primera aplicación Android y la investigación de tecnologías emergentes y disruptivas asociadas al desarrollo de software móvil.

### Objetivos:
1. Documentar la configuración e instalación del entorno de desarrollo Android (JDK Java, Android Studio SDK, Gradle).
2. Comprender y aplicar los principios de la Programación Orientada a Objetos (POO) y el lenguaje Kotlin/Java en Android.
3. Explicar la arquitectura y estructura de la primera aplicación creada (**`AppPedalea`** para el proyecto **Pal' Monte**).
4. Analizar el impacto de las tecnologías emergentes (Inteligencia Artificial, IoT y computación en la nube) en el desarrollo de aplicaciones móviles contemporáneas.

---

## 2. Instalación y Configuración del Entorno de Desarrollo

Para la construcción de la aplicación **`AppPedalea`** se configuraron las siguientes herramientas de desarrollo en Windows:

### 2.1 Instalación de JAVA (JDK)
- **Versión utilizada:** OpenJDK 21 / Java 17 LTS.
- **Configuración de Variables de Entorno:**
  - `JAVA_HOME = C:\Program Files\Java\jdk-21`
  - Inclusión de `%JAVA_HOME%\bin` en la variable del sistema `PATH`.
- **Verificación:** Comando `java -version` en la consola.

### 2.2 Instalación de Android Studio
- **Entorno IDE:** Android Studio Ladybug / Iguana.
- **SDK Manager:** Instalación de Android SDK Platform (API Level 34/35), Android SDK Build-Tools y NDK.
- **AVD Manager (Emulador):** Configuración de un dispositivo virtual Android (Pixel 7 con Google Play Services, Android 14.0 API 34).

### 2.3 Sistema de Construcción (Gradle)
- **Gradle Wrapper:** Versión 9.2.1.
- **Gradle Plugin (AGP):** 9.0.0.
- **Kotlin Compiler:** Versión 2.0.21.

---

## 3. Fundamentos de Programación Orientada a Objetos y Desarrollo Android

El desarrollo móvil moderno en Android combina los pilares de la Programación Orientada a Objetos (POO) con paradigmas reactivos y declarativos.

### 3.1 Pilares de POO aplicados en Android
* **Encapsulamiento:** Ocultamiento de la lógica interna en modelos de datos (`UserSession`, `RouteModel`) exponiendo métodos seguros de acceso.
* **Herencia:** La clase principal `MainActivity` extiende de `ComponentActivity`, heredando la gestión del ciclo de vida y context del sistema operativo.
* **Polimorfismo:** Implementación de interfaces comunes para consumidores de la API HTTP (`Retrofit`) e inyección de dependencias.
* **Abstracción:** Definición de plantillas UI reutilizables (`MainTemplate`, `DetailTemplate`, `AuthTemplate`) que aíslan la estructura visual del contenido dinámico.

### 3.2 Ciclo de Vida de una Actividad (*Activity Lifecycle*)
En Android, una `Activity` pasa por los estados `onCreate()`, `onStart()`, `onResume()`, `onPause()`, `onStop()`, `onDestroy()`. Con la adopción de **Jetpack Compose**, la UI se vuelve declarativa y reacciona automáticamente a cambios en los estados (`remember`, `mutableStateOf`), optimizando el rendimiento y evitando fugas de memoria.

---

## 4. Estructura y Características de la Aplicación `AppPedalea`

### 4.1 Identificación del Tipo de Aplicación
- **Categoría:** Aplicación nativa Android interactiva con cliente REST, geolocalización y servicios para ciclismo urbano/de montaña.
- **Ubicación del código fuente:** `D:\Android\AppPedalea`
- **Package name:** `com.example.apppedalea`

### 4.2 Módulos y Arquitectura
La aplicación sigue la arquitectura recomendada por Google organizando sus capas en:

```
com.example.apppedalea
├── MainActivity.kt           --> Contenedor principal y enrutador (NavHost)
├── components/               --> Barras de navegación superior e inferior (TopAppBar, BottomNavigationBar)
├── ui/templates/             --> Plantillas de pantalla (AuthTemplate, MainTemplate, DetailTemplate)
├── data/                     --> Modelos Pydantic/Gson, ApiService (Retrofit) y SessionManager
└── screens/                  --> Pantallas funcionales:
    ├── LoginScreen.kt        --> Autenticación de usuario
    ├── RegisterScreen.kt     --> Registro de nuevos ciclistas
    ├── DashboardScreen.kt    --> Panel principal del ciclista
    ├── RoutesListScreen.kt   --> Catálogo de rutas
    ├── RouteDetailScreen.kt  --> Detalle técnico de la ruta
    ├── CommercesListScreen.kt--> Bici-talleres y comercios afiliados
    ├── CommerceDetailScreen.kt-> Detalle de comercio y servicios
    ├── CommunityScreen.kt    --> Eventos y rodadas grupales
    ├── EventDetailScreen.kt  --> Inscripción a eventos
    ├── FavoritesScreen.kt   --> Rutas y comercios guardados
    ├── SettingsScreen.kt     --> Preferencias del usuario
    └── HelpScreen.kt         --> Preguntas frecuentes y soporte
```

---

## 5. Tecnologías Emergentes y Disruptivas en el Desarrollo Móvil

Como parte del componente del taller **GA8-220501096-AA2-EV03**, se investigaron e integraron conceptos de tecnologías disruptivas que transforman la experiencia del usuario en aplicaciones móviles:

### 5.1 Inteligencia Artificial Generativa (Edge AI & APIs)
La integración de modelos de lenguaje de gran tamaño (LLM) como **Gemini API** permite incorporar en aplicaciones de ciclismo como *Pal' Monte*:
- Asistentes virtuales conversacionales en tiempo real para recomendar rutas personalizadas según la condición física y el clima.
- Análisis predictivo de mantenimiento preventivo para la bicicleta basado en la distancia recorrida.

### 5.2 Internet de las Cosas (IoT) y Telemetría Móvil
Aprovechamiento de sensores integrados en dispositivos móviles y wearables (relojes inteligentes, medidores de potencia Bluetooth LE, sensores de cadencia) para capturar en tiempo real:
- Frecuencia cardíaca, elevación barométrica y velocidad GPS.
- Sistema de detección de caídas con alertas automáticas SOS.

### 5.3 Arquitecturas Reactivas y Cloud Native
- **Backend ligero e hiperrápido:** Implementado en FastAPI + Python 3.14 con conexión a MySQL.
- **Consumo de datos dinámico:** Retrofit + Kotlin Coroutines para peticiones asíncronas sin bloquear el hilo principal (*UI Thread*).

---

## 6. Conclusiones y Compilación de la Evidencia

1. Se configuró exitosamente el entorno de desarrollo en Android Studio utilizando las últimas herramientas recomendadas por Google (Kotlin 2.0, Jetpack Compose, Gradle 9.2).
2. Se completó el desarrollo de los módulos requeridos para la evidencia **GA8-220501096-AA2-EV02**, logrando compilar el ejecutable Android **`app-debug.apk`**.
3. La integración entre el frontend móvil en Android Studio y el backend en FastAPI demuestra la viabilidad de arquitecturas desacopladas y escalables en proyectos de desarrollo de software.
