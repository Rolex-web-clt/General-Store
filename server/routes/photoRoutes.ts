import { Router } from 'express';
import { getPhotos, bulkImportPhotosAsProducts } from '../controllers/photoController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public photo browse / search endpoint
router.get('/', getPhotos);

// Admin-protected bulk import endpoint
router.post('/bulk-import', authenticate, authorize('ADMIN'), bulkImportPhotosAsProducts);

export default router;
