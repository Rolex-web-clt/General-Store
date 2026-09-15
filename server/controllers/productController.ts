/**
 * Product Controller
 * Supports advanced filtering, search, sorting, pagination, and administrative CRUD.
 */

import { Request, Response } from 'express';
import { ProductModel } from '../config/db';

export const getProducts = (req: Request, res: Response): void => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      featured,
      bestSeller,
      newArrival,
      sort = 'newest',
      page = '1',
      limit = '12',
      status,
      includeInactive,
    } = req.query;

    let products = ProductModel.find(p => {
      if (status === 'active') return p.isActive;
      if (status === 'inactive') return !p.isActive;
      if (status === 'all' || includeInactive === 'true') return true;
      return p.isActive;
    });

    // 1. Text Search (name, brand, category, tags)
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (category && typeof category === 'string' && category !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 3. Brand Filter
    if (brand && typeof brand === 'string' && brand !== 'all') {
      products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
    }

    // 4. Price Filter
    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) products = products.filter(p => (p.discountPrice || p.price) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
      if (!isNaN(max)) products = products.filter(p => (p.discountPrice || p.price) <= max);
    }

    // 5. Rating Filter
    if (minRating) {
      const ratingVal = parseFloat(minRating as string);
      if (!isNaN(ratingVal)) products = products.filter(p => p.rating >= ratingVal);
    }

    // 6. In Stock Filter
    if (inStock === 'true') {
      products = products.filter(p => p.stock > 0);
    }

    // 7. Flags
    if (featured === 'true') products = products.filter(p => p.isFeatured);
    if (bestSeller === 'true') products = products.filter(p => p.isBestSeller);
    if (newArrival === 'true') products = products.filter(p => p.isNewArrival);

    // 8. Sorting
    switch (sort) {
      case 'price-asc':
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        products.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    // 9. Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const total = products.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = products.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      products: paginatedProducts,
      total,
      page: pageNum,
      totalPages,
      hasMore: pageNum < totalPages,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch products.' });
  }
};

export const getProductById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const product = ProductModel.findById(id);

    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    // Fetch related products in the same category
    const related = ProductModel.find(
      p => p.category === product.category && p.id !== product.id && p.isActive
    ).slice(0, 4);

    res.status(200).json({
      success: true,
      product,
      related,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch product details.' });
  }
};

export const getSearchSuggestions = (req: Request, res: Response): void => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      res.status(200).json({ success: true, suggestions: [] });
      return;
    }

    const query = q.toLowerCase().trim();
    const products = ProductModel.find(p => p.isActive);

    const matches = products
      .filter(
        p =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
      .slice(0, 6)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.discountPrice || p.price,
        image: p.images[0],
      }));

    res.status(200).json({
      success: true,
      suggestions: matches,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Error getting search suggestions.' });
  }
};

export const getBrands = (req: Request, res: Response): void => {
  try {
    const products = ProductModel.find(p => p.isActive);
    const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean).sort();
    res.status(200).json({ success: true, brands });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch brands.' });
  }
};

// Admin CRUD operations
export const createProduct = (req: Request, res: Response): void => {
  try {
    const {
      name,
      description,
      brand,
      category,
      price,
      discountPrice,
      stock,
      unit,
      images,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive,
      tags,
    } = req.body;

    if (!name || price === undefined || price === null || !category) {
      res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
      return;
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
      return;
    }

    const parsedDiscount = discountPrice ? parseFloat(discountPrice) : undefined;
    const finalDiscount = parsedDiscount && parsedDiscount < parsedPrice ? parsedDiscount : parsedPrice;

    // Filter out blank images
    const cleanImages = (images && Array.isArray(images)
      ? images.filter((img: any) => typeof img === 'string' && img.trim().length > 0)
      : []
    ).map((img: string) => img.trim());

    const fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

    const newProduct = ProductModel.create({
      name: name.trim(),
      description: (description || '').trim(),
      brand: (brand || 'Cornerstone Essentials').trim(),
      category: category.trim(),
      price: parsedPrice,
      discountPrice: finalDiscount,
      stock: Math.max(0, parseInt(stock, 10) || 0),
      unit: (unit || '1 piece').trim(),
      images: cleanImages.length > 0 ? cleanImages : [fallbackImage],
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      isNewArrival: isNewArrival !== undefined ? Boolean(isNewArrival) : true,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      tags: Array.isArray(tags) ? tags : [category.toLowerCase()],
    });

    res.status(201).json({
      success: true,
      message: 'Product created and listed successfully.',
      product: newProduct,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create product.' });
  }
};

export const updateProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const existing = ProductModel.findById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const updateData = { ...req.body };
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.discountPrice !== undefined) {
      const p = updateData.price !== undefined ? updateData.price : existing.price;
      const d = parseFloat(updateData.discountPrice);
      updateData.discountPrice = !isNaN(d) && d < p ? d : p;
    }
    if (updateData.stock !== undefined) {
      updateData.stock = Math.max(0, parseInt(updateData.stock, 10) || 0);
    }
    if (updateData.images && Array.isArray(updateData.images)) {
      const clean = updateData.images.filter((img: any) => typeof img === 'string' && img.trim().length > 0);
      if (clean.length > 0) updateData.images = clean;
    }

    const updated = ProductModel.findByIdAndUpdate(id, updateData);
    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update product.' });
  }
};

export const deleteProduct = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = ProductModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete product.' });
  }
};
