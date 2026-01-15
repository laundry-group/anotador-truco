# Anotador de Truco 🎴

Aplicación web progresiva (PWA) para anotar partidas de Truco con un diseño visual único que utiliza papas fritas animadas como sistema de conteo. Guarda el progreso automáticamente en `localStorage` del navegador.

## ✨ Características

- **Sistema de conteo visual**: Las papas fritas forman marcos cuadrados (5 puntos por cuadrado) con su diagonal característica
- **Diseño temático**: Logo personalizado "Laundry Truco" y guarda decorativa estilo tablero en 2 filas
- **Persistencia automática**: El estado del juego se guarda en localStorage
- **Historial tipo tabla**: Accede al VAR para revisar todos los movimientos con totales acumulados de ambos equipos
- **Separador a los 15 puntos**: Línea divisoria visual cuando se alcanza la mitad del juego (15/30)
- **Optimización móvil**: Sin zoom accidental, botones táctiles de 56px, viewport controlado
- **PWA completa**: Instalable en iOS y Android con iconos personalizados
- **Modal de victoria**: Notificación al alcanzar la meta de puntos
- **Interfaz unificada**: Mismo tamaño de botones (56px) en desktop y móvil

## 🎮 Uso

1. Abrir `index.html` en un navegador moderno
2. Opcional: usar Live Server o servir con:
   ```bash
   python -m http.server 8000
   ```
3. Personalizar nombres de equipos
4. Usar botones + y - para sumar/restar puntos
5. Acceder al menú (☰) para:
   - Ver historial completo (VAR)
   - Reiniciar la partida

## 📁 Estructura del Proyecto

```
Truco/
├── index.html          # Interfaz principal con meta tags PWA
├── style.css           # Estilos, diseño visual y responsive
├── app.js              # Lógica del juego y localStorage
├── manifest.json       # Configuración PWA para Android/Chrome
├── assets/
│   ├── logo_laundry_truco.png         # Logo principal (nuevo)
│   ├── truco_laundry_logo.png         # Logo header
│   ├── apple-touch-icon-*.png         # Iconos iOS (152, 167, 180)
│   ├── favicon-32x32.png              # Favicon navegador
│   ├── papafrita.svg                  # Diseño base de papa (vertical)
│   ├── papafrita-horizontal.svg       # Papa horizontal para top/bottom
│   ├── papafrita1-5.svg               # Variantes de papas (5 diseños)
│   ├── var.svg                        # Icono del historial/VAR
│   └── restart.png                    # Icono de reiniciar
└── README.md
```

## 🎨 Sistema Visual

- **Papas fritas**: Cada punto se representa con una papa frita en estilo cartoon
- **Marco cuadrado**: 5 papas forman un marco (top, right, bottom, left + diagonal)
  - Papas horizontales para posiciones superior e inferior
  - Papas verticales para posiciones laterales y diagonal
  - 40px de grosor en todas las posiciones
- **Guarda decorativa**: Patrón de cuadrados rojos y blancos en 2 filas intercaladas (60px altura)
- **Historial tipo tabla**: Columnas ACCIÓN, HORA, ELLOS, NOSOTROS con totales acumulados
- **Colores**: Esquema de rojos (#A51d1d, #b71c1c) con detalles en naranja

## 📱 PWA (Progressive Web App)

- **Instalable**: Funciona como app nativa en iOS y Android
- **Iconos personalizados**: 5 tamaños (152x152, 167x167, 180x180, 192x192, 512x512)
- **Sin zoom accidental**: viewport con maximum-scale=1, user-scalable=no
- **Touch optimizado**: touch-action: manipulation en botones
- **Standalone**: Se abre sin barra de navegador del browser
- **Theme color**: #a51d1d para la barra de estado

## 🔧 Tecnologías

- HTML5 con meta tags PWA
- CSS3 (Grid, Flexbox, gradientes, sticky positioning)
- JavaScript Vanilla
- SVG para gráficos vectoriales
- localStorage API
- Web App Manifest

## 📝 Notas

- La meta predeterminada es 30 puntos
- El historial registra cada movimiento con timestamp y totales acumulados
- Los nombres de equipos por defecto son "Nosotros" y "Ellos"
- El estado se guarda automáticamente con cada cambio
- El historial muestra las columnas en orden: ACCIÓN, HORA, ELLOS, NOSOTROS
- El divisor aparece automáticamente al llegar a 15 puntos
- Botones de control de 56px × 56px en todos los dispositivos
- Logo redimensionado a 199px × 75px (aumentado 15% respecto al original)

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
