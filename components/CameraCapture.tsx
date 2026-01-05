'use client';

import { RefObject, useEffect } from 'react';
import { CameraState } from '@/types';

interface CameraCaptureProps {
  videoRef: RefObject<HTMLVideoElement>;
  cameraState: CameraState;
}

export function CameraCapture({ videoRef, cameraState }: CameraCaptureProps) {
  // Ensure stream is attached to video element when it changes
  useEffect(() => {
    console.log('🎥 CameraCapture: stream changed', {
      hasStream: !!cameraState.stream,
      isActive: cameraState.isActive,
      hasVideoRef: !!videoRef.current,
    });

    if (videoRef.current && cameraState.stream) {
      // Only attach if not already attached
      if (videoRef.current.srcObject !== cameraState.stream) {
        console.log('🎥 Attaching stream to video element');
        videoRef.current.srcObject = cameraState.stream;
        
        // Force play after a short delay to avoid interruption
        setTimeout(() => {
          videoRef.current?.play().catch((error) => {
            console.error('❌ Error playing video:', error);
          });
        }, 100);
      }
    }
  }, [cameraState.stream, videoRef]);

  if (cameraState.error) {
    console.error('❌ Camera error:', cameraState.error);
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-800 rounded-2xl p-8">
        <div className="text-center">
          <svg
            className="w-20 h-20 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">
            Error al acceder a la cámara
          </h3>
          <p className="text-gray-300">{cameraState.error}</p>
          <p className="text-sm text-gray-400 mt-4">
            Por favor, permite el acceso a la cámara en tu navegador
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Always render video element so ref is available */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
        onLoadedMetadata={() => console.log('✅ Video metadata loaded')}
        onPlaying={() => console.log('▶️ Video is playing')}
      />
      
      {/* Show loading overlay if not active yet */}
      {!cameraState.isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Activando cámara...</p>
          </div>
        </div>
      )}
      
      {/* Camera overlay with grid - only show when active */}
      {cameraState.isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid lines for composition */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-10">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/50"></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

