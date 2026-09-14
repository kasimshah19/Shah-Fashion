import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { formatPrice, formatDate } from '../utils/format';
import type { Order } from '../types';

export function OrderConfirmationPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const order = (location.state as { order?: Order })?.order;

  if (!order) {
    return (
      <div className="page-container py-16 text-center animate-fade-in">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-semibold text-maroon mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">Order ID: {orderId}</p>
        <Link to="/" className="btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8 pb-24 lg:pb-8 animate-fade-in">
      <div className="max-w-lg mx-auto text-center">
        <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-maroon mb-2">Thank You!</h1>
        <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>

        <div className="card p-6 text-left mb-6">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="font-semibold text-maroon">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 pt-4">
            {order.items.map((item) => (
              <div key={item.productId} className="flex gap-3 text-sm">
                <img src={item.image} alt="" className="w-10 h-14 object-cover rounded" />
                <div className="flex-1">
                  <p className="line-clamp-1">{item.name}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 mt-3 text-sm space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Total Paid</span>
              <span className="text-maroon">{formatPrice(order.total)}</span>
            </div>
            <p className="text-gray-500">Payment: {order.paymentMethod}</p>
            <p className="text-gray-500">Delivery: {order.deliverySlot}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/account/orders" className="btn-primary">Track Order</Link>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
