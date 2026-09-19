import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Store,
  Percent,
  ShoppingBag,
  User as UserIcon,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';

export const MobileBottomNav: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { totalItems, subtotal } = useCart();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.includes('?')) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      label: 'Aisles',
      path: '/shop',
      icon: Store,
    },
    {
      label: 'Deals',
      path: '/shop?offers=true',
      icon: Percent,
      badge: 'OFF',
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingBag,
      badgeCount: totalItems,
      sublabel: subtotal > 0 ? formatPrice(subtotal) : undefined,
    },
    {
      label: isAdmin ? 'Admin' : user ? 'Account' : 'Sign In',
      path: isAdmin ? '/admin' : user ? '/account' : '/auth',
      icon: isAdmin ? LayoutDashboard : UserIcon,
      isSpecial: isAdmin,
    },
  ];

  // Hide mobile nav when inside admin routes (AdminLayout has its own mobile nav)
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 py-1.5 transition-all"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center gap-1">
        {navItems.map(item => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 min-h-[50px] ${
                active
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <item.icon
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110 stroke-[2.4]' : 'scale-100 stroke-[1.8]'
                  } ${item.isSpecial ? 'text-emerald-700' : ''}`}
                />

                {/* Number Badge (e.g. for Cart) */}
                {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs border-2 border-white animate-in zoom-in-50 duration-150">
                    {item.badgeCount > 99 ? '99+' : item.badgeCount}
                  </span>
                )}

                {/* Text Badge (e.g. for Deals) */}
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[8px] font-black px-1 rounded-full uppercase leading-tight shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 leading-none ${
                  active ? 'font-bold text-emerald-800' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Pip */}
              {active && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
