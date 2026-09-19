import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { OrderStatusTracker } from '../components/order/OrderStatusTracker';
import { Order } from '../types';
import { STORE_CONFIG } from '../config/store';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { formatPrice } from '../utils/currency';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const res = await api.getOrderById(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Retrieving order details..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Order Placed Successfully!</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          Your order has been recorded. Our staff has started processing your items.
        </p>
        <Link to="/shop" className="px-6 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Top Success Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block">
          Order Received
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          Thank you, {order.customerInfo.fullName}!
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
          We have received your order <strong>{order.orderNumber}</strong>. Our local store associates are
          packing your items for quick delivery.
        </p>

        {/* Live Order Status Progress Tracker */}
        <div className="mt-8 text-left">
          <OrderStatusTracker
            status={order.orderStatus}
            orderNumber={order.orderNumber}
            createdAt={order.createdAt}
            updatedAt={order.updatedAt}
            statusHistory={order.statusHistory}
            variant="full"
          />
        </div>

        {/* Delivery ETA Notice */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60">
          <Clock className="w-4 h-4 text-emerald-700" />
          <span>Estimated arrival: {STORE_CONFIG.delivery.estimatedDeliveryTime}</span>
        </div>

        {/* Order Details Breakdown */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-xs">
          {/* Destination */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Delivery Address</span>
            </h4>
            <p className="font-semibold text-slate-800">{order.customerInfo.fullName}</p>
            <p className="text-slate-600">{order.customerInfo.deliveryAddress}</p>
            <p className="text-slate-600">
              {order.customerInfo.area}, {order.customerInfo.city}
            </p>
            {order.customerInfo.landmark && (
              <p className="text-slate-500 italic">Landmark: {order.customerInfo.landmark}</p>
            )}
            <p className="text-slate-700 font-medium pt-1">Phone: {order.customerInfo.phone}</p>
          </div>

          {/* Payment & Status */}
          <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Payment & Summary</span>
            </h4>
            <p className="text-slate-600">
              Method: <strong>{order.paymentMethod}</strong>
            </p>
            <p className="text-slate-600">
              Payment Status:{' '}
              <strong className={order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-600'}>
                {order.paymentStatus}
              </strong>
            </p>
            <p className="text-slate-600">
              Subtotal: <strong>{formatPrice(order.subtotal)}</strong>
            </p>
            <p className="text-slate-600">
              Delivery Fee: <strong>{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</strong>
            </p>
            {order.discount > 0 && (
              <p className="text-emerald-700">
                Discount: <strong>-{formatPrice(order.discount)}</strong>
              </p>
            )}
            <p className="text-base font-black text-slate-900 pt-1 border-t border-slate-200">
              Grand Total: {formatPrice(order.grandTotal)}
            </p>
          </div>
        </div>

        {/* Ordered items */}
        <div className="mt-8 text-left border-t border-slate-100 pt-6">
          <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">
            Items in this order ({order.items.length})
          </h4>
          <div className="divide-y divide-slate-100">
            {order.items.map(item => (
              <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                  />
                  <div>
                    <span className="font-bold text-slate-800 block">{item.name}</span>
                    <span className="text-slate-400">
                      {item.quantity} × {formatPrice(item.price)} ({item.unit})
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-slate-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/account?tab=orders"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View All My Orders</span>
          </Link>

          <a
            href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I just placed order ${order.orderNumber}. Could you please confirm dispatch?`)}`}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Confirmation</span>
          </a>

          <Link
            to="/shop"
            className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
