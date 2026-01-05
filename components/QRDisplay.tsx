'use client';

import { QRCodeSVG } from 'qrcode.react';

interface QRDisplayProps {
  imageUrl: string;
}

export function QRDisplay({ imageUrl }: QRDisplayProps) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-purple-200">
      <div className="mb-6 text-center">
        <p className="text-gray-800 font-bold text-2xl mb-3">
          📱 Escanea para descargar
        </p>
        <p className="text-gray-600 text-lg">
          Usa tu teléfono para guardar tu foto
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-2xl">
        <QRCodeSVG
          value={imageUrl}
          size={280}
          level="H"
          includeMargin={true}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}

