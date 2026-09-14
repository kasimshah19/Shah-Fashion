import { useState, useEffect } from 'react';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export function ProgressiveImage({ src, alt, className = '', ...props }: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    // Reset loaded state when src changes
    setIsLoaded(false);
    setCurrentSrc(src);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {/* 
        We use a highly compressed / blurred version of the image if available in a real backend.
        Since we only have one URL, we use a CSS blur and fade-in effect to simulate progressive loading.
      */}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
          isLoaded ? 'scale-100 blur-0 opacity-100' : 'scale-105 blur-lg opacity-0'
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
      />
      
      {/* Loading Skeleton Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-300" />
      )}
    </div>
  );
}
