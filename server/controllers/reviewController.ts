/**
 * Review Controller
 */

import { Request, Response } from 'express';
import { ReviewModel, ProductModel } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getReviewsByProduct = (req: Request, res: Response): void => {
  try {
    const { productId } = req.params;
    const reviews = ReviewModel.findByProductId(productId);
    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

export const addReview = (req: AuthRequest, res: Response): void => {
  try {
    const { productId } = req.params;
    const { rating, comment, userName } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ success: false, message: 'Please provide both rating (1-5) and your review comments.' });
      return;
    }

    const numericRating = Math.min(5, Math.max(1, parseInt(rating, 10)));
    const product = ProductModel.findById(productId);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const reviewerName = req.user ? req.user.name : (userName || 'Verified Buyer');
    const userId = req.user ? req.user.id : 'guest-reviewer';

    const newReview = ReviewModel.create({
      productId,
      userId,
      userName: reviewerName,
      rating: numericRating,
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your product review has been submitted.',
      review: newReview,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};
