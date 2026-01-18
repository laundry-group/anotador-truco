# Anotador de Truco 🎴

Aplicación web progresiva (PWA) para anotar partidas de Truco con un diseño visual único que utiliza papas fritas animadas como sistema de conteo. Completamente optimizada para móviles con soporte para dispositivos con notch, instalable en iOS, Android y Windows.

## ✨ Características Principales

- **Sistema de conteo visual**: Las papas fritas forman marcos cuadrados (5 puntos por cuadrado) con su diagonal característica
- **Pantalla de bienvenida**: Aparece siempre al iniciar la app con opciones de ver historial o comenzar nueva partida
- **Seguimiento de duración**: Cada partida registra su tiempo de duración en minutos, visible al terminar y en el historial
- **Estadísticas simplificadas**: Muestra las últimas 5 partidas con detalles completos (fecha, hora, puntajes, duración)
- **Layout optimizado**: Header, nombres y controles fijos, scroll solo en área de tally para mejor usabilidad
- **Historial con dos vistas**:
  - **Agrupado**: Agrupa acciones de ambos equipos en ventanas de 60 segundos (una línea por minuto)
  - **Detalle**: Muestra cada acción individual con totales acumulados
- **Diseño temático**: Logo personalizado "Laundry Truco" (216px desktop, 168px móvil)
- **Persistencia automática**: El estado del juego se guarda en localStorage
- **Separador a los 15 puntos**: Línea divisoria con patrón de cuadrados (aparece al superar 15 puntos)
- **Nombres en mayúsculas**: Los nombres de equipos se convierten automáticamente a UPPERCASE
- **Optimización móvil premium**:
  - Safe area insets para dispositivos con notch (iPhone X+) en modales
  - Font-size mínimo 16px para evitar zoom automático en iOS
  - Feedback táctil en todos los botones (56x56px)
  - Modo landscape optimizado
  - Modo alto contraste para visibilidad bajo luz solar
- **PWA completa**: Instalable en iOS, Android y Windows con iconos optimizados
- **Modal de victoria**: Notificación con duración de la partida al alcanzar la meta
- **Interfaz unificada**: Botones táctiles de 56px en todas las plataformas

## 🎮 Uso

1. Abrir `index.html` en un navegador moderno o iniciar servidor local:
   ```bash
   python -m http.server 8000
   ```
2. Acceder a `http://localhost:8000`
3. **Pantalla de bienvenida**:
   - Ver "Últimas Partidas" 🏆 para revisar el historial
   - Presionar "Empezar" para iniciar una nueva partida (resetea puntajes)
4. Personalizar nombres de equipos (se convierten automáticamente a MAYÚSCULAS)
5. Usar botones + y - para sumar/restar puntos
6. Scroll en el área de tally cuando hay muchos puntos
7. Acceder al menú (☰) para:
   - Ver historial completo con tabs "Agrupado" y "Detalle" (IR AL VAR)
   - Ver últimas 5 partidas con duración (🏆 ÚLTIMAS PARTIDAS)
   - Reiniciar la partida (🔄 REINICIAR)
8. Al terminar una partida, se muestra el tiempo de duración en el modal de victoria

## 📁 Estructura del Proyecto

```
Truco/
├── index.html              # Interfaz principal con meta tags PWA
├── style.css               # Estilos, diseño visual y responsive
├── app.js                  # Lógica del juego, localStorage y agrupación
├── sw.js                   # Service Worker (cache, offline, actualizaciones)
├── manifest.json           # Configuración PWA (Android/iOS/Windows)
├── create-icons.ps1        # Script PowerShell para generar íconos
├── create-favicon.ps1      # Script PowerShell para generar favicon
├── assets/
│   ├── logo_laundry_truco.png         # Logo principal
│   ├── truco_laundry_logo.png         # Logo header
│   ├── icon-44x44.png                 # Icono Windows barra de tareas
│   ├── icon-150x150.png               # Icono Windows tile mediano
│   ├── icon-310x310.png               # Icono Windows tile grande
│   ├── apple-touch-icon-*.png         # Iconos iOS (152, 167, 180)
│   ├── favicon.ico                    # Favicon multi-tamaño
│   ├── favicon-32x32.png              # Favicon navegador PNG
│   ├── papafrita.svg                  # Diseño base de papa (vertical)
│   ├── papafrita-horizontal.svg       # Papa horizontal para top/bottom
│   ├── papafrita1-5.svg               # Variantes de papas (5 diseños)
│   ├── var.svg                        # Icono del historial/VAR
│   └── restart.png                    # Icono de reiniciar
└── README.md
```

