import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-bottle text-white mt-auto pb-20 lg:pb-0">
      <div className="page-container py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/favicon.png" alt="SF" className="w-10 h-10 rounded-xl" />
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand tracking-tight leading-none">
                Shah Fashion
              </h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Premium Indian sarees and blouse pieces. Authentic handloom & silk, delivered across India.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/919876543210" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/shop/silk-sarees" className="hover:text-white transition-colors">Silk Sarees</Link></li>
              <li><Link to="/shop/cotton-sarees" className="hover:text-white transition-colors">Cotton Sarees</Link></li>
              <li><Link to="/shop/wedding" className="hover:text-white transition-colors">Wedding Collection</Link></li>
              <li><Link to="/shop/blouse-pieces" className="hover:text-white transition-colors">Blouse Pieces</Link></li>
              <li><Link to="/shop/sale" className="hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Help</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition-colors">Size & Blouse Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-3 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About Shah Fashion</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Store Locator</Link></li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {['UPI', 'Visa', 'MC', 'COD'].map((m) => (
                <span key={m} className="text-xs bg-white/10 px-2 py-1 rounded">{m}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Shah Fashion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
