import { Router } from 'express';
import { storeConfig } from '../config/storeConfig';
import { OfferModel } from '../config/db';

const router = Router();

router.get('/info', (req, res) => {
  res.status(200).json({
    success: true,
    store: storeConfig,
  });
});

router.get('/active-offers', (req, res) => {
  const offers = OfferModel.find().filter(o => o.isActive);
  res.status(200).json({
    success: true,
    offers,
  });
});

export default router;
