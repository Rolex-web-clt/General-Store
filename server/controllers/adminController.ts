/**
 * Admin Controller
 * High-level analytics, customer management, inventory alerts, and promotional offer campaigns.
 */

import { Response } from 'express';
import { ProductModel, OrderModel, UserModel, CategoryModel, OfferModel } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getDashboardMetrics = (req: AuthRequest, res: Response): void => {
  try {
    const allOrders = OrderModel.find();
    const allProducts = ProductModel.find();
    const allUsers = UserModel.find({ role: 'CUSTOMER' });

    const totalSales = OrderModel.totalSales();
    const totalOrders = allOrders.length;
    const totalCustomers = allUsers.length;
    const totalProducts = allProducts.length;

    const lowStockProducts = allProducts
      .filter(p => p.stock <= 10 && p.isActive)
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        stock: p.stock,
        price: p.price,
        image: p.images[0],
      }));

    const pendingOrders = allOrders.filter(o => o.orderStatus === 'Pending').length;
    const recentOrders = allOrders.slice(0, 7);

    // Sales by Category
    const salesByCategory: Record<string, number> = {};
    allOrders
      .filter(o => o.orderStatus !== 'Cancelled')
      .forEach(o => {
        o.items.forEach(item => {
          const prod = ProductModel.findById(item.productId);
          const cat = prod?.category || 'Other';
          salesByCategory[cat] = (salesByCategory[cat] || 0) + (item.price * item.quantity);
        });
      });

    const categoryBreakdown = Object.entries(salesByCategory).map(([category, revenue]) => ({
      category,
      revenue: parseFloat(revenue.toFixed(2)),
    }));

    // Status breakdown
    const statusCounts = {
      Pending: allOrders.filter(o => o.orderStatus === 'Pending').length,
      Confirmed: allOrders.filter(o => o.orderStatus === 'Confirmed').length,
      Processing: allOrders.filter(o => o.orderStatus === 'Processing').length,
      Shipped: allOrders.filter(o => o.orderStatus === 'Shipped').length,
      Delivered: allOrders.filter(o => o.orderStatus === 'Delivered').length,
      Cancelled: allOrders.filter(o => o.orderStatus === 'Cancelled').length,
    };

    res.status(200).json({
      success: true,
      metrics: {
        totalSales: parseFloat(totalSales.toFixed(2)),
        totalOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        pendingOrders,
        recentOrders,
        categoryBreakdown,
        statusCounts,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve admin dashboard metrics.' });
  }
};

export const getCustomers = (req: AuthRequest, res: Response): void => {
  try {
    const { search } = req.query;
    let customers = UserModel.find({ role: 'CUSTOMER' });

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      customers = customers.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.phone && c.phone.includes(q))
      );
    }

    const allOrders = OrderModel.find();

    const formatted = customers.map(c => {
      const userOrders = allOrders.filter(o => o.userId === c.id);
      const totalSpent = userOrders
        .filter(o => o.orderStatus !== 'Cancelled')
        .reduce((sum, o) => sum + o.grandTotal, 0);

      const { password: _, ...sanitized } = c;
      return {
        ...sanitized,
        ordersCount: userOrders.length,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        lastOrderDate: userOrders[0]?.createdAt || null,
      };
    });

    res.status(200).json({
      success: true,
      customers: formatted,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer list.' });
  }
};

export const toggleCustomerStatus = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = UserModel.findById(id);

    if (!user) {
      res.status(404).json({ success: false, message: 'Customer not found.' });
      return;
    }

    if (user.role === 'ADMIN') {
      res.status(403).json({ success: false, message: 'Cannot deactivate an admin account.' });
      return;
    }

    const updated = UserModel.findByIdAndUpdate(id, { isActive: !user.isActive });
    res.status(200).json({
      success: true,
      message: `Customer account ${updated?.isActive ? 'enabled' : 'disabled'} successfully.`,
      customer: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update customer status.' });
  }
};

// Offer & Discount Management
export const getOffers = (req: AuthRequest, res: Response): void => {
  try {
    const offers = OfferModel.find();
    res.status(200).json({ success: true, offers });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch offers.' });
  }
};

export const createOffer = (req: AuthRequest, res: Response): void => {
  try {
    const { code, title, description, discountPercent, minPurchase, validUntil } = req.body;

    if (!code || !title || !discountPercent) {
      res.status(400).json({ success: false, message: 'Coupon code, title, and discount percentage are required.' });
      return;
    }

    const newOffer = OfferModel.create({
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description || '',
      discountPercent: parseFloat(discountPercent),
      minPurchase: parseFloat(minPurchase) || 0,
      validUntil: validUntil || '2026-12-31',
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Discount offer created successfully.',
      offer: newOffer,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to create offer.' });
  }
};

export const updateOffer = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const updated = OfferModel.findByIdAndUpdate(id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Offer updated successfully.',
      offer: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update offer.' });
  }
};

export const deleteOffer = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = OfferModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Offer not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Offer deleted successfully.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to delete offer.' });
  }
};
