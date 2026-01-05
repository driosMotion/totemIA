// Type definitions for the Photobooth Totem App

export type AppState =
  | 'IDLE'
  | 'CAMERA_READY'
  | 'COUNTDOWN'
  | 'PHOTO_TAKEN'
  | 'FILTER_SELECT'
  | 'PROCESSING'
  | 'RESULT';

export type FilterStyle = 'cyberpunk' | 'anime' | 'pixar';

export interface Filter {
  id: FilterStyle;
  name: string;
  prompt: string;
  description: string;
  previewColor: string;
}

export interface CapturedPhoto {
  dataUrl: string;
  timestamp: number;
}

export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  filter: FilterStyle;
  timestamp: number;
}

export interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  hasPermission: boolean;
}

