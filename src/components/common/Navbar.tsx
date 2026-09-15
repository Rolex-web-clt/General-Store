import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Clock,
  MessageCircle,
  LayoutDashboard,
  LogOut,
  Package,
  Store,
  ChevronDown,
  Percent,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { STORE_CONFIG } from '../../config/store';
import { SearchBar } from './SearchBar';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems, subtotal } = useCart();
  const { wishlist } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop?view=categories' },
    { name: 'Offers', path: '/shop?offers=true', icon: Percent },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path || location.pathname.startsWith(path.split('?')[0]);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Notification & Fast Contact Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{STORE_CONFIG.openingHours.weekdays}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 text-slate-300">
              <span>Free local delivery on orders over ${STORE_CONFIG.delivery.freeDeliveryThreshold}!</span>
            </div>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <a
              href={`tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Call:</span> {STORE_CONFIG.phone}
            </a>
            <a
              href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink min-w-0 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition-all shrink-0">
              <Store className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-lg sm:text-2xl text-slate-900 tracking-tight block leading-none truncate">
                Annil
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 tracking-wider uppercase block mt-0.5 truncate">
                General Store
              </span>
            </div>
          </Link>

          {/* Centered Search Bar on Desktop & Tablet */}
          <div className="hidden lg:block flex-1 max-w-lg mx-6">
            <SearchBar />
          </div>

          {/* Right Action Icons: Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Wishlist Icon */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-2 sm:p-2.5 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-2.5 sm:px-3.5 py-2 text-slate-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200/60 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-[10px] text-emerald-900/70 uppercase font-semibold leading-none">
                  My Cart
                </span>
                <span className="block text-xs font-bold text-emerald-950 leading-tight">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </Link>

            {/* User Account / Sign In */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-800"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left text-xs">
                      <span className="block font-semibold text-slate-900 leading-none truncate max-w-[90px]">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <>
                          <Link
                            to="/admin"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                            <span>Admin Dashboard</span>
                          </Link>

                          <Link
                            to="/admin/products?action=new"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-emerald-700" />
                            <span>+ Add More Product</span>
                          </Link>

                          <Link
                            to="/admin/products"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            <span>Products & Inventory</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/account?tab=profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/account?tab=orders"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/account?tab=wishlist"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Wishlist ({wishlist.length})</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-2 text-xs font-semibold text-slate-800 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 shrink-0"
                  title="Login or Register"
                >
                  <UserIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="hidden sm:inline">Login / Register</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Secondary Category & Page Links Strip (Desktop) */}
        <div className="hidden lg:flex items-center justify-between py-2 border-t border-slate-100 text-sm">
          <nav className="flex items-center gap-6">
            {navLinks.map(link => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium transition-colors flex items-center gap-1.5 py-1 ${
                    active
                      ? 'text-emerald-700 font-bold border-b-2 border-emerald-600 -mb-[9px]'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5 text-amber-500" />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/50">
            ⚡ Quick local delivery in 45–90 mins
          </div>
        </div>

        {/* Mobile Search Bar & Quick Suggestion Chips */}
        <div className="lg:hidden pb-3">
          <SearchBar onSearchSubmitted={() => setMobileMenuOpen(false)} />
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 scrollbar-none text-[11px]">
            <span className="text-slate-400 font-medium shrink-0">Popular:</span>
            {['Rice', 'Fresh Milk', 'Tea', 'Apples', 'Spices', 'Detergent'].map(tag => (
              <Link
                key={tag}
                to={`/shop?search=${encodeURIComponent(tag)}`}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Sheet with Backdrop Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-[85%] max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 animate-in slide-in-from-right duration-250">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block leading-tight">Annil</span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">General Store</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Greeting Card in Drawer */}
              {user ? (
                <div className="mb-4 p-3 bg-emerald-50/80 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold capitalize">{user.role.toLowerCase()}</p>
                    </div>
                  </div>
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg shadow-xs border border-emerald-200 shrink-0"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Welcome to our store!</p>
                    <p className="text-[10px] text-slate-500">Sign in for saved orders & wishlist</p>
                  </div>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Sign In
                  </Link>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1.5">
                {navLinks.map(link => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive(link.path)
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.icon && <link.icon className="w-4 h-4 text-amber-500" />}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-sm font-bold text-emerald-900 bg-emerald-100/80 mt-2 border border-emerald-200"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                    <span>Store Admin Dashboard</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Bottom Help & Contacts in Drawer */}
            <div className="border-t border-slate-100 pt-4 mt-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Need Help Ordering?
              </p>
              <div className="space-y-2 text-xs">
                <a
                  href={`tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center gap-2 text-slate-700 font-semibold hover:text-emerald-700"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call {STORE_CONFIG.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-700 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Instant Order</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
