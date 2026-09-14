import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { cn } from '../../utils/format';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: LayoutGrid, label: 'Categories', href: '/shop/sarees' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: ShoppingBag, label: 'Cart', href: '/cart' },
  { icon: User, label: 'Account', href: '/account' },
];

export function MobileNav() {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
          const badge = href === '/cart' ? cartCount : href === '/wishlist' ? wishlistCount : 0;

          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 min-w-[64px] min-h-[44px] relative transition-colors',
                active ? 'text-brand' : 'text-gray-500'
              )}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
              {badge > 0 && (
                <span className="absolute top-0 right-2 bg-brand text-white text-[9px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-0.5">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
