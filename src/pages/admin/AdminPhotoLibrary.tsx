import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Image as ImageIcon,
  Search,
  Copy,
  Check,
  PlusCircle,
  ExternalLink,
  Eye,
  Sparkles,
  Layers,
  ShoppingBag,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  Download,
  Tag,
  RefreshCw,
} from 'lucide-react';
import {
  GENERAL_STORE_PHOTOS,
  PHOTO_CATEGORIES,
  GeneralStorePhoto,
} from '../../data/generalStorePhotos';
import { formatPrice } from '../../utils/currency';

export default function AdminPhotoLibrary() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<GeneralStorePhoto | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const itemsPerPage = 36;

  // Category counts calculation
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: GENERAL_STORE_PHOTOS.length };
    for (const p of GENERAL_STORE_PHOTOS) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return GENERAL_STORE_PHOTOS.filter(photo => {
      const matchCat =
        selectedCategory === 'All' ||
        photo.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCat) return false;
      if (!q) return true;

      return (
        photo.title.toLowerCase().includes(q) ||
        photo.brand.toLowerCase().includes(q) ||
        photo.category.toLowerCase().includes(q) ||
        photo.unit.toLowerCase().includes(q) ||
        photo.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage) || 1;
  const paginatedPhotos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPhotos.slice(start, start + itemsPerPage);
  }, [filteredPhotos, currentPage]);

  const handleCopyUrl = (photo: GeneralStorePhoto) => {
    navigator.clipboard.writeText(photo.url);
    setCopiedId(photo.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleSelectToggle = (id: string) => {
    setSelectedPhotoIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    if (paginatedPhotos.every(p => selectedPhotoIds.has(p.id))) {
      // Unselect visible
      setSelectedPhotoIds(prev => {
        const next = new Set(prev);
        paginatedPhotos.forEach(p => next.delete(p.id));
        return next;
      });
    } else {
      // Select visible
      setSelectedPhotoIds(prev => {
        const next = new Set(prev);
        paginatedPhotos.forEach(p => next.add(p.id));
        return next;
      });
    }
  };

  const handleCreateProductWithPhoto = (photo: GeneralStorePhoto) => {
    // Navigate to AdminProducts with pre-populated query parameters
    const params = new URLSearchParams({
      action: 'new',
      name: photo.title,
      category: photo.category,
      brand: photo.brand,
      price: photo.price.toString(),
      discountPrice: (photo.discountPrice || photo.price).toString(),
      unit: photo.unit,
      image: photo.url,
    });
    navigate(`/admin/products?${params.toString()}`);
  };

  const handleBulkImportSelected = async () => {
    if (selectedPhotoIds.size === 0) return;
    setIsImporting(true);
    setImportStatus(null);

    const selectedItems = GENERAL_STORE_PHOTOS.filter(p => selectedPhotoIds.has(p.id));

    try {
      const res = await fetch('/api/photos/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await res.json();
      if (data.success) {
        setImportStatus(`Successfully created ${data.count} new products in your live store!`);
        setSelectedPhotoIds(new Set());
        setTimeout(() => setImportStatus(null), 5000);
      } else {
        setImportStatus(data.message || 'Import failed');
      }
    } catch (err: any) {
      setImportStatus('Error importing products to store.');
    } finally {
      setIsImporting(false);
    }
  };

  // Lock body scroll when preview modal is open
  useEffect(() => {
    if (previewPhoto) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [previewPhoto]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" /> General Store Stock Asset Library
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              525+ High-Resolution General Store Photos
            </h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Curated image library covering all 15 grocery & general store aisles. Copy direct HD URLs, browse item presets, or publish live products to your storefront with 1 click.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-950/50 backdrop-blur border border-emerald-600/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-300">525</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">Verified Photos</div>
            </div>
            <div className="bg-emerald-950/50 backdrop-blur border border-emerald-600/30 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-300">15</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">Store Aisles</div>
            </div>
            <div className="bg-emerald-950/50 backdrop-blur border border-emerald-600/30 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-300">1-Click</div>
              <div className="text-[11px] text-emerald-200/70 font-medium">Storefront Sync</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {importStatus && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            {importStatus}
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
          >
            View Products &rarr;
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search 525+ photos (e.g. apple, rice, detergent, tea, soap)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Bulk Action Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleSelectAllVisible}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              {paginatedPhotos.every(p => selectedPhotoIds.has(p.id)) ? (
                <>
                  <CheckSquare className="w-4 h-4 text-emerald-600" /> Deselect Page
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-slate-400" /> Select Page
                </>
              )}
            </button>

            {selectedPhotoIds.size > 0 && (
              <button
                onClick={handleBulkImportSelected}
                disabled={isImporting}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 disabled:opacity-50 transition shadow-sm"
              >
                {isImporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                Import {selectedPhotoIds.size} as Live Products
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {PHOTO_CATEGORIES.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-medium transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          Showing {paginatedPhotos.length} of {filteredPhotos.length} photos
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
        <div>
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Photos Grid */}
      {paginatedPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No photos found</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">
            Try searching with a different grocery keyword or switch to another category.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedPhotos.map(photo => {
            const isSelected = selectedPhotoIds.has(photo.id);
            const isCopied = copiedId === photo.id;

            return (
              <div
                key={photo.id}
                className={`group bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
                  isSelected
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Selection Checkbox */}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleSelectToggle(photo.id);
                    }}
                    className={`absolute top-2.5 left-2.5 p-1 rounded-lg backdrop-blur shadow-sm transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/80 text-slate-600 hover:bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  {/* Category Pill */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-semibold">
                    {photo.category}
                  </span>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    <button
                      onClick={() => setPreviewPhoto(photo)}
                      className="p-2 bg-white text-slate-800 rounded-lg hover:bg-slate-100 transition shadow"
                      title="Preview Full HD Photo"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyUrl(photo)}
                      className={`p-2 rounded-lg transition shadow ${
                        isCopied ? 'bg-emerald-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                      title="Copy Image URL"
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleCreateProductWithPhoto(photo)}
                      className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow flex items-center gap-1 text-xs font-semibold"
                      title="Create Product in Store"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition">
                      {photo.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>{photo.brand}</span>
                      <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {photo.unit}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatPrice(photo.price)}
                      </span>
                      {photo.discountPrice && (
                        <span className="text-[10px] text-slate-400 line-through ml-1.5">
                          {formatPrice(photo.price * 1.15)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleCreateProductWithPhoto(photo)}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                    >
                      <span>+ Use Photo</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between text-xs">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            &larr; Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNumber = i + 1;
              if (totalPages > 7) {
                if (currentPage > 4) {
                  pageNumber = currentPage - 3 + i;
                  if (pageNumber > totalPages) pageNumber = totalPages - (6 - i);
                }
              }
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-8 h-8 rounded-lg font-semibold transition ${
                    currentPage === pageNumber
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </div>
      )}

      {/* Full HD Preview Modal */}
      {previewPhoto &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in isolate" role="dialog" aria-modal="true">
            <div
              className="fixed inset-0"
              onClick={() => setPreviewPhoto(null)}
              aria-hidden="true"
            />
            <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-in z-10">
              <div className="relative aspect-[16/9] bg-slate-900">
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full text-white flex items-center justify-center text-sm font-bold transition-colors"
                >
                  &times;
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md">
                  {previewPhoto.category} &bull; High Resolution
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{previewPhoto.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>Brand: <strong className="text-slate-700">{previewPhoto.brand}</strong></span>
                    <span>Unit: <strong className="text-slate-700">{previewPhoto.unit}</strong></span>
                    <span>Suggested Price: <strong className="text-emerald-700">{formatPrice(previewPhoto.price)}</strong></span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {previewPhoto.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleCopyUrl(previewPhoto)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    {copiedId === previewPhoto.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" /> Copied Image URL!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Copy Image URL
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={previewPhoto.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Full Size
                    </a>
                    <button
                      onClick={() => {
                        const p = previewPhoto;
                        setPreviewPhoto(null);
                        handleCreateProductWithPhoto(p);
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                      <PlusCircle className="w-4 h-4" /> Create Product in Store
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
