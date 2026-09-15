import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  MessageSquare,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Product, Review } from '../types';
import { STORE_CONFIG } from '../config/store';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  // Review Form
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          api.getProductById(id),
          api.getReviewsByProduct(id),
        ]);

        if (prodRes.success && prodRes.product) {
          setProduct(prodRes.product);
          setSelectedImage(prodRes.product.images[0] || '');
          setRelated(prodRes.related || []);
        }
        if (revRes.success) {
          setReviews(revRes.reviews);
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="mt-6 inline-block px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold text-sm">
          Browse Store Catalog
        </Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const savings = hasDiscount ? product.price - product.discountPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await api.addReview(product.id, {
        rating: reviewRating,
        comment: reviewComment,
        userName: user?.name || reviewName.trim() || 'Valued Neighbor',
      });
      if (res.success) {
        setReviews([res.review, ...reviews]);
        setReviewComment('');
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 3000);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs text-slate-500 mb-6 flex-wrap sm:flex-nowrap min-w-0 max-w-full overflow-hidden">
        <Link to="/" className="hover:text-emerald-700 shrink-0">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <Link to="/shop" className="hover:text-emerald-700 shrink-0">Shop</Link>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-emerald-700 truncate max-w-[110px] sm:max-w-[180px] shrink-0"
          title={product.category}
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
        <span
          className="text-slate-800 font-semibold truncate max-w-[130px] sm:max-w-[260px] min-w-0"
          title={product.name}
        >
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 relative">
            <ImageWithFallback
              src={selectedImage || product.images[0]}
              category={product.category}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-lg shadow-sm">
                -{discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-md ${
                isFavorite ? 'bg-rose-50 text-rose-600' : 'bg-white text-slate-400 hover:text-rose-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === img ? 'border-emerald-700 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <ImageWithFallback
                    src={img}
                    category={product.category}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category & Brand */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating and Unit */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/60 font-bold">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
              </div>

              <span className="text-slate-600 font-medium bg-slate-100 px-2.5 py-1 rounded-lg">
                Package Unit: <strong>{product.unit}</strong>
              </span>

              {/* Stock Status */}
              <div>
                {product.stock > 0 ? (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({product.stock} available)</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently Out of Stock</span>
                  </span>
                )}
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-950 font-display">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100/70 px-2 py-0.5 rounded">
                    You Save ${savings.toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="text-sm text-slate-600 leading-relaxed pt-2">
              <p>{product.description}</p>
            </div>

            {/* Quantity Stepper */}
            {product.stock > 0 && (
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  product.stock <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-700 text-white'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-emerald-700" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  product.stock <= 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-md shadow-emerald-900/20'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Delivery & Store Promises Card */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{STORE_CONFIG.delivery.estimatedDeliveryTime}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>100% Quality Checked</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Doorstep Inspection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Form Section */}
      <section className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>Customer Reviews ({reviews.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Real feedback from neighborhood shoppers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-slate-400">out of 5</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-8">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-6">
                No reviews yet for this product. Be the first to share your experience!
              </p>
            ) : (
              reviews.map(rev => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{rev.userName}</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Box */}
          <div className="lg:col-span-5 bg-slate-50/70 rounded-2xl p-5 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm mb-3">Write a Customer Review</h4>
            {reviewSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                Thank you! Your review has been added.
              </div>
            )}
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              {!user && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewName}
                    onChange={e => setReviewName(e.target.value)}
                    placeholder="e.g. Maya Sharma"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className={`p-1 transition-colors ${
                        reviewRating >= star ? 'text-amber-400' : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                  <span className="font-bold text-slate-700 ml-2">{reviewRating} Stars</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Your Feedback</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share details about the quality, freshness, and delivery..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products from same Category */}
      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                You might also need
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                Related {product.category} Items
              </h3>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.slice(0, 4).map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Purchase Bar */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2.5 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="text-xl font-black text-slate-900">${currentPrice.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block truncate max-w-full">
            {product.unit || '1 piece'} &bull; {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all ${
              product.stock <= 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
};
