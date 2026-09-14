import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, Bookmark, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { EmptyState } from '../components/ui/EmptyState';
import { supabase } from '../utils/supabase';
import { useToast } from '../components/ui/Toast';

const SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 99;

export function CartPage() {
  const { activeItems, savedItems, updateQuantity, removeFromCart, toggleSaveForLater, getCartTotal, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProducts() {
      const itemIds = [...activeItems, ...savedItems].map(i => i.productId);
      if (itemIds.length === 0) {
        return;
      }
      const { data } = await supabase
        .from('products')
        .select(`*, product_images(image_url)`)
        .in('id', itemIds);
        
      if (data) {
        setProducts(data.map(p => ({
          ...p,
          price: p.mrp,
          discountedPrice: p.discounted_price,
          images: p.product_images?.length ? p.product_images.map((img: any) => img.image_url) : ['https://images.unsplash.com/photo-1610189014167-3367123f1ce0?auto=format&fit=crop&q=80']
        })));
      }
    }
    loadProducts();
  }, [activeItems, savedItems]);

  const { subtotal, discount, couponDiscount, total } = getCartTotal(products);
  const shipping = subtotal >= SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .single();
        
      if (error || !data) throw new Error('Invalid coupon code');
      
      if (!data.active) throw new Error('This coupon is no longer active');
      
      const now = new Date();
      if (data.valid_from && new Date(data.valid_from) > now) throw new Error('This coupon is not active yet');
      if (data.valid_to && new Date(data.valid_to) < now) throw new Error('This coupon has expired');
      
      if (data.min_order_value && subtotal < data.min_order_value) {
        throw new Error(`Minimum order value for this coupon is ${formatPrice(data.min_order_value)}`);
      }
      
      applyCoupon(data);
      setCouponCode('');
      showToast('Coupon applied successfully');
    } catch (err: any) {
      showToast(err.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (activeItems.length === 0 && savedItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Browse our collection of premium sarees and blouse pieces"
        actionLabel="Start Shopping"
        actionHref="/shop/sarees"
      />
    );
  }

  const renderItem = (item: typeof activeItems[0], saved = false) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) return null;

    return (
      <div key={item.productId} className="card p-3 sm:p-4 flex gap-3 sm:gap-4 animate-fade-in">
        <Link to={`/product/${product.id}`} className="shrink-0">
          <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1610189014167-3367123f1ce0?auto=format&fit=crop&q=80'} alt={product.name} className="w-20 sm:w-24 aspect-[3/4] object-cover rounded-lg" />
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/product/${product.id}`} className="font-medium text-sm sm:text-ivory line-clamp-2 hover:text-maroon">{product.name}</Link>
          <p className="text-xs text-gray-500 mt-0.5">{product.fabric}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-semibold text-maroon">{formatPrice(product.discountedPrice)}</span>
            {product.discountPercent > 0 && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            )}
          </div>

          {!saved && (
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Minus size={16} />
                </button>
                <span className="px-3 text-sm font-medium min-w-[32px] text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggleSaveForLater(item.productId)} className="p-2 text-gray-400 hover:text-maroon min-w-[44px] min-h-[44px] flex items-center justify-center" title="Save for later">
                  <Bookmark size={18} />
                </button>
                <button onClick={() => removeFromCart(item.productId)} className="p-2 text-gray-400 hover:text-red-500 min-w-[44px] min-h-[44px] flex items-center justify-center">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )}
          {saved && (
            <button onClick={() => toggleSaveForLater(item.productId)} className="text-sm text-maroon mt-2 hover:underline">
              Move to cart
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="page-container py-6 pb-24 lg:pb-8 animate-fade-in">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {activeItems.map((item) => renderItem(item))}

          {savedItems.length > 0 && (
            <div className="mt-8">
              <h2 className="font-medium text-gray-900 mb-3">Saved for Later ({savedItems.length})</h2>
              <div className="space-y-3">
                {savedItems.map((item) => renderItem(item, true))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sm:p-6 sticky top-24">
            <h2 className="font-serif text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-gray-400">Free shipping on orders above {formatPrice(SHIPPING_THRESHOLD)}</p>
              )}
              <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-ivory">
                <span>Total</span>
                <span className="text-maroon">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="mt-6 border-t border-gray-100 pt-6">
              {appliedCoupon ? (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase">{appliedCoupon.code}</p>
                    <p className="text-xs text-green-700">Coupon applied!</p>
                  </div>
                  <button onClick={removeCoupon} className="text-sm text-green-700 hover:text-green-900 underline">Remove</button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="input-field flex-1 uppercase"
                  />
                  <button 
                    onClick={handleApplyCoupon} 
                    disabled={!couponCode.trim() || applyingCoupon}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {applyingCoupon ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {activeItems.length > 0 && (
              <Link to="/checkout" className="btn-primary w-full mt-6">Proceed to Checkout</Link>
            )}
            <Link to="/shop/sarees" className="block text-center text-sm text-maroon mt-3 hover:underline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