## 🎨 Sistema Visual

### Pantalla de Bienvenida
- **Logo**: 216px en desktop, 168px en móvil con animación bounce
- **Botones**: Instalar PWA, Ver últimas partidas (🏆), Empezar
- **Aparece siempre**: Al recargar o entrar a la app
- **z-index**: 10000 para estar sobre todo el contenido

### Layout con Scroll Optimizado
- **Header fijo**: Siempre visible en la parte superior
- **Nombres fijos**: Los inputs de nombres permanecen accesibles
- **Puntajes fijos**: Score siempre visible
- **Controles fijos**: Botones +/- siempre accesibles
- **Tally scrolleable**: Solo el área de papas fritas hace scroll
  - Scrollbar personalizado semitransparente
  - Desktop: max-height calc(100vh - 350px)
  - Mobile: flex 1 con min-height 0

### Papas Fritas (Tally System)
- **Marco cuadrado**: 5 papas forman un marco (top, right, bottom, left + diagonal)
  - Papas horizontales para posiciones superior e inferior
  - Papas verticales para posiciones laterales y diagonal
  - 40px de grosor, 150px tamaño de grupo
  - Animaciones de fade-in (140ms)
- **Separador a los 15 puntos**: 
  - Patrón de cuadrados rojos y blancos (12px cada cuadrado)
  - 24px de altura, solo aparece cuando el puntaje supera 15
  - flex-shrink: 0 para mantener tamaño en scroll

