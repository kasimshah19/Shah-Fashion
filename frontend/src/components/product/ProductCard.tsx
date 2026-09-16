import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, cn } from '../../utils/format';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../ui/Toast';

interface ProductCardProps {
  product: Product;
  listView?: boolean;
}

export function ProductCard({ product, listView = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const wished = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    showToast('Added to cart');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(wished ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (listView) {
    return (
      <Link to={`/product/${product.id}`} className="card flex gap-4 p-3 hover:shadow-md transition-shadow animate-fade-in">
        <div className="relative w-28 sm:w-36 shrink-0">
          <img src={product.images[0]} alt={product.name} loading="lazy" className="aspect-[3/4] object-cover rounded-lg w-full" />
          <div className="absolute top-1 left-1 flex flex-col gap-1">
            {product.isSale && <Badge variant="sale">{product.discountPercent}% OFF</Badge>}
            {product.isNew && <Badge variant="new">New</Badge>}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <p className="text-xs text-gray-500 mb-1">{product.fabric} · {product.region}</p>
            <h3 className="font-medium text-sm sm:text-ivory line-clamp-2 mb-1">{product.name}</h3>
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="font-semibold text-maroon">{formatPrice(product.discountedPrice)}</span>
              {product.discountPercent > 0 && (
                <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(product.price)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={handleWishlist} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <Heart size={20} className={cn(wished ? 'fill-maroon text-maroon' : 'text-gray-400')} />
              </button>
              <button onClick={handleAddToCart} className="btn-primary text-sm px-4 py-2 min-h-[44px]">
                <ShoppingBag size={16} /> Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/product/${product.id}`} className="card group hover:shadow-md transition-all duration-200 animate-fade-in flex flex-col h-full">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isSale && <Badge variant="sale">{product.discountPercent}% OFF</Badge>}
          {product.isNew && <Badge variant="new">New</Badge>}
          {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
          {product.stock <= 5 && product.stock > 0 && <Badge variant="lowstock">Low Stock</Badge>}
        </div>
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={18} className={cn(wished ? 'fill-maroon text-maroon' : 'text-gray-500')} />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-maroon/90 text-white py-2.5 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <ShoppingBag size={16} /> Quick Add
        </button>
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">{product.fabric}</p>
        <h3 className="font-medium text-sm line-clamp-2 mb-1.5 leading-snug">{product.name}</h3>
        <Rating value={product.rating} count={product.reviewCount} />
        </div>
        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-maroon">{formatPrice(product.discountedPrice)}</span>
          {product.discountPercent > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
              <span className="text-xs text-green-600 font-medium">({product.discountPercent}% off)</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
