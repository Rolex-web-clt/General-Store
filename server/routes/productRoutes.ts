import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getSearchSuggestions,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/brands', getBrands);
router.get('/:id', getProductById);

// Admin-only protected routes
router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProduct);

export default router;
