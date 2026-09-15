import React from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ size = 'md', text, className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-emerald-700 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin`} />
      {text && <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>}
    </div>
  );
};
