import { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, ShoppingBag, Zap, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { formatPrice } from '../utils/format';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { ProgressiveImage } from '../components/ui/ProgressiveImage';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { SizeGuideModal } from '../components/product/SizeGuideModal';
import { ReviewForm } from '../components/product/ReviewForm';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { supabase } from '../utils/supabase';
import type { Product } from '../types';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<{ estimate: string; deliveryDate: string } | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [completeTheLook, setCompleteTheLook] = useState<Product[]>([]);
  const galleryRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      const { data: pData } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url)
        `)
        .eq('id', id)
        .single();
      
      if (pData) {
        const mapped = {
          ...pData,
          price: pData.mrp,
          discountedPrice: pData.discounted_price,
          isNew: pData.is_new,
          isBestseller: pData.is_bestseller,
          isSale: pData.is_sale,
          discountPercent: pData.discount_percent,
          stock: pData.stock_quantity,
          inStock: pData.in_stock,
          blouseStatus: pData.blouse_status,
          blousePieceLength: pData.blouse_piece_length,
          sareeLength: pData.saree_length,
          washCare: pData.wash_care,
          reviewCount: pData.review_count,
          images: pData.product_images?.map((img: any) => img.image_url) || []
        };
        setProduct(mapped);
        setActiveImage(0);

        // Add to recently viewed
        const recentRaw = localStorage.getItem('recentlyViewed') || '[]';
        let recent: string[] = [];
        try { recent = JSON.parse(recentRaw); } catch (e) {}
        recent = recent.filter(rId => rId !== pData.id);
        recent.unshift(pData.id);
        if (recent.length > 10) recent = recent.slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(recent));

        // Fetch Reviews (Approved only)
        const { data: rData } = await supabase
          .from('reviews')
          .select('*, profiles(name)')
          .eq('product_id', id)
          .eq('status', 'approved');
          
        if (rData) {
          setProductReviews(rData.map(r => ({
            id: r.id,
            productId: r.product_id,
            userName: r.profiles?.name || 'Verified Buyer',
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString(),
            photos: r.images
          })));
        }

        // Fetch Complete the look (if Saree and blouse is separate)
        if (
          pData.category === 'Saree' && 
          (pData.blouse_status === 'Blouse Sold Separately' || pData.blouse_status === 'Blouse Piece Only')
        ) {
          let query = supabase.from('products')
            .select(`*, product_images(image_url)`)
            .eq('category', 'Blouse Piece')
            .neq('id', id)
            .limit(4);
            
          // If we have occasion, match by occasion, otherwise by fabric
          if (pData.occasion && pData.occasion.length > 0) {
            query = query.contains('occasion', pData.occasion);
          } else {
            query = query.eq('fabric', pData.fabric);
          }
          
          const { data: ctlData } = await query;
          if (ctlData && ctlData.length > 0) {
            setCompleteTheLook(ctlData.map(p => ({
              ...p,
              price: p.mrp,
              discountedPrice: p.discounted_price,
              isNew: p.is_new,
              isBestseller: p.is_bestseller,
              images: p.product_images?.map((img: any) => img.image_url) || []
            })));
          }
        }

        // Fetch Related
        const { data: relData } = await supabase.from('products')
          .select(`
            *,
            product_images(image_url)
          `)
          .neq('id', id)
          .eq('category', pData.category)
          .limit(8);
        if (relData) {
          setRelated(relData.map(p => ({
            ...p,
            price: p.mrp,
            discountedPrice: p.discounted_price,
            isNew: p.is_new,
            isBestseller: p.is_bestseller,
            images: p.product_images && p.product_images.length > 0 ? [p.product_images[0].image_url] : []
          })));
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="font-serif text-2xl text-maroon mb-4">Product Not Found</h1>
        <Link to="/shop/sarees" className="btn-primary">Browse Sarees</Link>
      </div>
    );
  }

  const wished = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id);
    showToast('Added to cart');
  };

  const handleBuyNow = () => {
    addToCart(product.id);
    navigate('/checkout');
  };

  const checkDelivery = async () => {
    if (!/^\d{6}$/.test(pincode)) return;
    setCheckingDelivery(true);
    try {
      const res = await fetch('/api/delivery/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      setDeliveryInfo(data);
    } catch {
      const days = 3;
      const d = new Date();
      d.setDate(d.getDate() + days);
      setDeliveryInfo({
        estimate: '3-5 business days',
        deliveryDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      });
    }
    setCheckingDelivery(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!');
    }
  };

  const scrollGallery = (dir: 'left' | 'right') => {
    setActiveImage((prev) => {
      const next = dir === 'left' ? (prev > 0 ? prev - 1 : product.images.length - 1) : (prev < product.images.length - 1 ? prev + 1 : 0);
      const el = document.getElementById(`gallery-img-${next}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      return next;
    });
  };

  return (
    <div className="animate-fade-in pb-36 lg:pb-8">
      <div className="page-container py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4">
          <Link to="/" className="hover:text-maroon">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/shop/sarees" className="hover:text-maroon">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Gallery */}
          <div>
            <div ref={galleryRef} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group">
              <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth" id="product-gallery">
                {product.images.map((img, i) => (
                  <div key={i} id={`gallery-img-${i}`} className="min-w-full shrink-0 snap-center h-full">
                    <ProgressiveImage
                      src={img}
                      alt={`${product.name} - view ${i + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => { setActiveImage(i); setIsFullscreenZoom(true); }}
                    />
                  </div>
                ))}
              </div>
              <button onClick={() => scrollGallery('left')} className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => scrollGallery('right')} className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} />
              </button>
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
                {product.isSale && <Badge variant="sale">{product.discountPercent}% OFF</Badge>}
                {product.isNew && <Badge variant="new">New</Badge>}
                {product.isBestseller && <Badge variant="bestseller">Bestseller</Badge>}
              </div>
            </div>
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveImage(i);
                    const el = document.getElementById(`gallery-img-${i}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                  className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-maroon' : 'border-transparent'}`}
                >
                  <ProgressiveImage src={img} alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-sm text-gray-500 mb-1">{product.fabric} · {product.region} · SKU: {product.sku}</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">{product.name}</h1>
            <Rating 
              value={productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : product.rating} 
              count={productReviews.length > 0 ? productReviews.length : product.reviewCount} 
              size="md" 
            />

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-maroon">{formatPrice(product.discountedPrice)}</span>
              {product.discountPercent > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-sm font-semibold text-green-600">{product.discountPercent}% off</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>

            {/* Blouse status */}
            <div className="mt-4 p-3 bg-ivory-dark rounded-lg">
              <p className="text-sm font-medium text-gray-900">Blouse: {product.blouseStatus}</p>
              {product.blousePieceLength && (
                <p className="text-xs text-gray-500 mt-0.5">Piece length: {product.blousePieceLength}</p>
              )}
              {product.sareeLength && (
                <p className="text-xs text-gray-500 mt-0.5">Saree length: {product.sareeLength}</p>
              )}
              <button 
                onClick={() => setShowSizeGuide(true)} 
                className="text-xs text-maroon font-medium underline mt-2 hover:text-maroon-dark"
              >
                Size & Blouse Guide
              </button>
            </div>

            {/* Delivery checker */}
            <div className="mt-4">
              <p className="text-sm font-medium mb-2 flex items-center gap-1"><MapPin size={16} /> Check Delivery</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="input-field flex-1 text-sm"
                />
                <button onClick={checkDelivery} disabled={pincode.length !== 6 || checkingDelivery} className="btn-primary text-sm px-4 shrink-0">
                  {checkingDelivery ? 'Checking...' : 'Check'}
                </button>
              </div>
              {deliveryInfo && (
                <p className="text-sm text-green-700 mt-2">
                  ✓ Delivery by {deliveryInfo.deliveryDate} ({deliveryInfo.estimate})
                </p>
              )}
            </div>

            {/* Stock & actions - desktop */}
            <div className="hidden lg:flex gap-3 mt-6">
              <button onClick={handleAddToCart} className="btn-primary flex-1">
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} className="btn-gold flex-1">
                <Zap size={18} /> Buy Now
              </button>
              <button onClick={() => { toggleWishlist(product.id); showToast(wished ? 'Removed from wishlist' : 'Added to wishlist'); }} className="btn-secondary px-4">
                <Heart size={18} className={wished ? 'fill-maroon text-maroon' : ''} />
              </button>
              <button onClick={handleShare} className="btn-secondary px-4">
                <Share2 size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              {product.inStock ? (
                product.stock <= 5 ? <span className="text-orange-600 font-medium">Only {product.stock} left!</span> : '✓ In Stock'
              ) : 'Out of Stock'}
            </p>

            {/* Description */}
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Fabric:</span> <span className="font-medium">{product.fabric}</span></div>
                <div><span className="text-gray-500">Work:</span> <span className="font-medium">{product.work}</span></div>
                <div><span className="text-gray-500">Occasion:</span> <span className="font-medium">{(Array.isArray(product.occasion) ? product.occasion : (typeof product.occasion === 'string' ? [product.occasion] : [])).join(', ')}</span></div>
                <div><span className="text-gray-500">Colors:</span> <span className="font-medium">{(Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? [product.colors] : [])).join(', ')}</span></div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Wash Care</h3>
                <p className="text-sm text-gray-600">{product.washCare}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-10 border-t border-gray-100 pt-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
            <div>
              <h2 className="font-serif text-xl font-semibold text-maroon mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <Rating 
                  value={productReviews.length > 0 ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length : product.rating} 
                  showCount={false} 
                  size="md" 
                />
                <span className="text-sm font-medium">{productReviews.length > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1) : product.rating.toFixed(1)} out of 5</span>
                <span className="text-sm text-gray-500">({productReviews.length} reviews)</span>
              </div>
            </div>
            {!showReviewForm && (
              <button 
                onClick={() => user ? setShowReviewForm(true) : showToast('Please log in to write a review')} 
                className="btn-secondary text-sm px-4"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm 
                productId={product.id} 
                onCancel={() => setShowReviewForm(false)} 
                onSuccess={() => setShowReviewForm(false)} 
              />
            </div>
          )}

          {productReviews.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {productReviews.map((review) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Rating value={review.rating} showCount={false} />
                    <span className="text-sm font-medium">{review.userName}</span>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.photos.map((photo: string, i: number) => (
                        <button key={i} onClick={() => {
                          setActiveImage(0); // If we wanted a lightbox for reviews, we'd add it. For now just clicking opens it if we had a dedicated state.
                          // Realistically we could add a review image lightbox state, or just render it. Let's just make it viewable.
                          window.open(photo, '_blank');
                        }} className="shrink-0">
                          <img src={photo} alt="" className="w-16 h-16 rounded object-cover border border-gray-200" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Complete The Look */}
      {completeTheLook.length > 0 && (
        <ProductCarousel title="Complete The Look" products={completeTheLook} />
      )}

      {/* Related */}
      {related.length > 0 && (
        <ProductCarousel title="You May Also Like" products={related} />
      )}

      {/* Sticky mobile bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 flex gap-2 safe-bottom">
        <button onClick={() => { toggleWishlist(product.id); showToast(wished ? 'Removed' : 'Saved'); }} className="btn-secondary px-3 sm:px-4 shrink-0 min-h-[44px]">
          <Heart size={18} className={wished ? 'fill-maroon text-maroon' : ''} />
        </button>
        <button onClick={handleAddToCart} className="btn-primary flex-1 text-sm min-h-[44px] px-2 sm:px-4">
          <ShoppingBag size={16} className="hidden sm:inline-block mr-1" /> Add
        </button>
        <button onClick={handleBuyNow} className="btn-gold flex-1 text-sm min-h-[44px] px-2 sm:px-4">
          <Zap size={16} className="hidden sm:inline-block mr-1" /> Buy Now
        </button>
      </div>

      {/* Fullscreen Zoom Overlay */}
      {isFullscreenZoom && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <button 
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-4 right-4 z-[101] w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white backdrop-blur-sm"
          >
            <X size={24} />
          </button>

          {/* Left/Right controls inside zoom */}
          {product.images.length > 1 && (
            <>
              <button onClick={() => scrollGallery('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-[101] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                <ChevronLeft size={32} />
              </button>
              <button onClick={() => scrollGallery('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-[101] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={4}
            centerOnInit
          >
            <TransformComponent wrapperClass="!w-screen !h-screen flex items-center justify-center" contentClass="!w-screen !h-screen flex items-center justify-center">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="max-w-full max-h-screen object-contain pointer-events-none"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}
