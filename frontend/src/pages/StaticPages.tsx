import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Clock, Send, Truck, RefreshCw, ShieldCheck, HeartHandshake, Map, ChevronDown } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export function ContactPage() {
  const [isHovered, setIsHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: formRef, isVisible: formVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: storeRef, isVisible: storeVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: faqRef, isVisible: faqVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal({ threshold: 0.5 });

  const heroSlides = [
    {
      title: 'At Your Service',
      subtitle: 'Dedicated assistance for our esteemed clientele',
      image: '/contact/contact-1.jpg',
    },
    {
      title: 'Luxury Concierge',
      subtitle: 'Personalized attention to every detail',
      image: '/contact/contact-2.jpg',
    },
    {
      title: 'Crafted with Care',
      subtitle: 'Every piece handled with the utmost precision',
      image: '/contact/contact-3.jpg',
    },
    {
      title: 'Bespoke Experience',
      subtitle: 'Step into a world of exclusive consultations',
      image: '/contact/contact-4.jpg',
    },
    {
      title: 'Timeless Elegance',
      subtitle: 'Master artisans perfecting your vision',
      image: '/contact/contact-5.jpg',
    },
  ];

  const faqs = [
    {
      q: "Do you offer virtual consultations?",
      a: "Yes, our personal stylists are available for one-on-one virtual consultations to help you find the perfect piece."
    },
    {
      q: "Can I customize an order?",
      a: "Absolutely. We offer bespoke services for many of our garments. Please contact us directly to discuss your requirements."
    },
    {
      q: "How do I track my premium shipment?",
      a: "Once your order is dispatched, you will receive a tracking link via email and WhatsApp. Our concierge team proactively monitors all shipments."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1500); // Fake submit delay
  };

  return (
    <div className="min-h-screen relative bg-[#FAFAF8] overflow-hidden">
      {/* Hero Carousel */}
      <section ref={heroRef} className={`relative overflow-hidden w-full h-[clamp(500px,55vw,750px)] min-h-[500px] transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img 
              src={slide.image} 
              alt="" 
              className={`absolute inset-0 w-full h-full object-cover object-[center_15%] transition-transform duration-[10s] ease-linear ${idx === currentSlide ? 'scale-110' : 'scale-100'}`} 
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-black/40 to-transparent" />
            <div className="relative page-container h-full flex flex-col justify-center items-center text-center py-16 sm:py-24">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-md">{slide.title}</h2>
              <p className="text-white/90 text-lg sm:text-2xl font-light max-w-2xl drop-shadow">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${idx === currentSlide ? 'bg-gold w-8' : 'bg-white/60 hover:bg-white'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Decorative ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-light/10 rounded-full blur-[100px] opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-gold-light/10 rounded-full blur-[100px] opacity-40 animate-float"></div>
      </div>

      <div className="py-16 lg:py-24 relative">
        <div ref={formRef} className={`transition-all duration-1000 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="text-center mb-16 relative z-10 px-4">
            <h3 className="uppercase tracking-[0.2em] text-gold font-medium text-sm mb-3">Reach Out</h3>
            <h1 className="font-serif text-5xl lg:text-6xl font-bold text-maroon mb-6 drop-shadow-sm">Get in Touch</h1>
            <p className="text-gray-600 max-w-xl mx-auto text-lg leading-relaxed">
              We'd love to hear from you. Whether you have a question about our curated collections, sizing, or your order, our team is at your service.
            </p>
          </div>

          <div className="max-w-[1100px] mx-auto bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(122,12,46,0.15)] overflow-hidden flex flex-col md:flex-row border border-white relative z-10 mx-4 lg:mx-auto">
            
            {/* Left Side: Contact Info */}
            <div className="md:w-5/12 bg-gradient-to-br from-maroon to-maroon-dark text-ivory p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
              <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gold/20 rounded-full blur-3xl pointer-events-none animate-float"></div>
              
              <div className="relative z-10 space-y-10">
                <div>
                  <h2 className="text-3xl font-serif font-semibold mb-4 tracking-wide text-gold-light">Contact Information</h2>
                  <p className="text-ivory-dark/80 text-base leading-relaxed">
                    Fill out the form and our concierge team will get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-8">
                  <a href="tel:+919359794521" className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold-light/20 group-hover:border-gold-light/50 transition-all duration-300 shadow-lg">
                      <Phone size={22} className="text-gold-light group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-sm text-ivory-dark/70 font-medium uppercase tracking-wider mb-1">Phone / WhatsApp</p>
                      <p className="font-semibold text-lg group-hover:text-gold-light transition-colors">+91 93597 94521</p>
                    </div>
                  </a>
                  
                  <a href="mailto:Kasimshah998@gmail.com" className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold-light/20 group-hover:border-gold-light/50 transition-all duration-300 shadow-lg">
                      <Mail size={22} className="text-gold-light group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-sm text-ivory-dark/70 font-medium uppercase tracking-wider mb-1">Email</p>
                      <p className="font-semibold text-lg group-hover:text-gold-light transition-colors">Kasimshah998@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="relative z-10 mt-16 flex gap-5">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-maroon-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(201,162,75,0.3)]">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-maroon-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(201,162,75,0.3)]">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-maroon-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(201,162,75,0.3)]">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="md:w-7/12 p-10 lg:p-14 bg-white/90">
              <form onSubmit={handleSubmit} className="h-full flex flex-col space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="firstName"
                      className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 focus:ring-0 focus:border-maroon transition-colors duration-300 placeholder-transparent outline-none"
                      placeholder="First Name"
                      required
                    />
                    <label htmlFor="firstName" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-maroon font-medium cursor-text">First Name</label>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="text" 
                      id="lastName"
                      className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 focus:ring-0 focus:border-maroon transition-colors duration-300 placeholder-transparent outline-none"
                      placeholder="Last Name"
                    />
                    <label htmlFor="lastName" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-maroon font-medium cursor-text">Last Name</label>
                  </div>
                </div>

                <div className="relative group">
                  <input 
                    type="email" 
                    id="email"
                    className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 focus:ring-0 focus:border-maroon transition-colors duration-300 placeholder-transparent outline-none"
                    placeholder="Email Address"
                    required
                  />
                  <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-maroon font-medium cursor-text">Email Address</label>
                </div>
                
                <div className="relative group">
                  <input 
                    type="tel" 
                    id="phone"
                    className="peer w-full px-0 py-3 bg-transparent border-0 border-b-2 border-gray-200 text-gray-900 focus:ring-0 focus:border-maroon transition-colors duration-300 placeholder-transparent outline-none"
                    placeholder="Phone Number"
                  />
                  <label htmlFor="phone" className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-maroon font-medium cursor-text">Phone Number (Optional)</label>
                </div>

                <div className="relative group flex-grow pt-2">
                  <textarea 
                    id="message"
                    className="peer w-full h-full min-h-[140px] px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all duration-300 placeholder-transparent outline-none resize-none shadow-inner"
                    placeholder="Your Message"
                    required
                  />
                  <label htmlFor="message" className="absolute left-4 -top-3 bg-white px-2 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:text-maroon peer-focus:bg-white font-medium cursor-text rounded-md">How can we help you today?</label>
                </div>

                <div className="pt-4 relative overflow-hidden rounded-2xl">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`w-full px-8 py-4 rounded-2xl font-semibold text-white tracking-wide transition-all duration-500 flex items-center justify-center gap-3 relative z-10
                      ${isSubmitting ? 'bg-maroon/70 cursor-not-allowed scale-[0.98]' : 'bg-gradient-to-r from-maroon to-maroon-dark hover:shadow-[0_15px_30px_rgba(122,12,46,0.3)] hover:-translate-y-1'}`}
                  >
                    <div className="absolute inset-0 bg-gold opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                    {isSubmitting ? (
                      <span className="animate-pulse">Sending Message...</span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={20} className={`transition-all duration-500 ${isHovered ? 'translate-x-2 -translate-y-2 opacity-100' : 'opacity-80'}`} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Guarantees Section */}
        <div ref={featuresRef} className={`max-w-6xl mx-auto px-4 mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex flex-col items-center text-center p-6 group">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
              <ShieldCheck size={28} className="text-gold-dark" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">Secure Experience</h4>
            <p className="text-gray-600 font-light leading-relaxed">Your privacy and security are our highest priority during your shopping journey.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 group">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
              <HeartHandshake size={28} className="text-gold-dark" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">Concierge Support</h4>
            <p className="text-gray-600 font-light leading-relaxed">Dedicated stylists and support staff available to assist you with every request.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 group">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-500">
              <Truck size={28} className="text-gold-dark" />
            </div>
            <h4 className="font-serif text-xl font-semibold text-gray-900 mb-3">Premium Delivery</h4>
            <p className="text-gray-600 font-light leading-relaxed">Insured, expedited shipping worldwide to ensure your masterpiece arrives perfectly.</p>
          </div>
        </div>

        {/* Flagship Store Section */}
        <div ref={storeRef} className={`max-w-6xl mx-auto px-4 mt-32 transition-all duration-1000 delay-100 ${storeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden group">
              <img src="/contact/contact-1.jpg" alt="Boutique" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[20s]" />
              <div className="absolute inset-0 bg-maroon/20 mix-blend-overlay"></div>
            </div>
            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <Map size={24} className="text-gold" />
                <h3 className="uppercase tracking-widest text-gold font-medium text-sm">Visit Us</h3>
              </div>
              <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">Our Flagship Boutique</h2>
              <p className="text-gray-600 font-light text-lg mb-8 leading-relaxed">
                Experience the luxury of our collections in person. Our flagship store offers an immersive shopping experience with personalized styling services.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin size={20} className="text-maroon mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                    <p className="text-gray-600 font-light">Garib Nawaz Colony, Gulmohar Park,<br/>Dhule Road, Dondaicha 425408</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={20} className="text-maroon mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Boutique Hours</h4>
                    <p className="text-gray-600 font-light">Monday to Saturday: 10:00 AM – 8:00 PM<br/>Sunday: By Appointment Only</p>
                  </div>
                </div>
              </div>
              
              <button className="mt-10 self-start px-8 py-3 border border-maroon text-maroon rounded-full hover:bg-maroon hover:text-white transition-colors duration-300">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div ref={faqRef} className={`max-w-4xl mx-auto px-4 mt-32 transition-all duration-1000 delay-100 ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-4">Common Enquiries</h2>
            <p className="text-gray-600 font-light text-lg">Quick answers to our most frequently asked questions.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-gold shadow-md' : 'border-gray-200 hover:border-gold/50'}`}
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className={`font-serif text-lg font-medium transition-colors duration-300 ${openFaq === index ? 'text-maroon' : 'text-gray-900'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-gold' : ''}`} />
                </button>
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-gray-600 font-light leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-2 text-maroon hover:text-gold transition-colors duration-300 font-medium">
              View all FAQs <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* Quote Section */}
        <div ref={quoteRef} className={`max-w-4xl mx-auto px-4 mt-32 mb-10 text-center transition-all duration-1000 delay-300 ${quoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-800 leading-tight italic font-light mb-8">
            "True luxury is not just in what you wear, but in the experience of finding it. We are here to guide you."
          </h2>
          <p className="text-maroon font-medium uppercase tracking-widest text-sm">— Shah Fashion</p>
          <div className="w-16 h-px bg-gold mx-auto mt-8"></div>
        </div>
      </div>
    </div>
  );
}

export function ShippingReturnsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: journeyRef, isVisible: journeyVisible } = useScrollReveal({ threshold: 0.15 });
  const { ref: shippingRef, isVisible: shippingVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: returnsRef, isVisible: returnsVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: trustRef, isVisible: trustVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal({ threshold: 0.5 });

  const heroSlides = [
    {
      title: 'Premium Packaging',
      subtitle: 'Every piece wrapped with love and care',
      image: '/images/shipping-returns/guide-1.jpg',
    },
    {
      title: 'Delivered with Joy',
      subtitle: 'From our boutique straight to your doorstep',
      image: '/images/shipping-returns/guide-2.jpg',
    },
    {
      title: 'Crafted with Precision',
      subtitle: 'Each order handled with artisan-level care',
      image: '/images/shipping-returns/guide-3.jpg',
    },
    {
      title: 'Safe & Secure',
      subtitle: 'Insured shipping across India and worldwide',
      image: '/images/shipping-returns/guide-4.jpg',
    },
    {
      title: 'Hassle-Free Returns',
      subtitle: 'Your satisfaction is our foremost priority',
      image: '/images/shipping-returns/guide-5.jpg',
    },
  ];

  const journeySteps = [
    { step: '01', title: 'Order Placed', desc: 'Instant confirmation via email & WhatsApp', icon: '🛍️' },
    { step: '02', title: 'Quality Check', desc: 'Each piece inspected by our artisan team', icon: '✨' },
    { step: '03', title: 'Premium Packing', desc: 'Wrapped in branded luxury packaging', icon: '🎁' },
    { step: '04', title: 'Doorstep Delivery', desc: 'Insured, tracked & delivered with care', icon: '🚚' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen relative bg-[#FAFAF8] overflow-hidden">
      {/* Hero Carousel */}
      <section ref={heroRef} className={`relative overflow-hidden w-full h-[clamp(500px,55vw,750px)] min-h-[500px] transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img 
              src={slide.image} 
              alt="" 
              className={`absolute inset-0 w-full h-full object-cover object-[center_15%] transition-transform duration-[10s] ease-linear ${idx === currentSlide ? 'scale-110' : 'scale-100'}`} 
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-black/40 to-transparent" />
            <div className="relative page-container h-full flex flex-col justify-center items-center text-center py-16 sm:py-24">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-md">{slide.title}</h2>
              <p className="text-white/90 text-lg sm:text-2xl font-light max-w-2xl drop-shadow">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${idx === currentSlide ? 'bg-gold w-8' : 'bg-white/60 hover:bg-white'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-light/10 rounded-full blur-[100px] opacity-70 animate-pulse-slow"></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[400px] h-[400px] bg-gold-light/10 rounded-full blur-[100px] opacity-40 animate-float"></div>
      </div>

      <div className="py-16 lg:py-24 relative">
        {/* Title Section */}
        <div ref={titleRef} className={`text-center mb-20 relative z-10 px-4 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="inline-block mb-4">
            <span className="block w-12 h-px bg-gold mx-auto mb-4 opacity-50"></span>
            <h3 className="uppercase tracking-[0.3em] text-maroon font-medium text-xs mb-3">Delivery & Care</h3>
            <span className="block w-12 h-px bg-gold mx-auto mt-4 opacity-50"></span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            Shipping & Returns
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            We ensure your handcrafted pieces reach you with the same care and precision with which they were made.
          </p>
        </div>

        {/* Shipping Journey Timeline */}
        <div ref={journeyRef} className={`max-w-5xl mx-auto px-4 mb-28 transition-all duration-1000 delay-200 ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900 mb-3">Your Shipping Journey</h2>
            <p className="text-gray-500 font-light text-lg">From our atelier to your doorstep — a seamless experience.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {journeySteps.map((item, idx) => (
              <div
                key={idx}
                className="relative group"
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Connector Line (hidden on last item and small screens) */}
                {idx < journeySteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-px bg-gradient-to-r from-gold/40 to-gold/10 z-0"></div>
                )}
                <div className="relative z-10 flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] group-hover:border-gold/30 group-hover:shadow-[0_15px_40px_-10px_rgba(201,162,75,0.15)] transition-all duration-500 group-hover:-translate-y-2">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                  <span className="text-xs font-bold tracking-widest text-gold uppercase mb-2">Step {item.step}</span>
                  <h4 className="font-serif text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-500 font-light text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Cards */}
        <div className="max-w-[1000px] mx-auto px-4 relative z-10 space-y-12 mb-20">
          {/* Shipping Section */}
          <section ref={shippingRef} className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_15px_50px_-10px_rgba(201,162,75,0.1)] transition-all duration-700 relative group flex flex-col lg:flex-row ${shippingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Image Side */}
            <div className="lg:w-5/12 relative h-56 lg:h-auto overflow-hidden">
              <img src="/about-story/story_2_v3.jpg" alt="Premium Packaging" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s]" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 lg:bg-gradient-to-l"></div>
            </div>

            {/* Content Side */}
            <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-maroon border border-maroon/10 shadow-sm group-hover:shadow-[0_0_15px_rgba(201,162,75,0.15)] group-hover:text-gold transition-all duration-500">
                  <Truck size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-3xl font-semibold text-gray-900 tracking-wide">Shipping Policy</h3>
              </div>
              
              <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent mb-8"></div>
              
              <ul className="text-lg text-gray-600 space-y-5 font-light">
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Free shipping on all orders above <span className="font-medium text-maroon">₹1,999</span></span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Standard delivery within 3–7 business days across India</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Express delivery available at checkout (1–2 days)</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Cash on Delivery (COD) available for orders up to ₹25,000</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>All orders are securely packed in premium branded boxes</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Returns Section */}
          <section ref={returnsRef} className={`bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_15px_50px_-10px_rgba(201,162,75,0.1)] transition-all duration-700 relative group flex flex-col lg:flex-row-reverse ${returnsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gold/5 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Image Side */}
            <div className="lg:w-5/12 relative h-56 lg:h-auto overflow-hidden">
              <img src="/about-story/story_3_v3.jpg" alt="Returns & Exchanges" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[15s]" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20 lg:bg-gradient-to-r"></div>
            </div>

            {/* Content Side */}
            <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-maroon border border-maroon/10 shadow-sm group-hover:shadow-[0_0_15px_rgba(201,162,75,0.15)] group-hover:text-gold transition-all duration-500">
                  <RefreshCw size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-3xl font-semibold text-gray-900 tracking-wide">Returns & Exchanges</h3>
              </div>
              
              <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent mb-8"></div>
              
              <ul className="text-lg text-gray-600 space-y-5 font-light">
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>7-day easy return policy on unused products with original tags intact</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Return pickup arranged directly from your doorstep at no extra cost</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>Refunds processed within 5–7 business days after quality check</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-maroon/10 flex items-center justify-center text-maroon text-xs font-bold mt-0.5 shrink-0">!</span>
                  <span>Custom-stitched blouses and "Final Sale" items are non-returnable</span>
                </li>
                <li className="flex items-start gap-3 group/item">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs font-bold mt-0.5 shrink-0 group-hover/item:bg-gold group-hover/item:text-white transition-all duration-300">✓</span>
                  <span>For immediate exchanges, contact our concierge on WhatsApp within 48 hours</span>
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Trust Badges */}
        <div ref={trustRef} className={`max-w-5xl mx-auto px-4 mb-24 transition-all duration-1000 delay-200 ${trustVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck size={28} />, label: '100% Authentic', sub: 'Certified Products' },
              { icon: <Truck size={28} />, label: 'Free Shipping', sub: 'On orders above ₹1,999' },
              { icon: <RefreshCw size={28} />, label: 'Easy Returns', sub: '7-day return policy' },
              { icon: <HeartHandshake size={28} />, label: '24/7 Support', sub: 'WhatsApp & Phone' },
            ].map((badge, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gold/30 hover:-translate-y-1 transition-all duration-500 group">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-4 text-gold-dark group-hover:bg-gold group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  {badge.icon}
                </div>
                <h4 className="font-serif text-base font-semibold text-gray-900 mb-1">{badge.label}</h4>
                <p className="text-gray-500 text-sm font-light">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div ref={quoteRef} className={`max-w-4xl mx-auto px-4 mb-10 text-center transition-all duration-1000 delay-300 ${quoteVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
          <h2 className="font-serif text-3xl md:text-4xl text-gray-800 leading-tight italic font-light mb-8">
            "Every package we send carries not just a saree, but a promise — of quality, authenticity, and an unforgettable experience."
          </h2>
          <p className="text-maroon font-medium uppercase tracking-widest text-sm">— Shah Fashion</p>
          <div className="w-16 h-px bg-gold mx-auto mt-8"></div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8 mb-10">
          <Link to="/contact" className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-gold text-maroon font-medium tracking-[0.1em] uppercase text-sm hover:bg-gold hover:text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,162,75,0.3)] hover:-translate-y-1">
            Need Help? Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { ref: heroRef, isVisible: heroVisible } = useScrollReveal();
  const { ref: titleRef, isVisible: titleVisible } = useScrollReveal({ threshold: 0.2 });
  const { ref: listRef, isVisible: listVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: footerRef, isVisible: footerVisible } = useScrollReveal({ threshold: 0.5 });

  const heroSlides = [
    {
      title: 'Our Promise',
      subtitle: 'Answers to your most discerning queries',
      image: '/faq/support-1.jpg',
    },
    {
      title: 'Heritage & Craft',
      subtitle: 'Understanding the legacy of Kanchipuram silk',
      image: '/faq/support-2.jpg',
    },
    {
      title: 'Bespoke Services',
      subtitle: 'Tailored specifically for your needs',
      image: '/faq/support-3.jpg',
    },
    {
      title: 'Personal Styling',
      subtitle: 'Expert assistance for your special day',
      image: '/faq/support-4.jpg',
    },
    {
      title: 'Authenticity Guaranteed',
      subtitle: 'Trust and quality in every weave',
      image: '/faq/support-5.jpg',
    },
    {
      title: 'Curated Collections',
      subtitle: 'Explore our masterfully woven masterpieces',
      image: '/faq/support-6.jpg',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const faqs = [
    {
      question: "Are your sarees authentic?",
      answer: "Yes. All silk sarees come with authenticity certification where applicable. We source directly from weaver cooperatives and certified suppliers to ensure you receive only genuine, highest-quality weaves.",
      image: "/faq/support-1.jpg"
    },
    {
      question: "How long does shipping take?",
      answer: "Orders within India are delivered within 3-5 business days. International shipping takes 7-14 business days depending on customs clearance. All our packages are fully insured during transit.",
      image: "/faq/support-2.jpg"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by destination. We partner with premium logistics providers to ensure your luxury items reach you safely across the globe.",
      image: "/faq/support-3.jpg"
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery. The item must be unworn, unwashed, and have original tags attached. Custom-stitched items and bespoke orders cannot be returned.",
      image: "/faq/support-4.jpg"
    },
    {
      question: "How do I care for my silk sarees?",
      answer: "We recommend dry cleaning only for all pure silk sarees. Store them wrapped in a clean cotton cloth in a cool, dry place. Avoid using perfumes directly on the fabric to prevent staining.",
      image: "/faq/support-5.jpg"
    },
    {
      question: "Can I cancel my order?",
      answer: "You can cancel your order within 24 hours of placing it. After 24 hours, the order is processed for dispatch and cannot be canceled. Please contact our concierge team for immediate assistance.",
      image: "/faq/support-6.jpg"
    }
  ];

  return (
    <div className="min-h-screen animate-fade-in relative bg-[#FAFAF8] overflow-hidden">
      {/* Hero Carousel */}
      <section ref={heroRef} className={`relative overflow-hidden w-full h-[clamp(500px,55vw,750px)] min-h-[500px] transition-all duration-1000 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
          >
            <img 
              src={slide.image} 
              alt="" 
              className={`absolute inset-0 w-full h-full object-cover object-[center_15%] transition-transform duration-[10s] ease-linear ${idx === currentSlide ? 'scale-110' : 'scale-100'}`} 
              loading={idx === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-black/40 to-transparent" />
            <div className="relative page-container h-full flex flex-col justify-center items-center text-center py-16 sm:py-24">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-md">{slide.title}</h2>
              <p className="text-white/90 text-lg sm:text-2xl font-light max-w-2xl drop-shadow">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${idx === currentSlide ? 'bg-gold w-8' : 'bg-white/60 hover:bg-white'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="py-16 lg:py-24 relative">
        {/* Delicate Ambient Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[100px] opacity-70 animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-maroon/10 rounded-full blur-[120px] opacity-60 animate-float"></div>
        </div>

        {/* Title Section */}
        <div ref={titleRef} className={`text-center mb-16 relative z-10 px-4 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          <div className="inline-block mb-4">
            <span className="block w-12 h-px bg-gold mx-auto mb-4 opacity-50"></span>
            <h3 className="uppercase tracking-[0.3em] text-maroon font-medium text-xs mb-3">Client Services</h3>
            <span className="block w-12 h-px bg-gold mx-auto mt-4 opacity-50"></span>
          </div>
          <h1 className="font-serif text-5xl lg:text-7xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            Questions & Answers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
            Discover everything you need to know about our collections, craftsmanship, and bespoke services.
          </p>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className={`max-w-4xl mx-auto px-4 relative z-10 transition-all duration-1000 delay-200 ${listVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-6">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <div 
                  key={index} 
                  style={{ transitionDelay: `${index * 100}ms` }}
                  className={`bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border transition-all duration-500 hover:shadow-[0_15px_50px_-10px_rgba(201,162,75,0.15)] group cursor-pointer ${
                    isOpen ? 'border-gold/50 shadow-[0_15px_50px_-10px_rgba(201,162,75,0.2)]' : 'border-gray-100 hover:border-gold/30'
                  } ${listVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                >
                  <div className="p-6 lg:p-8 flex justify-between items-center bg-transparent">
                    <h3 className={`font-serif text-xl pr-8 transition-colors duration-300 ${isOpen ? 'text-maroon' : 'text-gray-900 group-hover:text-maroon'}`}>
                      {faq.question}
                    </h3>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-500 flex-shrink-0 ${
                      isOpen ? 'border-maroon bg-maroon/10 text-maroon rotate-180 scale-110' : 'border-gray-200 text-gray-400 group-hover:border-gold group-hover:bg-gold/10 group-hover:text-gold group-hover:scale-110'
                    }`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="p-6 lg:p-8 pt-6 border-t border-gold/10 mx-6 lg:mx-8 flex flex-col md:flex-row gap-8 items-start mt-2">
                      <div className="w-full md:w-1/3 shrink-0">
                        <img src={faq.image} alt="FAQ Support" className="w-full h-auto rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] object-cover" />
                      </div>
                      <p className="text-gray-600 leading-relaxed font-light text-lg flex-1">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer CTA */}
          <div ref={footerRef} className={`mt-24 text-center transition-all duration-1000 delay-500 ${footerVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-16 h-px bg-gold mx-auto mb-8"></div>
            <p className="text-gray-500 mb-6 font-serif italic text-xl">Unable to find what you're looking for?</p>
            <Link to="/contact" className="inline-flex items-center justify-center px-10 py-4 rounded-full border-2 border-gold text-maroon font-medium tracking-[0.1em] uppercase text-sm hover:bg-gold hover:text-white transition-all duration-500 hover:shadow-[0_0_30px_rgba(201,162,75,0.4)] hover:-translate-y-1">
              Contact Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SizeGuidePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: 'Flawless Fit',
      subtitle: 'Discover the art of perfect measurements',
      image: '/images/size-guide/guide-1.jpg',
    },
    {
      title: 'Bespoke Elegance',
      subtitle: 'Tailored to grace your unique silhouette',
      image: '/images/size-guide/guide-2.jpg',
    },
    {
      title: 'The Perfect Drape',
      subtitle: 'Every fold masterfully measured',
      image: '/images/size-guide/guide-3.jpg',
    },
    {
      title: 'Master Craftsmanship',
      subtitle: 'Precision cutting for an exquisite look',
      image: '/images/size-guide/guide-4.jpg',
    },
    {
      title: 'Luxurious Silhouette',
      subtitle: 'Golden silk draped to perfection',
      image: '/images/size-guide/guide-5.jpg',
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="min-h-screen animate-fade-in relative bg-[#FAFAF8] overflow-hidden">
      {/* Hero Carousel */}
      <section className="relative overflow-hidden w-full h-[clamp(500px,55vw,750px)] min-h-[500px]">
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
            <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-black/40 to-transparent" />
            <div className="relative page-container h-full flex flex-col justify-center items-center text-center py-16 sm:py-24">
              <h2 className="font-serif text-4xl sm:text-6xl font-bold text-white mb-4 drop-shadow-md">{slide.title}</h2>
              <p className="text-white/90 text-lg sm:text-2xl font-light max-w-2xl drop-shadow">{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {heroSlides.length > 1 && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 shadow-md ${idx === currentSlide ? 'bg-gold w-8' : 'bg-white/60 hover:bg-white'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      <div className="py-12 lg:py-20 relative">
        {/* Delicate Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-maroon/5 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="text-center mb-20 relative z-10 px-4">
        <div className="inline-block mb-4">
          <span className="block w-12 h-px bg-gold mx-auto mb-4 opacity-50"></span>
          <h3 className="uppercase tracking-[0.3em] text-maroon font-medium text-xs mb-3">Measurements & Fit</h3>
          <span className="block w-12 h-px bg-gold mx-auto mt-4 opacity-50"></span>
        </div>
        <h1 className="font-serif text-5xl lg:text-7xl font-bold text-gray-900 mb-6 drop-shadow-sm">
          Size & Blouse Guide
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-light">
          Achieve a flawless silhouette. Consult our comprehensive guide to understand drape lengths and bespoke blouse measurements.
        </p>
      </div>

      <div className="max-w-[900px] mx-auto px-4 relative z-10 space-y-12">
        {/* Saree Length Section */}
        <section className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_15px_50px_-10px_rgba(201,162,75,0.1)] transition-all duration-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-maroon border border-maroon/10 shadow-sm group-hover:shadow-[0_0_15px_rgba(201,162,75,0.15)] group-hover:text-gold transition-all duration-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="font-serif text-3xl font-semibold text-gray-900 tracking-wide">Saree Length</h3>
          </div>
          
          <div className="w-full h-px bg-gradient-to-r from-gray-200 to-transparent mb-8"></div>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-light">
            Standard drape length is <span className="font-medium text-maroon">6.3 metres</span> (including an exquisite 0.8m blouse piece where included). Pre-stitched blouse sarees are masterfully crafted with 5.5m of fabric and a ready blouse.
          </p>
        </section>

        {/* Blouse Piece Lengths */}
        <section className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gold/30 hover:shadow-[0_15px_50px_-10px_rgba(201,162,75,0.1)] transition-all duration-700 relative group">
          <div className="p-8 lg:p-12 pb-8">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-maroon border border-maroon/10 shadow-sm group-hover:shadow-[0_0_15px_rgba(201,162,75,0.15)] group-hover:text-gold transition-all duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3 className="font-serif text-3xl font-semibold text-gray-900 tracking-wide">Fabric Provisions</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto px-4 lg:px-12 pb-12">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100">
                  <th className="py-5 px-6 font-serif text-lg text-maroon font-medium uppercase tracking-[0.1em]">Type</th>
                  <th className="py-5 px-6 font-serif text-lg text-maroon font-medium uppercase tracking-[0.1em]">Length</th>
                  <th className="py-5 px-6 font-serif text-lg text-maroon font-medium uppercase tracking-[0.1em]">Ideal For</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 font-light text-lg">
                <tr className="border-b border-gray-50 hover:bg-ivory/50 transition-colors duration-500">
                  <td className="py-6 px-6 font-medium text-gray-900 tracking-wide">Standard Piece</td>
                  <td className="py-6 px-6 text-maroon font-medium tracking-wider">0.8m</td>
                  <td className="py-6 px-6">Sleeveless or short sleeve styling</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-ivory/50 transition-colors duration-500">
                  <td className="py-6 px-6 font-medium text-gray-900 tracking-wide">Full Piece</td>
                  <td className="py-6 px-6 text-maroon font-medium tracking-wider">1.0m</td>
                  <td className="py-6 px-6">Full sleeve with elegant piping</td>
                </tr>
                <tr className="hover:bg-ivory/50 transition-colors duration-500">
                  <td className="py-6 px-6 font-medium text-gray-900 tracking-wide">Stitched (M)</td>
                  <td className="py-6 px-6 text-maroon font-medium tracking-wider">Ready</td>
                  <td className="py-6 px-6">Bust 34–36"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Stitched Blouse Sizes */}
        <section className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-maroon/30 hover:shadow-[0_15px_50px_-10px_rgba(122,12,46,0.15)] transition-all duration-700 relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-maroon/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="p-8 lg:p-12 pb-8 relative z-10">
            <div className="flex items-center gap-5 mb-2">
              <div className="w-14 h-14 rounded-full bg-ivory flex items-center justify-center text-maroon border border-maroon/20 shadow-[0_0_15px_rgba(122,12,46,0.05)] group-hover:shadow-[0_0_20px_rgba(122,12,46,0.15)] transition-all duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="6.5"></line>
                </svg>
              </div>
              <h3 className="font-serif text-3xl font-semibold text-gray-900 tracking-wide">Ready-to-Wear Sizing</h3>
            </div>
          </div>
          
          <div className="overflow-x-auto px-4 lg:px-12 pb-12 relative z-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-5 px-6 font-serif text-lg text-gray-900 font-bold uppercase tracking-[0.1em]">Size</th>
                  <th className="py-5 px-6 font-serif text-lg text-gray-900 font-bold uppercase tracking-[0.1em]">Bust</th>
                  <th className="py-5 px-6 font-serif text-lg text-gray-900 font-bold uppercase tracking-[0.1em]">Waist</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 font-light text-lg">
                <tr className="border-b border-gray-100 hover:bg-maroon/5 transition-colors duration-500">
                  <td className="py-6 px-6 font-semibold text-maroon text-xl">S</td>
                  <td className="py-6 px-6 tracking-wide">32"</td>
                  <td className="py-6 px-6 tracking-wide">28"</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-maroon/5 transition-colors duration-500">
                  <td className="py-6 px-6 font-semibold text-maroon text-xl">M</td>
                  <td className="py-6 px-6 tracking-wide">34–36"</td>
                  <td className="py-6 px-6 tracking-wide">30–32"</td>
                </tr>
                <tr className="border-b border-gray-100 hover:bg-maroon/5 transition-colors duration-500">
                  <td className="py-6 px-6 font-semibold text-maroon text-xl">L</td>
                  <td className="py-6 px-6 tracking-wide">38–40"</td>
                  <td className="py-6 px-6 tracking-wide">34–36"</td>
                </tr>
                <tr className="hover:bg-maroon/5 transition-colors duration-500">
                  <td className="py-6 px-6 font-semibold text-maroon text-xl">XL</td>
                  <td className="py-6 px-6 tracking-wide">42–44"</td>
                  <td className="py-6 px-6 tracking-wide">38–40"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="page-container py-16 text-center animate-fade-in">
      <h1 className="font-serif text-6xl font-bold text-maroon mb-2">404</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}

