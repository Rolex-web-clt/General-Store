import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { ProductModel } from '../config/db';

interface PhotoItem {
  id: string;
  title: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  unit: string;
  url: string;
  tags: string[];
}

let cachedPhotos: PhotoItem[] | null = null;

function loadPhotos(): PhotoItem[] {
  if (cachedPhotos) return cachedPhotos;
  try {
    const jsonPath = path.join(process.cwd(), 'server', 'data', 'generalStorePhotos.json');
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, 'utf-8');
      cachedPhotos = JSON.parse(data);
      return cachedPhotos || [];
    }
  } catch (err) {
    console.error('Error loading general store photos:', err);
  }
  return [];
}

export const getPhotos = (req: Request, res: Response): void => {
  try {
    const photos = loadPhotos();
    const { q, category, page = '1', limit = '48' } = req.query;

    let filtered = photos;

    if (category && typeof category === 'string' && category.toLowerCase() !== 'all') {
      filtered = filtered.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (q && typeof q === 'string' && q.trim().length > 0) {
      const query = q.toLowerCase().trim();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags?.some(t => t.toLowerCase().includes(query))
      );
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 48);
    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum);
    const offset = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(offset, offset + limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      totalPages,
      photos: paginated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch photos.' });
  }
};

export const bulkImportPhotosAsProducts = (req: Request, res: Response): void => {
  try {
    const { photoIds, items } = req.body;
    const allPhotos = loadPhotos();
    const photosToImport: PhotoItem[] = [];

    if (Array.isArray(items) && items.length > 0) {
      photosToImport.push(...items);
    } else if (Array.isArray(photoIds) && photoIds.length > 0) {
      const idSet = new Set(photoIds);
      photosToImport.push(...allPhotos.filter(p => idSet.has(p.id)));
    }

    if (photosToImport.length === 0) {
      res.status(400).json({ success: false, message: 'No valid photos selected for product creation.' });
      return;
    }

    const createdProducts = [];
    for (const photo of photosToImport) {
      const created = ProductModel.create({
        name: photo.title,
        description: `Premium quality ${photo.title.toLowerCase()} from our curated general store collection. Authentic, fresh, and guaranteed satisfaction.`,
        brand: photo.brand || 'Cornerstone Essentials',
        category: photo.category || 'Groceries',
        price: photo.price || 3.99,
        discountPrice: photo.discountPrice || photo.price || 3.99,
        stock: 50,
        unit: photo.unit || '1 piece',
        images: [photo.url],
        rating: 4.8,
        reviewsCount: 4,
        isFeatured: false,
        isBestSeller: false,
        isNewArrival: true,
        isActive: true,
        tags: photo.tags || [photo.category.toLowerCase()],
      });
      createdProducts.push(created);
    }

    res.status(201).json({
      success: true,
      message: `Successfully imported ${createdProducts.length} new product(s) with general store photos into active catalog.`,
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to bulk import products.' });
  }
};
