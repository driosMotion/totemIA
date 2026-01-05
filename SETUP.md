# 🚀 Guía de Configuración Rápida

## Pasos para Ejecutar el Prototipo

### 1. Obtener API Key de Fal.ai

1. Ve a [fal.ai](https://fal.ai)
2. Crea una cuenta o inicia sesión
3. Ve al Dashboard → API Keys
4. Crea una nueva API key
5. Copia la key (la necesitarás en el siguiente paso)

### 2. Configurar Variables de Entorno

Crea un archivo llamado `.env.local` en la raíz del proyecto:

```bash
# En la carpeta 260103.TotemIA/
touch .env.local
```

Abre el archivo y agrega tu API key:

```
NEXT_PUBLIC_FAL_KEY=tu_api_key_aqui
```

**Importante:** Reemplaza `tu_api_key_aqui` con tu API key real de Fal.ai.

### 3. Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias necesarias:
- Next.js 15
- React 19
- TailwindCSS
- @fal-ai/client
- qrcode.react
- TypeScript y tipos

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Verás un mensaje como:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

### 5. Abrir en el Navegador

1. Abre tu navegador
2. Ve a `http://localhost:3000`
3. **Importante:** Permite el acceso a la cámara cuando el navegador lo solicite

### 6. Probar el Flujo Completo

1. Click en "Comenzar"
2. Posiciónate frente a la cámara
3. Click en "Tomar Foto"
4. Espera el countdown (3 segundos)
5. Revisa la foto: "Tomar otra" o "Continuar"
6. Selecciona un filtro (Cyberpunk, Anime o Pixar)
7. Espera el procesamiento (10-30 segundos)
8. ¡Disfruta del resultado!
9. Escanea el QR con tu teléfono para descargar

## 🔧 Solución de Problemas Comunes

### "Camera permission denied"
**Solución:** En Chrome, ve a configuración del sitio (icono del candado en la barra de direcciones) y permite el acceso a la cámara.

### "Fal.ai API error"
**Verificar:**
- ¿Creaste el archivo `.env.local`?
- ¿Copiaste la API key correctamente?
- ¿Reiniciaste el servidor después de crear el archivo?

**Reiniciar servidor:**
```bash
# Presiona Ctrl+C para detener
# Luego ejecuta de nuevo:
npm run dev
```

### Puerto 3000 ocupado
Si el puerto 3000 está en uso:

```bash
# Opción 1: Usar otro puerto
PORT=3001 npm run dev

# Opción 2: Matar el proceso en puerto 3000
# En Mac/Linux:
lsof -ti:3000 | xargs kill -9

# En Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### La cámara no se ve
**Verificar:**
- ¿Tu computadora tiene una webcam?
- ¿Está conectada correctamente?
- ¿Otra aplicación está usando la cámara?
- ¿Los permisos del navegador están correctos?

## 📱 Probar en un Dispositivo Móvil

### En la misma red WiFi:

1. Encuentra tu IP local:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

2. Inicia el servidor con:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```

3. En tu móvil, ve a:
   ```
   http://TU_IP:3000
   ```
   Ejemplo: `http://192.168.1.100:3000`

4. Permite el acceso a la cámara

## 💡 Consejos para Mejor Experiencia

### Iluminación
- Usa iluminación frontal uniforme
- Evita contra luz
- La luz natural funciona mejor

### Posicionamiento
- Centra tu rostro en el preview
- Mantén una distancia apropiada (1-1.5m)
- Mira directamente a la cámara

### Fotos
- Mantente quieto durante el countdown
- Sonríe o haz expresiones claras
- Evita movimientos rápidos

### Filtros
- **Cyberpunk:** Mejor con fondos oscuros
- **Anime:** Funciona bien con expresiones faciales
- **Pixar:** Mejor con sonrisas y poses amigables

## 🎯 Modo Pantalla Completa

Para la experiencia de totem completa:

1. Presiona `F11` o usa el botón en pantalla
2. Esto ocultará la barra de navegación
3. Presiona `ESC` para salir

### Kiosk Mode (Avanzado)

Para un totem real, inicia Chrome en modo kiosk:

**Mac:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk http://localhost:3000
```

**Windows:**
```bash
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk http://localhost:3000
```

**Linux:**
```bash
google-chrome --kiosk http://localhost:3000
```

## 📊 Monitoreo de Costos

Cada imagen procesada cuesta aproximadamente **$0.025 USD** en Fal.ai.

Para ver tu uso:
1. Ve a [fal.ai/dashboard](https://fal.ai/dashboard)
2. Revisa "Usage" o "Billing"

Considera comprar créditos prepagados para uso frecuente.

## ✅ Checklist de Primera Ejecución

- [ ] Node.js 18+ instalado
- [ ] Proyecto descargado/clonado
- [ ] `npm install` ejecutado
- [ ] Cuenta en Fal.ai creada
- [ ] API key obtenida
- [ ] Archivo `.env.local` creado
- [ ] API key agregada al `.env.local`
- [ ] Servidor iniciado con `npm run dev`
- [ ] Navegador abierto en `localhost:3000`
- [ ] Permisos de cámara otorgados
- [ ] Flujo completo probado

## 🆘 ¿Necesitas Ayuda?

1. Revisa `context.md` para documentación técnica completa
2. Revisa `README.md` para información general
3. Verifica la consola del navegador (F12) para errores
4. Verifica la terminal donde corre `npm run dev` para errores del servidor

---

**¡Listo para empezar! 🎉**

