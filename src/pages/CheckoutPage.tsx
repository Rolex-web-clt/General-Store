import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Banknote,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { STORE_CONFIG } from '../config/store';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { formatPrice } from '../utils/currency';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, deliveryFee, discount, grandTotal, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.addresses?.[0]?.street || ''
  );
  const [city, setCity] = useState(user?.addresses?.[0]?.city || STORE_CONFIG.address.city);
  const [area, setArea] = useState(
    user?.addresses?.[0]?.area || STORE_CONFIG.delivery.deliveryAreas[0]
  );
  const [landmark, setLandmark] = useState(user?.addresses?.[0]?.landmark || '');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online Payment'>('Cash on Delivery');
  const [onlineProvider, setOnlineProvider] = useState<'eSewa' | 'Khalti' | 'Cards'>('eSewa');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-xl font-bold text-sm"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !deliveryAddress.trim() || !city.trim() || !area.trim()) {
      setError('Please fill in all required delivery details marked with (*).');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerInfo: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || 'guest@generalstore.com',
          deliveryAddress: deliveryAddress.trim(),
          city: city.trim(),
          area: area.trim(),
          landmark: landmark.trim() || undefined,
          notes: notes.trim() || undefined,
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.discountPrice || item.product.price,
          quantity: item.quantity,
          unit: item.product.unit,
          image: item.product.images[0],
        })),
        subtotal,
        deliveryFee,
        discount,
        appliedCoupon: appliedCoupon?.code || undefined,
        grandTotal,
        paymentMethod: paymentMethod === 'Online Payment' ? onlineProvider : 'Cash on Delivery',
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid', // simulates instant approval for online demo
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        clearCart();
        navigate(`/order-success/${res.order.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to place your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link to="/cart" className="hover:text-emerald-700">Shopping Cart</Link>
        <ChevronRight className="w-3 h-3 text-slate-300" />
        <span className="text-slate-800 font-bold">Checkout & Delivery</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Checkout & Delivery</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Provide your local address for swift neighborhood doorstep dispatch
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Delivery Details & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {/* Customer & Address Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <span>1. Delivery Destination</span>
              </h2>
              {user && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Logged in as {user.name}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Recipient Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Karki"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Phone Number (For Delivery Call) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 9841234567"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Email (For Order Updates)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Street Address / House or Apartment Number *
                </label>
                <textarea
                  rows={2}
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Flat 3B, Sunshine Apartments, Main Road"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Neighborhood / Delivery Area *
                </label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white font-medium cursor-pointer"
                >
                  {STORE_CONFIG.delivery.deliveryAreas.map(a => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                  <option value="Other Neighborhood">Other Neighborhood Area</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={e => setLandmark(e.target.value)}
                  placeholder="e.g. Near Community Health Center, Opposite Grocery Market"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Special Delivery Notes / Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Please call upon arrival, do not ring doorbell"
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Banknote className="w-5 h-5 text-emerald-700" />
              <span>2. Choose Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cash on Delivery Option */}
              <label
                className={`p-5 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Cash on Delivery</span>
                      <span className="text-[11px] text-slate-500">Pay at your doorstep</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === 'Cash on Delivery'}
                    onChange={() => setPaymentMethod('Cash on Delivery')}
                    className="w-4 h-4 text-emerald-700 focus:ring-emerald-600 mt-1"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-3 border-t border-slate-200/60 pt-2">
                  Verify your groceries & household supplies with our rider before handing over cash.
                </p>
              </label>

              {/* Online / Digital Payment Option */}
              <label
                className={`p-5 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Online Payment'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">Online / Wallet</span>
                      <span className="text-[11px] text-slate-500">eSewa, Khalti, Cards</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="Online Payment"
                    checked={paymentMethod === 'Online Payment'}
                    onChange={() => setPaymentMethod('Online Payment')}
                    className="w-4 h-4 text-emerald-700 focus:ring-emerald-600 mt-1"
                  />
                </div>

                {paymentMethod === 'Online Payment' && (
                  <div className="mt-3 border-t border-slate-200/60 pt-3 flex gap-2">
                    {(['eSewa', 'Khalti', 'Cards'] as const).map(provider => (
                      <button
                        type="button"
                        key={provider}
                        onClick={() => setOnlineProvider(provider)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          onlineProvider === provider
                            ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Review & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Items ({cart.length})
            </h3>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => {
                const price = item.product.discountPrice || item.product.price;
                return (
                  <div key={item.product.id} className="py-2.5 flex items-center gap-3">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      category={item.product.category}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.quantity} × {formatPrice(price)} ({item.product.unit})
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatPrice(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Items Total</span>
                <span className="font-bold text-slate-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="font-bold text-slate-800">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-100">
                <span>Grand Total</span>
                <span className="font-display">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Delivery Guarantee Notice */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Dispatched locally from <strong>{STORE_CONFIG.address.street}</strong> within{' '}
                <strong>{STORE_CONFIG.delivery.estimatedDeliveryTime}</strong>.
              </span>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirm Order ({formatPrice(grandTotal)})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
