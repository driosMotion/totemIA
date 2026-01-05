'use client';

import { useEffect, useState } from 'react';

interface LoadingBarProps {
  message?: string;
}

export function LoadingBar({ message = 'Procesando tu imagen...' }: LoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-24 w-24 border-8 border-purple-600 border-t-transparent mb-6 shadow-2xl"></div>
        <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">{message}</h2>
        <p className="text-2xl text-gray-200 drop-shadow-lg">Esto puede tomar unos 10-30 segundos...</p>
      </div>

      <div className="w-full bg-gray-800/50 rounded-full h-8 overflow-hidden border-2 border-white/20 shadow-2xl">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transition-all duration-500 ease-out rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
        </div>
      </div>

      <p className="text-center text-2xl text-white font-bold drop-shadow-lg">
        {Math.round(progress)}% completado
      </p>
    </div>
  );
}

