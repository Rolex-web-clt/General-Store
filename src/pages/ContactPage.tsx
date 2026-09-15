import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Store,
  Truck,
} from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
          Neighborhood Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
          Contact {STORE_CONFIG.name}
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Have an inquiry about stock, bulk groceries, special orders, or delivery timing? We are always
          here to help our neighborhood community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Store Information & Helpdesk
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Phone Order Hotline</span>
                  <a href={`tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`} className="text-emerald-700 hover:underline">
                    {STORE_CONFIG.phone}
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">Call directly for instant orders</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">WhatsApp Direct</span>
                  <a
                    href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:underline"
                  >
                    Chat on WhatsApp ({STORE_CONFIG.whatsapp})
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">Send a photo of your handwritten grocery list!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Email Support</span>
                  <a href={`mailto:${STORE_CONFIG.email}`} className="text-emerald-700 hover:underline">
                    {STORE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Store Opening Hours</span>
                  <p className="text-slate-700">{STORE_CONFIG.openingHours.weekdays}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{STORE_CONFIG.openingHours.weekends}</p>
                  <p className="text-emerald-700 text-[11px] font-bold mt-1">
                    {STORE_CONFIG.openingHours.holidayNote}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Shop Address</span>
                  <p className="text-slate-700">{STORE_CONFIG.address.fullAddress}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{STORE_CONFIG.address.landmark}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Coverage Areas Card */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Truck className="w-6 h-6 text-emerald-300" />
              <h4 className="font-bold text-base">Local Neighborhood Delivery</h4>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              We deliver daily within a 5km radius of our store location across:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {STORE_CONFIG.delivery.deliveryAreas.map(area => (
                <span
                  key={area}
                  className="px-3 py-1 rounded-lg bg-emerald-800 text-emerald-200 text-xs font-semibold border border-emerald-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Send Us a Message</h3>
          <p className="text-xs text-slate-500 mb-6">
            Leave us a note below and our store manager will get back to you shortly.
          </p>

          {sent && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                Thank you! Your message has been sent to our store team. We will get back to you within 2 hours.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9841234567"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. maya@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white cursor-pointer font-medium"
                >
                  <option value="">Select an Inquiry Type</option>
                  <option value="Product Availability">Product Availability & Stock</option>
                  <option value="Delivery Question">Delivery Status or Question</option>
                  <option value="Bulk Order">Bulk / Event Grocery Order</option>
                  <option value="Feedback / Suggestion">Feedback or New Product Suggestion</option>
                  <option value="Other">Other Query</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Write your questions or product request here..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md shadow-emerald-950/20 transition-all flex items-center gap-2 text-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
