import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';

export const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('10');
  const [minPurchase, setMinPurchase] = useState('25');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOffers();
      if (res.success) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!code.trim() || !title.trim()) {
      setError('Coupon code and title are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.createOffer({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minPurchase: parseFloat(minPurchase),
        expiresAt,
        isActive: true,
      });

      if (res.success) {
        setOffers([res.offer, ...offers]);
        setModalOpen(false);
        setCode('');
        setTitle('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create coupon.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      const res = await api.deleteOffer(id);
      if (res.success) {
        setOffers(prev => prev.filter(o => o.id !== id));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Promotions & Coupons</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create discount coupon codes for checkout savings and holiday grocery events
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon Code</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="md" text="Loading discount offers..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Order</th>
                  <th className="py-3 px-4">Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {offers.map(offer => (
                  <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {offer.code}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{offer.title}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap font-extrabold text-slate-900">
                      {offer.discountType === 'PERCENTAGE'
                        ? `${offer.discountValue}% OFF`
                        : `$${offer.discountValue} FLAT OFF`}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      ${offer.minPurchase.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {new Date(offer.expiresAt).toLocaleDateString()}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create Discount Coupon">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. FESTIVE15"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl uppercase font-mono font-bold outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Promo Title / Description *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. 15% Off on Groceries above $40"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={e => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Flat Dollar ($)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
              <input
                type="number"
                step="0.1"
                required
                value={discountValue}
                onChange={e => setDiscountValue(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min. Order Amount ($)</label>
              <input
                type="number"
                step="1"
                required
                value={minPurchase}
                onChange={e => setMinPurchase(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Valid Until</label>
              <input
                type="date"
                required
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Activate Coupon'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
