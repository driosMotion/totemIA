'use client';

import { Filter } from '@/types';

interface FilterCardProps {
  filter: Filter;
  isSelected: boolean;
  onClick: () => void;
}

export function FilterCard({ filter, isSelected, onClick }: FilterCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-3xl p-10 transition-all duration-300
        ${isSelected ? 'ring-8 ring-white scale-110 shadow-2xl' : 'hover:scale-105'}
        bg-gradient-to-br ${filter.previewColor}
        shadow-2xl hover:shadow-3xl
        min-h-[240px] w-full
        touch-manipulation select-none
        active:scale-95
        transform
      `}
    >
      <div className="relative z-10 text-white">
        <h3 className="text-3xl font-bold mb-3">{filter.name}</h3>
        <p className="text-lg opacity-90">{filter.description}</p>
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-all duration-300"></div>
      
      {isSelected && (
        <div className="absolute top-4 right-4 bg-white text-purple-600 rounded-full p-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

