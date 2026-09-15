import { Router } from 'express';
import {
  getDashboardMetrics,
  getCustomers,
  toggleCustomerStatus,
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from '../controllers/adminController';
import { uploadImage } from '../controllers/uploadController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// All admin routes require ADMIN authorization
router.use(authenticate, authorize('ADMIN'));

router.get('/metrics', getDashboardMetrics);
router.get('/customers', getCustomers);
router.put('/customers/:id/toggle-status', toggleCustomerStatus);

// Offers management
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// Image upload
router.post('/upload', uploadImage);

export default router;
