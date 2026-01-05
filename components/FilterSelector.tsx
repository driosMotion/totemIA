'use client';

import { useState } from 'react';
import { FilterStyle } from '@/types';
import { FILTER_CONFIGS } from '@/lib/fal-service';
import { FilterCard } from './FilterCard';
import { TouchButton } from './TouchButton';

interface FilterSelectorProps {
  onSelectFilter: (filter: FilterStyle) => void;
  onCancel: () => void;
}

export function FilterSelector({ onSelectFilter, onCancel }: FilterSelectorProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterStyle | null>(null);

  const filters = Object.values(FILTER_CONFIGS);

  const handleConfirm = () => {
    if (selectedFilter) {
      onSelectFilter(selectedFilter);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-2xl">
          🎨 Elige tu estilo
        </h2>
        <p className="text-2xl text-gray-200 drop-shadow-lg">
          Selecciona cómo quieres transformar tu foto con IA
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {filters.map((filter) => (
          <FilterCard
            key={filter.id}
            filter={filter}
            isSelected={selectedFilter === filter.id}
            onClick={() => setSelectedFilter(filter.id)}
          />
        ))}
      </div>

      <div className="flex gap-6 mt-8">
        <TouchButton
          variant="secondary"
          size="medium"
          onClick={onCancel}
        >
          Volver
        </TouchButton>
        
        <TouchButton
          variant="primary"
          size="medium"
          onClick={handleConfirm}
          disabled={!selectedFilter}
        >
          Continuar con {selectedFilter ? FILTER_CONFIGS[selectedFilter].name : '...'}
        </TouchButton>
      </div>
    </div>
  );
}

