# 📸 Photobooth IA Totem

Sistema de photobooth interactivo con filtros de inteligencia artificial para pantallas touchscreen.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![Fal.ai](https://img.shields.io/badge/Fal.ai-IA-purple)

## ✨ Características

- 📷 **Captura de fotos** con webcam integrada
- 🎨 **3 filtros de IA** disponibles:
  - Cyberpunk (estilo neon futurista)
  - Anime (estilo manga/animación)
  - Pixar (estilo animación 3D)
- 📱 **Código QR** para descarga desde móvil
- 👆 **Interfaz touchscreen** optimizada
- ⚡ **Procesamiento en tiempo real** con Fal.ai
- 🎯 **State machine** con 7 estados para flujo controlado

## 🚀 Inicio Rápido

### Prerequisitos

- Node.js 18+ instalado
- Cuenta en [Fal.ai](https://fal.ai) con API key
- Webcam conectada

### Instalación

1. **Clonar o descargar el proyecto**

```bash
cd 260103.TotemIA
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local` en la raíz del proyecto:

```bash
NEXT_PUBLIC_FAL_KEY=tu_api_key_de_fal_ai
```

> 💡 Obtén tu API key gratis en [fal.ai/dashboard](https://fal.ai/dashboard)

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

Navega a [http://localhost:3000](http://localhost:3000)

## 🎮 Uso

### Flujo de Usuario

1. **Pantalla de Bienvenida** → Click en "Comenzar"
2. **Vista en Vivo** → Posicionarse frente a la cámara
3. **Capturar Foto** → Click en "Tomar Foto" (countdown de 3 seg)
4. **Revisar Foto** → Elegir "Tomar otra" o "Continuar"
5. **Seleccionar Filtro** → Elegir entre Cyberpunk, Anime o Pixar
6. **Procesamiento** → Esperar mientras la IA procesa (10-30 seg)
7. **Resultado** → Ver la foto procesada y escanear el QR para descargar

### Atajos de Teclado

- `F11` o botón en pantalla → Pantalla completa
- `ESC` → Salir de pantalla completa

### Configuración para Totem

Para usar en un totem real:

1. Configurar el navegador para abrir en pantalla completa al inicio
2. Bloquear el sistema operativo para que solo ejecute el navegador
3. Conectar una webcam HD externa (recomendado)
4. Considerar iluminación adicional para mejores resultados

## 📁 Estructura del Proyecto

```
260103.TotemIA/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal con state machine
│   ├── layout.tsx         # Layout raíz
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── CameraCapture.tsx  # Captura de cámara
│   ├── FilterSelector.tsx # Selector de filtros
│   ├── FilterCard.tsx     # Tarjeta de filtro
│   ├── LoadingBar.tsx     # Barra de progreso
│   ├── QRDisplay.tsx      # Generador de QR
│   ├── ResultScreen.tsx   # Pantalla de resultado
│   ├── TouchButton.tsx    # Botón touch-friendly
│   └── FullscreenButton.tsx # Toggle pantalla completa
├── lib/                   # Lógica y utilidades
│   ├── fal-service.ts     # Cliente de Fal.ai
│   ├── utils.ts           # Funciones auxiliares
│   └── hooks/
│       └── useCamera.ts   # Hook de cámara
├── types/                 # Definiciones TypeScript
│   └── index.ts
├── context/               # Documentación de diseño
└── context.md            # Documentación técnica
```

## 🛠️ Tecnologías

- **[Next.js 15](https://nextjs.org)** - Framework React
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[TailwindCSS](https://tailwindcss.com)** - Estilos utility-first
- **[Fal.ai](https://fal.ai)** - Procesamiento de imágenes con IA
- **[qrcode.react](https://www.npmjs.com/package/qrcode.react)** - Generación de QR codes

## 🎨 Filtros de IA

### Cyberpunk
Transforma tu foto con estilo cyberpunk: luces neón, ambiente futurista, colores vibrantes.

**Modelo:** `fal-ai/flux-lora`  
**Prompt:** "cyberpunk style, neon lights, futuristic city background, glowing elements, tech wear, dramatic lighting, digital art"

### Anime
Convierte tu foto al estilo anime/manga: colores vibrantes, ojos expresivos, líneas limpias.

**Modelo:** `fal-ai/flux-lora`  
**Prompt:** "anime style, manga illustration, cel shaded, vibrant colors, big expressive eyes, clean linework, studio ghibli inspired"

### Pixar
Transforma tu foto en personaje de animación 3D tipo Pixar/Disney.

**Modelo:** `fal-ai/flux-lora`  
**Prompt:** "pixar 3d animation style, disney character design, cute and friendly, soft lighting, high quality render, colorful"

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Crear build optimizado
npm start            # Iniciar servidor de producción

# Calidad de código
npm run lint         # Ejecutar ESLint
```

## 📝 Configuración Avanzada

### Ajustar Parámetros de IA

Editar `lib/fal-service.ts`:

```typescript
const result = await fal.subscribe('fal-ai/flux-lora', {
  input: {
    image_url: imageUrl,
    prompt: filter.prompt,
    strength: 0.85,              // 0-1: Intensidad del filtro
    num_inference_steps: 28,      // Más pasos = mejor calidad
    guidance_scale: 3.5,          // Adherencia al prompt
  },
});
```

### Cambiar Tiempo de Auto-Reset

Editar `app/page.tsx`:

```typescript
useEffect(() => {
  if (appState === 'RESULT') {
    const timeout = setTimeout(() => {
      handleRestart();
    }, 60000); // Cambiar valor en milisegundos
    
    return () => clearTimeout(timeout);
  }
}, [appState]);
```

### Agregar Más Filtros

1. Agregar configuración en `lib/fal-service.ts`:

```typescript
export const FILTER_CONFIGS = {
  // ... filtros existentes
  vintage: {
    id: 'vintage' as FilterStyle,
    name: 'Vintage',
    prompt: 'vintage photo style, sepia tones, grainy texture, old film look',
    description: 'Estilo fotografía vintage',
    previewColor: 'from-amber-600 to-orange-500',
  },
};
```

2. Actualizar tipo en `types/index.ts`:

```typescript
export type FilterStyle = 'cyberpunk' | 'anime' | 'pixar' | 'vintage';
```

## 🐛 Solución de Problemas

### Error: "Camera permission denied"
**Solución:** Permitir acceso a la cámara en la configuración del navegador.

### Error: "Fal.ai API key not configured"
**Solución:** Verificar que el archivo `.env.local` existe y contiene la API key correcta.

### Procesamiento muy lento
**Posibles causas:**
- Servidores de Fal.ai con alta carga
- Conexión a internet lenta
- Imagen de alta resolución

**Solución:** Ajustar `num_inference_steps` a un valor menor (ej: 20) para procesamiento más rápido.

### La cámara se ve invertida
**Esto es normal.** El efecto espejo está aplicado intencionalmente para la vista previa. La foto final no está invertida.

## 📊 Rendimiento

- **Tiempo de captura:** Instantáneo
- **Tiempo de procesamiento IA:** 10-30 segundos (depende de Fal.ai)
- **Tamaño de imagen procesada:** ~1-2 MB
- **Costo por imagen:** ~$0.025 USD (Fal.ai pricing)

## 🔒 Seguridad

- ✅ Las imágenes no se almacenan en el servidor
- ✅ Procesamiento temporal en memoria
- ✅ Datos de usuario no se recopilan
- ⚠️ Para producción: implementar almacenamiento seguro en Supabase

## 🚧 Roadmap

- [ ] Integración con n8n para workflows
- [ ] Almacenamiento persistente con Supabase
- [ ] Panel de administración
- [ ] Soporte para múltiples idiomas
- [ ] Cámara con AI tracking automático
- [ ] Efectos y marcos personalizables
- [ ] Sistema de plantillas de filtros
- [ ] Analytics y métricas de uso
- [ ] PWA para instalación offline

## 📚 Documentación Adicional

- [context.md](./context.md) - Documentación técnica completa
- [Diagramas de flujo](./context/) - Diseño y arquitectura

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Las sugerencias y mejoras son bienvenidas.

## 📄 Licencia

Este proyecto es privado y de uso interno.

---

**Desarrollado con ❤️ para experiencias interactivas**

Para más información, consulta [context.md](./context.md)
