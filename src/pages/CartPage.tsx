import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  CheckCircle2,
  Truck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_CONFIG } from '../config/store';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    grandTotal,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const minOrder = STORE_CONFIG.delivery.minimumOrder;
  const freeThreshold = STORE_CONFIG.delivery.freeDeliveryThreshold;
  const amountNeededForFree = Math.max(0, freeThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, (subtotal / freeThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-50 text-emerald-700 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 mb-8">
          Looks like you haven't added any groceries or household items yet. Check out our fresh stock!
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-950/20 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review your pantry & household items before checkout
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Free Delivery Threshold Bar */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-700" />
            {amountNeededForFree > 0 ? (
              <span>
                Add <strong className="text-emerald-700">${amountNeededForFree.toFixed(2)}</strong> more for <strong>FREE Local Delivery</strong>!
              </span>
            ) : (
              <span className="text-emerald-700 font-extrabold">
                🎉 Congratulations! You have unlocked FREE Local Delivery!
              </span>
            )}
          </div>
          <span>${subtotal.toFixed(2)} / ${freeThreshold}</span>
        </div>
        <div className="w-full bg-emerald-200/70 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-700 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeDeliveryPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {cart.map(item => {
            const price = item.product.discountPrice || item.product.price;
            const lineTotal = price * item.quantity;

            return (
              <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      category={item.product.category}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-100"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.id}`}
                      className="block font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">{item.product.unit}</p>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      ${price.toFixed(2)} per unit
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 text-slate-500 hover:text-slate-800"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-extrabold text-slate-900 text-sm font-display min-w-[70px] text-right">
                    ${lineTotal.toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Input */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-700" />
              <span>Promo / Coupon Code</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div>
                  <span className="font-extrabold text-emerald-800 block">{appliedCoupon.code}</span>
                  <span className="text-[11px] text-emerald-600">
                    {appliedCoupon.title} applied ({appliedCoupon.discountPercent}% off)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Try: WELCOME10, FREESHIP"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase outline-none focus:border-emerald-600"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {applying ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-rose-600 font-medium">{couponError}</p>
                )}
              </form>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span>Standard Delivery Fee</span>
                  {deliveryFee === 0 && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                      FREE
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? '$0.00' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
              <div>
                <span className="font-bold text-slate-900 text-base">Grand Total</span>
                <span className="block text-[11px] text-slate-400">All local taxes included</span>
              </div>
              <span className="text-2xl font-black text-slate-950 font-display">
                ${grandTotal.toFixed(2)}
              </span>
            </div>

            {/* Minimum order check */}
            {subtotal < minOrder && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Minimum order amount for delivery is <strong>${minOrder.toFixed(2)}</strong>. Please add{' '}
                  <strong>${(minOrder - subtotal).toFixed(2)}</strong> more to proceed.
                </span>
              </div>
            )}

            <button
              onClick={() => navigate('/checkout')}
              disabled={subtotal < minOrder}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/shop"
              className="block text-center text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-1"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Bar for Fast Ordering */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Total to Pay</p>
            <p className="text-xl font-black text-slate-900 leading-tight">${grandTotal.toFixed(2)}</p>
            {deliveryFee === 0 && (
              <span className="text-[10px] font-bold text-emerald-700">Free delivery unlocked</span>
            )}
          </div>

          <button
            onClick={() => navigate('/checkout')}
            disabled={subtotal < minOrder}
            className="py-3 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
