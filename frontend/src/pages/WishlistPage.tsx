import { Heart } from 'lucide-react';
import { products } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/product/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';

export function WishlistPage() {
  const { wishlist } = useWishlist();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!wishlistProducts.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save sarees you love and shop them later"
        actionLabel="Explore Collection"
        actionHref="/shop/sarees"
      />
    );
  }

  return (
    <div className="page-container py-6 pb-24 lg:pb-8 animate-fade-in">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon mb-6">
        Wishlist ({wishlistProducts.length})
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
