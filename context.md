# Photobooth IA Totem - Documentación del Proyecto

## 📋 Descripción General

Sistema de photobooth interactivo para totem touchscreen que permite a los usuarios:
1. Capturar fotos con cámara web
2. Seleccionar un filtro de estilo de IA (Cyberpunk, Anime, Pixar)
3. Procesar la imagen con inteligencia artificial vía Fal.ai
4. Visualizar el resultado y descargarlo mediante código QR

## 🎯 Objetivos del Proyecto

### Prototipo Actual (Offline)
- ✅ Aplicación web funcional con Next.js
- ✅ Captura de fotos con webcam del navegador
- ✅ Procesamiento de imágenes con Fal.ai API
- ✅ Interfaz optimizada para pantalla touchscreen
- ✅ Generación de QR para descarga

### Futuras Iteraciones (Producción)
- ⏳ Integración con n8n workflow orchestrator
- ⏳ Base de datos Supabase para almacenamiento
- ⏳ Deploy en Vercel con CI/CD
- ⏳ Repositorio en GitHub
- ⏳ Cámara física con AI tracking
- ⏳ Panel de administración
- ⏳ Analytics y métricas

## 🏗️ Arquitectura Actual

### Stack Tecnológico
- **Framework:** Next.js 14+ (App Router) con TypeScript
- **Estilos:** TailwindCSS
- **Cámara:** Browser getUserMedia API
- **IA:** Fal.ai API (flux-lora model)
- **QR:** qrcode.react
- **Estado:** React hooks (useState, useCallback)

### Estructura de Archivos

```
260103.TotemIA/
├── app/
│   ├── page.tsx          # Página principal con state machine
│   ├── layout.tsx        # Layout raíz
│   └── globals.css       # Estilos globales y optimizaciones touch
├── components/
│   ├── TouchButton.tsx   # Botón optimizado para touch (80px+ target)
│   ├── CameraCapture.tsx # Componente de captura de cámara
│   ├── FilterSelector.tsx # Selector de filtros con 3 opciones
│   ├── FilterCard.tsx    # Tarjeta individual de filtro
│   ├── LoadingBar.tsx    # Barra de progreso animada
│   ├── QRDisplay.tsx     # Generador y display de código QR
│   └── ResultScreen.tsx  # Pantalla de resultado final
├── lib/
│   ├── fal-service.ts    # Cliente de Fal.ai con 3 filtros
│   └── hooks/
│       └── useCamera.ts  # Hook para manejo de cámara
├── types/
│   └── index.ts          # Definiciones de tipos TypeScript
├── context/
│   └── [diagramas del proyecto]
├── .env.local            # Variables de entorno (crear manualmente)
└── context.md            # Este archivo
```

## 🔄 Flujo de Estados (State Machine)

La aplicación utiliza una máquina de estados con 7 estados principales:

### 1. IDLE (Pantalla de Bienvenida)
- Muestra logo y botón "Comenzar"
- Animaciones de llamado a la acción
- **Transición:** Usuario presiona "Comenzar" → CAMERA_READY

### 2. CAMERA_READY (Vista en Vivo)
- Activa la cámara web
- Muestra preview en tiempo real con efecto espejo
- Botón grande "Tomar Foto"
- **Transición:** Usuario presiona "Tomar Foto" → COUNTDOWN

### 3. COUNTDOWN (Temporizador)
- Cuenta regresiva de 3 segundos
- Muestra números grandes animados
- **Transición:** Al llegar a 0 → PHOTO_TAKEN

### 4. PHOTO_TAKEN (Revisión de Foto)
- Muestra la foto capturada
- Opciones: "Tomar otra" o "Continuar"
- **Transiciones:** 
  - "Tomar otra" → CAMERA_READY
  - "Continuar" → FILTER_SELECT

### 5. FILTER_SELECT (Selección de Filtro)
- Grid con 3 tarjetas de filtros:
  - **Cyberpunk:** Neon, futurista, luces brillantes
  - **Anime:** Estilo manga, colores vibrantes
  - **Pixar:** Animación 3D, estilo Disney
- Botones: "Volver" o "Continuar con [filtro]"
- **Transiciones:**
  - "Volver" → PHOTO_TAKEN
  - "Continuar" → PROCESSING

### 6. PROCESSING (Procesamiento IA)
- Barra de progreso animada
- Spinner de carga
- Llamada a Fal.ai API
- **Transición:** Imagen procesada → RESULT

### 7. RESULT (Resultado Final)
- Muestra imagen procesada
- Código QR para descarga
- Botón "Tomar otra foto"
- Auto-reset después de 60 segundos de inactividad
- **Transición:** "Tomar otra foto" → IDLE

## 🎨 Filtros de IA (Fal.ai)

### Configuración de Filtros

Cada filtro utiliza el modelo `fal-ai/flux-lora` con prompts específicos:

#### Cyberpunk
```typescript
prompt: "cyberpunk style, neon lights, futuristic city background, 
         glowing elements, tech wear, dramatic lighting, digital art"
strength: 0.85
color: cyan to purple gradient
```

#### Anime
```typescript
prompt: "anime style, manga illustration, cel shaded, vibrant colors, 
         big expressive eyes, clean linework, studio ghibli inspired"
strength: 0.85
color: pink to yellow gradient
```

#### Pixar
```typescript
prompt: "pixar 3d animation style, disney character design, 
         cute and friendly, soft lighting, high quality render, colorful"
strength: 0.85
color: blue to green gradient
```

### Parámetros de Procesamiento
- `num_inference_steps: 28` - Calidad del procesamiento
- `guidance_scale: 3.5` - Adherencia al prompt
- `seed: random` - Variabilidad en resultados

## 🖥️ Optimizaciones para Totem Touchscreen

