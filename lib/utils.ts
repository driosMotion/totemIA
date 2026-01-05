/**
 * Utility functions for the Photobooth app
 */

/**
 * Enter fullscreen mode
 */
export function enterFullscreen(element?: HTMLElement): void {
  const elem = element || document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  } else if ((elem as any).mozRequestFullScreen) {
    (elem as any).mozRequestFullScreen();
  } else if ((elem as any).msRequestFullscreen) {
    (elem as any).msRequestFullscreen();
  }
}

/**
 * Exit fullscreen mode
 */
export function exitFullscreen(): void {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen();
  }
}

/**
 * Check if currently in fullscreen mode
 */
export function isFullscreen(): boolean {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement
  );
}

/**
 * Toggle fullscreen mode
 */
export function toggleFullscreen(element?: HTMLElement): void {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    enterFullscreen(element);
  }
}

/**
 * Prevent default touch behaviors (context menu, etc)
 * DISABLED for development - will enable for production
 */
export function preventDefaultTouchBehaviors(): void {
  // Context menu enabled for development/debugging
  // document.addEventListener('contextmenu', (e) => e.preventDefault());

  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Prevent pinch zoom on touch devices
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  document.addEventListener('gestureend', (e) => e.preventDefault());
}

/**
 * Download image from URL
 */
export async function downloadImage(imageUrl: string, filename: string): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

/**
 * Format timestamp to readable date
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Vibrate device (if supported) for touch feedback
 */
export function vibrateFeedback(duration: number = 10): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

