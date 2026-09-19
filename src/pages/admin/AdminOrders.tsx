import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Eye,
  Truck,
  RotateCcw,
  Copy,
  Printer,
  MoreVertical,
} from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { OrderStatusTracker } from '../../components/order/OrderStatusTracker';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';
import { ActionMenu } from '../../components/common/ActionMenu';
import { formatPrice } from '../../utils/currency';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAllOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerInfo.fullName.toLowerCase().includes(q) ||
      o.customerInfo.phone.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Orders & Fulfillment</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Process customer grocery packages, update live tracking status, and verify dispatch
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by order number (e.g. GS-2026-...) or customer name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white font-bold cursor-pointer"
          >
            <option value="all">All Order Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped / Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="md" text="Loading store orders..." />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No orders found matching the filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer & Location</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Status & Transition</th>
                  <th className="py-3 px-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-extrabold text-slate-900 block">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {order.customerInfo.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {order.customerInfo.area}, {order.customerInfo.city}
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        Ph: {order.customerInfo.phone}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800">{order.items.length} items</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                        {order.items.map(i => i.name).join(', ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 block">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                      >
                        ● {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatPrice(order.grandTotal)}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleUpdateStatus(order.id, e.target.value)}
                        disabled={updatingStatus}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border outline-none cursor-pointer ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Full Order"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <ActionMenu
                          title={`Order ${order.orderNumber} options`}
                          triggerClassName="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center justify-center"
                          menuWidth="w-52"
                          items={[
                            {
                              id: 'view-order',
                              label: 'Inspect Order Details',
                              icon: Eye,
                              onClick: () => setSelectedOrder(order),
                            },
                            {
                              id: 'copy-num',
                              label: 'Copy Order Number',
                              icon: Copy,
                              onClick: () => {
                                navigator.clipboard?.writeText(order.orderNumber);
                              },
                            },
                            {
                              id: 'mark-delivered',
                              label: 'Mark as Delivered',
                              icon: CheckCircle2,
                              disabled: order.status === 'Delivered' || updatingStatus,
                              onClick: () => handleUpdateStatus(order.id, 'Delivered'),
                            },
                            {
                              id: 'mark-shipped',
                              label: 'Mark as Shipped',
                              icon: Truck,
                              disabled: order.status === 'Shipped' || updatingStatus,
                              onClick: () => handleUpdateStatus(order.id, 'Shipped'),
                            },
                            {
                              id: 'print',
                              label: 'Print Order Receipt',
                              icon: Printer,
                              onClick: () => {
                                setSelectedOrder(order);
                                setTimeout(() => window.print(), 300);
                              },
                            },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Inspection Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Inspect Order: ${selectedOrder?.orderNumber}`}
        maxWidth="max-w-2xl"
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Live Visual Tracker Preview */}
            <OrderStatusTracker
              status={selectedOrder.orderStatus}
              orderNumber={selectedOrder.orderNumber}
              createdAt={selectedOrder.createdAt}
              updatedAt={selectedOrder.updatedAt}
              statusHistory={selectedOrder.statusHistory}
              variant="full"
              showTimeline={true}
            />

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="font-bold uppercase text-[10px] text-slate-400 block">
                  Delivery Destination
                </span>
                <p className="font-bold text-slate-900 mt-1">{selectedOrder.customerInfo.fullName}</p>
                <p className="text-slate-600">{selectedOrder.customerInfo.deliveryAddress}</p>
                <p className="text-slate-600">
                  {selectedOrder.customerInfo.area}, {selectedOrder.customerInfo.city}
                </p>
                {selectedOrder.customerInfo.landmark && (
                  <p className="text-slate-500 italic">Landmark: {selectedOrder.customerInfo.landmark}</p>
                )}
                <p className="text-emerald-800 font-bold mt-1">
                  Phone: {selectedOrder.customerInfo.phone}
                </p>
                {selectedOrder.customerInfo.notes && (
                  <p className="text-amber-800 font-semibold bg-amber-50 p-1.5 rounded mt-2">
                    Note: "{selectedOrder.customerInfo.notes}"
                  </p>
                )}
              </div>

              <div>
                <span className="font-bold uppercase text-[10px] text-slate-400 block">
                  Payment & Fulfillment Status
                </span>
                <p className="mt-1">
                  Method: <strong>{selectedOrder.paymentMethod}</strong>
                </p>
                <p>
                  Payment Status: <strong>{selectedOrder.paymentStatus}</strong>
                </p>
                <p className="mt-2">
                  Placed Date: {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>

                <div className="mt-3">
                  <span className="font-bold block mb-1">Update Status:</span>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={e => handleUpdateStatus(selectedOrder.id, e.target.value)}
                    disabled={updatingStatus}
                    className="w-full font-bold px-3 py-1.5 rounded-xl border bg-white cursor-pointer disabled:opacity-50"
                  >
                    <option value="Pending">Pending (Order Received)</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing (Packing Items)</option>
                    <option value="Shipped">Shipped (Out for Delivery)</option>
                    <option value="Delivered">Delivered (Completed)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Order Items ({selectedOrder.items.length})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          {item.quantity} × {formatPrice(item.price)} ({item.unit})
                        </span>
                      </div>
                    </div>
                    <span className="font-black text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-right space-y-1">
              <p>Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
              <p>Delivery Fee: {selectedOrder.deliveryFee === 0 ? 'FREE' : formatPrice(selectedOrder.deliveryFee)}</p>
              {selectedOrder.discount > 0 && (
                <p className="text-emerald-700">Coupon Discount: -{formatPrice(selectedOrder.discount)}</p>
              )}
              <p className="text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                Grand Total: {formatPrice(selectedOrder.grandTotal)}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
