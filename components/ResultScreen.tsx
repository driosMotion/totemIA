'use client';

import { QRDisplay } from './QRDisplay';
import { TouchButton } from './TouchButton';
import { ProcessedImage } from '@/types';
import { FILTER_CONFIGS } from '@/lib/fal-service';

interface ResultScreenProps {
  result: ProcessedImage;
  onRestart: () => void;
}

export function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const filterName = FILTER_CONFIGS[result.filter]?.name || result.filter;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          ¡Tu foto está lista! 🎉
        </h2>
        <p className="text-2xl text-gray-200 drop-shadow-lg">
          Escanea el código QR para descargarla en tu móvil
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 items-center justify-center w-full max-w-6xl">
        {/* Processed Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl max-w-xl border-4 border-white/30">
          <img
            src={result.processedUrl}
            alt="Foto procesada con IA"
            className="w-full h-auto"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
            <p className="text-white text-2xl font-bold drop-shadow-lg">
              🎨 Filtro: {filterName}
            </p>
          </div>
        </div>

        {/* QR Code */}
        <QRDisplay imageUrl={result.processedUrl} />
      </div>

      <TouchButton
        variant="primary"
        size="large"
        onClick={onRestart}
        className="mt-8"
      >
        📸 Tomar otra foto
      </TouchButton>
    </div>
  );
}

