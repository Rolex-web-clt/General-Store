import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  KeyRound,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Trash2,
  ShoppingBag,
  AlertCircle,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import { Order, IUserAddress } from '../types';
import { STORE_CONFIG } from '../config/store';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { OrderStatusTracker } from '../components/order/OrderStatusTracker';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AccountPage: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'orders';

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordErr, setPasswordErr] = useState<string | null>(null);

  // New Address State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newCity, setNewCity] = useState(STORE_CONFIG.address.city);
  const [newLandmark, setNewLandmark] = useState('');

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await api.cancelOrder(orderId);
      if (res.success) {
        setOrders(prev => prev.map(o => (o.id === orderId ? res.order : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await updateProfile({ name, phone });
      setProfileMsg('Profile details updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordErr(null);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordErr(err.message || 'Failed to change password.');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newArea.trim()) return;

    const newAddressObj: IUserAddress = {
      id: `addr-${Date.now()}`,
      label: 'Home',
      street: newStreet.trim(),
      area: newArea.trim(),
      city: newCity.trim(),
      landmark: newLandmark.trim() || undefined,
      pincode: STORE_CONFIG.address.pincode,
      isDefault: (user?.addresses?.length || 0) === 0,
    };

    const updatedAddresses = [...(user?.addresses || []), newAddressObj];
    await updateProfile({ addresses: updatedAddresses });
    setAddressModalOpen(false);
    setNewStreet('');
    setNewArea('');
    setNewLandmark('');
  };

  const handleDeleteAddress = async (addrId: string) => {
    const updated = (user?.addresses || []).filter(a => a.id !== addrId);
    await updateProfile({ addresses: updated });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Customer Account</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your orders, profile, delivery addresses, and saved wishlist
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Tabs */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-1">
          <button
            onClick={() => setSearchParams({ tab: 'orders' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'wishlist' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Wishlist ({wishlist.length})</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'profile' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Personal Profile & Addresses</span>
          </button>

          <button
            onClick={() => setSearchParams({ tab: 'security' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          {/* TAB 1: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Order History</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {orders.length} total orders placed
                </span>
              </div>

              {ordersLoading ? (
                <div className="py-12 flex justify-center">
                  <LoadingSpinner size="md" text="Loading your orders..." />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">No Orders Yet</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    You haven't placed any orders with {STORE_CONFIG.name} yet.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                        <div>
                          <span className="font-mono font-extrabold text-slate-900 text-sm block">
                            {order.orderNumber}
                          </span>
                          <span className="text-slate-400">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full font-extrabold text-[11px] ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            ● {order.orderStatus}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold"
                          >
                            Details
                          </button>
                        </div>
                      </div>

                      {/* Visual Status Progress Tracker */}
                      <div className="py-1">
                        <OrderStatusTracker
                          status={order.orderStatus}
                          orderNumber={order.orderNumber}
                          createdAt={order.createdAt}
                          updatedAt={order.updatedAt}
                          variant="compact"
                        />
                      </div>

                      {/* Items peek */}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {order.items.map(i => (
                            <ImageWithFallback
                              key={i.productId}
                              src={i.image}
                              alt={i.name}
                              title={i.name}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                            />
                          ))}
                        </div>
                        <div className="text-right pl-4">
                          <span className="text-slate-400 block text-[11px]">
                            {order.items.length} items
                          </span>
                          <span className="font-extrabold text-slate-900 text-sm">
                            ${order.grandTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {order.orderStatus === 'Pending' && (
                        <div className="pt-2 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs text-rose-600 hover:underline font-bold"
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Saved Wishlist ({wishlist.length})</h3>

              {wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-base">Your Wishlist is Empty</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-6">
                    Save your favorite groceries to reorder anytime with one click.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map(p => (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between"
                    >
                      <div>
                        <ImageWithFallback
                          src={p.images[0]}
                          category={p.category}
                          alt={p.name}
                          className="w-full h-36 object-cover rounded-xl mb-3"
                        />
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">
                          {p.brand}
                        </span>
                        <h4 className="font-bold text-slate-800 text-xs truncate">{p.name}</h4>
                        <p className="text-xs font-extrabold text-slate-900 mt-1">
                          ${(p.discountPrice || p.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => addToCart(p, 1)}
                          disabled={p.stock <= 0}
                          className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PERSONAL PROFILE & ADDRESSES */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Profile Details */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Customer Personal Info
                </h3>

                {profileMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-lg">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Email address cannot be modified.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. 9841234567"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50"
                  >
                    {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Saved Delivery Addresses */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Saved Delivery Addresses</h3>
                  <button
                    onClick={() => setAddressModalOpen(true)}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl flex items-center gap-1 hover:bg-emerald-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {(user?.addresses?.length || 0) === 0 ? (
                  <p className="text-xs text-slate-500 italic py-3">
                    No delivery addresses saved yet. Add one for rapid 1-click checkout.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user?.addresses?.map(addr => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-extrabold text-slate-900">{addr.label}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700">{addr.street}</p>
                          <p className="text-slate-500">
                            {addr.area}, {addr.city}
                          </p>
                          {addr.landmark && (
                            <p className="text-slate-400 italic mt-0.5">Near: {addr.landmark}</p>
                          )}
                        </div>

                        <div className="mt-4 pt-2 border-t border-slate-200/60 flex justify-end">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-lg">
              <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Change Password
              </h3>

              {passwordMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {passwordMsg}
                </div>
              )}

              {passwordErr && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
                  {passwordErr}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details - ${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block">Status</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {selectedOrder.orderStatus}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment</span>
                <span className="font-extrabold text-slate-900">
                  {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </span>
              </div>
            </div>

            {/* Visual Status Tracker with Progress Bar */}
            <OrderStatusTracker
              status={selectedOrder.orderStatus}
              orderNumber={selectedOrder.orderNumber}
              createdAt={selectedOrder.createdAt}
              updatedAt={selectedOrder.updatedAt}
              statusHistory={selectedOrder.statusHistory}
              variant="full"
              showTimeline={true}
            />

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                Items Ordered
              </h5>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div>
                        <span className="font-bold text-slate-800">{item.name}</span>
                        <span className="text-slate-400 block">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-right">
              <p>Subtotal: ${selectedOrder.subtotal.toFixed(2)}</p>
              <p>Delivery: ${selectedOrder.deliveryFee.toFixed(2)}</p>
              {selectedOrder.discount > 0 && <p className="text-emerald-700">Discount: -${selectedOrder.discount.toFixed(2)}</p>}
              <p className="font-extrabold text-sm text-slate-900 pt-1">
                Grand Total: ${selectedOrder.grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title="Add Delivery Address"
      >
        <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={newStreet}
              onChange={e => setNewStreet(e.target.value)}
              placeholder="e.g. 12 Baker Street, Apt 4"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Area / Neighborhood *</label>
            <input
              type="text"
              required
              value={newArea}
              onChange={e => setNewArea(e.target.value)}
              placeholder="e.g. Downtown District"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={newCity}
              onChange={e => setNewCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nearby Landmark (Optional)</label>
            <input
              type="text"
              value={newLandmark}
              onChange={e => setNewLandmark(e.target.value)}
              placeholder="e.g. Behind Community Hospital"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800"
            >
              Save Address
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
