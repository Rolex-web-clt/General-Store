import React, { useState, useEffect } from 'react';
import { ImageOff, Store } from 'lucide-react';

export const DEFAULT_STORE_PHOTO =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

// Category-based high quality fallback images
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  groceries: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
  'rice & grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  pulses: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
  'cooking oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
  snacks: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
  biscuits: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
  beverages: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  'dairy products': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  'personal care': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
  'cleaning products': 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80',
  'household items': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
  stationery: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',
  'baby products': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
};

export const getFallbackPhoto = (category?: string): string => {
  if (!category) return DEFAULT_STORE_PHOTO;
  const key = category.trim().toLowerCase();
  return CATEGORY_FALLBACK_IMAGES[key] || DEFAULT_STORE_PHOTO;
};

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  category?: string;
  containerClassName?: string;
  showIconFallbackIfFailed?: boolean;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product image',
  fallbackSrc,
  category,
  className = '',
  containerClassName = '',
  showIconFallbackIfFailed = false,
  ...props
}) => {
  const resolvedDefault = fallbackSrc || getFallbackPhoto(category);
  const [imgSrc, setImgSrc] = useState<string>(src || resolvedDefault);
  const [hasError, setHasError] = useState<boolean>(false);
  const [triedFallback, setTriedFallback] = useState<boolean>(false);

  useEffect(() => {
    setHasError(false);
    setTriedFallback(false);
    setImgSrc(src || resolvedDefault);
  }, [src, resolvedDefault]);

  const handleError = () => {
    if (!triedFallback && imgSrc !== resolvedDefault) {
      setTriedFallback(true);
      setImgSrc(resolvedDefault);
    } else {
      setHasError(true);
    }
  };

  if (hasError && showIconFallbackIfFailed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 ${className}`}
      >
        <Store className="w-8 h-8 text-slate-300 mb-1" />
        <span className="text-[10px] font-semibold text-slate-400 text-center">
          {alt || 'Store Item'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={props.loading || 'lazy'}
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
