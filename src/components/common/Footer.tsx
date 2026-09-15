import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Banknote,
} from 'lucide-react';
import { STORE_CONFIG } from '../../config/store';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      {/* Top Value Propositions Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Fast Local Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dispatched within 45–90 minutes</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Cash On Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Pay conveniently at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Quality Checked</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fresh stock from trusted suppliers</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy Exchanges</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free replacement policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Store Overview */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block">
                  Annil
                </span>
                <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase block">
                  General Store
                </span>
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-sm">
              Your neighborhood general store offering high-quality daily groceries, pantry
              staples, pulses, spices, fresh dairy, household cleaning supplies, and everyday personal essentials.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-colors text-xs font-bold shadow-md shadow-emerald-900/30"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href={`tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors text-xs font-semibold border border-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{STORE_CONFIG.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Explore Store
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-emerald-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?view=categories" className="hover:text-emerald-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/shop?offers=true" className="hover:text-emerald-400 transition-colors">
                  Special Offers & Deals
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About Our Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Account & Services */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Customer Area
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/cart" className="hover:text-emerald-400 transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link to="/account?tab=orders" className="hover:text-emerald-400 transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/account?tab=wishlist" className="hover:text-emerald-400 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-emerald-400 transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?role=admin" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Timings */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Visit Our Store
            </h4>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address.fullAddress}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">{STORE_CONFIG.openingHours.weekdays}</p>
                  <p className="text-slate-400 mt-0.5">{STORE_CONFIG.openingHours.weekends}</p>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${STORE_CONFIG.email}`} className="hover:text-emerald-400">
                  {STORE_CONFIG.email}
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <p className="text-[11px] text-slate-400">
                <span className="font-bold text-emerald-400">Delivery Areas:</span>{' '}
                {STORE_CONFIG.delivery.deliveryAreas.slice(0, 3).join(', ')} & more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payment Badges & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. All rights reserved.</p>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Payment Accepted:</span>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              Cash On Delivery
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
              eSewa
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-purple-400 font-semibold border border-slate-700">
              Khalti
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700 flex items-center gap-1">
              <CreditCard className="w-3 h-3" /> Cards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