### CSS y UX
- ✅ Botones mínimo 80px de altura (touch targets)
- ✅ Feedback visual en todos los toques (scale animations)
- ✅ Desactivado scroll, zoom, context menu
- ✅ Prevent text selection
- ✅ Prevent pull-to-refresh
- ✅ Fullscreen mode support
- ✅ Scrollbars personalizados touch-friendly
- ✅ Gradientes y animaciones suaves

### Comportamientos
- ✅ Auto-reset después de 60s de inactividad en pantalla final
- ✅ Temporizador de 3 segundos antes de captura
- ✅ Efecto espejo en cámara frontal
- ✅ Loading states en todas las operaciones asíncronas

## 🔑 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```bash
# Fal.ai API Key
NEXT_PUBLIC_FAL_KEY=your_fal_ai_api_key_here
```

**Importante:** 
- Obtener API key en [fal.ai](https://fal.ai)
- No commitear el archivo `.env.local` al repositorio
- Usar `.env.example` como plantilla

## 🚀 Comandos de Desarrollo

### Instalación
```bash
npm install
```

### Desarrollo Local
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### Build de Producción
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@fal-ai/client": "^1.x",
    "qrcode.react": "^4.x",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "typescript": "^5.x"
  }
}
```

## 🔧 Decisiones Técnicas

### ¿Por qué Next.js?
- App Router moderno con Server/Client Components
- Optimización automática de imágenes
- TypeScript out-of-the-box
- Fácil escalabilidad a producción con Vercel
- API routes para futuras necesidades backend

### ¿Por qué getUserMedia en lugar de cámara externa?
- Para prototipo es más simple y rápido
- No requiere hardware adicional
- Funciona en cualquier dispositivo con webcam
- En producción se puede cambiar a cámara con AI tracking

### ¿Por qué Fal.ai?
- API simple y bien documentada
- Modelos de alta calidad (Flux)
- Pricing transparente
- Buen soporte para image-to-image

### ¿Por qué no n8n en el prototipo?
- Simplifica el desarrollo inicial
- Conexión directa a Fal.ai es más rápida
- n8n se agregará en fase de producción para:
  - Orquestar workflows complejos
  - Integrar con Supabase
  - Manejar webhooks y notificaciones
  - Logging y monitoring

## 🐛 Problemas Conocidos y Soluciones

### Error: "Camera permission denied"
- **Causa:** Usuario no otorgó permisos de cámara
- **Solución:** Mostrar mensaje instructivo, permitir reintentar

### Error: "Fal.ai API key not configured"
- **Causa:** Variable de entorno no configurada
- **Solución:** Crear archivo `.env.local` con la API key

### Nota sobre @fal-ai/client v1.8+
- **Cambio de API:** La versión actual no usa `fal.config()`, las credenciales se pasan directamente a cada llamada
- **Solución implementada:** Credentials se pasan en el objeto de opciones de cada llamada API

### Error: "Image processing failed"
- **Causa:** Timeout o error en Fal.ai API
- **Solución:** Implementar retry logic, mostrar error al usuario

### Warning: Image component "unoptimized"
- **Causa:** Imágenes vienen de URLs externas (data URLs, Fal.ai)
- **Solución:** Usar prop `unoptimized`, es esperado en este caso

## 📝 Estado de Implementación

### ✅ Completado
- [x] Setup de Next.js con TypeScript y TailwindCSS
- [x] Estructura de carpetas y tipos
- [x] Hook useCamera para captura
- [x] Componentes UI (TouchButton, FilterCard, LoadingBar, etc.)
- [x] State machine con 7 estados
- [x] Integración con Fal.ai (3 filtros)
- [x] Generación de QR code
- [x] Optimizaciones touchscreen
- [x] Estilos globales y animaciones
- [x] Documentación (este archivo)

### ⏳ Pendiente para Producción
- [ ] Configurar repositorio Git y GitHub
- [ ] Setup de n8n workflow
- [ ] Integración con Supabase
  - [ ] Storage para imágenes
  - [ ] Database para metadata
  - [ ] Auth para panel admin
- [ ] Deploy en Vercel
- [ ] CI/CD con GitHub Actions
- [ ] Panel de administración
- [ ] Analytics y métricas
- [ ] Tests (unit, integration, e2e)
- [ ] Cámara con AI tracking física

## 🎯 Próximos Pasos

1. **Probar el prototipo localmente**
   - Configurar `.env.local` con API key de Fal.ai
   - Ejecutar `npm run dev`
   - Probar flujo completo
   - Ajustar prompts de filtros si es necesario

2. **Optimizaciones menores**
   - Ajustar tiempos de animación
   - Mejorar mensajes de error
   - Agregar más feedback visual

3. **Preparar para producción**
   - Crear repositorio GitHub
   - Documentar proceso de deploy
   - Configurar Supabase project
   - Diseñar workflow en n8n

## 💡 Notas Adicionales

### Uso en Totem
- Recomendado pantalla táctil de 24"+ 
- Resolución mínima: 1920x1080
- Webcam externa HD recomendada
- Considerar iluminación adicional

### Performance
- Tiempo promedio de procesamiento: 10-30 segundos
- Depende de carga de servidores Fal.ai
- Considerar mostrar ejemplos mientras procesa

### Costos Fal.ai
- Modelo flux-lora: ~$0.025 por imagen
- Calcular según uso esperado
- Considerar plan con créditos prepagados

## 📞 Contacto y Soporte

- **Documentación Fal.ai:** https://fal.ai/docs
- **Next.js Docs:** https://nextjs.org/docs
- **TailwindCSS:** https://tailwindcss.com/docs

---

**Última actualización:** Enero 2026  
**Versión:** 1.0.0 (Prototipo)  
**Estado:** ✅ Funcional para desarrollo local

