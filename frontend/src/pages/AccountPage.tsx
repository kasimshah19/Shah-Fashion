import { useState } from 'react';
import { Link, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/format';
import type { OrderStatus } from '../types';

const STATUS_STEPS: OrderStatus[] = ['Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

function AccountHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { icon: Package, label: 'My Orders', href: '/account/orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: MapPin, label: 'Saved Addresses', href: '/account/addresses' },
    { icon: User, label: 'Edit Profile', href: '/account/profile' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="card p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center">
            <User size={28} className="text-maroon" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-sm text-gray-500">{user?.phone}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {links.map(({ icon: Icon, label, href }) => (
          <Link key={href} to={href} className="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow min-h-[56px]">
            <Icon size={20} className="text-maroon" />
            <span className="flex-1 font-medium">{label}</span>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        ))}
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="card p-4 flex items-center gap-3 w-full text-left hover:shadow-md transition-shadow min-h-[56px] text-red-600"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

function OrdersPage() {
  const { orders } = useAuth();

  if (!orders.length) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Package size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No orders yet</p>
        <Link to="/shop/sarees" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="font-serif text-xl font-semibold text-maroon">My Orders</h2>
      {orders.map((order) => (
        <div key={order.id} className="card p-4">
          <div className="flex justify-between mb-3">
            <div>
              <p className="font-semibold text-sm">{order.id}</p>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <span className="text-sm font-medium text-maroon">{formatPrice(order.total)}</span>
          </div>

          {/* Status tracker */}
          <div className="flex items-center gap-1 mb-3 overflow-x-auto scrollbar-hide">
            {STATUS_STEPS.map((step, i) => {
              const currentIdx = STATUS_STEPS.indexOf(order.status);
              const done = i <= currentIdx;
              return (
                <div key={step} className="flex items-center shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${done ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && <div className={`w-4 h-0.5 ${done ? 'bg-maroon' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mb-3">Status: <strong>{order.status}</strong></p>

          <div className="flex gap-2 overflow-x-auto">
            {order.items.map((item) => (
              <img key={item.productId} src={item.image} alt="" className="w-12 h-16 object-cover rounded shrink-0" />
            ))}
          </div>

          <button className="flex items-center gap-1 text-sm text-maroon mt-3 hover:underline">
            <Download size={14} /> Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
}

function AddressesPage() {
  const { user, addAddress, deleteAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', pincode: '', addressLine1: '', city: '', state: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(form);
    setShowForm(false);
    setForm({ name: '', phone: '', pincode: '', addressLine1: '', city: '', state: '' });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl font-semibold text-maroon">Saved Addresses</h2>
        <button onClick={() => setShowForm(!showForm)} className="text-sm text-maroon font-medium">+ Add New</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card p-4 mb-4 space-y-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input-field text-sm" />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="input-field text-sm" />
          <input placeholder="Pincode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required className="input-field text-sm" />
          <input placeholder="Address" value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} required className="input-field text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required className="input-field text-sm" />
            <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="input-field text-sm" />
          </div>
          <button type="submit" className="btn-primary w-full text-sm">Save Address</button>
        </form>
      )}

      {!user?.addresses.length ? (
        <p className="text-gray-500 text-sm">No saved addresses yet.</p>
      ) : (
        <div className="space-y-3">
          {user.addresses.map((addr) => (
            <div key={addr.id} className="card p-4">
              <p className="font-medium">{addr.name}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
              <p className="text-sm mt-1">{addr.addressLine1}, {addr.city} — {addr.pincode}</p>
              <button onClick={() => deleteAddress(addr.id)} className="text-xs text-red-500 mt-2 hover:underline">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="font-serif text-xl font-semibold text-maroon mb-4">Edit Profile</h2>
      <form onSubmit={handleSave} className="card p-4 space-y-4">
        <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
        <button type="submit" className="btn-primary w-full">{saved ? 'Saved!' : 'Save Changes'}</button>
      </form>
    </div>
  );
}

export function AccountPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="page-container py-6 pb-24 lg:pb-8">
      <Routes>
        <Route index element={<AccountHome />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}
