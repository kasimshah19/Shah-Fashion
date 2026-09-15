import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { SearchBar } from './SearchBar';

export function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Silk Sarees', href: '/shop/silk-sarees' },
    { label: 'Cotton Sarees', href: '/shop/cotton-sarees' },
    { label: 'Wedding', href: '/shop/wedding' },
    { label: 'Blouse Pieces', href: '/shop/blouse-pieces' },
    { label: 'Sale', href: '/shop/sale' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="page-container">
        {/* Top bar */}
        <div className="flex items-center gap-3 h-14 sm:h-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="shrink-0 flex items-center gap-2.5">
            <img src="/favicon.png" alt="Shah Fashion" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-sm" />
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-brand tracking-tight leading-none">
              Shah Fashion
            </h1>
          </Link>

          <div className="hidden md:block flex-1 mx-6">
            <SearchBar />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Search size={22} />
            </button>

            <Link to="/wishlist" className="hidden sm:flex relative p-2 min-w-[44px] min-h-[44px] items-center justify-center">
              <Heart size={22} className="text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
              <ShoppingBag size={22} className="text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-brand text-white text-[10px] font-bold min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className="hidden sm:flex p-2 min-w-[44px] min-h-[44px] items-center justify-center"
            >
              <User size={22} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="md:hidden pb-3 animate-fade-in">
            <SearchBar expanded onClose={() => setSearchOpen(false)} />
          </div>
        )}

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 h-10 border-t border-gray-50 -mt-px">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm font-medium text-gray-600 hover:text-brand transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/shop/new-arrivals" className="text-sm font-medium text-brand hover:text-maroon transition-colors py-2">
            New Arrivals
          </Link>
        </nav>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="page-container py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 text-ivory font-medium text-gray-700 hover:text-brand min-h-[44px]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/shop/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-3 text-ivory font-medium text-gold-dark min-h-[44px]"
            >
              New Arrivals
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
