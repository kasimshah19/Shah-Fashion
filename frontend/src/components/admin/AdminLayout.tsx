import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PackageSearch, Tag, MessageSquare, LogOut, Home } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useEffect, useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: PackageSearch, label: 'Products', path: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Home, label: 'Homepage Content', path: '/admin/homepage' },
  { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
  { icon: MessageSquare, label: 'Reviews', path: '/admin/reviews' },
];

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAdminEmail(user.email ?? null);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-maroon">Shah Fashion</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
          <button className="lg:hidden p-2 -mr-2 text-gray-500" onClick={() => setIsSidebarOpen(false)}>
            &times;
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-maroon/10 text-maroon' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-maroon' : 'text-gray-400'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 mb-2">
            Storefront
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 w-full">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between lg:justify-end px-4 sm:px-8 sticky top-0 z-10">
          <button className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-gray-600" onClick={() => setIsSidebarOpen(true)}>
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current mb-1.5" />
            <div className="w-6 h-0.5 bg-current" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-maroon/10 flex items-center justify-center text-maroon font-semibold uppercase shrink-0">
              {adminEmail ? adminEmail.charAt(0) : 'A'}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">{adminEmail || 'Admin User'}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-8 max-w-7xl mx-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
