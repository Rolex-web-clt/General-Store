/**
 * Shared Frontend TypeScript Types
 */

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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  addresses: IUserAddress[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  unit: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

export interface Order {
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

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  minPurchase: number;
  validUntil: string;
  isActive: boolean;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    area: string;
    city: string;
    landmark: string;
    pincode: string;
    fullAddress: string;
  };
  openingHours: {
    weekdays: string;
    weekends: string;
    holidayNote: string;
  };
  delivery: {
    minimumOrder: number;
    standardDeliveryFee: number;
    freeDeliveryThreshold: number;
    estimatedDeliveryTime: string;
    deliveryAreas: string[];
  };
  payment: {
    codAvailable: boolean;
    onlinePaymentEnabled: boolean;
    acceptedMethods: string[];
  };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}
