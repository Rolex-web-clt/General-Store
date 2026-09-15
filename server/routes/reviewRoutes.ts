import { Router } from 'express';
import { getReviewsByProduct, addReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:productId', getReviewsByProduct);
router.post('/:productId', (req, res, next) => {
  // Allow review submission with or without auth token
  authenticate(req as any, res, () => {
    next();
  });
}, addReview);

export default router;
