import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Star } from 'lucide-react';
import { useAnimatedNumber } from '../hooks/useScrollReveal';
import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';

function AnimatedSection({ children, className = '', slideDirection = 'up', delay = 0, isHero = false }: { children: React.ReactNode, className?: string, slideDirection?: 'up' | 'left' | 'right', delay?: number, isHero?: boolean }) {
  let initial = { opacity: 0, y: 30, x: 0 };
  if (slideDirection === 'left') initial = { opacity: 0, y: 0, x: -30 };
  if (slideDirection === 'right') initial = { opacity: 0, y: 0, x: 30 };
  
  if (isHero) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StoryPhoto({ src, alt, grade = 'vintage' }: { src: string, alt: string, grade?: 'vintage' | 'modern' | 'bright' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, rotate: -3 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="group relative w-full max-w-[280px] md:max-w-[420px] mx-auto"
    >
      <div className="bg-white p-1.5 md:p-2.5 rounded-[20px] shadow-[0_12px_40px_rgba(128,0,0,0.12)] motion-safe:transition-all duration-[250ms] ease-out group-hover:scale-[1.03] group-hover:shadow-[0_16px_50px_rgba(128,0,0,0.18)]">
        <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden border-[1.5px] border-[#C9A24B]/80 motion-safe:transition-colors duration-[250ms] group-hover:border-[#C9A24B]">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover object-center motion-safe:transition-transform duration-[2000ms] ease-out"
          />
          {grade === 'vintage' && (
            <>
              <div className="absolute inset-0 bg-[#8b5a2b]/20 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-900/30 to-transparent mix-blend-overlay pointer-events-none" />
            </>
          )}
          {grade === 'modern' && (
            <>
              <div className="absolute inset-0 bg-maroon/10 mix-blend-color pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-maroon/10 to-[#fcd9df]/10 mix-blend-overlay pointer-events-none" />
            </>
          )}
          {grade === 'bright' && (
            <>
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, suffix = '' }: { label: string, value: number, suffix?: string }) {
  const { ref, value: animatedValue } = useAnimatedNumber(value);
  
  return (
    <motion.div variants={staggerItemVariants} ref={ref} className="group text-center">
      <p className="inline-block font-serif text-4xl sm:text-5xl font-bold text-maroon mb-2 motion-safe:transition-all duration-200 ease-out group-hover:scale-110 group-hover:text-[#5a0000]">
        {animatedValue}{suffix}
      </p>
      <p className="text-gray-600 font-medium uppercase tracking-wider text-sm">{label}</p>
    </motion.div>
  );
}

const HERO_IMAGES = [
  '/images/hero/hero-wedding-1.jpg',
  '/images/hero/hero-wedding-2.jpg',
  '/images/hero/hero-wedding-3.jpg',
  '/images/hero/hero-wedding-4.jpg',
  '/images/hero/hero-wedding-5.jpg',
  '/images/hero/hero-wedding-6.jpg',
];

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden bg-ivory-dark"
    >
      {HERO_IMAGES.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={img} 
            alt="Saree Texture" 
            className="w-full h-full object-cover"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#4a0d20]/70 via-[#4a0d20]/40 to-transparent" />
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FounderQuoteSection() {
  return (
    <section className="py-32 md:py-48 relative overflow-hidden bg-gradient-to-b from-[#fcd9df]/40 via-[#fcfbf9] to-[#fcfbf9]">
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ show: { transition: { staggerChildren: 0.2 } } }}
        className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center"
      >
        <motion.span 
          variants={staggerItemVariants}
          className="absolute -top-12 md:-top-20 left-1/2 -translate-x-1/2 text-8xl md:text-[12rem] text-[#C9A24B] font-serif leading-none opacity-30 pointer-events-none"
        >
          "
        </motion.span>

        <motion.p 
          variants={staggerItemVariants}
          className="font-serif text-[1.75rem] md:text-5xl italic text-gray-900 leading-[1.5] md:leading-[1.6] relative z-10"
        >
          To only sell what he'd proudly see draped on his own family.
        </motion.p>

        <motion.div 
          variants={staggerItemVariants}
          className="mt-12 md:mt-16 mb-6 flex items-center justify-center gap-3"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]"></div>
          <div className="w-16 md:w-24 h-[1px] bg-[#C9A24B]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#C9A24B]"></div>
        </motion.div>

        <motion.p 
          variants={staggerItemVariants}
          className="text-sm md:text-ivory uppercase tracking-[0.2em] text-maroon font-medium"
        >
          — The Shah Family Promise
        </motion.p>
      </motion.div>
    </section>
  );
}

export function AboutPage() {
  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative px-4 sm:px-6 lg:px-8 overflow-hidden group min-h-[450px] sm:min-h-[600px] md:min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center py-20">
        <HeroCarousel />
        
        <AnimatedSection isHero className="max-w-4xl mx-auto text-center relative z-10 mt-10">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-md">Our Story</h1>
          <p className="text-xl md:text-2xl text-white/90 font-serif italic drop-shadow-sm">Three generations. One family. One promise.</p>
        </AnimatedSection>
      </section>

      <section className="py-28 overflow-hidden bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32 md:space-y-40">
          
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <AnimatedSection slideDirection="left" className="md:w-1/2 order-2 md:order-1 relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-maroon mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  Shah Fashion didn't begin with a business plan. It began with a small shop
                  in Dondaicha, back in 1990, when <strong className="text-maroon font-semibold">Hamid Shah Gafur Shah Fakir</strong> decided to build
                  something that would outlast him — a business rooted in the timeless craft
                  of the saree.
                </p>
                <p>
                  For over three decades now, that same idea has stayed at the heart of
                  everything we do: a saree isn't just fabric. It's a piece of tradition,
                  passed from one generation to the next — in the way it's woven, and in the
                  way it's sold.
                </p>
              </div>
            </AnimatedSection>
            <div className="md:w-1/2 w-full order-1 md:order-2 flex justify-center items-center mb-8 md:mb-0">
              <StoryPhoto 
                src="/about-story/story_1_v3.jpg" 
                alt="Vintage sari shop interior with wooden shelves"
                grade="vintage"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="md:w-1/2 w-full order-1 md:order-1 flex justify-center items-center mb-8 md:mb-0">
              <StoryPhoto 
                src="/about-story/story_2_v3.jpg" 
                alt="Modern well-organized saree store interior"
                grade="modern"
              />
            </div>
            <AnimatedSection slideDirection="right" className="md:w-1/2 order-2 md:order-2 relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-maroon mb-6">A Family Legacy</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  When <strong className="text-maroon font-semibold">Hamid Shah Gafur Shah Fakir</strong>'s son, <strong className="text-maroon font-semibold">Salim Shah Hamid Shah Fakir</strong>, took over the
                  shop, he didn't just inherit a business. He inherited a promise: to only
                  sell what he'd proudly see draped on his own family.
                </p>
                <p>
                  That promise still guides every saree we choose today. From hand-picked
                  Banarasi and Kanjeevaram silks to everyday cottons for the women who wear
                  them without a second thought, every piece at Shah Fashion carries an eye
                  for quality that took three generations to build — and can't be rushed.
                </p>
              </div>
            </AnimatedSection>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <AnimatedSection slideDirection="left" className="md:w-1/2 order-2 md:order-1 relative z-10">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-maroon mb-6">From Dondaicha, to Everywhere</h2>
              <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                <p>
                  What started as one shop in Dondaicha now reaches customers far beyond it.
                  The counter has changed, the way people shop has changed — but the family
                  running it, and the care that goes into every saree, hasn't.
                </p>
              </div>
            </AnimatedSection>
            <div className="md:w-1/2 w-full order-1 md:order-2 flex justify-center items-center mb-8 md:mb-0">
              <StoryPhoto 
                src="/about-story/story_3_v3.jpg" 
                alt="Gift wrapped fashion package ready for shipping"
                grade="bright"
              />
            </div>
          </div>

        </div>
      </section>

      <FounderQuoteSection />

      <section className="py-28 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <h2 className="text-center font-serif text-3xl md:text-5xl font-semibold text-maroon mb-16 md:mb-24">Our Journey</h2>
          </AnimatedSection>
          
          <HorizontalTimeline />
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-maroon/5 to-[#fcfbf9]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8"
          >
            <StatCard label="Founded" value={1990} />
            <StatCard label="Years of Legacy" value={35} suffix="+" />
            <StatCard label="Generations" value={2} />
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-[#fcfbf9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AnimatedSection className="text-center mb-20">
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-maroon mb-6">Our Values</h2>
          </AnimatedSection>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ValueCard 
              icon={<Star size={36} />} 
              title="Authenticity" 
              desc="True to our roots, true to our craft." 
            />
            <ValueCard 
              icon={<ShieldCheck size={36} />} 
              title="Trust" 
              desc="Built carefully over three decades." 
            />
            <ValueCard 
              icon={<Heart size={36} />} 
              title="Craftsmanship" 
              desc="An eye for quality that cannot be rushed." 
            />
            <ValueCard 
              icon={<Users size={36} />} 
              title="Family" 
              desc="Passed from one generation to the next." 
            />
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-maroon text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <AnimatedSection className="relative z-10">
          <h2 className="font-serif text-4xl md:text-6xl font-semibold mb-10 drop-shadow-sm">Continue the tradition.</h2>
          <Link to="/shop/all" className="inline-block bg-white text-maroon font-semibold px-10 py-5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-gray-50 motion-safe:transition-all duration-300">
            Shop the Collection
          </Link>
        </AnimatedSection>
      </section>

    </div>
  );
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

function HorizontalTimeline() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ show: { transition: { staggerChildren: 0.15 } } }}
      className="relative mt-8 md:mt-12 mb-12"
    >
      <div className="hidden md:block absolute top-[31px] left-[15%] right-[15%] h-[2px] bg-maroon/20 z-0">
        <motion.div 
          variants={{
            hidden: { width: "0%" },
            show: { width: "100%", transition: { duration: 1, ease: "easeOut" } }
          }}
          className="h-full bg-maroon" 
        />
      </div>

      <div className="md:hidden absolute top-4 bottom-4 left-[31px] w-[2px] bg-maroon/20 z-0">
        <motion.div 
          variants={{
            hidden: { height: "0%" },
            show: { height: "100%", transition: { duration: 1, ease: "easeOut" } }
          }}
          className="w-full bg-maroon" 
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-16 md:gap-4 relative z-10">
        <TimelineItem 
          year="1990"
          title="The Beginning" 
          text="Hamid Shah Gafur Shah opens the first shop in Dondaicha." 
        />
        <TimelineItem 
          year="1996"
          title="Second Generation" 
          text="Salim Shah Hamid Shah takes over, inheriting not just the business but the promise behind it." 
        />
        <TimelineItem 
          year="2026"
          title="Today" 
          text="Shah Fashion continues as a family business, now reaching customers beyond Dondaicha online." 
        />
      </div>
    </motion.div>
  );
}

function TimelineItem({ year, title, text }: { year: string, title: string, text: string }) {
  return (
    <motion.div variants={staggerItemVariants} className="group relative flex md:flex-col items-start md:items-center w-full md:w-1/3 motion-safe:transition-transform duration-300 ease-out hover:-translate-y-0.5">
      <div className="shrink-0 w-16 h-16 rounded-full bg-ivory border-[3px] border-maroon flex items-center justify-center relative md:mb-6 z-10 shadow-sm motion-safe:transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(128,0,0,0.3)] group-hover:border-maroon/80">
        <span className="font-serif font-bold text-maroon text-lg md:text-xl tracking-wider">{year}</span>
      </div>
      <div className="pl-6 md:pl-0 text-left md:text-center mt-3 md:mt-0 w-full max-w-xs mx-auto">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 motion-safe:transition-colors duration-300 group-hover:text-maroon">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div variants={staggerItemVariants} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] text-center motion-safe:transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgb(128,0,0,0.08)] group">
      <div className="inline-flex justify-center motion-safe:transition-colors duration-300 text-gray-800 group-hover:text-maroon mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
