import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';
import { initiatePayment } from '../utils/payment';
import type { Address, PaymentMethod, OrderItem } from '../types';
import { supabase } from '../utils/supabase';

const STEPS = ['Address', 'Delivery', 'Payment', 'Review'];
const SHIPPING_COST = 99;
const SHIPPING_THRESHOLD = 1999;

const DELIVERY_SLOTS = [
  'Standard (3-5 days)',
  'Express (1-2 days) — ₹149',
  'Scheduled Delivery',
];

const PAYMENT_METHODS: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: 'UPI', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'Card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'Net Banking', label: 'Net Banking', desc: 'All major banks' },
  { id: 'Wallet', label: 'Wallets', desc: 'Paytm, Amazon Pay' },
  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when you receive' },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const { activeItems, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated, addAddress, addOrder } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<string | 'new'>('new');
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [placing, setPlacing] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    id: '',
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    async function loadProducts() {
      if (activeItems.length === 0) {
        return;
      }
      const { data } = await supabase
        .from('products')
        .select(`*, product_images(image_url)`)
        .in('id', activeItems.map(i => i.productId));
        
      if (data) {
        setProducts(data.map(p => ({
          ...p,
          price: p.mrp,
          discountedPrice: p.discounted_price,
          images: p.product_images?.length ? p.product_images.map((img: any) => img.image_url) : ['https://images.unsplash.com/photo-1610189014167-3367123f1ce0?auto=format&fit=crop&q=80']
        })));
      }
    }
    loadProducts();
  }, [activeItems]);

  const { subtotal, discount, couponDiscount, total } = getCartTotal(products);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const expressExtra = deliverySlot.includes('Express') ? 149 : 0;
  const grandTotal = total + shipping + expressExtra;

  if (activeItems.length === 0) {
    return (
      <div className="page-container py-16 text-center">
        <h1 className="font-serif text-2xl text-maroon mb-4">Nothing to checkout</h1>
        <Link to="/cart" className="btn-primary">Go to Cart</Link>
      </div>
    );
  }

  const getAddress = (): Address => {
    if (selectedAddress !== 'new' && user) {
      return user.addresses.find((a) => a.id === selectedAddress)!;
    }
    return { ...newAddress, id: 'temp' };
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    const address = getAddress();
    if (selectedAddress === 'new') addAddress(newAddress);

    const orderId = `SF${Date.now()}`;
    const paymentResult = paymentMethod !== 'COD'
      ? await initiatePayment({ orderId, amount: grandTotal, method: paymentMethod })
      : { success: true, paymentId: 'cod' };

    if (!paymentResult.success) {
      setPlacing(false);
      return;
    }

    const order = {
      id: orderId,
      userId: user?.id || 'guest',
      items: activeItems.map((item) => {
        const p = products.find((pr) => pr.id === item.productId);
        return p ? { productId: p.id, name: p.name, quantity: item.quantity, price: p.discountedPrice, image: p.images?.[0] } : null;
      }).filter(Boolean) as OrderItem[],
      address,
      paymentMethod,
      deliverySlot,
      subtotal,
      discount,
      couponDiscount,
      shipping: shipping + expressExtra,
      total: grandTotal,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    navigate(`/order-confirmation/${orderId}`, { state: { order } });
  };

  return (
    <div className="page-container py-6 pb-24 lg:pb-8 animate-fade-in">
      <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon mb-6">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-1 sm:gap-2 mb-8 overflow-x-auto scrollbar-hide">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1 sm:gap-2 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-maroon text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-xs sm:text-sm hidden sm:inline ${i <= step ? 'text-maroon font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`w-6 sm:w-10 h-0.5 ${i < step ? 'bg-maroon' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Step 0: Address */}
          {step === 0 && (
            <div className="card p-4 sm:p-6 animate-fade-in">
              <h2 className="font-medium text-lg mb-4">Delivery Address</h2>
              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mb-4">
                  <Link to="/login" className="text-brand hover:underline">Login</Link>
                  {' '}or{' '}
                  <Link to="/signup" className="text-brand hover:underline">Sign Up</Link>
                  {' '}to use saved addresses, or continue as guest.
                </p>
              )}
              {user && user.addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  {user.addresses.map((addr) => (
                    <label key={addr.id} className={`flex items-start gap-2 p-3 border rounded-lg cursor-pointer ${selectedAddress === addr.id ? 'border-maroon bg-maroon/5' : 'border-gray-200'}`}>
                      <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="accent-maroon mt-0.5 shrink-0" />
                      <div className="text-sm min-w-0">
                        <strong>{addr.name}</strong> · {addr.phone}<br />
                        <span className="text-gray-600 block mt-1">{addr.addressLine1}, {addr.city} — {addr.pincode}</span>
                      </div>
                    </label>
                  ))}
                  <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${selectedAddress === 'new' ? 'border-maroon bg-maroon/5' : 'border-gray-200'}`}>
                    <input type="radio" name="address" checked={selectedAddress === 'new'} onChange={() => setSelectedAddress('new')} className="accent-maroon shrink-0" />
                    <span className="text-sm font-medium">Add new address</span>
                  </label>
                </div>
              )}
              {(selectedAddress === 'new' || !user?.addresses.length) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input placeholder="Full Name" value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} className="input-field text-sm" />
                  <input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="input-field text-sm" />
                  <input placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} className="input-field text-sm" />
                  <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="input-field text-sm" />
                  <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="input-field text-sm" />
                  <input placeholder="Address Line 1" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} className="input-field text-sm sm:col-span-2" />
                  <input placeholder="Address Line 2 (optional)" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} className="input-field text-sm sm:col-span-2" />
                </div>
              )}
              <button onClick={() => setStep(1)} className="btn-primary mt-6">Continue to Delivery</button>
            </div>
          )}

          {/* Step 1: Delivery */}
          {step === 1 && (
            <div className="card p-4 sm:p-6 animate-fade-in">
              <h2 className="font-medium text-lg mb-4">Delivery Option</h2>
              <div className="space-y-2">
                {DELIVERY_SLOTS.map((slot) => (
                  <label key={slot} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${deliverySlot === slot ? 'border-maroon bg-maroon/5' : 'border-gray-200'}`}>
                    <input type="radio" name="delivery" checked={deliverySlot === slot} onChange={() => setDeliverySlot(slot)} className="accent-maroon shrink-0" />
                    <span className="text-sm min-w-0">{slot}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(0)} className="btn-secondary">Back</button>
                <button onClick={() => setStep(2)} className="btn-primary">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="card p-4 sm:p-6 animate-fade-in">
              <h2 className="font-medium text-lg mb-4">Payment Method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label key={pm.id} className={`flex items-start p-3 border rounded-lg cursor-pointer ${paymentMethod === pm.id ? 'border-maroon bg-maroon/5' : 'border-gray-200'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-maroon mt-0.5 mr-3 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{pm.label}</div>
                      <div className="text-xs text-gray-500">{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="card p-4 sm:p-6 animate-fade-in">
              <h2 className="font-medium text-lg mb-4">Review Your Order</h2>
              <div className="space-y-3 mb-4">
                {activeItems.map((item) => {
                  const p = products.find((pr) => pr.id === item.productId);
                  if (!p) return null;
                  return (
                    <div key={item.productId} className="flex gap-3 text-sm">
                      <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1610189014167-3367123f1ce0?auto=format&fit=crop&q=80'} alt="" className="w-12 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{p.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">{formatPrice(p.discountedPrice * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-sm space-y-1 border-t border-gray-100 pt-3">
                <p className="break-words"><strong>Deliver to:</strong> {getAddress().name}, {getAddress().addressLine1}, {getAddress().city} — {getAddress().pincode}</p>
                <p><strong>Delivery:</strong> {deliverySlot}</p>
                <p><strong>Payment:</strong> {paymentMethod}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(2)} className="btn-secondary">Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary flex-1">
                  {placing ? 'Placing Order...' : `Place Order · ${formatPrice(grandTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="card p-4 sm:p-6 h-fit sticky top-24">
          <h2 className="font-serif text-lg font-semibold mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
            {couponDiscount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-{formatPrice(couponDiscount)}</span></div>}
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            {expressExtra > 0 && <div className="flex justify-between"><span className="text-gray-500">Express</span><span>{formatPrice(expressExtra)}</span></div>}
            <div className="border-t pt-2 flex justify-between font-semibold"><span>Total</span><span className="text-maroon">{formatPrice(grandTotal)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
