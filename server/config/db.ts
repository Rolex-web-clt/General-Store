/**
 * Database & Data Layer
 * Provides robust storage engine with Mongoose-compatible interfaces.
 * Works seamlessly out of the box with realistic seed data and state persistence.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialReviews, initialOffers, CategoryItem, ProductItem, ReviewItem, OfferItem } from '../data/initialData';

export interface IUserAddress {
  id: string;
  label: string;
  street: string;
  city: string;
  area: string;
  landmark?: string;
  pincode: string;
  isDefault: boolean;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  addresses: IUserAddress[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    city: string;
    area: string;
    landmark?: string;
    notes?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  appliedCoupon?: string;
  grandTotal: number;
  paymentMethod: 'Cash on Delivery' | 'Online Payment' | 'Khalti' | 'eSewa' | 'Stripe';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  statusHistory: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface DatabaseStore {
  users: IUser[];
  products: ProductItem[];
  categories: CategoryItem[];
  orders: IOrder[];
  reviews: ReviewItem[];
  offers: OfferItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data_storage');
const DB_FILE = path.join(DATA_DIR, 'general_store_db.json');

// In-memory runtime cache
let db: DatabaseStore = {
  users: [],
  products: [],
  categories: [],
  orders: [],
  reviews: [],
  offers: [],
};

// Initialize DB
export function initDB(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(fileData);
    } else {
      seedDatabase();
    }
  } catch (err) {
    console.warn('Initializing database in-memory fallback:', err);
    seedDatabase();
  }
}

function saveDB(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database snapshot:', err);
  }
}

function seedDatabase(): void {
  const salt = bcrypt.genSaltSync(10);
  const adminHashed = bcrypt.hashSync('admin123', salt);
  const customerHashed = bcrypt.hashSync('customer123', salt);

  const initialUsers: IUser[] = [
    {
      id: 'usr-admin-1',
      name: 'Store Manager (Admin)',
      email: 'admin@generalstore.com',
      password: adminHashed,
      role: 'ADMIN',
      phone: '+1 (555) 234-5678',
      addresses: [
        {
          id: 'addr-admin-1',
          label: 'Store Headquarters',
          street: '45 Market Square',
          city: 'Metro City',
          area: 'Downtown District',
          landmark: 'Opposite Community Park',
          pincode: '10001',
          isDefault: true,
        },
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-customer-1',
      name: 'Sarah Jenkins',
      email: 'customer@example.com',
      password: customerHashed,
      role: 'CUSTOMER',
      phone: '+1 (555) 890-1234',
      addresses: [
        {
          id: 'addr-cust-1',
          label: 'Home',
          street: '12 Willow Lane, Apt 4B',
          city: 'Metro City',
          area: 'Northside Suburbs',
          landmark: 'Near Metro Station',
          pincode: '10005',
          isDefault: true,
        },
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'usr-customer-2',
      name: 'David Miller',
      email: 'david.m@example.com',
      password: customerHashed,
      role: 'CUSTOMER',
      phone: '+1 (555) 432-8765',
      addresses: [
        {
          id: 'addr-cust-2',
          label: 'Apartment',
          street: '78 River Road',
          city: 'Metro City',
          area: 'Riverside Colony',
          landmark: 'Beside Clocktower',
          pincode: '10003',
          isDefault: true,
        },
      ],
      isActive: true,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  // Seed sample past orders so admin dashboard has real numbers & charts
  const initialOrders: IOrder[] = [
    {
      id: 'ord-1001',
      orderNumber: 'GS-2026-0891',
      userId: 'usr-customer-1',
      customerInfo: {
        fullName: 'Sarah Jenkins',
        phone: '+1 (555) 890-1234',
        email: 'customer@example.com',
        deliveryAddress: '12 Willow Lane, Apt 4B',
        city: 'Metro City',
        area: 'Northside Suburbs',
        landmark: 'Near Metro Station',
        notes: 'Please leave at doorstep if bell not answered',
      },
      items: [
        {
          productId: 'prod-1',
          name: 'Royal Basmati Rice Super Long Grain (5kg)',
          price: 15.49,
          quantity: 1,
          unit: '5 kg bag',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        },
        {
          productId: 'prod-5',
          name: 'Aromatic Highland CTC Black Tea (500g)',
          price: 6.40,
          quantity: 2,
          unit: '500 g carton',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        },
      ],
      subtotal: 28.29,
      deliveryFee: 3.50,
      discount: 0,
      grandTotal: 31.79,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 5 * 86400000).toISOString() },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 5 * 86400000 + 10 * 60000).toISOString() },
        { status: 'Processing', timestamp: new Date(Date.now() - 5 * 86400000 + 30 * 60000).toISOString() },
        { status: 'Shipped', timestamp: new Date(Date.now() - 5 * 86400000 + 60 * 60000).toISOString() },
        { status: 'Delivered', timestamp: new Date(Date.now() - 5 * 86400000 + 120 * 60000).toISOString(), note: 'Delivered by rider Mike' },
      ],
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 86400000 + 120 * 60000).toISOString(),
    },
    {
      id: 'ord-1002',
      orderNumber: 'GS-2026-0892',
      userId: 'usr-customer-2',
      customerInfo: {
        fullName: 'David Miller',
        phone: '+1 (555) 432-8765',
        email: 'david.m@example.com',
        deliveryAddress: '78 River Road',
        city: 'Metro City',
        area: 'Riverside Colony',
        landmark: 'Beside Clocktower',
      },
      items: [
        {
          productId: 'prod-2',
          name: 'Pure Cold-Pressed Mustard Cooking Oil (1L)',
          price: 5.25,
          quantity: 2,
          unit: '1 Litre bottle',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
        },
        {
          productId: 'prod-3',
          name: 'Premium Yellow Lentils / Moong Dal (1kg)',
          price: 3.50,
          quantity: 2,
          unit: '1 kg pack',
          image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
        },
        {
          productId: 'prod-14',
          name: 'Farm Fresh Full Cream Milk (1 Litre)',
          price: 1.89,
          quantity: 3,
          unit: '1 Litre carton',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
        },
      ],
      subtotal: 23.17,
      deliveryFee: 3.50,
      discount: 2.31,
      appliedCoupon: 'WELCOME10',
      grandTotal: 24.36,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
      statusHistory: [
        { status: 'Pending', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
        { status: 'Confirmed', timestamp: new Date(Date.now() - 90 * 60000).toISOString() },
        { status: 'Processing', timestamp: new Date(Date.now() - 45 * 60000).toISOString() },
      ],
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    },
  ];

  db = {
    users: initialUsers,
    products: initialProducts,
    categories: initialCategories,
    orders: initialOrders,
    reviews: initialReviews,
    offers: initialOffers,
  };

  saveDB();
}

// User Model Repository
export const UserModel = {
  find: (query?: Partial<IUser>) => {
    if (!query) return [...db.users];
    return db.users.filter(u => Object.entries(query).every(([k, v]) => (u as any)[k] === v));
  },
  findById: (id: string) => db.users.find(u => u.id === id) || null,
  findOne: (query: Partial<IUser>) => {
    return db.users.find(u => Object.entries(query).every(([k, v]) => (u as any)[k] === v)) || null;
  },
  create: (data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: IUser = {
      ...data,
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveDB();
    return newUser;
  },
  findByIdAndUpdate: (id: string, update: Partial<IUser>) => {
    const index = db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    db.users[index] = { ...db.users[index], ...update, updatedAt: new Date().toISOString() };
    saveDB();
    return db.users[index];
  },
  countDocuments: () => db.users.length,
};

// Product Model Repository
export const ProductModel = {
  find: (filterFn?: (p: ProductItem) => boolean) => {
    if (!filterFn) return [...db.products];
    return db.products.filter(filterFn);
  },
  findById: (id: string) => db.products.find(p => p.id === id) || null,
  create: (data: Omit<ProductItem, 'id' | 'createdAt'>) => {
    const newProduct: ProductItem = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(newProduct);
    // update category item count
    const cat = db.categories.find(c => c.name === newProduct.category);
    if (cat) cat.itemCount += 1;
    saveDB();
    return newProduct;
  },
  findByIdAndUpdate: (id: string, update: Partial<ProductItem>) => {
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const oldCat = db.products[index].category;
    db.products[index] = { ...db.products[index], ...update };
    if (update.category && update.category !== oldCat) {
      const c1 = db.categories.find(c => c.name === oldCat);
      if (c1 && c1.itemCount > 0) c1.itemCount -= 1;
      const c2 = db.categories.find(c => c.name === update.category);
      if (c2) c2.itemCount += 1;
    }
    saveDB();
    return db.products[index];
  },
  findByIdAndDelete: (id: string) => {
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const deleted = db.products.splice(index, 1)[0];
    const cat = db.categories.find(c => c.name === deleted.category);
    if (cat && cat.itemCount > 0) cat.itemCount -= 1;
    saveDB();
    return deleted;
  },
  countDocuments: () => db.products.length,
  lowStockCount: (threshold = 10) => db.products.filter(p => p.stock <= threshold && p.isActive).length,
};

// Category Model Repository
export const CategoryModel = {
  find: () => [...db.categories],
  findById: (id: string) => db.categories.find(c => c.id === id) || null,
  create: (data: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...data,
      id: `cat-${Date.now()}`,
    };
    db.categories.push(newCat);
    saveDB();
    return newCat;
  },
  findByIdAndUpdate: (id: string, update: Partial<CategoryItem>) => {
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    db.categories[index] = { ...db.categories[index], ...update };
    saveDB();
    return db.categories[index];
  },
  findByIdAndDelete: (id: string) => {
    const index = db.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    const deleted = db.categories.splice(index, 1)[0];
    saveDB();
    return deleted;
  },
};

// Order Model Repository
export const OrderModel = {
  find: (query?: { userId?: string }) => {
    let list = [...db.orders];
    if (query?.userId) {
      list = list.filter(o => o.userId === query.userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  findById: (id: string) => db.orders.find(o => o.id === id) || null,
  create: (data: Omit<IOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    const orderNumber = `GS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: IOrder = {
      ...data,
      id: `ord-${Date.now()}`,
      orderNumber,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: 'Order placed by customer',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Deduct stock for ordered items
    data.items.forEach(item => {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });

    db.orders.unshift(newOrder);
    saveDB();
    return newOrder;
  },
  findByIdAndUpdateStatus: (id: string, newStatus: IOrder['orderStatus'], note?: string) => {
    const order = db.orders.find(o => o.id === id);
    if (!order) return null;
    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`,
    });
    if (newStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }
    saveDB();
    return order;
  },
  countDocuments: () => db.orders.length,
  totalSales: () => db.orders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + o.grandTotal, 0),
};

// Review Model Repository
export const ReviewModel = {
  findByProductId: (productId: string) => db.reviews.filter(r => r.productId === productId),
  create: (data: Omit<ReviewItem, 'id' | 'createdAt'>) => {
    const newReview: ReviewItem = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.reviews.unshift(newReview);
    // Recalculate product rating
    const productReviews = db.reviews.filter(r => r.productId === data.productId);
    const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length;
    const prod = db.products.find(p => p.id === data.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewsCount = productReviews.length;
    }
    saveDB();
    return newReview;
  },
};

// Offer Model Repository
export const OfferModel = {
  find: () => [...db.offers],
  findByCode: (code: string) => db.offers.find(o => o.code.toUpperCase() === code.toUpperCase() && o.isActive) || null,
  create: (data: Omit<OfferItem, 'id'>) => {
    const newOffer: OfferItem = {
      ...data,
      id: `off-${Date.now()}`,
    };
    db.offers.push(newOffer);
    saveDB();
    return newOffer;
  },
  findByIdAndUpdate: (id: string, update: Partial<OfferItem>) => {
    const index = db.offers.findIndex(o => o.id === id);
    if (index === -1) return null;
    db.offers[index] = { ...db.offers[index], ...update };
    saveDB();
    return db.offers[index];
  },
  findByIdAndDelete: (id: string) => {
    const index = db.offers.findIndex(o => o.id === id);
    if (index === -1) return null;
    const deleted = db.offers.splice(index, 1)[0];
    saveDB();
    return deleted;
  },
};

// Call initDB when this module loads
initDB();
