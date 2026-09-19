import React from 'react';
import { RotateCcw, Filter, Star } from 'lucide-react';
import { Category } from '../../types';

interface FiltersProps {
  categories: Category[];
  brands: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  minPrice: string;
  maxPrice: string;
  onPriceChange: (min: string, max: string) => void;
  minRating: string;
  onSelectRating: (rating: string) => void;
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  onReset: () => void;
}

export const ProductFilters: React.FC<FiltersProps> = ({
  categories,
  brands,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onSelectRating,
  inStockOnly,
  onToggleInStock,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Categories
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.itemCount > 0 && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  {cat.itemCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Brand
        </h4>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectBrand('all')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedBrand === 'all'
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Brands
          </button>
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => onSelectBrand(brand)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedBrand.toLowerCase() === brand.toLowerCase()
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Price Range (Rs.)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Min (Rs.)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={e => onPriceChange(e.target.value, maxPrice)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Max (Rs.)</label>
            <input
              type="number"
              min="0"
              placeholder="2500"
              value={maxPrice}
              onChange={e => onPriceChange(minPrice, e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Rating
        </h4>
        <div className="space-y-1">
          {['all', '4.5', '4.0', '3.0'].map(r => (
            <button
              key={r}
              onClick={() => onSelectRating(r)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${
                minRating === r ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {r === 'all' ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>{r} Stars & Above</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Availability
        </h4>
        <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={e => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};
