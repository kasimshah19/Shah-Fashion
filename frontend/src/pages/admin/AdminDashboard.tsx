import { useEffect, useState } from 'react';
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { formatPrice } from '../../utils/format';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { data: orders } = await supabase.from('orders').select('total');
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer');

        const totalRev = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        setStats({
          totalProducts: productCount || 0,
          totalOrders: orderCount || 0,
          totalRevenue: totalRev,
          activeUsers: userCount || 0,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Customers', value: stats.activeUsers.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 font-medium truncate">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500">More detailed charts and recent orders will appear here.</p>
      </div>
    </div>
  );
}
