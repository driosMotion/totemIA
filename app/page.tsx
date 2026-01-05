'use client';

import { useState, useCallback, useEffect } from 'react';
import { AppState, FilterStyle, CapturedPhoto, ProcessedImage } from '@/types';
import { processImageWithFal } from '@/lib/fal-service';
import { useCamera } from '@/lib/hooks/useCamera';
import { preventDefaultTouchBehaviors } from '@/lib/utils';
import { CameraCapture } from '@/components/CameraCapture';
import { FilterSelector } from '@/components/FilterSelector';
import { LoadingBar } from '@/components/LoadingBar';
import { ResultScreen } from '@/components/ResultScreen';
import { TouchButton } from '@/components/TouchButton';
import { FullscreenButton } from '@/components/FullscreenButton';
import { DebugPanel } from '@/components/DebugPanel';

export default function PhotoboothApp() {
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [error, setError] = useState<string | null>(null);

  const { videoRef, capturePhoto, startCamera, stopCamera, cameraState } = useCamera();

  // Initialize touch behaviors on mount
  useEffect(() => {
    preventDefaultTouchBehaviors();
  }, []);

  // Auto-reset after inactivity
  useEffect(() => {
    if (appState === 'RESULT') {
      const timeout = setTimeout(() => {
        handleRestart();
      }, 60000); // 60 seconds

      return () => clearTimeout(timeout);
    }
  }, [appState]);

  const handleStart = useCallback(async () => {
    console.log('🚀 handleStart called');
    setAppState('CAMERA_READY');
    setError(null);
    await startCamera();
    console.log('✅ Camera started, state:', cameraState);
  }, [startCamera, cameraState]);

  const handleTakePhoto = useCallback(() => {
    console.log('📸 Iniciando captura de foto...');
    console.log('📹 Video estado:', {
      hasVideoRef: !!videoRef.current,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      readyState: videoRef.current?.readyState,
    });
    
    setAppState('COUNTDOWN');
    setCountdown(3);

    let currentCount = 3;
    
    const countdownInterval = setInterval(() => {
      currentCount = currentCount - 1;
      console.log('⏰ Countdown:', currentCount);
      
      if (currentCount < 0) {
        clearInterval(countdownInterval);
        
        console.log('📷 Capturando foto en 200ms...');
        // Small delay to ensure last frame is visible and stable
        setTimeout(() => {
          const photoDataUrl = capturePhoto();
          if (photoDataUrl) {
            console.log('✅ Foto capturada exitosamente');
            setCapturedPhoto({
              dataUrl: photoDataUrl,
              timestamp: Date.now(),
            });
            setAppState('PHOTO_TAKEN');
          } else {
            console.error('❌ Error al capturar la foto - reintentando en 500ms...');
            // Retry once after 500ms
            setTimeout(() => {
              const retryPhoto = capturePhoto();
              if (retryPhoto) {
                console.log('✅ Foto capturada exitosamente (2do intento)');
                setCapturedPhoto({
                  dataUrl: retryPhoto,
                  timestamp: Date.now(),
                });
                setAppState('PHOTO_TAKEN');
              } else {
                console.error('❌ Error al capturar la foto después de reintentar');
                setError('Error al capturar la foto. Por favor intenta de nuevo.');
                setAppState('CAMERA_READY');
              }
            }, 500);
          }
        }, 200);
      } else {
        setCountdown(currentCount);
      }
    }, 1000);
    
    // Cleanup function
    return () => clearInterval(countdownInterval);
  }, [capturePhoto, videoRef]);

  const handleRetakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    setAppState('CAMERA_READY');
  }, []);

  const handleContinueToFilters = useCallback(() => {
    setAppState('FILTER_SELECT');
    stopCamera();
  }, [stopCamera]);

  const handleSelectFilter = useCallback(async (filter: FilterStyle) => {
    if (!capturedPhoto) return;

    setAppState('PROCESSING');
    setError(null);

    try {
      const result = await processImageWithFal({
        imageDataUrl: capturedPhoto.dataUrl,
        filterStyle: filter,
      });

      if (result.success && result.processedImageUrl) {
        setProcessedImage({
          originalUrl: capturedPhoto.dataUrl,
          processedUrl: result.processedImageUrl,
          filter,
          timestamp: Date.now(),
        });
        setAppState('RESULT');
      } else {
        setError(result.error || 'Error al procesar la imagen');
        setAppState('FILTER_SELECT');
      }
    } catch (err) {
      setError('Error inesperado al procesar la imagen');
      setAppState('FILTER_SELECT');
    }
  }, [capturedPhoto]);

  const handleCancelFilterSelection = useCallback(() => {
    setAppState('PHOTO_TAKEN');
  }, []);

  const handleRestart = useCallback(() => {
    setCapturedPhoto(null);
    setProcessedImage(null);
    setError(null);
    setCountdown(3);
    setAppState('IDLE');
    stopCamera();
  }, [stopCamera]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Debug Panel */}
      <DebugPanel appState={appState} cameraState={cameraState} countdown={countdown} />

      {/* Fullscreen toggle button */}
      <FullscreenButton />

      {/* Error notification */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* IDLE State - Welcome Screen */}
      {appState === 'IDLE' && (
        <div className="h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="relative z-10">
            <div className="mb-10 animate-bounce">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-full p-8 mx-auto w-40 h-40 flex items-center justify-center shadow-2xl">
                <svg
                  className="w-24 h-24 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            
            <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
                Photobooth IA
              </span>
            </h1>
            
            <p className="text-3xl text-gray-200 mb-16 max-w-3xl drop-shadow-lg">
              Tómate una foto y transfórmala con inteligencia artificial ✨
            </p>

            <TouchButton variant="primary" size="large" onClick={handleStart}>
              🚀 Comenzar Ahora
            </TouchButton>
          </div>
        </div>
      )}

      {/* CAMERA_READY & COUNTDOWN States - Combined with overlay */}
      {(appState === 'CAMERA_READY' || appState === 'COUNTDOWN') && (
        <div className="h-screen flex flex-col items-center justify-center p-8">
          {/* Title - only show when not counting down */}
          {appState === 'CAMERA_READY' && (
            <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
              📷 Prepárate para la foto
            </h2>
          )}
          
          {/* Camera container - same for both states */}
          <div className="w-full max-w-5xl h-[70vh] max-h-[720px] min-h-[360px] mb-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative bg-black">
            {/* Live view - ALWAYS visible */}
            <div className="absolute inset-0 z-0">
              <CameraCapture
                videoRef={videoRef}
                cameraState={cameraState}
              />
            </div>
            
            {/* Countdown overlay - only visible during countdown */}
            {appState === 'COUNTDOWN' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black/40 via-black/60 to-black/40 z-20 pointer-events-none">
                {countdown > 0 ? (
                  <>
                    <div className="text-white text-[200px] font-black leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-pulse">
                      {countdown}
                    </div>
                    <p className="text-5xl text-white font-bold mt-12 drop-shadow-2xl animate-bounce">
                      ¡Sonríe! 😊
                    </p>
                  </>
                ) : (
                  <div className="text-white text-8xl font-black drop-shadow-2xl animate-ping">
                    📸
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Buttons - only show when ready (not during countdown) */}
          {appState === 'CAMERA_READY' && (
            <div className="flex gap-6">
              <TouchButton variant="secondary" size="medium" onClick={handleRestart}>
                ❌ Cancelar
              </TouchButton>
              
              <TouchButton
                variant="primary"
                size="large"
                onClick={handleTakePhoto}
                disabled={!cameraState.isActive}
              >
                {cameraState.isActive ? '📸 Tomar Foto' : '⏳ Activando cámara...'}
              </TouchButton>
            </div>
          )}
        </div>
      )}

      {/* PHOTO_TAKEN State - Review */}
      {appState === 'PHOTO_TAKEN' && capturedPhoto && (
        <div className="h-screen flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
            ¿Te gusta la foto?
          </h2>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-10 max-w-3xl border-4 border-white/20">
            {capturedPhoto.dataUrl ? (
              <img
                src={capturedPhoto.dataUrl}
                alt="Foto capturada"
                className="w-full h-auto"
              />
            ) : (
              <div className="w-full h-96 bg-gray-800 flex items-center justify-center">
                <p className="text-white">Error al cargar la imagen</p>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <TouchButton
              variant="secondary"
              size="medium"
              onClick={handleRetakePhoto}
            >
              🔄 Tomar otra
            </TouchButton>
            
            <TouchButton
              variant="primary"
              size="large"
              onClick={handleContinueToFilters}
            >
              ✨ Continuar
            </TouchButton>
          </div>
        </div>
      )}

      {/* FILTER_SELECT State */}
      {appState === 'FILTER_SELECT' && (
        <FilterSelector
          onSelectFilter={handleSelectFilter}
          onCancel={handleCancelFilterSelection}
        />
      )}

      {/* PROCESSING State */}
      {appState === 'PROCESSING' && (
        <div className="h-screen flex flex-col items-center justify-center p-8">
          <LoadingBar message="Aplicando filtro de IA..." />
        </div>
      )}

      {/* RESULT State */}
      {appState === 'RESULT' && processedImage && (
        <ResultScreen result={processedImage} onRestart={handleRestart} />
      )}
    </main>
  );
}
