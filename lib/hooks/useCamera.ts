'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CameraState } from '@/types';

export function useCamera() {
  const [cameraState, setCameraState] = useState<CameraState>({
    stream: null,
    isActive: false,
    error: null,
    hasPermission: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * Initialize camera and request permissions
   */
  const startCamera = useCallback(async () => {
    console.log('🎬 Starting camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      console.log('✅ Camera stream obtained', stream);

      setCameraState({
        stream,
        isActive: true,
        error: null,
        hasPermission: true,
      });

      console.log('✅ Camera state updated');

      // Attach stream to video element if ref is available
      if (videoRef.current) {
        console.log('📺 Attaching stream to videoRef');
        videoRef.current.srcObject = stream;
      } else {
        console.warn('⚠️ videoRef.current is null');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to access camera';
      
      console.error('❌ Camera error:', errorMessage);
      
      setCameraState({
        stream: null,
        isActive: false,
        error: errorMessage,
        hasPermission: false,
      });
    }
  }, []);

  /**
   * Stop camera stream
   */
  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach((track) => track.stop());
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setCameraState({
        stream: null,
        isActive: false,
        error: null,
        hasPermission: cameraState.hasPermission,
      });
    }
  }, [cameraState.stream, cameraState.hasPermission]);

  /**
   * Capture a photo from the video stream
   */
  const capturePhoto = useCallback((): string | null => {
    console.log('📸 capturePhoto called', {
      hasVideoRef: !!videoRef.current,
      isActive: cameraState.isActive,
      videoWidth: videoRef.current?.videoWidth,
      videoHeight: videoRef.current?.videoHeight,
      readyState: videoRef.current?.readyState,
    });

    if (!videoRef.current) {
      console.error('❌ No video ref');
      return null;
    }

    if (!cameraState.isActive) {
      console.error('❌ Camera not active');
      return null;
    }

    const video = videoRef.current;
    
    // Wait for video to be ready
    if (video.readyState < 2) {
      console.error('❌ Video not ready yet, readyState:', video.readyState);
      return null;
    }
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('❌ Video dimensions are 0, waiting for video to load...');
      return null;
    }

    console.log('✅ Video ready, dimensions:', video.videoWidth, 'x', video.videoHeight);

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('❌ Could not get canvas context');
      return null;
    }

    // Draw the current video frame to canvas (flip horizontally to match preview)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    console.log('✅ Photo captured successfully! Data URL length:', dataUrl.length);
    
    return dataUrl;
  }, [cameraState.isActive]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      if (cameraState.stream) {
        cameraState.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraState.stream]);

  return {
    cameraState,
    videoRef,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}

