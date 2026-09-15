import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ShieldCheck, Heart, Truck, Users, Award, ArrowRight } from 'lucide-react';
import { STORE_CONFIG } from '../config/store';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="bg-emerald-900 text-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            About Our Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Rooted in Community, Dedicated to Quality.
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {STORE_CONFIG.name} has been proudly serving local families with fresh pantry
            essentials, verified grains, reliable spices, and daily household supplies.
          </p>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              A True Neighborhood General Store in the Digital Age.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Founded with the belief that daily shopping should be simple, honest, and personal,
              {STORE_CONFIG.name} bridges traditional warm neighborhood service with fast,
              modern online convenience.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unlike impersonal mega-warehouses, every bag of rice, bottle of cooking oil, and carton
              of milk is stocked right in our local shop. When you place an order, our staff packages
              your goods and dispatches our local rider directly to your door.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-2xl font-black text-emerald-800">500+</span>
                <p className="text-slate-500 font-medium">Carefully Selected Staples</p>
              </div>
              <div>
                <span className="text-2xl font-black text-emerald-800">45-90 min</span>
                <p className="text-slate-500 font-medium">Average Doorstep Delivery</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80"
                alt={`${STORE_CONFIG.name} Produce`}
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Our Values
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              What Sets {STORE_CONFIG.name} Apart
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">Guaranteed Freshness</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We strictly rotate inventory, ensuring optimal expiry dates and peak flavor for all
                spices, flours, pulses, and dairy items.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">Neighborhood Care</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Need an item not listed on our website? Call us or send a photo on WhatsApp, and we’ll
                source it for you from our trusted partners.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-slate-900">Honest Pricing</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                No inflated delivery markups. You pay exactly the fair neighborhood shop prices, with
                regular promotional discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to stock up your pantry?
            </h3>
            <p className="text-emerald-100 text-sm mt-1 max-w-md">
              Order today and enjoy fast local delivery straight to your doorstep.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-8 py-3.5 rounded-xl bg-white text-emerald-900 font-extrabold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shrink-0 text-sm"
          >
            <span>Explore Store Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
