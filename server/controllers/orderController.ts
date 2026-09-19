/**
 * Order Controller
 * Complete order lifecycle management: placement, validation, coupon calculation,
 * customer tracking, cancellation, and admin fulfillment updates.
 */

import { Response } from 'express';
import { OrderModel, ProductModel, OfferModel, IOrderItem } from '../config/db';
import { storeConfig } from '../config/storeConfig';
import { AuthRequest } from '../middleware/auth';

export const createOrder = (req: AuthRequest, res: Response): void => {
  try {
    const {
      customerInfo,
      items,
      paymentMethod = 'Cash on Delivery',
      couponCode,
    } = req.body;

    // Validate customer info
    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.deliveryAddress || !customerInfo.city || !customerInfo.area) {
      res.status(400).json({
        success: false,
        message: 'Please provide full recipient name, phone number, street address, city, and area.',
      });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Cart is empty. Please add items to checkout.' });
      return;
    }

    // Verify stock and compute subtotal
    let subtotal = 0;
    const verifiedItems: IOrderItem[] = [];

    for (const item of items) {
      const product = ProductModel.findById(item.productId);
      if (!product || !product.isActive) {
        res.status(400).json({
          success: false,
          message: `Product "${item.name || 'Unknown'}" is no longer available.`,
        });
        return;
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} left.`,
        });
        return;
      }

      const itemPrice = product.discountPrice || product.price;
      subtotal += itemPrice * item.quantity;

      verifiedItems.push({
        productId: product.id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        unit: product.unit,
        image: product.images[0] || '',
      });
    }

    // Check minimum order amount
    if (subtotal < storeConfig.delivery.minimumOrder) {
      res.status(400).json({
        success: false,
        message: `Minimum order amount for delivery is Rs. ${storeConfig.delivery.minimumOrder}.`,
      });
      return;
    }

    // Delivery fee calculation
    let deliveryFee = subtotal >= storeConfig.delivery.freeDeliveryThreshold ? 0 : storeConfig.delivery.standardDeliveryFee;
    let discount = 0;
    let appliedCouponName = '';

    // Handle coupon code if supplied
    if (couponCode && typeof couponCode === 'string') {
      const offer = OfferModel.findByCode(couponCode.trim());
      if (offer && subtotal >= offer.minPurchase) {
        if (offer.code.toUpperCase() === 'FREESHIP') {
          deliveryFee = 0;
          appliedCouponName = offer.code;
        } else {
          discount = parseFloat(((subtotal * offer.discountPercent) / 100).toFixed(2));
          appliedCouponName = offer.code;
        }
      }
    }

    const grandTotal = parseFloat((subtotal + deliveryFee - discount).toFixed(2));

    const userId = req.user ? req.user.id : 'guest-customer';

    const order = OrderModel.create({
      userId,
      customerInfo: {
        fullName: customerInfo.fullName.trim(),
        phone: customerInfo.phone.trim(),
        email: customerInfo.email?.trim() || (req.user ? req.user.email : ''),
        deliveryAddress: customerInfo.deliveryAddress.trim(),
        city: customerInfo.city.trim(),
        area: customerInfo.area.trim(),
        landmark: customerInfo.landmark?.trim() || '',
        notes: customerInfo.notes?.trim() || '',
      },
      items: verifiedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee,
      discount,
      appliedCoupon: appliedCouponName || undefined,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Your order has been placed successfully!',
      order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to place order.' });
  }
};

export const getMyOrders = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const orders = OrderModel.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
  }
};

export const getOrderById = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const order = OrderModel.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Check authorization: must be the order owner or an admin
    if (req.user && req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
      return;
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
  }
};

export const cancelOrder = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const order = OrderModel.findById(id);

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    // Check permission
    if (req.user && req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      res.status(403).json({ success: false, message: 'Unauthorized to cancel this order.' });
      return;
    }

    // Customer can only cancel if Pending or Confirmed
    if (req.user?.role !== 'ADMIN' && !['Pending', 'Confirmed'].includes(order.orderStatus)) {
      res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already in "${order.orderStatus}" stage.`,
      });
      return;
    }

    // Restore stock
    order.items.forEach(item => {
      const prod = ProductModel.findById(item.productId);
      if (prod) {
        prod.stock += item.quantity;
      }
    });

    const updated = OrderModel.findByIdAndUpdateStatus(id, 'Cancelled', 'Cancelled by customer');

    res.status(200).json({
      success: true,
      message: 'Order has been successfully cancelled.',
      order: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to cancel order.' });
  }
};

// Admin order operations
export const getAllOrders = (req: AuthRequest, res: Response): void => {
  try {
    const { status, search } = req.query;
    let orders = OrderModel.find();

    if (status && typeof status === 'string' && status !== 'all') {
      orders = orders.filter(o => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      orders = orders.filter(
        o =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerInfo.fullName.toLowerCase().includes(q) ||
          o.customerInfo.phone.includes(q) ||
          o.customerInfo.city.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      orders,
      total: orders.length,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

export const updateOrderStatus = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid order status specified.' });
      return;
    }

    const updated = OrderModel.findByIdAndUpdateStatus(id, status, note);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};
