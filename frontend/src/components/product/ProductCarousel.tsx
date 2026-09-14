import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductCarouselProps {
  title: string;
  products: Product[];
  subtitle?: string;
}

export function ProductCarousel({ title, products, subtitle }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.75;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="py-8 overflow-hidden">
      <div className="page-container">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon">{title}</h2>
            {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-maroon hover:text-maroon transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-maroon hover:text-maroon transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 -mx-4 px-4">
          {products.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[140px] sm:w-[200px] md:w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
