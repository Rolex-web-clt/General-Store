import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check, Zap, Eye, Copy, ExternalLink } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { ActionMenu } from '../common/ActionMenu';
import { Modal } from '../common/Modal';
import { formatPrice } from '../../utils/currency';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const navigate = useNavigate();

  const isFavorite = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/product/${product.id}`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-500/60 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col overflow-hidden">
        {/* Top Image Container */}
      <Link to={`/product/${product.id}`} className="relative block aspect-square bg-slate-50 overflow-hidden">
        <ImageWithFallback
          src={product.images[0]}
          category={product.category}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges: Discount and Stock */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-extrabold rounded-md shadow-xs tracking-tight">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-md shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Floating Action Cluster: Wishlist & 3-Dot Options */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-rose-50 text-rose-600 shadow-sm'
                : 'bg-white/90 text-slate-400 hover:text-rose-600 hover:bg-white shadow-xs'
            }`}
            title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <ActionMenu
            title={`Options for ${product.name}`}
            triggerClassName="w-8 h-8 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 hover:bg-white shadow-xs flex items-center justify-center transition-all"
            menuWidth="w-48"
            items={[
              {
                id: 'quick-view',
                label: 'Quick View',
                icon: Eye,
                onClick: () => setQuickViewOpen(true),
              },
              {
                id: 'view-full',
                label: 'View Product Page',
                icon: ExternalLink,
                onClick: () => navigate(`/product/${product.id}`),
              },
              {
                id: 'copy-link',
                label: copiedLink ? 'Link Copied!' : 'Copy Link',
                icon: copiedLink ? Check : Copy,
                onClick: handleCopyLink,
              },
              {
                id: 'wishlist',
                label: isFavorite ? 'Remove from Wishlist' : 'Save to Wishlist',
                icon: Heart,
                onClick: () => toggleWishlist(product),
              },
            ]}
          />
        </div>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-1.5 text-[11px] text-slate-500 mb-1 min-w-0 overflow-hidden">
            <span
              className="font-semibold text-emerald-800 uppercase tracking-wide truncate min-w-0 max-w-[48%]"
              title={product.brand}
            >
              {product.brand}
            </span>
            <span
              className="text-slate-400 truncate min-w-0 max-w-[50%] text-right"
              title={product.category}
            >
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 min-h-[40px]">
              {product.name}
            </h3>
          </Link>

          {/* Unit info */}
          <p className="text-xs text-slate-500 mt-1">{product.unit || '1 piece'}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount})</span>

            {/* Stock indicator */}
            <div className="ml-auto">
              {product.stock > 0 && product.stock <= 8 && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & CTA Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-slate-900 font-display">
              {formatPrice(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className={`w-full py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                product.stock <= 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Quick View Overlapping Dialogue Modal */}
    <Modal
      isOpen={quickViewOpen}
      onClose={() => setQuickViewOpen(false)}
      title={product.name}
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
          <ImageWithFallback
            src={product.images[0]}
            category={product.category}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between h-full space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              <span className="text-xs font-semibold text-slate-500">{product.brand}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{product.name}</h2>
            <p className="text-xs text-slate-500 mt-1">Package: {product.unit || '1 piece'}</p>

            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-emerald-700">
                {formatPrice(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            <div className="mt-3">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                  product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                />
                {product.stock > 0 ? `${product.stock} items in stock` : 'Currently out of stock'}
              </span>
            </div>

            {product.description && (
              <p className="text-xs text-slate-600 mt-3 leading-relaxed border-t border-slate-100 pt-3">
                {product.description}
              </p>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={(e) => {
                handleAddToCart(e);
                setQuickViewOpen(false);
              }}
              disabled={product.stock <= 0}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickViewOpen(false);
                navigate(`/product/${product.id}`);
              }}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Full Product Details & Reviews</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </>
  );
};
