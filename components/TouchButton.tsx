'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export function TouchButton({
  children,
  variant = 'primary',
  size = 'large',
  className = '',
  ...props
}: TouchButtonProps) {
  const baseClasses = 'font-bold rounded-3xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none touch-manipulation transform hover:scale-105';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl hover:shadow-purple-500/50',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-xl hover:shadow-2xl border-2 border-white/20',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-2xl hover:shadow-red-500/50',
  };

  const sizeClasses = {
    small: 'px-8 py-4 text-lg min-h-[70px] min-w-[140px]',
    medium: 'px-10 py-5 text-xl min-h-[90px] min-w-[200px]',
    large: 'px-14 py-7 text-2xl min-h-[110px] min-w-[280px]',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

