import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await api.getAdminMetrics();
        if (res.success) {
          setMetrics(res.metrics);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading store performance metrics..." />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500">
        Could not load dashboard metrics.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Store Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time business performance, inventory alerts, and fulfillment tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products?action=new"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              ${metrics.totalRevenue.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realized Store Sales</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              {metrics.totalOrders}
            </span>
            <span className="text-[11px] text-amber-600 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{metrics.ordersByStatus.Pending || 0} Pending dispatch</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Registered Customers
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              {metrics.totalCustomers}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Neighborhood shoppers
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Products & Low Stock */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Catalog Items
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1">
              {metrics.totalProducts}
            </span>
            {metrics.lowStockProducts.length > 0 ? (
              <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{metrics.lowStockProducts.length} low in stock</span>
              </span>
            ) : (
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                All inventory healthy
              </span>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Recent Customer Orders</h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {metrics.recentOrders.map((order: any) => (
              <div
                key={order.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-slate-900">{order.orderNumber}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">
                    {order.customerInfo.fullName} • {order.customerInfo.area}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="font-extrabold text-slate-900 text-sm">
                    ${order.grandTotal.toFixed(2)}
                  </span>
                  <Link
                    to="/admin/orders"
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Low Stock Alerts</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {metrics.lowStockProducts.length} items
            </span>
          </div>

          {metrics.lowStockProducts.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <span>All product stocks are well maintained.</span>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {metrics.lowStockProducts.map((p: any) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ImageWithFallback
                      src={p.images[0]}
                      category={p.category}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover border border-slate-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.unit}</p>
                    </div>
                  </div>
                  <span className="font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-md text-[11px] shrink-0 ml-2">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/admin/products"
            className="block w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 text-center text-xs font-bold rounded-xl transition-colors"
          >
            Update Inventory Stock
          </Link>
        </div>
      </div>
    </div>
  );
};
