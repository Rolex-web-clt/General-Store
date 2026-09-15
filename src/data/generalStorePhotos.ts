/**
 * Curated Database of 500+ General Store Photos & Item Templates
 * Covering all 15 grocery & general store categories with high-resolution Unsplash imagery.
 */

export interface GeneralStorePhoto {
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

import photosData from './generalStorePhotos.json';

export const GENERAL_STORE_PHOTOS: GeneralStorePhoto[] = photosData as GeneralStorePhoto[];

export const PHOTO_CATEGORIES: string[] = [
  'All',
  'Groceries',
  'Rice & Grains',
  'Pulses',
  'Cooking Oil',
  'Spices',
  'Snacks',
  'Biscuits',
  'Beverages',
  'Dairy Products',
  'Personal Care',
  'Cleaning Products',
  'Household Items',
  'Stationery',
  'Baby Products',
  'Other'
];

export function getPhotosByCategory(category: string): GeneralStorePhoto[] {
  if (!category || category === 'All') return GENERAL_STORE_PHOTOS;
  return GENERAL_STORE_PHOTOS.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function searchStorePhotos(query: string, category?: string): GeneralStorePhoto[] {
  const q = query.toLowerCase().trim();
  let list = GENERAL_STORE_PHOTOS;
  if (category && category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (!q) return list;
  return list.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q))
  );
}
