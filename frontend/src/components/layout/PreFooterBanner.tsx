import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function AnimatedSection({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, x: 0 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function PreFooterBanner() {
  const location = useLocation();
  const path = location.pathname;

  // Paths to skip banner
  if (
    path === '/login' ||
    path === '/signup' ||
    path === '/checkout' ||
    path.startsWith('/order-confirmation') ||
    path.startsWith('/admin')
  ) {
    return null;
  }

  // Determine content based on route
  let heading = "Continue the tradition.";
  let subtext = "";
  let ctaText = "Shop the Collection";
  let ctaLink = "/shop/all";
  let showCta = true;
  let useWhatsAppCta = false;

  if (path.startsWith('/shop') || path === '/search') {
    heading = "Free shipping on orders above ₹2,000";
    subtext = "Secure Payments • Easy Returns • Authentic Handloom";
    showCta = false;
  } else if (path.startsWith('/product')) {
    heading = "Need help choosing?";
    subtext = "Our experts are here to assist you with styling and fit.";
    useWhatsAppCta = true;
    ctaText = "Chat with us";
  } else if (path === '/cart') {
    heading = "Shop with Confidence";
    subtext = "Secure Checkout • Authentic Handloom • Easy Returns";
    showCta = false;
  } else if (path.startsWith('/account') || path === '/wishlist') {
    heading = "New Arrivals Just In";
    ctaText = "Explore New Arrivals";
    ctaLink = "/shop/new-arrivals";
  }

  return (
    <section className="py-24 md:py-32 bg-maroon text-white text-center relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ></div>
      
      <AnimatedSection className="relative z-10 px-4">
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 drop-shadow-sm max-w-4xl mx-auto leading-tight">
          {heading}
        </h2>
        
        {subtext && (
          <p className="text-white/80 text-lg md:text-xl mb-8 font-medium">
            {subtext}
          </p>
        )}
        
        {showCta && !useWhatsAppCta && (
          <Link 
            to={ctaLink} 
            className="inline-block bg-white text-maroon font-semibold px-8 py-4 md:px-10 md:py-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50 motion-safe:transition-all duration-300 mt-4"
          >
            {ctaText}
          </Link>
        )}

        {showCta && useWhatsAppCta && (
          <a 
            href="https://wa.me/919359794521"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#25D366] text-white font-semibold px-8 py-4 md:px-10 md:py-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-[#20b958] motion-safe:transition-all duration-300 mt-4"
          >
            {ctaText}
          </a>
        )}
      </AnimatedSection>
    </section>
  );
}
