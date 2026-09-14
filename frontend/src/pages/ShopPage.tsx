import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { filterProducts } from '../utils/filters';
import type { ProductFilters } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { FilterPanel } from '../components/product/FilterPanel';
import { BottomSheet } from '../components/ui/BottomSheet';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import { RecentlyViewed } from '../components/product/RecentlyViewed';
import { supabase } from '../utils/supabase';

const CATEGORY_TITLES: Record<string, string> = {
  sarees: 'All Sarees',
  'blouse-pieces': 'Blouse Pieces',
  sale: 'Sale',
  'new-arrivals': 'New Arrivals',
  'silk-sarees': 'Silk Sarees',
  'cotton-sarees': 'Cotton Sarees',
  wedding: 'Wedding Collection',
};

const PAGE_SIZE = 12;

export function ShopPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({ category, sort: 'popularity' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url)
        `)
        .eq('is_active', true);
      
      if (data) {
        const mapped = data.map(p => ({
          ...p,
          price: p.mrp,
          discountedPrice: p.discounted_price,
          isNew: p.is_new,
          isBestseller: p.is_bestseller,
          images: p.product_images && p.product_images.length > 0 ? [p.product_images[0].image_url] : []
        }));
        setProducts(mapped);
      }
      setLoading(false);
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category }));
    setPage(1);
  }, [category]);

  const filtered = useMemo(() => filterProducts(products, filters), [products, filters]);
  const displayed = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < filtered.length;

  const title = CATEGORY_TITLES[category || ''] || 'All Products';

  const clearFilters = () => setFilters({ category, sort: filters.sort });

  return (
    <div className="page-container py-6 pb-24 lg:pb-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} products</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-24">
            <FilterPanel filters={filters} onChange={setFilters} onClear={clearFilters} />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 flex-wrap">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium min-h-[44px]"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>

            <select
              value={filters.sort || 'popularity'}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value as ProductFilters['sort'] })}
              className="input-field w-auto flex-1 sm:flex-none text-sm py-2.5 min-h-[44px]"
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
            </select>

            <div className="hidden sm:flex gap-1 ml-auto">
              <button
                onClick={() => setListView(false)}
                className={`p-2.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${!listView ? 'bg-maroon text-white' : 'bg-gray-100'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setListView(true)}
                className={`p-2.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center ${listView ? 'bg-maroon text-white' : 'bg-gray-100'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className={`grid gap-4 ${listView ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">No products match your filters.</p>
              <button onClick={clearFilters} className="btn-secondary">Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 ${listView ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                {displayed.map((product) => (
                  <ProductCard key={product.id} product={product} listView={listView} />
                ))}
              </div>
              {hasMore && (
                <div className="text-center mt-8">
                  <button onClick={() => setPage((p) => p + 1)} className="btn-secondary">
                    Load More ({filtered.length - displayed.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <FilterPanel filters={filters} onChange={setFilters} onClear={clearFilters} />
        <button onClick={() => setFilterOpen(false)} className="btn-primary w-full mt-4">
          Show {filtered.length} Products
        </button>
      </BottomSheet>
      <RecentlyViewed />
    </div>
  );
}
