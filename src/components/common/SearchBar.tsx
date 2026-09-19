import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { ImageWithFallback } from './ImageWithFallback';
import { formatPrice } from '../../utils/currency';

interface SearchBarProps {
  className?: string;
  onSearchSubmitted?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '', onSearchSubmitted }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.getSuggestions(query.trim());
        if (res.success) {
          setSuggestions(res.suggestions);
          setIsOpen(true);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    if (onSearchSubmitted) onSearchSubmitted();
  };

  const handleSelectSuggestion = (productId: string) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
    if (onSearchSubmitted) onSearchSubmitted();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search rice, spices, oil, snacks, detergents..."
          className="w-full pl-11 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 text-sm rounded-full border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 transition-all outline-none"
        />
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        {isLoading ? (
          <Loader2 className="absolute right-3.5 w-4 h-4 text-emerald-600 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
            }}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
          <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium px-3">
            <span>SUGGESTED PRODUCTS</span>
            <span>{suggestions.length} found</span>
          </div>
          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {suggestions.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelectSuggestion(item.id)}
                className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-emerald-50/60 transition-colors group"
              >
                <ImageWithFallback
                  src={item.image}
                  category={item.category}
                  alt={item.name}
                  className="w-11 h-11 object-cover rounded-lg border border-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-emerald-700">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span className="font-medium text-emerald-700">{formatPrice(item.price)}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>{item.brand}</span>
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 shrink-0" />
              </button>
            ))}
          </div>
          <button
            onClick={handleSearchSubmit}
            className="w-full py-2.5 bg-slate-50 hover:bg-emerald-50 text-center text-xs font-semibold text-emerald-700 transition-colors border-t border-slate-100"
          >
            View all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};
