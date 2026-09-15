import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Order placement (can be authenticated customer or guest)
router.post('/', (req, res, next) => {
  // Try authenticate if token is present, else continue as guest
  authenticate(req as any, res, () => {
    next();
  });
}, createOrder);

// Customer protected routes
router.get('/my-orders', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

// Admin order routes
router.get('/', authenticate, authorize('ADMIN'), getAllOrders);
router.put('/:id/status', authenticate, authorize('ADMIN'), updateOrderStatus);

export default router;
