import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  Tag,
  Store,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const adminNav = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Photo Library (525+)', path: '/admin/photos', icon: ImageIcon },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Offers & Coupons', path: '/admin/offers', icon: Tag },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block leading-tight">
                Annil Admin
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                Store Operations
              </span>
            </div>
          </Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Go to Customer Storefront</span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right hidden sm:block">
            <span className="font-bold text-white block">{user?.name}</span>
            <span className="text-emerald-400 text-[10px] uppercase font-semibold">Store Administrator</span>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Body with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-60 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs hidden md:flex flex-col justify-between shrink-0 self-start sticky top-20">
          <div className="space-y-1">
            <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
              Management Menus
            </span>
            {adminNav.map(item => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-semibold p-2"
            >
              <Store className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation Strip */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 z-40 flex items-center gap-1 overflow-x-auto scrollbar-none shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
          {adminNav.map(item => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`shrink-0 flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl text-[10px] font-bold transition-colors ${
                  active ? 'text-emerald-800 bg-emerald-50 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <item.icon className={`w-4 h-4 mb-0.5 ${active ? 'text-emerald-700' : 'text-slate-500'}`} />
                <span className="truncate max-w-[56px]">{item.name}</span>
              </Link>
            );
          })}
          <Link
            to="/"
            className="shrink-0 flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded-xl text-[10px] font-bold text-slate-500 hover:text-emerald-700"
          >
            <Store className="w-4 h-4 mb-0.5" />
            <span>Store</span>
          </Link>
        </div>

        {/* Main Content View */}
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
