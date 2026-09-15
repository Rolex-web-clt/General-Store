import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Banknote,
  Clock,
  Sparkles,
  Percent,
  CheckCircle2,
  Copy,
  Star,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../services/api';
import { Category, Product, Offer, Review } from '../types';
import { STORE_CONFIG } from '../config/store';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catRes, prodRes, offersRes, revRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 20 }),
          api.getActiveOffers(),
          api.getReviewsByProduct('prod-1'), // initial sample reviews
        ]);

        if (catRes.success) setCategories(catRes.categories);
        if (prodRes.success) {
          setFeaturedProducts(prodRes.products.filter(p => p.isFeatured).slice(0, 4));
          setBestSellers(prodRes.products.filter(p => p.isBestSeller).slice(0, 4));
          setNewArrivals(prodRes.products.filter(p => p.isNewArrival).slice(0, 4));
        }
        if (offersRes.success) setOffers(offersRes.offers);
        if (revRes.success) setReviews(revRes.reviews);
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading General Store..." />
      </div>
    );
  }

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-6">
        {/* Background Subtle Accent */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Direct Neighborhood Delivery • 45–90 Mins</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Fresh Groceries & <br />
              <span className="text-emerald-300">Daily Essentials</span> <br />
              At Your Doorstep.
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-xl font-normal leading-relaxed">
              Order aromatic rice, pulses, spices, fresh milk, tea, snacks, and trusted household
              cleaning products with simple Cash on Delivery or quick WhatsApp checkout.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-extrabold hover:bg-emerald-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40 text-sm min-h-[44px]"
              >
                <span>Shop Catalog Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${STORE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello! I would like to place an order from ${STORE_CONFIG.name}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto justify-center px-5 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold transition-all flex items-center gap-2 border border-emerald-500/40 text-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-emerald-700/60 max-w-md text-center sm:text-left text-xs">
              <div>
                <p className="font-extrabold text-lg sm:text-xl text-white">45–90m</p>
                <p className="text-emerald-200/80 text-[11px] sm:text-xs">Fast Delivery</p>
              </div>
              <div>
                <p className="font-extrabold text-lg sm:text-xl text-white">100%</p>
                <p className="text-emerald-200/80 text-[11px] sm:text-xs">Cash on Delivery</p>
              </div>
              <div>
                <p className="font-extrabold text-lg sm:text-xl text-white">500+</p>
                <p className="text-emerald-200/80 text-[11px] sm:text-xs">Pantry Items</p>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-xs">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="General Store Fresh Produce and Essentials"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Annil Quality Promise
                </span>
                <p className="text-lg font-bold text-white mt-1">
                  100% Fresh & Authentic Products
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Cleaned, hygienically packed, and delivered directly from our local store.
                </p>
              </div>
            </div>

            {/* Floating Offer Badge */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-amber-400 text-slate-900 rounded-2xl p-4 shadow-xl border-2 border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-lg">
                %
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  New Customer Offer
                </p>
                <p className="text-sm font-black text-slate-950">Use Code: WELCOME10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Special Offers & Discount Coupons */}
      {offers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
                Save On Your Grocery Bill
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Active Store Discounts & Coupons
              </h2>
            </div>
            <Link
              to="/shop?offers=true"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex md:grid overflow-x-auto md:overflow-visible pb-3 md:pb-0 gap-4 md:gap-6 snap-x -mx-4 px-4 md:mx-0 md:px-0">
            {offers.map(offer => (
              <div
                key={offer.id}
                className="w-[82vw] sm:w-[320px] md:w-auto shrink-0 snap-center relative rounded-2xl bg-white border border-emerald-100 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      {offer.discountPercent}% DISCOUNT
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Min. ${offer.minPurchase}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{offer.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{offer.description}</p>
                </div>

                <div className="relative z-10 mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-mono text-xs font-extrabold px-3 py-1 bg-slate-100 text-slate-800 rounded-lg border border-dashed border-slate-300 tracking-wider">
                    {offer.code}
                  </div>
                  <button
                    onClick={() => handleCopyCoupon(offer.code)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-emerald-50 transition-colors"
                  >
                    {copiedCoupon === offer.code ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
              Department Aisle
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop?view=categories"
            className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Horizontal Carousel for Quick Aisle Browsing */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x -mx-4 px-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="shrink-0 w-20 flex flex-col items-center text-center snap-start group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border-2 border-slate-100 shadow-xs mb-1.5 group-hover:border-emerald-500 transition-colors">
                <ImageWithFallback
                  src={cat.image}
                  category={cat.name}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
              </div>
              <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400">{cat.itemCount} items</span>
            </Link>
          ))}
        </div>

        {/* Tablet & Desktop Grid */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.slice(0, 12).map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-50 border-2 border-slate-100 group-hover:border-emerald-500 transition-colors mb-3">
                <ImageWithFallback
                  src={cat.image}
                  category={cat.name}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{cat.itemCount} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
                Handpicked Essentials
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Featured Products
              </h2>
            </div>
            <Link
              to="/shop?featured=true"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>See More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. Best-Selling Pantry Staples Banner & Products */}
      {bestSellers.length > 0 && (
        <section className="bg-slate-100/70 py-12 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block">
                  Customer Favorites
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  Best-Selling Daily Staples
                </h2>
              </div>
              <Link
                to="/shop?bestSeller=true"
                className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View All Best Sellers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 block">
                Fresh In Store
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?newArrival=true"
              className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Explore New Goods</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Why Choose Our General Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
              Why Shop With Annil
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              The Trust of a Neighborhood Shop, The Speed of Modern Delivery.
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              We know your household relies on reliable groceries, honest weights, and fresh dates.
              Every order is hand-inspected before dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10 relative z-10">
            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Truck className="w-8 h-8 text-emerald-300 mb-3" />
              <h4 className="font-bold text-base text-white">45–90 Min Delivery</h4>
              <p className="text-xs text-emerald-100/80 mt-1">
                Fast local dispatch throughout your neighborhood area.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Banknote className="w-8 h-8 text-emerald-300 mb-3" />
              <h4 className="font-bold text-base text-white">Cash on Delivery</h4>
              <p className="text-xs text-emerald-100/80 mt-1">
                Inspect your items before paying at your door.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <ShieldCheck className="w-8 h-8 text-emerald-300 mb-3" />
              <h4 className="font-bold text-base text-white">Checked Quality</h4>
              <p className="text-xs text-emerald-100/80 mt-1">
                Triple-cleaned grains and genuine brand warranties.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <Phone className="w-8 h-8 text-emerald-300 mb-3" />
              <h4 className="font-bold text-base text-white">Friendly Support</h4>
              <p className="text-xs text-emerald-100/80 mt-1">
                Call or WhatsApp our shop staff anytime for inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Reviews & Community Trust */}
      {reviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
              Happy Neighbors
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map(review => (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center text-amber-400 gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{review.userName}</span>
                  <span className="text-slate-400">Verified Customer</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Store Location, Hours & Fast Contact Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Visit Or Call Us Today
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {STORE_CONFIG.name}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We are located at <strong>{STORE_CONFIG.address.fullAddress}</strong>. Drop by during our
              opening hours or place your order online for door-to-door delivery.
            </p>

            <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span>{STORE_CONFIG.openingHours.weekdays}</span>
                  <span className="text-slate-500 text-xs block mt-0.5">{STORE_CONFIG.openingHours.weekends}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Delivery Coverage: {STORE_CONFIG.delivery.deliveryAreas.join(', ')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Call Store: {STORE_CONFIG.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <a
                href={`tel:${STORE_CONFIG.phone.replace(/[^0-9+]/g, '')}`}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Store Phone</span>
              </a>
              <Link
                to="/contact"
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Directions & Details
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-64 sm:h-72 relative flex items-center justify-center text-center p-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Store Front Location</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {STORE_CONFIG.address.street}, {STORE_CONFIG.address.area}, {STORE_CONFIG.address.city}
              </p>
              <div className="inline-block px-3 py-1 bg-white text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 shadow-xs">
                Open Daily • Free Parking Available
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
