import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { products } from '../data/products';
import { filterProducts } from '../utils/filters';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(
    () => (query ? filterProducts(products, { search: query }) : []),
    [query]
  );

  return (
    <div className="page-container py-6 pb-24 lg:pb-8 animate-fade-in">
      <h1 className="font-serif text-2xl font-semibold text-maroon mb-1">
        {query ? `Results for "${query}"` : 'Search'}
      </h1>
      {query && <p className="text-gray-500 text-sm mb-6">{results.length} products found</p>}

      {!query ? (
        <EmptyState
          icon={SearchX}
          title="Start searching"
          description="Search for sarees, fabrics, regions, or colors"
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No results found"
          description={`We couldn't find anything matching "${query}". Try different keywords.`}
          actionLabel="Browse All Sarees"
          actionHref="/shop/sarees"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
