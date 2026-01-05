'use client';

import { AppState, CameraState } from '@/types';
import { useState, useEffect } from 'react';

interface DebugPanelProps {
  appState: AppState;
  cameraState: CameraState;
  countdown: number;
}

export function DebugPanel({ appState, cameraState, countdown }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);

  // Capture console logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev.slice(-10), `[LOG] ${message}`]);
      }, 0);
    };

    console.error = (...args) => {
      originalError(...args);
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev.slice(-10), `[ERROR] ${message}`]);
      }, 0);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        setLogs(prev => [...prev.slice(-10), `[WARN] ${message}`]);
      }, 0);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-mono hover:bg-black"
      >
        Show Debug 🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 text-white p-4 rounded-2xl shadow-2xl max-w-md w-full max-h-96 overflow-auto font-mono text-xs border-2 border-green-500">
      <div className="flex justify-between items-center mb-3 border-b border-green-500 pb-2">
        <h3 className="font-bold text-green-400 text-sm">🐛 Debug Panel</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-300 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-yellow-400">App State:</span>{' '}
          <span className="text-green-300 font-bold">{appState}</span>
        </div>

        <div>
          <span className="text-yellow-400">Camera Active:</span>{' '}
          <span className={cameraState.isActive ? 'text-green-400' : 'text-red-400'}>
            {cameraState.isActive ? '✅ YES' : '❌ NO'}
          </span>
        </div>

        <div>
          <span className="text-yellow-400">Has Stream:</span>{' '}
          <span className={cameraState.stream ? 'text-green-400' : 'text-red-400'}>
            {cameraState.stream ? '✅ YES' : '❌ NO'}
          </span>
        </div>

        <div>
          <span className="text-yellow-400">Has Permission:</span>{' '}
          <span className={cameraState.hasPermission ? 'text-green-400' : 'text-gray-400'}>
            {cameraState.hasPermission ? '✅ YES' : '⏳ NO'}
          </span>
        </div>

        {cameraState.error && (
          <div>
            <span className="text-red-400">Error:</span>{' '}
            <span className="text-red-300">{cameraState.error}</span>
          </div>
        )}

        {appState === 'COUNTDOWN' && (
          <div>
            <span className="text-yellow-400">Countdown:</span>{' '}
            <span className="text-green-300 font-bold text-lg">{countdown}</span>
          </div>
        )}

        <div className="border-t border-green-500 pt-2 mt-2">
          <div className="text-yellow-400 mb-1">Recent Logs:</div>
          <div className="space-y-1 max-h-40 overflow-auto bg-black/50 p-2 rounded">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`text-[10px] ${
                    log.includes('[ERROR]')
                      ? 'text-red-400'
                      : log.includes('[WARN]')
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

