/**
 * Main Express + Vite Server Entry Point
 * Mounts all REST API endpoints under /api/* and handles SPA client serving.
 */

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';

// Routes
import authRoutes from './server/routes/authRoutes';
import productRoutes from './server/routes/productRoutes';
import categoryRoutes from './server/routes/categoryRoutes';
import orderRoutes from './server/routes/orderRoutes';
import reviewRoutes from './server/routes/reviewRoutes';
import adminRoutes from './server/routes/adminRoutes';
import storeRoutes from './server/routes/storeRoutes';
import photoRoutes from './server/routes/photoRoutes';
import { errorHandler } from './server/middleware/errorHandler';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: 'Cornerstone General Store API running' });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/store', storeRoutes);
  app.use('/api/photos', photoRoutes);

  // Central Error Handler for API routes
  app.use(errorHandler);

  // Vite middleware for development / Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Cornerstone General Store running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Fatal] Server failed to start:', err);
  process.exit(1);
});
