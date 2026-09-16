import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { ProductCarousel } from '../components/product/ProductCarousel';
import { TrustStrip } from '../components/layout/TrustStrip';
import { RecentlyViewed } from '../components/product/RecentlyViewed';

export function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [offerBanner, setOfferBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      // Fetch Products with primary images
      const { data: productData } = await supabase
        .from('products')
        .select(`
          *,
          product_images(image_url)
        `)
        .eq('is_active', true)
        .limit(20);
      
      if (productData) {
        // map image_url as first image
        const mappedProducts = productData.map(p => ({
          ...p,
          price: p.mrp,
          discountedPrice: p.discounted_price,
          isNew: p.is_new,
          isBestseller: p.is_bestseller,
          images: p.product_images && p.product_images.length > 0 ? [p.product_images[0].image_url] : []
        }));
        setProducts(mappedProducts);
      }

      // Fetch Homepage Content
      const { data: contentData } = await supabase
        .from('homepage_content')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (contentData && contentData.length > 0) {
        // Force the carousel to always use all 6 premium local slides
        const slides = defaultHeroSlides;
        
        const cats = contentData
          .filter(c => c.section === 'category_tile')
          .map((c, i) => {
            let imageUrl = c.image_url;
            if (!imageUrl || imageUrl.includes('loremflickr')) {
              imageUrl = defaultCategories[i % defaultCategories.length]?.image;
            }
            return {
              label: c.title,
              image: imageUrl,
              href: c.cta_link
            };
          });
        const offerRow = contentData.find(c => c.section === 'offer_banner');
        let offer = null;
        if (offerRow) {
          offer = {
            title: offerRow.title,
            subtitle: offerRow.subtitle,
            couponText: '', // Or pull from another field if you added it
            cta: offerRow.cta_text,
            href: offerRow.cta_link
          };
        }

        setHeroSlides(slides.length > 0 ? slides : defaultHeroSlides);
        setCategories(cats.length > 0 ? cats : defaultCategories);
        setOfferBanner(offer || defaultOffer);
      } else {
        setHeroSlides(defaultHeroSlides);
        setCategories(defaultCategories);
        setOfferBanner(defaultOffer);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const newArrivals = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => p.isBestseller);
  const trending = [...products].slice(0, 8); // Assuming mock trending

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Carousel */}
      <section 
        className="relative overflow-hidden bg-ivory-dark w-full h-[clamp(450px,50vw,700px)] min-h-[450px]"
      >
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img 
              src={slide.image} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover object-[center_15%]" 
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4a0d20]/70 via-[#4a0d20]/40 to-transparent" />
            <div className="relative page-container h-full flex flex-col justify-center py-16 sm:py-24">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-2 max-w-lg break-words leading-tight">{slide.title}</h2>
              <p className="text-white/80 text-sm sm:text-lg mb-6 max-w-md">{slide.subtitle}</p>
              <Link to={slide.href} className="btn-gold w-fit pointer-events-auto">{slide.cta}</Link>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <TrustStrip />

      {/* Category Tiles */}
      <section className="py-8 sm:py-12">
        <div className="page-container">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon mb-6 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <Link key={idx} to={cat.href} className="group relative aspect-[4/5] rounded-xl overflow-hidden">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 text-white font-medium text-sm sm:text-ivory">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductCarousel title="New Arrivals" subtitle="Fresh styles just in" products={newArrivals.length ? newArrivals : products.slice(0, 6)} />
      <ProductCarousel title="Best Sellers" subtitle="Loved by thousands" products={bestSellers.length ? bestSellers : products.slice(0, 8)} />
      <ProductCarousel title="Trending Now" subtitle="Most reviewed this season" products={trending} />

      {/* Offers Banner */}
      {offerBanner && (
        <section className="py-8">
          <div className="page-container">
            <div className="bg-gradient-to-r from-maroon to-maroon-dark rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-1">{offerBanner.subtitle || 'Limited Time Offer'}</p>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">{offerBanner.title}</h3>
                <p className="text-white/70 text-sm mt-2">{offerBanner.couponText}</p>
              </div>
              <Link to={offerBanner.href || '/shop/sale'} className="btn-gold shrink-0">{offerBanner.cta || 'Shop Sale'}</Link>
            </div>
          </div>
        </section>
      )}
      <RecentlyViewed />
    </div>
  );
}

const defaultHeroSlides = [
  {
    title: 'Wedding Collection 2025',
    subtitle: 'Handwoven silks for your special day',
    cta: 'Shop Wedding Sarees',
    href: '/shop/wedding',
    bg: 'from-maroon/90 to-maroon-dark/90',
    image: '/hero/saree_hero_1.jpg',
  },
  {
    title: 'Festive Sale — Up to 30% Off',
    subtitle: 'Premium sarees at unbeatable prices',
    cta: 'Shop Sale',
    href: '/shop/sale',
    bg: 'from-bottle/90 to-bottle-light/90',
    image: '/hero/saree_hero_2.jpg',
  },
  {
    title: 'Heritage Banarasi',
    subtitle: 'Woven with real gold zari',
    cta: 'Explore Banarasi',
    href: '/shop/banarasi',
    bg: 'from-amber-800/90 to-amber-900/90',
    image: '/hero/saree_hero_3.jpg',
  },
  {
    title: 'The Royal Drape',
    subtitle: 'Classic silks for evening elegance',
    cta: 'Shop Silks',
    href: '/shop/silk',
    bg: 'from-indigo-900/90 to-purple-900/90',
    image: '/hero/saree_hero_4.jpg',
  },
  {
    title: 'Artisan Crafted',
    subtitle: 'Every thread tells a story of tradition',
    cta: 'Our Story',
    href: '/about',
    bg: 'from-rose-900/90 to-rose-950/90',
    image: '/hero/saree_hero_5.jpg',
  },
  {
    title: 'Bridal Exclusives',
    subtitle: 'Your perfect match awaits',
    cta: 'Shop Bridal',
    href: '/shop/bridal',
    bg: 'from-red-900/90 to-maroon/90',
    image: '/hero/slide1.jpg',
  },
];

const defaultCategories = [
  { label: 'Silk Sarees', href: '/shop/silk-sarees', image: '/about-story/story_1_v3.jpg' },
  { label: 'Cotton Sarees', href: '/shop/cotton-sarees', image: '/about-story/story_2_v3.jpg' },
];

const defaultOffer = {
  title: 'Extra 10% off on orders above ₹5,000',
  subtitle: 'Limited Time Offer',
  couponText: 'Use code: SHAH10 at checkout',
  cta: 'Shop Sale',
  href: '/shop/sale'
};
