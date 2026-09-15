import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  Tag,
  Store,
  Image as ImageIcon,
  Check,
  AlertTriangle,
  Layers,
  ArrowRight,
  Upload,
  Camera,
  FileImage,
} from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Modal } from '../../components/common/Modal';
import { GENERAL_STORE_PHOTOS, GeneralStorePhoto } from '../../data/generalStorePhotos';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

// Curated high-resolution image presets for common grocery and store items
const IMAGE_PRESETS = [
  {
    category: 'Produce & Fruits',
    items: [
      { name: 'Crisp Apples', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fresh Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80' },
      { name: 'Ripe Vine Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80' },
      { name: 'Baby Spinach', url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80' },
      { name: 'Hass Avocados', url: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Grains & Staples',
    items: [
      { name: 'Royal Basmati Rice', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Yellow Lentils / Dal', url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80' },
      { name: 'Whole Wheat Flour', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
      { name: 'Organic Rolled Oats', url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Dairy & Farm',
    items: [
      { name: 'Whole Cream Milk', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80' },
      { name: 'Greek Yogurt', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80' },
      { name: 'Natural Cheddar Cheese', url: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80' },
      { name: 'Organic Eggs', url: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Oils & Spices',
    items: [
      { name: 'Cold-Pressed Olive Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Pure Turmeric Powder', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80' },
      { name: 'Black Peppercorns', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Beverages & Tea',
    items: [
      { name: 'Assam CTC Black Tea', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80' },
      { name: 'Arabica Coffee Beans', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fresh Orange Juice', url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Bakery & Snacks',
    items: [
      { name: 'Artisan Whole Wheat Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
      { name: 'Roasted Almonds', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chocolate Chip Cookies', url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' },
    ],
  },
  {
    category: 'Household & Cleaning',
    items: [
      { name: 'Laundry Detergent', url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80' },
      { name: 'Eco Surface Cleaner', url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80' },
    ],
  },
];

const COMMON_UNITS = ['1 kg', '500 g', '250 g', '1 Litre', '500 ml', '1 piece', 'Pack of 2', 'Pack of 6', 'Dozen', '5 kg bag'];
const POPULAR_BRANDS = ['Store Direct', 'Annil Essentials', 'Royal Organic', 'Fresh Valley', 'Golden Harvest'];

export const AdminProducts: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusTab, setStatusTab] = useState<'all' | 'active' | 'inactive' | 'lowStock'>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [unit, setUnit] = useState('1 piece');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [tags, setTags] = useState('');

  // UI States
  const [showImagePresets, setShowImagePresets] = useState(false);
  const [photoSearchQuery, setPhotoSearchQuery] = useState('');
  const [photoCategoryFilter, setPhotoCategoryFilter] = useState('All');
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url' | 'library'>('library');
  const [dragOverImage, setDragOverImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; productId?: string } | null>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WEBP, GIF).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image file is too large. Please select a photo under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ limit: 300, includeInactive: true }),
        api.getCategories(),
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    const qName = searchParams.get('name');
    const qCat = searchParams.get('category');
    const qBrand = searchParams.get('brand');
    const qPrice = searchParams.get('price');
    const qDiscount = searchParams.get('discountPrice');
    const qUnit = searchParams.get('unit');
    const qImage = searchParams.get('image');

    setEditingProduct(null);
    setName(qName || '');
    setBrand(qBrand || 'Annil Essentials');
    setCategory(qCat || categories[0]?.name || 'Groceries');
    setIsAddingNewCategory(false);
    setCustomCategory('');
    setPrice(qPrice || '');
    setDiscountPrice(qDiscount && qDiscount !== qPrice ? qDiscount : '');
    setStock('25');
    setUnit(qUnit || '1 kg');
    setDescription(qName ? `Fresh and authentic ${qName} sourced for our general store customers.` : '');
    setImageUrl(qImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80');
    setIsFeatured(false);
    setIsBestSeller(false);
    setIsNewArrival(true);
    setIsActive(true);
    setTags('');
    setShowImagePresets(false);
    setPhotoSearchQuery('');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setIsAddingNewCategory(false);
    setCustomCategory('');
    setPrice(String(p.price));
    setDiscountPrice(p.discountPrice && p.discountPrice < p.price ? String(p.discountPrice) : '');
    setStock(String(p.stock));
    setUnit(p.unit || '1 piece');
    setDescription(p.description || '');
    setImageUrl(p.images[0] || '');
    setIsFeatured(p.isFeatured);
    setIsBestSeller(p.isBestSeller);
    setIsNewArrival(p.isNewArrival);
    setIsActive(p.isActive !== false);
    setTags(p.tags ? p.tags.join(', ') : '');
    setShowImagePresets(false);
    setFormError(null);
    setModalOpen(true);
  };

  // Toggle Listed on Website status directly from table row
  const handleToggleActive = async (p: Product) => {
    const nextStatus = !p.isActive;
    try {
      const res = await api.updateProduct(p.id, { isActive: nextStatus });
      if (res.success) {
        setProducts(prev =>
          prev.map(item => (item.id === p.id ? { ...item, isActive: nextStatus } : item))
        );
        showNotification(
          nextStatus
            ? `"${p.name}" is now listed and visible to customers on the website.`
            : `"${p.name}" is now unlisted and hidden from the website.`,
          p.id
        );
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update website listing status.');
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!window.confirm(`Are you sure you want to permanently remove "${prodName}" from inventory?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showNotification(`Product "${prodName}" has been deleted.`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    }
  };

  const showNotification = (message: string, productId?: string) => {
    setToast({ message, productId });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const resolvedCategory = isAddingNewCategory ? customCategory.trim() : category.trim();

    if (!name.trim()) {
      setFormError('Please enter a product title.');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    if (!resolvedCategory) {
      setFormError('Please select or specify a category.');
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedDiscount = discountPrice ? parseFloat(discountPrice) : undefined;
    if (parsedDiscount !== undefined && parsedDiscount >= parsedPrice) {
      setFormError('Discount price must be lower than the regular price.');
      return;
    }

    setFormSaving(true);

    const parsedTags = tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (!parsedTags.includes(resolvedCategory.toLowerCase())) {
      parsedTags.push(resolvedCategory.toLowerCase());
    }

    const payload = {
      name: name.trim(),
      brand: brand.trim() || 'Annil Essentials',
      category: resolvedCategory,
      price: parsedPrice,
      discountPrice: parsedDiscount,
      stock: parseInt(stock, 10) || 0,
      unit: unit.trim() || '1 piece',
      description: description.trim(),
      images: [imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive, // Controls whether listed on website
      tags: parsedTags,
    };

    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, payload);
        if (res.success) {
          setProducts(prev => prev.map(p => (p.id === editingProduct.id ? res.product : p)));
          setModalOpen(false);
          showNotification(
            `Product "${res.product.name}" updated successfully ${res.product.isActive ? 'and listed on the website' : '(unlisted)'}.`,
            res.product.id
          );
        }
      } else {
        const res = await api.createProduct(payload);
        if (res.success) {
          setProducts([res.product, ...products]);
          setModalOpen(false);
          showNotification(
            `"${res.product.name}" has been created and listed on the website!`,
            res.product.id
          );
        }
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setFormSaving(false);
    }
  };

  // Status counts
  const totalCount = products.length;
  const activeCount = products.filter(p => p.isActive).length;
  const inactiveCount = products.filter(p => !p.isActive).length;
  const lowStockCount = products.filter(p => p.stock <= 10 && p.isActive).length;

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(query)));

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStatus = true;
    if (statusTab === 'active') matchesStatus = p.isActive === true;
    if (statusTab === 'inactive') matchesStatus = p.isActive === false;
    if (statusTab === 'lowStock') matchesStatus = p.stock <= 10 && p.isActive;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-emerald-700 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold">{toast.message}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {toast.productId && (
              <Link
                to={`/product/${toast.productId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <span>View on Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setToast(null)}
              className="p-1 text-emerald-300 hover:text-white rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Products & Inventory</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add new items, publish products to your website storefront, track stock levels, and set prices
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            to="/shop"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Store className="w-4 h-4 text-emerald-700" />
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-200 pb-3">
        <button
          onClick={() => setStatusTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All Products</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusTab === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-700'}`}>
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => setStatusTab('active')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusTab === 'active'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Listed on Website</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusTab === 'active' ? 'bg-emerald-800 text-emerald-100' : 'bg-emerald-50 text-emerald-700'}`}>
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => setStatusTab('inactive')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusTab === 'inactive'
              ? 'bg-amber-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span>Unlisted / Hidden</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusTab === 'inactive' ? 'bg-amber-800 text-amber-100' : 'bg-slate-100 text-slate-700'}`}>
            {inactiveCount}
          </span>
        </button>

        <button
          onClick={() => setStatusTab('lowStock')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            statusTab === 'lowStock'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low Stock Alert</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusTab === 'lowStock' ? 'bg-rose-800 text-rose-100' : 'bg-rose-50 text-rose-700'}`}>
            {lowStockCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, brand, or search tags..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        <div className="w-full sm:w-56">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-600 focus:bg-white font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="md" text="Loading products catalog..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-3">
            <Package className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700 text-sm">No products found</p>
            <p className="text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all' || statusTab !== 'all'
                ? 'No items match the active filters. Try clearing your search or switching tabs.'
                : 'Your inventory catalog is currently empty. Click "Add New Product" to list your first item!'}
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold inline-flex items-center gap-1.5 text-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Item & Details</th>
                  <th className="py-3.5 px-4">Category & Brand</th>
                  <th className="py-3.5 px-4">Price / Discount</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Website Listing</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProducts.map(p => {
                  const hasDiscount = p.discountPrice && p.discountPrice < p.price;
                  const discountPercent = hasDiscount
                    ? Math.round(((p.price - p.discountPrice!) / p.price) * 100)
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Item image, title, and badges */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={p.images[0]}
                            category={p.category}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs hover:text-emerald-700 transition-colors">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-500 font-semibold">{p.unit}</span>
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">
                                  Home Featured
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                                  Best Seller
                                </span>
                              )}
                              {p.isNewArrival && (
                                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[9px] font-bold rounded">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Brand */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="block font-semibold text-slate-800">{p.category}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          {p.brand}
                        </span>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-extrabold text-slate-900 text-sm">
                            ${(p.discountPrice || p.price).toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ${p.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        {hasDiscount && (
                          <span className="text-[9px] font-extrabold text-rose-600 uppercase">
                            {discountPercent}% OFF Promo
                          </span>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            p.stock <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 8
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock <= 0 ? (
                            'Out of Stock'
                          ) : p.stock <= 8 ? (
                            `Low Stock (${p.stock})`
                          ) : (
                            `${p.stock} in stock`
                          )}
                        </span>
                      </td>

                      {/* Website Listing Status Toggle */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(p)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                            p.isActive
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                          }`}
                          title={p.isActive ? 'Click to Unlist / Hide from store' : 'Click to List on Website'}
                        >
                          {p.isActive ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Listed on Website</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              <span>Unlisted (Hidden)</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Row Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${p.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View on Customer Storefront"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal with Live Storefront Preview */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Store Product' : 'Add New Product to Store'}
        maxWidth="max-w-4xl"
      >
        {formError && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl font-bold border border-rose-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Product Inputs */}
            <div className="lg:col-span-7 space-y-4">
              {/* Product Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Product Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Royal Basmati Long Grain Rice (5kg)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-semibold"
                />
              </div>

              {/* Brand Name & Quick Suggestions */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brand}
                  onChange={e => setBrand(e.target.value)}
                  placeholder="e.g. Annil Essentials, Fortune, Fresh Valley"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400 self-center">Popular:</span>
                  {POPULAR_BRANDS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-md transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    className="text-[11px] text-emerald-700 hover:underline font-bold"
                  >
                    {isAddingNewCategory ? '← Choose existing category' : '+ Type new category'}
                  </button>
                </div>

                {isAddingNewCategory ? (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                    placeholder="Type new category name (e.g. Organic Herbal, Exotic Spices)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-emerald-400 rounded-xl outline-none focus:bg-white text-xs"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-medium cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Pricing & Stock Row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Regular Price ($) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="15.00"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sale / Discount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={discountPrice}
                    onChange={e => setDiscountPrice(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Stock Units <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Unit / Weight & Quick Chips */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Packaging Unit / Weight</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  placeholder="e.g. 1 kg, 500 g, 1 Litre, 1 piece"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-400 self-center">Presets:</span>
                  {COMMON_UNITS.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnit(u)}
                      className={`text-[10px] px-2 py-0.5 rounded-md transition-colors ${
                        unit === u
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Photo Upload & Selection Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-700">
                    Product Photo <span className="text-emerald-700 font-semibold">*</span>
                  </label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('library')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                        imageUploadMode === 'library'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>525+ Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                        imageUploadMode === 'upload'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                        imageUploadMode === 'url'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {/* Mode 1: File Upload (Drag & Drop + File Selector) */}
                {imageUploadMode === 'upload' && (
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setDragOverImage(true);
                    }}
                    onDragLeave={() => setDragOverImage(false)}
                    onDrop={e => {
                      e.preventDefault();
                      setDragOverImage(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleImageFile(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      dragOverImage
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-slate-200 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageFile(e.target.files[0]);
                        }
                      }}
                    />
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200/80 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose photo or drag & drop here
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, WEBP, or GIF (up to 5MB)
                    </p>
                  </div>
                )}

                {/* Mode 2: Direct Image URL input */}
                {imageUploadMode === 'url' && (
                  <div className="space-y-1.5">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                    />
                    <p className="text-[10px] text-slate-400">
                      Paste any public image link or CDN URL.
                    </p>
                  </div>
                )}

                {/* Mode 3: 525+ Verified General Store Library */}
                {imageUploadMode === 'library' && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-700">
                        Pick a photo from our store library:
                      </p>
                      <Link
                        to="/admin/photos"
                        target="_blank"
                        className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                      >
                        <span>Open 525+ Photos Fullscreen</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {/* Quick Search */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={photoSearchQuery}
                        onChange={e => setPhotoSearchQuery(e.target.value)}
                        placeholder="Search photos (e.g. sugar, milk, rice, tea, soap, oil)..."
                        className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-emerald-600"
                      />
                    </div>

                    {/* Photo Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-1">
                      {GENERAL_STORE_PHOTOS.filter(p => {
                        if (!photoSearchQuery.trim()) return true;
                        const q = photoSearchQuery.toLowerCase();
                        return (
                          p.title.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q) ||
                          p.tags.some(t => t.toLowerCase().includes(q))
                        );
                      })
                        .slice(0, 24)
                        .map(item => (
                          <div
                            key={item.id}
                            className={`group relative rounded-lg overflow-hidden border transition-all text-left bg-white ${
                              imageUrl === item.url
                                ? 'border-emerald-600 ring-2 ring-emerald-500'
                                : 'border-slate-200 hover:border-emerald-400'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setImageUrl(item.url);
                              }}
                              className="w-full text-left"
                            >
                              <ImageWithFallback
                                src={item.url}
                                category={item.category}
                                alt={item.title}
                                className="w-full h-14 object-cover"
                              />
                              <div className="p-1">
                                <span className="block text-[10px] font-bold text-slate-800 truncate">
                                  {item.title}
                                </span>
                                <span className="block text-[9px] text-slate-500 truncate">
                                  {item.category}
                                </span>
                              </div>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImageUrl(item.url);
                                if (!name) setName(item.title);
                                if (!category) setCategory(item.category);
                                if (!price) setPrice(item.price.toString());
                                if (!brand || brand === 'Annil Essentials') setBrand(item.brand);
                                if (!unit || unit === '1 piece') setUnit(item.unit);
                              }}
                              className="w-full py-0.5 bg-slate-100 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 text-[9px] font-semibold text-center border-t border-slate-100"
                            >
                              Auto-fill details
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Selected Photo Mini Preview Banner */}
                {imageUrl && (
                  <div className="flex items-center gap-3 p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
                    <ImageWithFallback
                      src={imageUrl}
                      category={category}
                      alt="Selected preview"
                      className="w-12 h-12 rounded-lg object-cover border border-emerald-200 shrink-0 bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-emerald-950 block">Photo Attached</span>
                      <span className="text-[10px] text-emerald-700 truncate block max-w-xs font-mono">
                        {imageUrl.startsWith('data:') ? 'Custom uploaded image (Ready)' : imageUrl}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Freshly sourced, rich in nutrients, store in a cool dry place..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>

              {/* Search Tags */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Search Keywords / Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="e.g. organic, vegan, healthy, breakfast, pantry"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Right Column: Visibility & Live Preview */}
            <div className="lg:col-span-5 space-y-4">
              {/* Website Listing Switch Box */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-800" />
                    <span className="font-extrabold text-xs text-emerald-900">
                      Storefront Listing Status
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                  </label>
                </div>

                <p className="text-[11px] text-emerald-800/90 leading-relaxed font-medium">
                  {isActive ? (
                    <span className="flex items-center gap-1.5 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      Listed on Website: Visible to all shoppers immediately upon saving.
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-600 font-bold">
                      <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      Unlisted / Draft: Saved in catalog but hidden from customers.
                    </span>
                  )}
                </p>

                {/* Homepage & Promotion Badges */}
                <div className="pt-2 border-t border-emerald-200/60 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-900 block">
                    Placement & Highlight Badges:
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-emerald-900">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={e => setIsFeatured(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Show in "Featured Products" on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-emerald-900">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={e => setIsNewArrival(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Tag as "New Arrival"</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 hover:text-emerald-900">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={e => setIsBestSeller(e.target.checked)}
                      className="rounded text-emerald-700"
                    />
                    <span>Highlight as "Best Seller"</span>
                  </label>
                </div>
              </div>

              {/* Live Storefront Product Card Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Live Customer Storefront Preview
                </span>

                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm max-w-xs mx-auto">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                    <ImageWithFallback
                      src={imageUrl}
                      category={category}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    {discountPrice && parseFloat(discountPrice) < parseFloat(price || '0') && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded-md shadow-xs">
                        -{Math.round(((parseFloat(price) - parseFloat(discountPrice)) / parseFloat(price)) * 100)}% OFF
                      </span>
                    )}
                    {isBestSeller && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-md shadow-xs">
                        BESTSELLER
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-bold text-emerald-800 uppercase">{brand || 'Brand'}</span>
                      <span>{isAddingNewCategory ? customCategory || 'Category' : category || 'Category'}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs line-clamp-2 min-h-[32px]">
                      {name || 'Product Title Will Appear Here'}
                    </h4>

                    <span className="text-[10px] text-slate-400 block">{unit || '1 piece'}</span>

                    <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                      <span className="text-base font-extrabold text-slate-900">
                        ${(discountPrice && parseFloat(discountPrice) < parseFloat(price || '0')
                          ? parseFloat(discountPrice)
                          : parseFloat(price || '0')
                        ).toFixed(2)}
                      </span>
                      {discountPrice && parseFloat(discountPrice) < parseFloat(price || '0') && (
                        <span className="text-xs text-slate-400 line-through">
                          ${parseFloat(price || '0').toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              <span>Will be {isActive ? 'immediately published to store' : 'saved as draft'}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formSaving}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-xs"
              >
                {formSaving ? (
                  <span>Saving...</span>
                ) : editingProduct ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Create & List Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