### Historial (VAR)
- **Tabs personalizados**:
  - Activo: Fondo rojo oscuro (#b71c1c), texto blanco, elevado 2px
  - Inactivo: Fondo crema (#fffdf4), texto gris (#666)
  - Padding compacto: 8px 16px, min-height 44px
- **Vista Agrupada**: Agrupa acciones de ambos equipos en ventanas de 60 segundos (formato: "EQUIPO1 +2 | EQUIPO2 -1")
- **Vista Detalle**: Muestra cada acción con totales acumulados
- **Tabla responsive**: 
  - Desktop: font-size 13px
  - Mobile: font-size 12px, padding reducido
  - Columnas: ACCIÓN, HORA, team-1, team-2

### Estadísticas (🏆 Últimas Partidas)
- **Simplificadas**: Solo muestra las últimas 5 partidas
- **Match cards**: Fondo #a51d1d con texto blanco
- **Información por partida**:
  - Fecha y hora
  - Ganador 🏆 con puntaje
  - Perdedor con puntaje
  - Duración ⏱️ en minutos
- **Scrolleable**: Max-height 400px (desktop) / 300px (móvil)
- **Scrollbar personalizado**: Diseño coherente con el tema rojo

### Colores
- Principal: #a51d1d
- Acento: #b71c1c
- Fondo claro: #fffdf4
- Texto: #e6eef6 / #FFFFFF

## 📱 PWA & Optimizaciones Móviles

### Instalación Multi-Plataforma
- **iOS**: Iconos 152x152, 167x167, 180x180
- **Android**: Iconos 192x192, 512x512 (maskable)
- **Windows**: Iconos 44x44, 150x150, 310x310
- **Favicon**: .ico multi-tamaño (16, 32, 48)

### Optimizaciones Premium
- **Safe Area Insets**: Soporte completo para notch en modales (iPhone X+, Android)
  - Modales: `margin-top: max(32px, env(safe-area-inset-top))`
  - Mobile: Ajuste automático con safe-area-inset-top y bottom
- **Viewport**: `viewport-fit=cover` para pantalla completa
- **Font-size**: Mínimo 16px en inputs (evita zoom automático iOS)
- **Touch Targets**: Todos los botones 56x56px (menú, cerrar, controles)
- **Touch Actions**: `touch-action:manipulation` en elementos interactivos
- **Feedback Táctil**: States `:active` con scale(0.95)
- **Botones con hover**: Efectos visuales en :hover y :active
- **Landscape Mode**: Optimización específica para horizontal
- **Alto Contraste**: Borders más gruesos en modo high-contrast
- **Performance**: `will-change` en animaciones para 60fps
- **Modal Mobile**: Max-height ajustado con safe-area, z-index 10001
- **Layout Móvil**: Estructura flex con scroll solo en tally (height: 100vh)

### Progressive Web App
- **Standalone**: Se abre sin barra de navegador
- **Offline Ready**: Funciona completamente sin internet
- **Auto-Update**: Detecta y notifica nuevas versiones
- **Cache Inteligente**: Carga instantánea después de primera visita
- **Theme color**: #a51d1d para barra de estado
- **Background color**: #a51d1d
- **Orientation**: Portrait preferred
- **Screenshots**: Estructura preparada para stores

## 🔧 Tecnologías

- **HTML5**: Meta tags PWA, semantic markup
- **CSS3**: 
  - Grid & Flexbox layouts
  - Media queries (mobile, landscape, high-contrast)
  - CSS Variables (custom properties)
  - Sticky positioning (tabla header)
  - Transform & transitions
- **JavaScript Vanilla**:
  - localStorage API
  - Date manipulation
  - Event delegation
  - DOM manipulation
- **SVG**: Gráficos vectoriales escalables
- **Web APIs**: 
  - Web App Manifest
  - Service Worker ready
  - Safe area insets

## 📋 Características Técnicas

### Sistema de Duración de Partidas
- **Tracking automático**: Se registra `startTime` al iniciar/resetear partida
- **Cálculo al terminar**: `Math.round((endTime - startTime) / 60000)` para obtener minutos
- **Almacenamiento**: Campo `duration` en cada match del historial
- **Visualización**: 
  - Modal de victoria: "⏱️ Duración: X minutos"
  - Match cards: "⏱️ X minutos" bajo el nombre del perdedor
- **Formato inteligente**: "1 minuto" (singular) vs "X minutos" (plural)

### Pantalla de Bienvenida
- **Aparece siempre**: No usa localStorage para recordar visita
- **Reseteo automático**: Al presionar "Empezar" se resetea la partida (puntajes a 0)
- **Acceso a estadísticas**: Botón para ver últimas partidas desde el inicio
- **z-index alto**: 10000 para estar sobre todo, modales en 10001

### Historial Agrupado
- **Ventana de tiempo**: 60 segundos
- **Criterios de agrupación**: 
  - Todas las acciones dentro de la misma ventana de 60 segundos
  - Muestra ambos equipos en una sola línea (ej: "NOSOTROS +2 | ELLOS -1")
  - Resalta con color los equipos que tuvieron actividad
- **Comportamiento**: Siempre abre en vista "Agrupado" por defecto

### Persistencia
- Estado completo guardado en localStorage (LS_KEY: 'truco_anotador_v1')
- Estadísticas en localStorage (LS_STATS_KEY: 'truco_stats_v1')
- Historia de movimientos con timestamps
- Nombres de equipos personalizados (auto-uppercase)
- Duración de partidas guardada en historial
- **No se guarda** la visita a pantalla de bienvenida (siempre aparece)

### Responsive Design
- **Desktop**: 980px max-width, layout horizontal
- **Mobile (<700px)**: Split 50/50, controles optimizados
- **Landscape (<900px)**: Max-height 85vh con scroll
- **Touch targets**: Mínimo 44px (W3C guidelines)

## 🚀 Instalación como PWA

### iOS (Safari)
1. Abrir en Safari
2. Tocar el botón "Compartir" 
3. Seleccionar "Añadir a pantalla de inicio"
4. Confirmar instalación

### Android (Chrome)
1. Abrir en Chrome
2. Tocar el menú (⋮)
3. Seleccionar "Instalar aplicación" o "Añadir a pantalla de inicio"
4. Confirmar instalación

### Windows 10/11 (Edge)
1. Abrir en Microsoft Edge
2. Click en el menú (⋯)
3. Seleccionar "Aplicaciones" → "Instalar este sitio como aplicación"
4. Confirmar instalación
5. La app aparecerá en el Menú Inicio con íconos optimizados

## 📝 Notas Adicionales

- **Meta predeterminada**: 30 puntos
- **Nombres por defecto**: "NOSOTROS" y "ELLOS" (siempre en MAYÚSCULAS)
- **Guardado automático**: Cada acción se persiste inmediatamente
- **Separador dinámico**: Solo aparece cuando algún equipo supera 15 puntos
- **Historial inteligente**: Default siempre en vista "Agrupado"
- **Timestamps**: Formato HH:MM:SS para cada acción
- **Duración**: Se trackea desde el inicio hasta que alguien gana
- **Pantalla inicial**: Aparece siempre al recargar la app
- **Optimización**: Animaciones a 60fps con will-change
- **Accesibilidad**: Touch targets de 56x56px (superior a los 44px recomendados)
- **Layout responsivo**: Header fijo, scroll solo en tally
- **Sin footer**: Espacio completo para el juego
- **Bloqueo post-victoria**: No se pueden sumar puntos después de ganar hasta resetear

## 🎯 Próximas Mejoras Potenciales

- [x] Service Worker para funcionamiento offline completo ✅
- [x] Sistema de actualización automática con notificaciones ✅
- [x] Estadísticas simplificadas con últimas partidas ✅
- [x] Sistema de duración de partidas ✅
- [x] Pantalla de bienvenida persistente ✅
- [x] Layout optimizado con scroll solo en tally ✅
- [x] Touch targets de 56x56px ✅
- [x] Safe area insets para iOS ✅
- [ ] Estadísticas avanzadas (win rate, promedios, gráficos)
- [ ] Temas personalizables (claro/oscuro)
- [ ] Sonidos de feedback
- [ ] Export/Import de historial
- [ ] Screenshots para manifest.json

## 🔄 Sistema de Actualizaciones

### Service Worker Implementado
La app incluye un Service Worker completo que:
- **Cache-First**: Recursos cargados desde cache para máxima velocidad
- **Funcionamiento Offline**: La app funciona sin conexión
- **Auto-actualización**: Detecta nuevas versiones automáticamente cada 60 segundos
- **Banner de notificación**: Muestra aviso cuando hay actualización disponible
- **Actualización instantánea**: Un click y la app se actualiza sin perder datos

### ¿Cómo funciona?
1. **Primera visita**: Descarga y cachea todos los recursos
2. **Visitas posteriores**: Carga instantánea desde cache
3. **Nueva versión**: Detecta cambios y muestra banner de actualización
4. **Usuario decide**: Click en "Actualizar ahora" o "Más tarde"
5. **Actualización**: Refresco automático con la nueva versión

### Para Desarrolladores
Al hacer cambios, **ACTUALIZAR la versión** en `sw.js`:
```javascript
const CACHE_NAME = 'truco-laundry-v2.0.1'; // Incrementar versión
```
Esto asegura que los usuarios obtengan la nueva versión automáticamente.

## 🤝 Contribuciones

Este es un proyecto personal. Si encuentras bugs o tienes sugerencias, por favor abre un issue.

## 📄 Licencia

Este proyecto está bajo uso personal/educativo.

---

**Desarrollado con ❤️ por Laundry Garage** | Truco Score Keeper v2.0
