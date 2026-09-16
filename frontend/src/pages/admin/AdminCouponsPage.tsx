import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { Search, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { Coupon } from '../../types';

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percent',
    discount_value: 0,
    min_order_value: 0,
    valid_from: new Date().toISOString().slice(0, 10),
    valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').order('valid_from', { ascending: false });
    if (error) {
      console.error('Error fetching coupons:', error);
    } else {
      setCoupons(data || []);
    }
    setLoading(false);
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase.from('coupons').update({ active: !currentStatus }).eq('id', id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('Update blocked by RLS or coupon not found');
      setCoupons(coupons.map(c => c.id === id ? { ...c, active: !currentStatus } : c));
    } catch (err: any) {
      console.error('Error toggling coupon status:', err);
      alert(`Failed to update coupon status: ${err.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting coupon:', err);
      alert('Failed to delete coupon');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        const { data, error } = await supabase.from('coupons').update(formData).eq('id', editingCoupon.id).select();
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Update blocked by RLS');
      } else {
        const { data, error } = await supabase.from('coupons').insert([formData]).select();
        if (error) throw error;
        if (!data || data.length === 0) throw new Error('Insert blocked by RLS');
      }
      setShowModal(false);
      fetchCoupons();
    } catch (err: any) {
      console.error('Error saving coupon:', err);
      alert(`Failed to save coupon: ${err.message || 'Unknown error'}`);
    }
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_order_value: coupon.min_order_value,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().slice(0, 10) : '',
        valid_to: coupon.valid_to ? new Date(coupon.valid_to).toISOString().slice(0, 10) : '',
        active: coupon.active
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discount_type: 'percent',
        discount_value: 0,
        min_order_value: 0,
        valid_from: new Date().toISOString().slice(0, 10),
        valid_to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        active: true
      });
    }
    setShowModal(true);
  };

  const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
        <button onClick={() => openModal()} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search coupons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col divide-y divide-gray-100">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading coupons...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No coupons found.</div>
          ) : (
            filtered.map((coupon) => (
              <div key={coupon.id} className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900 text-lg mb-1">{coupon.code}</p>
                    <p className="font-medium text-maroon">
                      {coupon.discount_type === 'percent' ? `${coupon.discount_value}% OFF` : `${formatPrice(coupon.discount_value)} OFF`}
                    </p>
                  </div>
                  <button 
                    onClick={() => toggleActive(coupon.id, coupon.active)}
                    className={`px-3 py-1 min-h-[32px] rounded-full text-xs font-medium flex items-center gap-1 ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {coupon.active ? <><Check size={12}/> Active</> : <><X size={12}/> Inactive</>}
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg space-y-1">
                  <p>Min Order: {formatPrice(coupon.min_order_value)}</p>
                  <p>Valid: {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_to).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <button onClick={() => openModal(coupon)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(coupon.id)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Discount</th>
                <th className="px-6 py-4">Min Order</th>
                <th className="px-6 py-4">Valid Period</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading coupons...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No coupons found.</td>
                </tr>
              ) : (
                filtered.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{coupon.code}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : formatPrice(coupon.discount_value)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{formatPrice(coupon.min_order_value)}</td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {new Date(coupon.valid_from).toLocaleDateString()} - {new Date(coupon.valid_to).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleActive(coupon.id, coupon.active)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        {coupon.active ? <><Check size={12}/> Active</> : <><X size={12}/> Inactive</>}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(coupon)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-2">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-serif text-gray-900">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon uppercase"
                  placeholder="e.g. FESTIVE20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select 
                    value={formData.discount_type} 
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value as any})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    value={formData.discount_value} 
                    onChange={(e) => setFormData({...formData, discount_value: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Value (₹)</label>
                <input 
                  type="number" 
                  required 
                  min="0"
                  value={formData.min_order_value} 
                  onChange={(e) => setFormData({...formData, min_order_value: Number(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.valid_from} 
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.valid_to} 
                    onChange={(e) => setFormData({...formData, valid_to: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  className="w-4 h-4 text-maroon focus:ring-maroon border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
