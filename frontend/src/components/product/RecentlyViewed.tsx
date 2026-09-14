import { useEffect, useState } from 'react';
import { ProductCarousel } from './ProductCarousel';
import { supabase } from '../../utils/supabase';
import type { Product } from '../../types';

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      try {
        const recentRaw = localStorage.getItem('recentlyViewed');
        if (!recentRaw) {
          setLoading(false);
          return;
        }

        const recentIds: string[] = JSON.parse(recentRaw);
        if (recentIds.length === 0) {
          setLoading(false);
          return;
        }

        const { data } = await supabase
          .from('products')
          .select(`*, product_images(image_url)`)
          .in('id', recentIds);

        if (data) {
          // Maintain the order of recentIds
          const orderedData = recentIds
            .map(id => data.find(p => p.id === id))
            .filter((p): p is any => p !== undefined)
            .map(p => ({
              ...p,
              price: p.mrp,
              discountedPrice: p.discounted_price,
              isNew: p.is_new,
              isBestseller: p.is_bestseller,
              images: p.product_images?.map((img: any) => img.image_url) || []
            }));
            
          setProducts(orderedData);
        }
      } catch (error) {
        console.error('Error fetching recently viewed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-16">
      <ProductCarousel title="Recently Viewed" products={products} />
    </div>
  );
}
