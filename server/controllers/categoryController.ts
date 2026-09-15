/**
 * Category Controller
 */

import { Request, Response } from 'express';
import { CategoryModel } from '../config/db';

export const getCategories = (req: Request, res: Response): void => {
  try {
    const categories = CategoryModel.find();
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
};

export const createCategory = (req: Request, res: Response): void => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategory = CategoryModel.create({
      name: name.trim(),
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      itemCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
      category: newCategory,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create category.' });
  }
};

export const updateCategory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const updateData: any = {};
    if (name) {
      updateData.name = name.trim();
      updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    const updated = CategoryModel.findByIdAndUpdate(id, updateData);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      category: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update category.' });
  }
};

export const deleteCategory = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = CategoryModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Category not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete category.' });
  }
};
