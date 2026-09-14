import { Star } from 'lucide-react';
import { cn } from '../../utils/format';

interface RatingProps {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export function Rating({ value, count, size = 'sm', showCount = true }: RatingProps) {
  const starSize = size === 'sm' ? 14 : 18;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            className={cn(
              star <= Math.round(value)
                ? 'fill-gold text-gold'
                : 'fill-gray-200 text-gray-200'
            )}
          />
        ))}
      </div>
      <span className={cn('text-gray-600', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {value.toFixed(1)}
        {showCount && count != null && (
          <span className="text-gray-400 ml-1">({count})</span>
        )}
      </span>
    </div>
  );
}
