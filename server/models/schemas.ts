/**
 * MongoDB / Mongoose Schema Specifications
 * These schemas define the data structures for MongoDB integration.
 */

export const MongooseUserSchema = {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
  phone: { type: String },
  addresses: [{
    label: String,
    street: String,
    city: String,
    area: String,
    landmark: String,
    pincode: String,
    isDefault: Boolean
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const MongooseProductSchema = {
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  stock: { type: Number, required: true, default: 0 },
  unit: { type: String, default: '1 piece' },
  images: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
};

export const MongooseCategorySchema = {
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  itemCount: { type: Number, default: 0 }
};

export const MongooseOrderSchema = {
  orderNumber: { type: String, required: true, unique: true },
  user: { type: String, ref: 'User', required: true },
  customerInfo: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    landmark: String,
    notes: String
  },
  items: [{
    productId: { type: String, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit: String,
    image: String
  }],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  appliedCoupon: String,
  grandTotal: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Cash on Delivery', 'Online Payment', 'Khalti', 'eSewa', 'Stripe'], default: 'Cash on Delivery' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

export const MongooseReviewSchema = {
  productId: { type: String, ref: 'Product', required: true },
  userId: { type: String, ref: 'User', required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
};
