import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown, X, Search, ChevronLeft, ChevronRight, Plus, Package, Store } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { api } from '../services/api';
import { Product, Category } from '../types';
import { useAuth } from '../context/AuthContext';

export const Shop: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL parameters
  const currentSearch = searchParams.get('search') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const currentBrand = searchParams.get('brand') || 'all';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('rating') || 'all';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentOffers = searchParams.get('offers') === 'true';
  const currentFeatured = searchParams.get('featured') === 'true';
  const currentBestSeller = searchParams.get('bestSeller') === 'true';
  const currentNewArrival = searchParams.get('newArrival') === 'true';

  // Load initial filter metadata
  useEffect(() => {
    async function loadMetadata() {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
        ]);
        if (catRes.success) setCategories(catRes.categories);
        if (brandRes.success) setBrands(brandRes.brands);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    }
    loadMetadata();
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams: Record<string, any> = {
          page: currentPage,
          limit: 12,
          sort: currentSort,
        };

        if (currentSearch) queryParams.search = currentSearch;
        if (currentCategory !== 'all') queryParams.category = currentCategory;
        if (currentBrand !== 'all') queryParams.brand = currentBrand;
        if (currentMinPrice) queryParams.minPrice = currentMinPrice;
        if (currentMaxPrice) queryParams.maxPrice = currentMaxPrice;
        if (currentRating !== 'all') queryParams.minRating = currentRating;
        if (currentInStock) queryParams.inStock = true;
        if (currentFeatured) queryParams.featured = true;
        if (currentBestSeller) queryParams.bestSeller = true;
        if (currentNewArrival) queryParams.newArrival = true;

        const res = await api.getProducts(queryParams);
        if (res.success) {
          let list = res.products;
          if (currentOffers) {
            list = list.filter(p => p.discountPrice && p.discountPrice < p.price);
          }
          setProducts(list);
          setTotal(res.total);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    currentSearch,
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentRating,
    currentInStock,
    currentSort,
    currentPage,
    currentOffers,
    currentFeatured,
    currentBestSeller,
    currentNewArrival,
  ]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== 'false') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceChange = (min: string, max: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min);
    else newParams.delete('minPrice');
    if (max) newParams.set('maxPrice', max);
    else newParams.delete('maxPrice');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Administrator Storefront Banner */}
      {isAdmin && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">Administrator Storefront View</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                  Admin Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Viewing live customer storefront. You can add new products and manage inventory anytime.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/admin/products?action=new"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add More Product</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              <span>Manage Catalog</span>
            </Link>
          </div>
        </div>
      )}

      {/* Top Banner & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {currentCategory !== 'all'
              ? currentCategory
              : currentSearch
              ? `Results for "${currentSearch}"`
              : currentOffers
              ? 'Special Offers & Discounted Products'
              : 'Shop General Store Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <strong className="text-slate-800">{products.length}</strong> of{' '}
            <strong className="text-slate-800">{total}</strong> products
          </p>
        </div>

        {/* Controls: Mobile Filter Toggle & Sort Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 hover:bg-slate-50 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span>Filters</span>
            {(currentCategory !== 'all' || currentBrand !== 'all' || currentMinPrice || currentMaxPrice || currentRating !== 'all' || currentInStock) && (
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            )}
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={e => updateParam('sort', e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Quick Category Horizontal Chips */}
      <div className="lg:hidden mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
        <button
          onClick={() => updateParam('category', 'all')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            currentCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Departments
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateParam('category', cat.name)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              currentCategory === cat.name
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Active Filter Chips Bar (Visible when filters are active) */}
      {(currentCategory !== 'all' || currentBrand !== 'all' || currentMinPrice || currentMaxPrice || currentRating !== 'all' || currentInStock || currentSearch) && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Active Filters:</span>
          {currentSearch && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Keyword: "{currentSearch}"
              <button onClick={() => updateParam('search', '')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Category: {currentCategory}
              <button onClick={() => updateParam('category', 'all')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentBrand !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Brand: {currentBrand}
              <button onClick={() => updateParam('brand', 'all')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              Price: ${currentMinPrice || '0'} - ${currentMaxPrice || '∞'}
              <button onClick={() => handlePriceChange('', '')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {currentInStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
              In Stock Only
              <button onClick={() => updateParam('inStock', 'false')} className="hover:text-emerald-950">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28">
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategory={currentCategory}
            onSelectCategory={cat => updateParam('category', cat)}
            selectedBrand={currentBrand}
            onSelectBrand={b => updateParam('brand', b)}
            minPrice={currentMinPrice}
            maxPrice={currentMaxPrice}
            onPriceChange={handlePriceChange}
            minRating={currentRating}
            onSelectRating={r => updateParam('rating', r)}
            inStockOnly={currentInStock}
            onToggleInStock={val => updateParam('inStock', String(val))}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <LoadingSpinner size="lg" text="Searching store inventory..." />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">No products found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                We couldn't find any products matching your chosen filters or search query.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2 max-w-full overflow-hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="p-2 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Mobile Indicator */}
                  <div className="sm:hidden px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 shrink-0">
                    Page {currentPage} of {totalPages}
                  </div>

                  {/* Desktop Page Numbers */}
                  <div className="hidden sm:flex items-center gap-1.5 flex-wrap justify-center">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                            currentPage === pageNum
                              ? 'bg-emerald-700 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="p-2 sm:px-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-bold flex items-center gap-1 shrink-0"
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-base text-slate-900">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProductFilters
              categories={categories}
              brands={brands}
              selectedCategory={currentCategory}
              onSelectCategory={cat => {
                updateParam('category', cat);
                setMobileFilterOpen(false);
              }}
              selectedBrand={currentBrand}
              onSelectBrand={b => {
                updateParam('brand', b);
                setMobileFilterOpen(false);
              }}
              minPrice={currentMinPrice}
              maxPrice={currentMaxPrice}
              onPriceChange={handlePriceChange}
              minRating={currentRating}
              onSelectRating={r => {
                updateParam('rating', r);
                setMobileFilterOpen(false);
              }}
              inStockOnly={currentInStock}
              onToggleInStock={val => updateParam('inStock', String(val))}
              onReset={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
            />

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                View Results ({total})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
